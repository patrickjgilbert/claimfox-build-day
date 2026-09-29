# Ecosystem modules and standard regression checks (SAMPLE, replace with the real list)

> Written for training from what we know of the workflow: intake, page selection, redaction, billing, customer service, portal delivery. Mary: replace these with the real module names and the checks you always run, then rename to `modules.md`.

| Module | What it does | Always regression-test when touched |
|---|---|---|
| **Requestor Portal - Intake** | Requestors submit requests and documents | Required fields; file upload types and sizes; confirmation email; duplicate-request detection |
| **Intake Processing** | Associates validate and enter requests, match them to carrier and claim | Claim matching; deficiency notice; request type detection; return-date capture on subpoenas |
| **Queue & Assignment** | Routes requests to reviewers | Sort order; assignment rules; SLA due-date calculation; reassignment |
| **Page Selection** | Chooses the pages to release per carrier business rules | Carrier rule set applied; withheld categories (SIU, privileged); page counts |
| **Redaction** | Removes PII per carrier rules | Standard redactions (SSN, DOB, account numbers); carrier-specific redactions; redaction log |
| **Billing** | Invoices requestors and carriers | Fee schedule by state; line items; tax; invoice total; cancellations |
| **Notifications** | Emails to requestors and carriers | Correct recipient; correct dates and amounts; template text |
| **Portal Delivery** | Releases files after payment | Release only after payment; correct file; download expiry; access logging |
| **Reporting** | Daily SLA and client reports | New fields appear; filters; totals tie to source |
| **Admin & Configuration** | Feature flags, fee tables, client-level settings, user roles | Who can change the setting; per-client on/off; audit log of changes; default for new clients |

## Business-day rule (SAMPLE, confirm with Heidy)

- The day of receipt is day 0. Day 1 is the next business day.
- Requests received after **5:00 pm Eastern**, on a weekend, or on a holiday count as received at the start of the next business day.
- Holidays: `holidays.SAMPLE.csv` (replace it with ClaimFox's observed holidays).
- `scripts/business_days.py` applies this rule. Use it for every expected due date in a test case.
