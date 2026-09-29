"""Generate the fully fictional ClaimFox build-day sample data.

Every carrier, requestor, vendor, person and dollar figure here is invented.
Deterministic: same seed, same files. Run with `uv run python tools/generate_sample_data.py`
from the build-day folder.

Planted stories (the skills should find these on their own):
  requests  - Harborline Mutual volume up ~30% in 2026 and its SLA hit rate drops in Q3 2026
            - August and January volume spikes (seasonality)
            - Beacon Casualty volume falls off after Apr 2026 (moved work in-house)
  requestors- RecordPoint Retrieval has a pile of unpaid invoices, several close to 2 years old
            - Morrison & Pratt LLP has an unusual number of cancelled invoices (duplicate requests)
            - Portal login is the top ticket category for RecordPoint
  finance   - Aug 2026 GL: exact duplicate vendor bill, near-duplicate, two miscoded lines,
              an unbalanced journal entry (transposition), a missing recurring vendor,
              a large MoM variance in cloud hosting, a weekend round-number manual JE
            - Bank rec: deposit in transit, outstanding check, unrecorded bank fee, amount mismatch
"""
import csv
import datetime as dt
import json
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "sample-data"
rng = random.Random(20260929)


def bday_add(d, n):
    while n > 0:
        d += dt.timedelta(days=1)
        if d.weekday() < 5:
            n -= 1
    return d


def bdays_between(a, b):
    n, d = 0, a
    while d < b:
        d += dt.timedelta(days=1)
        if d.weekday() < 5:
            n += 1
    return n


def write_csv(path, rows, fields):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        w.writerows(rows)


# ---------------------------------------------------------------- requests
CLIENTS = {
    # name: (line of business, contracted SLA business days, base monthly volume)
    "Harborline Mutual Insurance": ("Auto", 5, 70),
    "Granite Shield Insurance": ("Auto", 7, 55),
    "Keystone Auto Group": ("Auto", 7, 45),
    "Tri-County Workers' Comp Fund": ("Workers' Comp", 10, 35),
    "Beacon Casualty Company": ("Auto", 7, 40),
    "Northfork Insurance Co.": ("Auto", 7, 30),
    "Meridian Auto & Home": ("Auto", 5, 25),
    "Atlas Comp Services": ("Workers' Comp", 10, 20),
}
SEASON = {1: 1.25, 2: 1.0, 3: 1.05, 4: 0.95, 5: 0.95, 6: 0.9, 7: 1.0, 8: 1.3, 9: 1.05, 10: 1.0, 11: 0.9, 12: 0.8}

REQUESTOR_TYPES = [
    ("Plaintiff Attorney", 0.42), ("Defense Attorney", 0.14), ("Record Retrieval Co.", 0.2),
    ("Adverse Carrier", 0.12), ("WC Board", 0.05), ("Claimant (self)", 0.07),
]
FIRMS = ["Morrison & Pratt LLP", "Delgado Law Group", "Kessler Injury Attorneys", "Whitcombe & Rao",
         "Brennan Hale PC", "Ostrowski Legal", "Park & Levine", "Salas Trial Lawyers", "Hudson Valley Injury Law",
         "Marchetti & Cole", "Ferris Nguyen LLP", "Abernathy Law", "Grayson Poole", "Tate & Winslow",
         "Lindqvist Defense", "Carver Moss LLP", "Iverson Goldberg", "Pruitt Legal Group", "Quinlan & Ames",
         "Beaumont Stark"]
RETRIEVERS = ["RecordPoint Retrieval", "SwiftFile Records", "DocuTrace Services", "Keystone Record Retrieval",
              "ClearPath Records", "Summit Chart Services"]
CARRIERS_ADV = ["Pioneer Standard Insurance", "Lakeside Mutual", "Evergreen Casualty", "Sterling Auto Insurance"]
BOARDS = ["NY WCB District Office", "NJ Division of Workers' Comp"]

requestors = []
rid = 100
for name in FIRMS:
    rid += 1
    rtype = "Defense Attorney" if name in ("Lindqvist Defense", "Carver Moss LLP", "Quinlan & Ames", "Whitcombe & Rao") else "Plaintiff Attorney"
    requestors.append({"requestor_id": f"RQ-{rid}", "requestor_name": name, "requestor_type": rtype})
for name in RETRIEVERS:
    rid += 1
    requestors.append({"requestor_id": f"RQ-{rid}", "requestor_name": name, "requestor_type": "Record Retrieval Co."})
for name in CARRIERS_ADV:
    rid += 1
    requestors.append({"requestor_id": f"RQ-{rid}", "requestor_name": name, "requestor_type": "Adverse Carrier"})
for name in BOARDS:
    rid += 1
    requestors.append({"requestor_id": f"RQ-{rid}", "requestor_name": name, "requestor_type": "WC Board"})
rid += 1
requestors.append({"requestor_id": f"RQ-{rid}", "requestor_name": "Individual claimants (self-represented)", "requestor_type": "Claimant (self)"})
RQ = {r["requestor_name"]: r for r in requestors}

weights = []
for r in requestors:
    w = {"Plaintiff Attorney": 1.0, "Defense Attorney": 0.6, "Record Retrieval Co.": 1.6,
         "Adverse Carrier": 1.0, "WC Board": 0.8, "Claimant (self)": 2.5}[r["requestor_type"]]
    if r["requestor_name"] in ("RecordPoint Retrieval", "Morrison & Pratt LLP"):
        w *= 3
    weights.append(w)

REVIEWERS = ["J. Alvarez", "T. Brooks", "M. Chen", "D. Esposito", "K. Farrell", "L. Gomez", "R. Haddad",
             "S. Ivanova", "P. Jennings", "A. Kowalski", "N. Lopez", "V. Mehta"]
REQ_TYPES = [("Authorization", 0.45), ("Subpoena", 0.3), ("Letter Request", 0.18), ("Court Order", 0.07)]


def pick(pairs):
    x, acc = rng.random(), 0
    for v, p in pairs:
        acc += p
        if x <= acc:
            return v
    return pairs[-1][0]


TODAY = dt.date(2026, 9, 25)
requests, invoices = [], []
req_n, inv_n = 40000, 70000
month = dt.date(2025, 1, 1)
while month <= dt.date(2026, 9, 1):
    for client, (lob, sla, base) in CLIENTS.items():
        vol = base * SEASON[month.month]
        if client == "Harborline Mutual Insurance" and month.year == 2026:
            vol *= 1.3
        if client == "Beacon Casualty Company" and month >= dt.date(2026, 5, 1):
            vol *= 0.35
        if month == dt.date(2026, 9, 1):
            vol *= 0.8  # partial month
        n = max(1, int(rng.gauss(vol, vol * 0.08)))
        for _ in range(n):
            req_n += 1
            day = rng.randint(1, 28)
            received = month.replace(day=day)
            if received > TODAY:
                continue
            while received.weekday() >= 5:
                received += dt.timedelta(days=1)
            rq = rng.choices(requestors, weights)[0]
            if lob == "Workers' Comp" and rng.random() < 0.15:
                rq = RQ[rng.choice(BOARDS)]
            rtype = pick(REQ_TYPES)
            pages = int(rng.lognormvariate(5.4, 0.6))
            released = int(pages * rng.uniform(0.35, 0.8))
            redacted = int(released * rng.uniform(0.2, 0.6))
            # contracted SLA for this request (Harborline's Amendment No. 2 tightened it on 2026-02-01)
            req_sla = sla
            if client == "Harborline Mutual Insurance":
                amended = received >= dt.date(2026, 2, 1)
                req_sla = (3 if amended else 5) if rtype == "Subpoena" else (5 if amended else 7)
            elif rtype == "Subpoena":
                req_sla = min(sla, 5)
            typical = 3.6 if client == "Harborline Mutual Insurance" else req_sla * 0.62
            base_tat = rng.gauss(typical, 1.2)
            if client == "Harborline Mutual Insurance" and received >= dt.date(2026, 7, 1):
                base_tat += 1.5
            if rtype == "Subpoena":
                base_tat += 0.6
            tat = max(1, int(round(base_tat)))
            due = bday_add(received, req_sla)
            completed = bday_add(received, tat)
            status = "Fulfilled"
            if rng.random() < 0.04:
                status = "Cancelled"
            if completed > TODAY:
                status = rng.choice(["In Review", "Received"])
            elif rng.random() < 0.06:
                status = "Awaiting Payment"
            reviewer = rng.choice(REVIEWERS)
            rework = "Y" if (rng.random() < (0.16 if reviewer == "R. Haddad" else 0.04)) else "N"
            req = {
                "request_id": f"REQ-{req_n}", "received_date": received.isoformat(), "client": client,
                "line_of_business": lob, "requestor_id": rq["requestor_id"], "requestor_name": rq["requestor_name"],
                "requestor_type": rq["requestor_type"], "request_type": rtype, "pages_received": pages,
                "pages_released": released if status in ("Fulfilled", "Awaiting Payment") else "",
                "pages_redacted": redacted if status in ("Fulfilled", "Awaiting Payment") else "",
                "status": status, "due_date": due.isoformat(), "sla_business_days": req_sla,
                "completed_date": completed.isoformat() if status in ("Fulfilled", "Awaiting Payment") else "",
                "turnaround_business_days": tat if status in ("Fulfilled", "Awaiting Payment") else "",
                "sla_met": ("Y" if tat <= req_sla else "N") if status in ("Fulfilled", "Awaiting Payment") else "",
                "reviewer": reviewer, "rework_flag": rework, "invoice_id": "",
            }
            # invoices: requestor pays for copies (claimants and WC boards are no-charge)
            if rq["requestor_type"] not in ("Claimant (self)", "WC Board") and status in ("Fulfilled", "Awaiting Payment", "Cancelled"):
                inv_n += 1
                amount = round(min(25 + released * 0.35, 650), 2) if released else 25.0
                inv_date = completed if status != "Cancelled" else received
                inv_status, paid, reason = "Paid", "", ""
                p_unpaid = 0.06
                if rq["requestor_name"] == "RecordPoint Retrieval":
                    p_unpaid = 0.38
                if rng.random() < p_unpaid or status == "Awaiting Payment":
                    inv_status = "Open"
                    req["status"] = "Awaiting Payment" if status == "Fulfilled" else req["status"]
                if status == "Cancelled":
                    inv_status, reason = "Cancelled", rng.choice(["Request withdrawn", "Duplicate request", "No records found"])
                if rq["requestor_name"] == "Morrison & Pratt LLP" and rng.random() < 0.14:
                    inv_status, reason = "Cancelled", "Duplicate request"
                if inv_status == "Paid":
                    paid = (inv_date + dt.timedelta(days=rng.randint(2, 18))).isoformat()
                    if dt.date.fromisoformat(paid) > TODAY:
                        inv_status, paid = "Open", ""
                invoices.append({"invoice_id": f"INV-{inv_n}", "request_id": req["request_id"],
                                 "requestor_id": rq["requestor_id"], "requestor_name": rq["requestor_name"],
                                 "client": client, "invoice_date": inv_date.isoformat(), "amount": f"{amount:.2f}",
                                 "status": inv_status, "paid_date": paid, "cancel_reason": reason})
                req["invoice_id"] = f"INV-{inv_n}"
            requests.append(req)
    month = (month.replace(day=28) + dt.timedelta(days=4)).replace(day=1)

# Older RecordPoint backlog: open invoices from late 2024, nearing the 2-year mark
for i in range(14):
    req_n += 1
    inv_n += 1
    d = dt.date(2024, 9, 23) + dt.timedelta(days=i * 6)
    client = rng.choice(list(CLIENTS))
    rq = RQ["RecordPoint Retrieval"]
    requests.append({"request_id": f"REQ-{req_n}", "received_date": d.isoformat(), "client": client,
                     "line_of_business": CLIENTS[client][0], "requestor_id": rq["requestor_id"],
                     "requestor_name": rq["requestor_name"], "requestor_type": rq["requestor_type"],
                     "request_type": "Authorization", "pages_received": 180, "pages_released": 96,
                     "pages_redacted": 30, "status": "Awaiting Payment", "due_date": bday_add(d, 7).isoformat(),
                     "sla_business_days": CLIENTS[client][1], "completed_date": bday_add(d, 4).isoformat(),
                     "turnaround_business_days": 4, "sla_met": "Y", "reviewer": rng.choice(REVIEWERS),
                     "rework_flag": "N", "invoice_id": f"INV-{inv_n}"})
    invoices.append({"invoice_id": f"INV-{inv_n}", "request_id": f"REQ-{req_n}", "requestor_id": rq["requestor_id"],
                     "requestor_name": rq["requestor_name"], "client": client,
                     "invoice_date": bday_add(d, 4).isoformat(), "amount": "58.60", "status": "Open",
                     "paid_date": "", "cancel_reason": ""})

requests.sort(key=lambda r: r["received_date"])
REQ_FIELDS = list(requests[0].keys())
write_csv(ROOT / "requests" / "requests.csv", requests, REQ_FIELDS)
write_csv(ROOT / "requests" / "invoices.csv", invoices, list(invoices[0].keys()))
write_csv(ROOT / "requests" / "requestors.csv", requestors, ["requestor_id", "requestor_name", "requestor_type"])

TICKET_CATS = [("Status inquiry", 0.3), ("Invoice question", 0.2), ("Portal login", 0.14), ("Payment issue", 0.12),
               ("Missing pages", 0.1), ("Duplicate request", 0.06), ("Redaction dispute", 0.04), ("Other", 0.04)]
tickets, t_n = [], 90000
for r in requests:
    p = 0.09
    if r["requestor_name"] in ("RecordPoint Retrieval", "Morrison & Pratt LLP"):
        p = 0.22
    if rng.random() < p:
        t_n += 1
        cat = pick(TICKET_CATS)
        if r["requestor_name"] == "RecordPoint Retrieval" and rng.random() < 0.4:
            cat = "Portal login"
        if r["requestor_name"] == "Morrison & Pratt LLP" and rng.random() < 0.35:
            cat = "Duplicate request"
        opened = dt.date.fromisoformat(r["received_date"]) + dt.timedelta(days=rng.randint(1, 12))
        if opened > TODAY:
            continue
        resolved = opened + dt.timedelta(days=rng.randint(0, 6))
        tickets.append({"ticket_id": f"TCK-{t_n}", "requestor_id": r["requestor_id"], "requestor_name": r["requestor_name"],
                        "request_id": r["request_id"], "opened_date": opened.isoformat(), "category": cat,
                        "channel": rng.choice(["Email", "Phone", "Portal chat"]),
                        "status": "Resolved" if resolved <= TODAY else "Open",
                        "resolved_date": resolved.isoformat() if resolved <= TODAY else ""})
write_csv(ROOT / "requests" / "support_tickets.csv", tickets, list(tickets[0].keys()))

# ---------------------------------------------------------------- finance
COA = [
    ("1000", "Operating Cash - First Harbor Bank", "Asset", "Debit", "Main operating account. Every deposit and disbursement."),
    ("1100", "Accounts Receivable - Carriers", "Asset", "Debit", "Carrier service fees billed monthly."),
    ("1150", "Accounts Receivable - Requestors", "Asset", "Debit", "Copy fees billed to requestors."),
    ("1400", "Prepaid Expenses", "Asset", "Debit", "Annual contracts paid in advance, amortized monthly."),
    ("2000", "Accounts Payable", "Liability", "Credit", "Vendor bills."),
    ("2100", "Accrued Expenses", "Liability", "Credit", "Month-end accruals for bills not yet received."),
    ("2200", "Accrued Payroll", "Liability", "Credit", ""),
    ("4000", "Service Revenue - Carriers", "Revenue", "Credit", "Monthly carrier service fees."),
    ("4100", "Copy Fee Revenue - Requestors", "Revenue", "Credit", "Fees paid by requestors."),
    ("4200", "Licensing Revenue - Clever", "Revenue", "Credit", "Clever by ClaimFox license fees."),
    ("5000", "Salaries & Wages", "Expense", "Debit", ""),
    ("5100", "Payroll Taxes & Benefits", "Expense", "Debit", ""),
    ("6100", "Office Supplies", "Expense", "Debit", "Paper, toner, small physical items under $500. NOT software."),
    ("6200", "Rent & Occupancy", "Expense", "Debit", "Ronkonkoma office lease only."),
    ("6300", "Telephone & Internet", "Expense", "Debit", "Verizon Business, Optimum Business."),
    ("6420", "Software Subscriptions", "Expense", "Debit", "SaaS: Microsoft 365, HubSpot, Anthropic (Claude), Foxit, Adobe."),
    ("6450", "Cloud Hosting", "Expense", "Debit", "AWS and other infrastructure hosting."),
    ("6500", "Records Storage & Destruction", "Expense", "Debit", "Iron Mountain, Shred-Right."),
    ("6600", "Professional Fees", "Expense", "Debit", "Legal, audit, consulting."),
    ("6700", "Insurance", "Expense", "Debit", "Cyber, E&O, general liability."),
    ("6800", "Bank Fees", "Expense", "Debit", "Monthly service charges, wire fees."),
    ("6900", "Travel & Meals", "Expense", "Debit", ""),
]
write_csv(ROOT / "finance" / "chart_of_accounts.csv",
          [dict(zip(["account", "account_name", "type", "normal_balance", "usage_notes"], c)) for c in COA],
          ["account", "account_name", "type", "normal_balance", "usage_notes"])
ACCT = {c[0]: c[1] for c in COA}

RECURRING = [  # vendor, account, base amount, day of month
    ("Iron Mountain Records Mgmt", "6500", 1842.50, 5), ("Amazon Web Services", "6450", 14210.00, 3),
    ("Microsoft 365 Business", "6420", 2380.00, 1), ("HubSpot Inc.", "6420", 3150.00, 1),
    ("Anthropic PBC - Claude Team", "6420", 1500.00, 2), ("Verizon Business", "6300", 1265.40, 12),
    ("Optimum Business", "6300", 389.99, 14), ("Marconi Realty LLC", "6200", 18500.00, 1),
    ("Shred-Right Inc.", "6500", 640.00, 20), ("Foxit Software", "6420", 312.00, 8),
    ("Hartwell Cyber Insurance", "6700", 2210.00, 15), ("Kemper & Lau CPAs", "6600", 3500.00, 25),
]


def gl_month(year, mon, je_start):
    rows, je = [], je_start
    def post(date, lines, source="AP", memo="", entered_by="system"):
        nonlocal je
        je += 1
        for acct, desc, vendor, dr, cr, ref in lines:
            rows.append({"entry_id": f"{year}{mon:02d}-{len(rows)+1:04d}", "journal_ref": f"JE-{je}",
                         "date": date.isoformat(), "account": acct, "account_name": ACCT[acct],
                         "vendor_or_customer": vendor, "description": desc, "reference": ref,
                         "debit": f"{dr:.2f}" if dr else "", "credit": f"{cr:.2f}" if cr else "",
                         "source": source, "entered_by": entered_by, "memo": memo})
    for vendor, acct, amt, day in RECURRING:
        if (year, mon) == (2026, 8) and vendor == "Verizon Business":
            continue  # planted: missing recurring bill
        a = amt
        if vendor == "Amazon Web Services":
            a = {6: 13980.00, 7: 14342.18, 8: 20245.61}[mon]  # planted: August spike
        d = dt.date(year, mon, day)
        inv = f"{vendor[:3].upper()}-{year}{mon:02d}-{rng.randint(100,999)}"
        acct_used = acct
        if (year, mon) == (2026, 8) and vendor == "Anthropic PBC - Claude Team":
            acct_used = "6100"  # planted: miscode
        post(d, [(acct_used, f"{vendor} - monthly", vendor, a, 0, inv), ("2000", f"{vendor} - monthly", vendor, 0, a, inv)])
        if (year, mon) == (2026, 8) and vendor == "Iron Mountain Records Mgmt":
            post(d + dt.timedelta(days=2), [(acct, f"{vendor} - monthly", vendor, a, 0, inv),
                                             ("2000", f"{vendor} - monthly", vendor, 0, a, inv)])  # planted: exact duplicate
    # payroll
    for d in (dt.date(year, mon, 15), dt.date(year, mon, 28)):
        gross = round(rng.uniform(186000, 191000), 2)
        tax = round(gross * 0.118, 2)
        post(d, [("5000", "Payroll - semi-monthly", "ADP", gross, 0, "PR"), ("5100", "Employer taxes & benefits", "ADP", tax, 0, "PR"),
                 ("1000", "Payroll funding", "ADP", 0, round(gross + tax, 2), "PR")], source="Payroll")
    # revenue
    for client, (lob, sla, base) in CLIENTS.items():
        fee = round(base * rng.uniform(115, 125), 2)
        post(dt.date(year, mon, 1), [("1100", f"Monthly service fee - {client}", client, fee, 0, "AR"),
                                      ("4000", f"Monthly service fee - {client}", client, 0, fee, "AR")], source="AR")
    # everyday noise so the planted items are needles in a real haystack
    SMALL = [("Staples Business", "6100", 40, 420), ("Uline", "6100", 60, 380), ("Delta Air Lines", "6900", 180, 640),
             ("Hilton Garden Inn", "6900", 160, 520), ("DoorDash for Work", "6900", 35, 240),
             ("FedEx", "6100", 18, 140), ("Adobe Inc.", "6420", 55, 55), ("Zoom Video", "6420", 16, 160),
             ("Grubhub Corporate", "6900", 40, 310), ("UPS Store 4417", "6100", 12, 90)]
    for _ in range(rng.randint(55, 70)):
        vendor, acct, lo, hi = rng.choice(SMALL)
        d = dt.date(year, mon, rng.randint(1, 28))
        while d.weekday() >= 5:
            d += dt.timedelta(days=1)
        a = round(rng.uniform(lo, hi), 2)
        ref = f"CC-{rng.randint(10000, 99999)}"
        post(d, [(acct, f"{vendor} - corporate card", vendor, a, 0, ref), ("2000", f"{vendor} - corporate card", vendor, 0, a, ref)],
             source="Card feed")
    copy = round(rng.uniform(38000, 42000), 2)
    post(dt.date(year, mon, 28), [("1000", "Requestor copy fees collected", "Portal", copy, 0, "DEP"),
                                  ("4100", "Requestor copy fees collected", "Portal", 0, copy, "DEP")], source="Cash receipts")
    return rows, je


gl6, je = gl_month(2026, 6, 6000)
gl7, je = gl_month(2026, 7, je)
gl8, je = gl_month(2026, 8, je)

# planted August items
def add(rows, date, acct, desc, vendor, dr, cr, ref, je_ref, source="AP", memo="", entered_by="system"):
    rows.append({"entry_id": f"202608-{len(rows)+1:04d}", "journal_ref": je_ref, "date": date, "account": acct,
                 "account_name": ACCT[acct], "vendor_or_customer": vendor, "description": desc, "reference": ref,
                 "debit": f"{dr:.2f}" if dr else "", "credit": f"{cr:.2f}" if cr else "", "source": source,
                 "entered_by": entered_by, "memo": memo})

# near-duplicate: same vendor and amount, different invoice number, 9 days apart
add(gl8, "2026-08-11", "6600", "Legal review - carrier MSA", "Dunmore Legal Advisors", 4750.00, 0, "DLA-5521", "JE-9101")
add(gl8, "2026-08-11", "2000", "Legal review - carrier MSA", "Dunmore Legal Advisors", 0, 4750.00, "DLA-5521", "JE-9101")
add(gl8, "2026-08-20", "6600", "Legal review", "Dunmore Legal Advisors", 4750.00, 0, "DLA-5534", "JE-9102")
add(gl8, "2026-08-20", "2000", "Legal review", "Dunmore Legal Advisors", 0, 4750.00, "DLA-5534", "JE-9102")
# miscode: AWS marketplace charge booked to rent
add(gl8, "2026-08-18", "6200", "AWS Marketplace - Textract add-on", "Amazon Web Services", 2980.00, 0, "AWS-MKT-0818", "JE-9103")
add(gl8, "2026-08-18", "2000", "AWS Marketplace - Textract add-on", "Amazon Web Services", 0, 2980.00, "AWS-MKT-0818", "JE-9103")
# unbalanced JE (transposition: 12,450 vs 12,405)
add(gl8, "2026-08-31", "1400", "Reclass annual E&O renewal to prepaid", "", 12450.00, 0, "RECLASS", "JE-9104", source="Manual JE", entered_by="c.iacangelo")
add(gl8, "2026-08-31", "6700", "Reclass annual E&O renewal to prepaid", "", 0, 12405.00, "RECLASS", "JE-9104", source="Manual JE", entered_by="c.iacangelo")
# weekend, round-number manual JE with a vague memo
add(gl8, "2026-08-23", "6600", "Adjustment", "", 25000.00, 0, "", "JE-9105", source="Manual JE", memo="adj per discussion", entered_by="s.morck")
add(gl8, "2026-08-23", "2100", "Adjustment", "", 0, 25000.00, "", "JE-9105", source="Manual JE", memo="adj per discussion", entered_by="s.morck")
# a clean manual JE so not every manual entry looks suspicious
add(gl8, "2026-08-31", "6420", "Amortize prepaid annual Adobe license", "", 410.00, 0, "AMORT", "JE-9106", source="Manual JE", memo="1/12 of $4,920 annual", entered_by="c.iacangelo")
add(gl8, "2026-08-31", "1400", "Amortize prepaid annual Adobe license", "", 0, 410.00, "AMORT", "JE-9106", source="Manual JE", memo="1/12 of $4,920 annual", entered_by="c.iacangelo")

GL_FIELDS = list(gl8[0].keys())
for name, rows in (("gl_2026-06.csv", gl6), ("gl_2026-07.csv", gl7), ("gl_2026-08.csv", gl8)):
    rows.sort(key=lambda r: (r["date"], r["journal_ref"]))
    write_csv(ROOT / "finance" / name, rows, GL_FIELDS)

# bank statement for August (operating cash 1000)
bank = []
for r in gl8:
    if r["account"] != "1000":
        continue
    amt = float(r["debit"] or 0) - float(r["credit"] or 0)
    d = dt.date.fromisoformat(r["date"])
    bank.append({"date": (d + dt.timedelta(days=1)).isoformat(), "description": r["description"].upper(),
                 "amount": f"{amt:.2f}", "type": "Deposit" if amt > 0 else "Withdrawal"})
# planted: the Aug 28 copy-fee deposit clears Sep 1 (deposit in transit): drop it from the Aug statement
bank = [b for b in bank if not b["description"].startswith("REQUESTOR COPY FEES")]
# vendor checks that cleared (paid AP)
for vendor, amt, d in (("MARCONI REALTY LLC CHK 4471", -18500.00, "2026-08-04"), ("IRON MOUNTAIN ACH", -1842.50, "2026-08-09"),
                       ("HUBSPOT INC ACH", -3150.00, "2026-08-05"), ("KEMPER & LAU CPAS CHK 4473", -3251.00, "2026-08-27")):
    bank.append({"date": d, "description": vendor, "amount": f"{amt:.2f}", "type": "Withdrawal"})
bank.append({"date": "2026-08-31", "description": "MONTHLY SERVICE CHARGE", "amount": "-85.00", "type": "Fee"})  # planted: unrecorded fee
bank.sort(key=lambda b: b["date"])
write_csv(ROOT / "finance" / "bank_statement_2026-08.csv", bank, ["date", "description", "amount", "type"])
# the checks as recorded in the GL cash account (for the rec): one outstanding, one amount mismatch
checks = [
    {"date": "2026-08-01", "check_or_ref": "CHK 4471", "payee": "Marconi Realty LLC", "amount": "18500.00"},
    {"date": "2026-08-05", "check_or_ref": "ACH", "payee": "Iron Mountain Records Mgmt", "amount": "1842.50"},
    {"date": "2026-08-03", "check_or_ref": "ACH", "payee": "HubSpot Inc.", "amount": "3150.00"},
    {"date": "2026-08-25", "check_or_ref": "CHK 4473", "payee": "Kemper & Lau CPAs", "amount": "3215.00"},  # bank shows 3,251.00
    {"date": "2026-08-29", "check_or_ref": "CHK 4474", "payee": "Hartwell Cyber Insurance", "amount": "2210.00"},  # outstanding
]
write_csv(ROOT / "finance" / "ap_disbursements_2026-08.csv", checks, ["date", "check_or_ref", "payee", "amount"])

print(json.dumps({"requests": len(requests), "invoices": len(invoices), "tickets": len(tickets),
                  "gl_aug_lines": len(gl8), "bank_lines": len(bank)}, indent=1))
