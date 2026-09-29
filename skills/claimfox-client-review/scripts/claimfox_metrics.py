#!/usr/bin/env python3
"""ClaimFox request metrics. Deterministic numbers for client reviews, requestor report
cards and the weekly leadership brief. Claude runs this and writes the story; Claude never
counts or averages by hand. Standard library only. Run with `python3` (or `python`).

  profile         what's in the export: date range, clients, requestors, columns, data-quality checks
  client-review   one client, one period, vs prior period and last year, trend, seasonality, break points
  drivers         which requestors / request types / etc. drove a change between two periods
  requestor-card  quarterly card per requestor: volume, money, aging vs archive rule, tickets, peers
  weekly          Mon-Fri business week for the leadership brief, with 6-month trend breaks

Examples
  python3 claimfox_metrics.py profile --data DIR
  python3 claimfox_metrics.py client-review --data DIR --client "Harborline Mutual Insurance" --period quarter --end 2026-09-30 [--credit-threshold 5]
  python3 claimfox_metrics.py drivers --data DIR --client "Harborline Mutual Insurance" --dimension requestor_name --period quarter --end 2026-09-30 --compare last-year
  python3 claimfox_metrics.py requestor-card --data DIR --requestor "RecordPoint Retrieval" --start 2026-07-01 --end 2026-09-30 [--archive-months 24 --warn-days 90 --as-of 2026-09-29]
  python3 claimfox_metrics.py weekly --data DIR --end 2026-09-25

DIR holds requests.csv (required), invoices.csv and support_tickets.csv (optional).
Expected request columns: request_id, received_date, client, requestor_id, requestor_name, requestor_type,
request_type, pages_received, pages_released, pages_redacted, status, due_date, sla_business_days,
completed_date, turnaround_business_days, sla_met, reviewer, rework_flag, invoice_id
SLA is judged against `sla_business_days` on each row (the contracted clock for that request).
"""
import argparse
import calendar
import csv
import datetime as dt
import difflib
import json
import math
import statistics as st
import sys
from collections import Counter, defaultdict
from pathlib import Path

OPEN_STATUSES = ("Received", "In Review", "On Hold")
PENDING_STATUSES = OPEN_STATUSES + ("Awaiting Payment",)


def load(path):
    if not path.exists():
        return None
    with open(path, newline="", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


def d(s):
    return dt.date.fromisoformat(s[:10]) if s else None


def num(s):
    try:
        return float(s)
    except (TypeError, ValueError):
        return None


def pct(a, b):
    return round(a / b * 100, 1) if b else None


def change(cur, prev):
    if cur is None or prev in (None, 0):
        return None
    return round((cur - prev) / prev * 100, 1)


def month_key(x):
    return x.strftime("%Y-%m")


def add_months(x, n):
    y, m = divmod(x.month - 1 + n, 12)
    y += x.year
    m += 1
    return dt.date(y, m, min(x.day, calendar.monthrange(y, m)[1]))


def month_end(x):
    return x.replace(day=calendar.monthrange(x.year, x.month)[1])


def top_with_ties(counter, n):
    items = counter.most_common()
    if len(items) <= n:
        return items
    cutoff = items[n - 1][1]
    return [kv for kv in items if kv[1] >= cutoff]


def p90(vals):
    if len(vals) < 10:
        return None
    s = sorted(vals)
    return s[math.ceil(0.9 * len(s)) - 1]  # nearest-rank


def period_for(kind, end):
    if kind == "quarter":
        q = (end.month - 1) // 3
        s = dt.date(end.year, q * 3 + 1, 1)
        return s, month_end(add_months(s, 2))
    if kind == "month":
        return end.replace(day=1), month_end(end)
    if kind == "year":
        return dt.date(end.year, 1, 1), dt.date(end.year, 12, 31)
    raise SystemExit("period must be month, quarter or year")


def shift(start, end, kind):
    months = {"month": 1, "quarter": 3, "year": 12}[kind]
    return add_months(start, -months), month_end(add_months(end.replace(day=1), -months))


def kpis(rows):
    done = [r for r in rows if num(r.get("turnaround_business_days")) is not None]
    tat = [num(r["turnaround_business_days"]) for r in done]
    met = sum(1 for r in done if r.get("sla_met") == "Y")
    rw = sum(1 for r in rows if r.get("rework_flag") == "Y")
    released = sum(num(r.get("pages_released")) or 0 for r in rows)
    received = sum(num(r.get("pages_received")) or 0 for r in rows)
    return {
        "requests": len(rows), "completed": len(done),
        "sla_hit_rate_pct": pct(met, len(done)), "sla_missed": len(done) - met,
        "avg_turnaround_bdays": round(st.mean(tat), 2) if tat else None,
        "median_turnaround_bdays": st.median(tat) if tat else None,
        "p90_turnaround_bdays": p90(tat),
        "pages_received": int(received), "pages_released": int(released),
        "release_ratio_pct": pct(released, received),
        "rework_rate_pct": pct(rw, len(rows)),
        "cancelled": sum(1 for r in rows if r.get("status") == "Cancelled"),
        "open_in_process": sum(1 for r in rows if r.get("status") in OPEN_STATUSES),
        "awaiting_payment": sum(1 for r in rows if r.get("status") == "Awaiting Payment"),
    }


def in_range(rows, start, end, field="received_date"):
    return [r for r in rows if r.get(field) and start <= d(r[field]) <= end]


def windows(start, end, kind, data_end):
    """Current, prior and last-year windows. If the current window runs past the data,
    all three are cut to the same number of elapsed days (like-for-like)."""
    cur_end = min(end, data_end)
    partial = end > data_end
    if kind == "custom":
        length = (end - start).days
        ps, pe = start - dt.timedelta(days=length + 1), start - dt.timedelta(days=1)
    else:
        ps, pe = shift(start, end, kind)
    ys, ye = add_months(start, -12), month_end(add_months(end.replace(day=1), -12))
    if partial:
        elapsed = (cur_end - start).days
        pe, ye = ps + dt.timedelta(days=elapsed), ys + dt.timedelta(days=elapsed)
    return (start, cur_end), (ps, pe), (ys, ye), partial


def guess(name, names):
    return difflib.get_close_matches(name, list(names), n=5, cutoff=0.5)


def monthly(rows):
    by_m = defaultdict(list)
    for r in rows:
        by_m[month_key(d(r["received_date"]))].append(r)
    return by_m


def breakpoints(series, key, min_move):
    """Months where `key` moved at least `min_move` vs the average of the 3 months before."""
    out = []
    for i in range(3, len(series)):
        prev = [s[key] for s in series[i - 3:i] if s[key] is not None]
        cur = series[i][key]
        if cur is None or len(prev) < 3:
            continue
        base = st.mean(prev)
        if abs(cur - base) >= min_move:
            out.append({"month": series[i]["month"], key: cur, "prior_3mo_avg": round(base, 1), "move": round(cur - base, 1)})
    return out


# ---------------------------------------------------------------------------- commands
def cmd_profile(a, req, inv, tck):
    dates = sorted(d(r["received_date"]) for r in req if r.get("received_date"))
    end = dates[-1]
    issues = []
    fut_c = [r["request_id"] for r in req if r.get("completed_date") and d(r["completed_date"]) > end]
    if fut_c:
        issues.append(f"{len(fut_c)} requests have a completed_date after the last received_date ({end}). Example: {fut_c[:3]}")
    if inv:
        fut_i = [i["invoice_id"] for i in inv if d(i["invoice_date"]) > end]
        if fut_i:
            issues.append(f"{len(fut_i)} invoices are dated after {end}. Example: {fut_i[:3]}")
    for c in sorted({r["client"] for r in req}):
        bm = Counter(month_key(d(r["received_date"])) for r in req if r["client"] == c)
        med = st.median(bm.values())
        thin = {m: n for m, n in bm.items() if n < 0.25 * med}
        if thin:
            issues.append(f"{c}: {len(thin)} month(s) with almost no requests (often backfilled records). They are real rows, but they are left out of seasonality: {dict(sorted(thin.items()))}")
    dup = [k for k, v in Counter(r["request_id"] for r in req).items() if v > 1]
    if dup:
        issues.append(f"{len(dup)} duplicate request_ids. Example: {dup[:3]}")
    print(json.dumps({
        "requests_file_rows": len(req), "date_range": [dates[0].isoformat(), end.isoformat()],
        "columns": list(req[0].keys()),
        "clients": Counter(r["client"] for r in req).most_common(),
        "top_requestors": Counter(r["requestor_name"] for r in req).most_common(15),
        "statuses": Counter(r["status"] for r in req).most_common(),
        "sla_clocks_by_client_and_type": sorted({(r["client"], r["request_type"], r["sla_business_days"]) for r in req}),
        "invoices_file_rows": len(inv) if inv else None, "tickets_file_rows": len(tck) if tck else None,
        "data_quality_issues": issues or "none found",
    }, indent=2))


def cmd_client(a, req, inv, tck):
    rows_all = [r for r in req if r["client"] == a.client]
    if not rows_all:
        raise SystemExit(f'No rows for client "{a.client}". Did you mean: {guess(a.client, {r["client"] for r in req})}')
    export_end = max(d(r["received_date"]) for r in req)
    end = d(a.end)
    kind = "custom" if a.start else a.period
    start, pend = (d(a.start), end) if a.start else period_for(a.period, end)
    (cs, ce), (ps, pe), (ys, ye), partial = windows(start, pend, kind, export_end)
    cur, prev, yoy = in_range(rows_all, cs, ce), in_range(rows_all, ps, pe), in_range(rows_all, ys, ye)
    out = {"client": a.client,
           "period": {"start": cs.isoformat(), "end": pend.isoformat(), "kind": kind, "data_through": ce.isoformat(),
                      "partial_period": partial, "note": "Partial period: prior and last-year windows are cut to the same number of days." if partial else ""},
           "current": kpis(cur),
           "prior_period": {"start": ps.isoformat(), "end": pe.isoformat(), **kpis(prev)},
           "same_period_last_year": {"start": ys.isoformat(), "end": ye.isoformat(), **kpis(yoy)} if yoy else None}
    c, p = out["current"], out["prior_period"]
    out["change_vs_prior_pct"] = {k: change(c[k], p[k]) for k in ("requests", "avg_turnaround_bdays", "pages_released")}
    out["change_vs_prior_pts"] = {"sla_hit_rate": round((c["sla_hit_rate_pct"] or 0) - (p["sla_hit_rate_pct"] or 0), 1)}
    if yoy:
        clock_now = {}
        for r in cur:
            if r.get("sla_business_days"):
                clock_now[r["request_type"]] = num(r["sla_business_days"])
        clock_then = {r["request_type"]: num(r["sla_business_days"]) for r in yoy if r.get("sla_business_days")}
        if any(clock_then.get(k) != v for k, v in clock_now.items() if k in clock_then):
            done_y = [r for r in yoy if num(r.get("turnaround_business_days")) is not None and r["request_type"] in clock_now]
            met = sum(1 for r in done_y if num(r["turnaround_business_days"]) <= clock_now[r["request_type"]])
            out["same_period_last_year"]["clocks_then"] = clock_then
            out["same_period_last_year"]["sla_hit_rate_on_todays_clocks_pct"] = pct(met, len(done_y))
            out["same_period_last_year"]["warning"] = "Contracted clocks changed between the two periods. Compare like with like: use sla_hit_rate_on_todays_clocks_pct, or say which basis you used."
        y = out["same_period_last_year"]
        out["change_vs_last_year_pct"] = {k: change(c[k], y[k]) for k in ("requests", "avg_turnaround_bdays")}
        out["change_vs_last_year_pts"] = {"sla_hit_rate": round((c["sla_hit_rate_pct"] or 0) - (y["sla_hit_rate_pct"] or 0), 1)}
    by_m = monthly(rows_all)
    months = sorted(by_m)[-18:]
    series = [{"month": m, **{k: kpis(by_m[m])[k] for k in ("requests", "sla_hit_rate_pct", "avg_turnaround_bdays")},
               "partial": m == month_key(export_end)} for m in months]
    out["monthly"] = series
    full = [s for s in series if not s["partial"]]
    out["break_points"] = {"sla_hit_rate_pct (moves of 10+ pts)": breakpoints(full, "sla_hit_rate_pct", 10),
                           "avg_turnaround_bdays (moves of 1+ day)": breakpoints(full, "avg_turnaround_bdays", 1.0)}
    med = st.median(len(v) for v in by_m.values()) if by_m else 0
    thin = sorted(m for m in by_m if len(by_m[m]) < 0.25 * med)
    allfull = [m for m in by_m if m != month_key(export_end) and m not in thin]
    if thin:
        out["thin_months_excluded_from_seasonality"] = {m: len(by_m[m]) for m in thin}
    cal = defaultdict(list)
    for m in allfull:
        cal[int(m[5:])].append(len(by_m[m]))
    overall = st.mean(len(by_m[m]) for m in allfull) if allfull else None
    out["seasonality_index"] = {calendar.month_abbr[k]: {"index": round(st.mean(v) / overall * 100), "years_of_data": len(v)}
                                for k, v in sorted(cal.items())} if overall else None
    out["seasonality_note"] = "Index 100 = an average month. Treat any month with years_of_data < 3 as a hint, not a pattern."
    out["mix_request_type"] = Counter(r["request_type"] for r in cur).most_common()
    out["mix_requestor_type"] = Counter(r["requestor_type"] for r in cur).most_common()
    out["top_requestors"] = Counter(r["requestor_name"] for r in cur).most_common(8)
    by_type = defaultdict(list)
    for r in cur:
        if r.get("sla_met"):
            by_type[r["request_type"]].append(r)
    out["sla_by_request_type"] = {k: {"sla_bdays": sorted({int(float(r["sla_business_days"])) for r in v if r.get("sla_business_days")}), "completed": len(v),
                                      "sla_hit_rate_pct": pct(sum(r["sla_met"] == "Y" for r in v), len(v))} for k, v in by_type.items()}
    rv = defaultdict(lambda: [0, 0])
    for r in cur:
        rv[r["reviewer"]][0] += 1
        rv[r["reviewer"]][1] += r.get("rework_flag") == "Y"
    out["reviewers_internal_only"] = sorted(({"reviewer": k, "requests": v[0], "rework_rate_pct": pct(v[1], v[0])} for k, v in rv.items()), key=lambda x: -x["requests"])
    out["share_of_all_claimfox_volume_pct"] = pct(len(cur), len(in_range(req, cs, ce)))
    if a.credit_threshold is not None:
        months_over = []
        excl = {x.strip().lower() for x in (a.credit_exclude_types or "").split(",") if x.strip()}
        eff = d(a.credit_effective) if a.credit_effective else None
        for s in series:
            if eff and s["month"] < month_key(eff):
                continue
            k = kpis([r for r in by_m[s["month"]] if r["request_type"].lower() not in excl])
            miss = 100 - (k["sla_hit_rate_pct"] if k["sla_hit_rate_pct"] is not None else 100)
            if k["completed"] and miss > a.credit_threshold:
                months_over.append({"month": s["month"], "miss_rate_pct": round(miss, 1), "completed": k["completed"], "partial": s["partial"]})
        out["service_credit_check"] = {"threshold_miss_rate_pct": a.credit_threshold, "clause_effective": a.credit_effective or "not given: all months counted",
                                       "request_types_excluded": sorted(excl) or "none", "months_over_threshold": months_over,
                                       "note": "Months before the clause took effect are skipped. Whether a month is actually owed is for the account owner and counsel."}
    if inv:
        ci = [i for i in inv if i["client"] == a.client and cs <= d(i["invoice_date"]) <= ce]
        out["requestor_billing_on_this_clients_files_internal_only"] = {"invoices": len(ci), "billed": round(sum(num(i["amount"]) or 0 for i in ci), 2),
                                                                        "open": sum(1 for i in ci if i["status"] == "Open")}
    print(json.dumps(out, indent=2))


def cmd_drivers(a, req, inv, tck):
    rows = [r for r in req if not a.client or r["client"] == a.client]
    if not rows:
        raise SystemExit(f'No rows for client "{a.client}". Did you mean: {guess(a.client, {r["client"] for r in req})}')
    if a.dimension not in rows[0]:
        raise SystemExit(f"Unknown dimension {a.dimension}. Pick one of: {list(rows[0].keys())}")
    export_end = max(d(r["received_date"]) for r in req)
    start, pend = period_for(a.period, d(a.end))
    (cs, ce), (ps, pe), (ys, ye), partial = windows(start, pend, a.period, export_end)
    bs, be = (ps, pe) if a.compare == "prior" else (ys, ye)
    cur, base = Counter(r[a.dimension] for r in in_range(rows, cs, ce)), Counter(r[a.dimension] for r in in_range(rows, bs, be))
    total = sum(cur.values()) - sum(base.values())
    table = []
    for k in set(cur) | set(base):
        delta = cur[k] - base[k]
        table.append({a.dimension: k, "current": cur[k], "baseline": base[k], "change": delta,
                      "share_of_total_change_pct": pct(delta, total) if total else None})
    table.sort(key=lambda x: -abs(x["change"]))
    growers = [t for t in table if t["change"] > 0]
    print(json.dumps({"client": a.client or "all", "dimension": a.dimension, "current_window": [cs.isoformat(), ce.isoformat()],
                      "baseline_window": [bs.isoformat(), be.isoformat()], "partial_like_for_like": partial,
                      "total_current": sum(cur.values()), "total_baseline": sum(base.values()), "total_change": total,
                      "how_many_grew": f"{len(growers)} of {len(table)}", "top_5_growers_share_of_increase_pct": pct(sum(t['change'] for t in growers[:5]), sum(t['change'] for t in growers)) if growers else None,
                      "table": table[:25]}, indent=2))


def cmd_requestor(a, req, inv, tck):
    start, end = d(a.start), d(a.end)
    export_end = max(d(r["received_date"]) for r in req)
    as_of = d(a.as_of) if a.as_of else dt.date.today()
    (cs, ce), (ps, pe), _, partial = windows(start, end, "quarter" if 80 <= (end - start).days <= 95 else "custom", export_end)
    names = {r["requestor_name"] for r in req}
    type_of = {r["requestor_name"]: r["requestor_type"] for r in req}
    cards = []
    for name in a.requestor:
        if name not in names:
            raise SystemExit(f'No requestor named "{name}". Did you mean: {guess(name, names)}')
        rr = [r for r in req if r["requestor_name"] == name]
        cur = in_range(rr, cs, ce)
        card = {"requestor": name, "requestor_type": type_of[name], "window": [cs.isoformat(), end.isoformat()], "data_through": ce.isoformat(),
                "partial_window": partial, "as_of": as_of.isoformat(), "requests_in_window": len(cur),
                "requests_prior_window": len(in_range(rr, ps, pe)), "prior_window": [ps.isoformat(), pe.isoformat()],
                "by_client": Counter(r["client"] for r in cur).most_common(),
                "by_request_type": Counter(r["request_type"] for r in cur).most_common()}
        card["change_vs_prior_window_pct"] = change(len(cur), card["requests_prior_window"])
        if inv:
            ri = [i for i in inv if i["requestor_name"] == name]
            win = [i for i in ri if cs <= d(i["invoice_date"]) <= ce]
            n_open = sum(1 for i in win if i["status"] == "Open")
            n_cxl = sum(1 for i in win if i["status"] == "Cancelled")
            card["invoices_in_window"] = {"count": len(win), "billed": round(sum(num(i["amount"]) or 0 for i in win), 2),
                                          "open_unpaid": n_open, "open_unpaid_rate_pct": pct(n_open, len(win)),
                                          "open_unpaid_amount": round(sum(num(i["amount"]) or 0 for i in win if i["status"] == "Open"), 2),
                                          "cancelled": n_cxl, "cancel_rate_pct": pct(n_cxl, len(win)),
                                          "cancel_reasons": Counter(i["cancel_reason"] for i in win if i["status"] == "Cancelled").most_common()}
            opn = [i for i in ri if i["status"] == "Open"]
            by_year = defaultdict(lambda: {"count": 0, "amount": 0.0})
            past, near, countdown = [], [], defaultdict(lambda: {"count": 0, "amount": 0.0})
            horizon = add_months(as_of, 12)
            for i in opn:
                amt = num(i["amount"]) or 0
                y = d(i["invoice_date"]).year
                by_year[y]["count"] += 1
                by_year[y]["amount"] = round(by_year[y]["amount"] + amt, 2)
                archive_on = add_months(d(i["invoice_date"]), int(a.archive_months))
                row = {"invoice_id": i["invoice_id"], "request_id": i["request_id"], "invoice_date": i["invoice_date"],
                       "amount": round(amt, 2), "archive_date": archive_on.isoformat(), "days_until_archive": (archive_on - as_of).days}
                if archive_on <= as_of:
                    past.append(row)
                elif (archive_on - as_of).days <= a.warn_days:
                    near.append(row)
                if as_of < archive_on <= horizon:
                    countdown[month_key(archive_on)]["count"] += 1
                    countdown[month_key(archive_on)]["amount"] = round(countdown[month_key(archive_on)]["amount"] + amt, 2)
            buckets = Counter()
            for i in opn:
                age = (as_of - d(i["invoice_date"])).days
                buckets["0-30 days (just billed)" if age <= 30 else "31-90 days" if age <= 90 else "91-365 days" if age <= 365 else "over 1 year"] += 1
            card["open_unpaid_by_age"] = {k: buckets[k] for k in ("0-30 days (just billed)", "31-90 days", "91-365 days", "over 1 year")}
            card["all_time_open_unpaid"] = {
                "count": len(opn), "amount": round(sum(num(i["amount"]) or 0 for i in opn), 2),
                "by_invoice_year": {str(k): v for k, v in sorted(by_year.items())},
                "archive_rule": f"{a.archive_months:g} calendar months from invoice date; warning window {a.warn_days} days",
                "already_past_archive_date": sorted(past, key=lambda x: x["archive_date"]),
                "within_warning_window": sorted(near, key=lambda x: x["archive_date"]),
                "within_warning_window_amount": round(sum(x["amount"] for x in near), 2),
                "archive_countdown_next_12_months": [{"month": m, **countdown[m]} for m in sorted(countdown)]}
        pend = [r for r in cur if r["status"] in PENDING_STATUSES]
        card["pending_requests_created_in_window"] = Counter(r["status"] for r in pend).most_common()
        if tck:
            rt = [t for t in tck if t["requestor_name"] == name and cs <= d(t["opened_date"]) <= ce]
            card["support_tickets"] = {"count": len(rt), "per_100_requests": round(len(rt) / len(cur) * 100, 1) if cur else None,
                                       "top_categories": top_with_ties(Counter(t["category"] for t in rt), 5),
                                       "open": sum(1 for t in rt if t["status"] == "Open")}
            ticket_reqs = {t["request_id"] for t in tck if t["requestor_name"] == name and t["category"] == "Portal login"}
            if inv:
                card["unpaid_invoices_with_a_portal_login_ticket"] = sum(1 for i in opn if i["request_id"] in ticket_reqs)
        cards.append(card)

    def bench(pool_names):
        rows = [r for r in in_range(req, cs, ce) if r["requestor_name"] in pool_names]
        out = {"requestors": len(pool_names), "requests": len(rows)}
        if tck:
            t = [x for x in tck if x["requestor_name"] in pool_names and cs <= d(x["opened_date"]) <= ce]
            out["tickets_per_100_requests"] = round(len(t) / len(rows) * 100, 1) if rows else None
        if inv:
            iv = [i for i in inv if i["requestor_name"] in pool_names and cs <= d(i["invoice_date"]) <= ce]
            out["open_unpaid_rate_pct"] = pct(sum(1 for i in iv if i["status"] == "Open"), len(iv))
            out["cancel_rate_pct"] = pct(sum(1 for i in iv if i["status"] == "Cancelled"), len(iv))
        return out
    chosen = set(a.requestor)
    benchmarks = {"all_other_requestors": bench(names - chosen)}
    for c in cards:
        peers = {n for n in names if type_of[n] == c["requestor_type"] and n != c["requestor"]}
        c["peer_benchmark_same_type"] = bench(peers) if peers else None
    print(json.dumps({"cards": cards, "benchmarks": benchmarks}, indent=2))


def cmd_weekly(a, req, inv, tck):
    end = d(a.end)
    start = end - dt.timedelta(days=end.weekday())  # Monday of that week
    if end.weekday() > 4:
        end = start + dt.timedelta(days=4)
    weeks = [(start - dt.timedelta(weeks=k), start - dt.timedelta(weeks=k) + dt.timedelta(days=4)) for k in range(1, 5)]
    rec = in_range(req, start, end)
    done = in_range(req, start, end, "completed_date")
    base_rec = [len(in_range(req, s, e)) for s, e in weeks]
    k = kpis(done)
    out = {"week_mon_fri": [start.isoformat(), end.isoformat()],
           "received": len(rec), "received_prior_4wk_avg": round(st.mean(base_rec), 1),
           "completed": len(done), "completed_sla_hit_rate_pct": k["sla_hit_rate_pct"], "completed_avg_turnaround_bdays": k["avg_turnaround_bdays"],
           "basis": "SLA and turnaround are measured on requests COMPLETED this week.",
           "last_week": None,
           "backlog_now": {"in_process": sum(1 for r in req if r["status"] in OPEN_STATUSES), "awaiting_payment": sum(1 for r in req if r["status"] == "Awaiting Payment")}}
    ls, le = weeks[0]
    ld = in_range(req, ls, le, "completed_date")
    lk = kpis(ld)
    out["last_week"] = {"week_mon_fri": [ls.isoformat(), le.isoformat()], "received": len(in_range(req, ls, le)), "completed": len(ld),
                        "completed_sla_hit_rate_pct": lk["sla_hit_rate_pct"], "completed_avg_turnaround_bdays": lk["avg_turnaround_bdays"]}
    out["change_vs_last_week"] = {"received_pct": change(len(rec), out["last_week"]["received"]),
                                  "sla_hit_rate_pts": round((k["sla_hit_rate_pct"] or 0) - (lk["sla_hit_rate_pct"] or 0), 1) if lk["sla_hit_rate_pct"] is not None else None,
                                  "turnaround_bdays": round((k["avg_turnaround_bdays"] or 0) - (lk["avg_turnaround_bdays"] or 0), 2) if lk["avg_turnaround_bdays"] is not None else None}
    clients = []
    for c in sorted({r["client"] for r in req}):
        w = [r for r in rec if r["client"] == c]
        wd = [r for r in done if r["client"] == c]
        b = [len([r for r in in_range(req, s, e) if r["client"] == c]) for s, e in weeks]
        kk = kpis(wd)
        clients.append({"client": c, "received": len(w), "prior_4wk_avg": round(st.mean(b), 1), "change_pct": change(len(w), st.mean(b)),
                        "completed": len(wd), "sla_hit_rate_pct": kk["sla_hit_rate_pct"], "avg_turnaround_bdays": kk["avg_turnaround_bdays"],
                        "contracted_sla_bdays": sorted({int(float(r["sla_business_days"])) for r in wd if r.get("sla_business_days")})})
    out["by_client"] = sorted(clients, key=lambda x: -x["received"])
    # 6-month trend breaks per client
    trends = []
    for c in sorted({r["client"] for r in req}):
        by_m = monthly([r for r in req if r["client"] == c])
        ms = [m for m in sorted(by_m) if m < month_key(start)][-6:]
        ser = [{"month": m, **{kk: kpis(by_m[m])[kk] for kk in ("requests", "sla_hit_rate_pct")}} for m in ms]
        if len(ser) >= 4:
            first, last = ser[:3], ser[-3:]
            v0, v1 = st.mean(x["requests"] for x in first), st.mean(x["requests"] for x in last)
            s0 = st.mean(x["sla_hit_rate_pct"] for x in first if x["sla_hit_rate_pct"] is not None)
            s1 = st.mean(x["sla_hit_rate_pct"] for x in last if x["sla_hit_rate_pct"] is not None)
            flags = []
            if v0 and abs(v1 - v0) / v0 >= 0.3:
                flags.append(f"volume {'up' if v1 > v0 else 'down'} {abs(round((v1 - v0) / v0 * 100))}% (avg of last 3 full months vs the 3 before)")
            if abs(s1 - s0) >= 10:
                flags.append(f"SLA hit rate {'down' if s1 < s0 else 'up'} {abs(round(s1 - s0))} pts ({round(s0)}% to {round(s1)}%)")
            if flags:
                trends.append({"client": c, "flags": flags, "monthly": ser})
    out["six_month_trend_breaks"] = trends or "none"
    if inv:
        wi = [i for i in inv if start <= d(i["invoice_date"]) <= end]
        opn = [i for i in inv if i["status"] == "Open"]
        by_req = defaultdict(lambda: [0, 0.0])
        for i in opn:
            by_req[i["requestor_name"]][0] += 1
            by_req[i["requestor_name"]][1] += num(i["amount"]) or 0
        lwi = [i for i in inv if ls <= d(i["invoice_date"]) <= le]
        out["invoices"] = {"issued_this_week": len(wi), "billed_this_week": round(sum(num(i["amount"]) or 0 for i in wi), 2),
                           "billed_last_week": round(sum(num(i["amount"]) or 0 for i in lwi), 2),
                           "open_unpaid_total": {"count": len(opn), "amount": round(sum(num(i["amount"]) or 0 for i in opn), 2)},
                           "top_open_unpaid_requestors": [{"requestor": k, "count": v[0], "amount": round(v[1], 2)} for k, v in sorted(by_req.items(), key=lambda x: -x[1][1])[:5]]}
    if tck:
        wt = [t for t in tck if start <= d(t["opened_date"]) <= end]
        bt = [len([t for t in tck if s <= d(t["opened_date"]) <= e]) for s, e in weeks]
        out["tickets"] = {"opened": len(wt), "opened_last_week": bt[0], "prior_4wk_avg": round(st.mean(bt), 1), "change_pct": change(len(wt), st.mean(bt)),
                          "top_categories": top_with_ties(Counter(t["category"] for t in wt), 4),
                          "top_requestors": Counter(t["requestor_name"] for t in wt).most_common(3)}
    print(json.dumps(out, indent=2))


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    for name in ("profile", "client-review", "drivers", "requestor-card", "weekly"):
        p = sub.add_parser(name)
        p.add_argument("--data", required=True)
        if name in ("client-review", "drivers"):
            p.add_argument("--client", required=(name == "client-review"))
            p.add_argument("--period", default="quarter", choices=["month", "quarter", "year"])
            p.add_argument("--end", required=True)
        if name == "client-review":
            p.add_argument("--start")
            p.add_argument("--credit-threshold", type=float, help="monthly SLA miss rate %% that triggers a service credit")
            p.add_argument("--credit-effective", help="date the credit clause took effect (YYYY-MM-DD)")
            p.add_argument("--credit-exclude-types", help='comma list of request types the clause does not cover, e.g. "Subpoena"')
        if name == "drivers":
            p.add_argument("--dimension", default="requestor_name")
            p.add_argument("--compare", default="last-year", choices=["prior", "last-year"])
        if name == "requestor-card":
            p.add_argument("--requestor", required=True, action="append")
            p.add_argument("--start", required=True)
            p.add_argument("--end", required=True)
            p.add_argument("--as-of", help="date to measure archive deadlines from (default: today)")
            p.add_argument("--archive-months", type=float, default=24)
            p.add_argument("--warn-days", type=int, default=90)
        if name == "weekly":
            p.add_argument("--end", required=True, help="last day of the week (Friday)")
    a = ap.parse_args()
    data = Path(a.data)
    req = load(data / "requests.csv")
    if req is None:
        sys.exit(f"requests.csv not found in {data}")
    inv, tck = load(data / "invoices.csv"), load(data / "support_tickets.csv")
    {"profile": cmd_profile, "client-review": cmd_client, "drivers": cmd_drivers,
     "requestor-card": cmd_requestor, "weekly": cmd_weekly}[a.cmd](a, req, inv, tck)


if __name__ == "__main__":
    main()
