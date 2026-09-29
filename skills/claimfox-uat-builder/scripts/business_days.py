#!/usr/bin/env python3
"""Business-day due dates for ClaimFox test cases, so expected results are exact.

Rule (the business-day rule section of references/modules.SAMPLE.md; edit both if ClaimFox's differs):
  - The day of receipt is day 0. Day 1 is the next business day.
  - A request received on a weekend, a holiday, or after the cutoff time is treated as received
    at the start of the next business day (that day becomes day 0).
  - Business days skip Saturdays, Sundays and the dates in the holidays file.

  python3 business_days.py due --received "2026-10-02 16:45" --days 2 [--return-date 2026-10-05] [--tz America/Los_Angeles]
      [--holidays references/holidays.SAMPLE.csv --cutoff 17:00]
  --return-date: for subpoenas "N business days or the return date, whichever is earlier"
  --tz: the time zone the receipt time is in; it is converted to Eastern (ClaimFox's clock) first
  python3 business_days.py matrix --clocks "Expedite=2" "Harborline subpoena=3" "Standard=5" \
      --received "2026-10-02 09:00" "2026-10-02 17:30" "2026-10-03 10:00" "2026-11-25 16:00"
"""
import argparse
import csv
import datetime as dt
import json
from zoneinfo import ZoneInfo
from pathlib import Path


def load_holidays(path):
    if not path or not Path(path).exists():
        return set()
    with open(path, newline="", encoding="utf-8-sig") as f:
        return {dt.date.fromisoformat(r["date"]) for r in csv.DictReader(f) if r.get("date")}


def is_bday(d, hol):
    return d.weekday() < 5 and d not in hol


def day_zero(received, hol, cutoff):
    d = received.date()
    late = received.time() > cutoff
    if not is_bday(d, hol) or late:
        d += dt.timedelta(days=1)
        while not is_bday(d, hol):
            d += dt.timedelta(days=1)
    return d


def due(received, days, hol, cutoff):
    d = day_zero(received, hol, cutoff)
    n = 0
    while n < days:
        d += dt.timedelta(days=1)
        if is_bday(d, hol):
            n += 1
    return d


def parse(s, tz=None):
    r = dt.datetime.fromisoformat(s if len(s) > 10 else s + " 09:00")
    if tz:
        r = r.replace(tzinfo=ZoneInfo(tz)).astimezone(ZoneInfo("America/New_York")).replace(tzinfo=None)
    return r


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    p1 = sub.add_parser("due")
    p1.add_argument("--received", required=True)
    p1.add_argument("--days", type=int, required=True)
    p1.add_argument("--return-date", help="YYYY-MM-DD; due date becomes the earlier of the clock and this date")
    p2 = sub.add_parser("matrix")
    p2.add_argument("--clocks", nargs="+", required=True, help='label=business days, e.g. "Expedite=2"')
    p2.add_argument("--received", nargs="+", required=True)
    for p in (p1, p2):
        p.add_argument("--holidays", default=str(Path(__file__).resolve().parent.parent / "references" / "holidays.SAMPLE.csv"))
        p.add_argument("--cutoff", default="17:00")
        p.add_argument("--tz", help="time zone of the receipt times, e.g. America/Chicago (default: Eastern)")
    a = ap.parse_args()
    hol = load_holidays(a.holidays)
    cutoff = dt.time.fromisoformat(a.cutoff)
    if a.cmd == "due":
        r = parse(a.received, a.tz)
        clock_due = due(r, a.days, hol, cutoff)
        final = min(clock_due, dt.date.fromisoformat(a.return_date)) if a.return_date else clock_due
        print(json.dumps({"received_eastern": r.isoformat(sep=" "), "day_0": day_zero(r, hol, cutoff).isoformat(),
                          "business_days": a.days, "clock_due_date": clock_due.isoformat(),
                          "return_date": a.return_date, "due_date": final.isoformat(),
                          "governed_by": "return date" if a.return_date and final < clock_due else "business-day clock",
                          "rule": f"receipt day = day 0; after {a.cutoff}, weekends and holidays roll to the next business day"}, indent=2))
    else:
        clocks = [(c.split("=")[0], int(c.split("=")[1])) for c in a.clocks]
        rows = []
        for s in a.received:
            r = parse(s, a.tz)
            row = {"received": r.strftime("%a %Y-%m-%d %H:%M"), "day_0": day_zero(r, hol, cutoff).isoformat()}
            for label, n in clocks:
                row[f"{label} ({n} bd)"] = due(r, n, hol, cutoff).isoformat()
            rows.append(row)
        print(json.dumps(rows, indent=2))


if __name__ == "__main__":
    main()
