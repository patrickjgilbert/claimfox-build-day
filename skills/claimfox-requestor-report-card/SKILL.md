---
name: claimfox-requestor-report-card
description: "Builds a quarterly report card for chosen ClaimFox requestors (law firms, record retrieval companies, adverse carriers): request volume, which carrier clients they request from, open, pending and unpaid requests, cancelled invoices and why, all-time unpaid invoices by year with exact archive dates and a 12-month archive countdown, support tickets and top reasons, compared with same-type peers and all requestors. Also drafts a ready-to-send statement of open invoices with pay-by dates. Numbers come from a script. Claude writes the observations and leaves room for CX comments. Use when asked for a requestor report card or scorecard, how a law firm or retrieval company is doing, who owes us, which invoices are about to be archived, which requestors cause the most tickets, or to prep for a requestor call."
---

# ClaimFox Requestor Report Card

One page per requestor that Customer Experience can use to run a quarterly check-in, collect unpaid invoices before they age out, and spot requestors who need help with the portal.

Owner: Michelle Erimez (Director of Customer Experience).

## What you need

- A folder with `requests.csv`, `invoices.csv` and `support_tickets.csv`. Columns are listed at the top of `scripts/claimfox_metrics.py`. If the exports come from different systems or use other column names, write a short script to map them into a working copy and show the mapping.
- **The requestors to include**, by name. This is a chosen list, not every requestor. Run `profile` to see the top requestors.
- **The window.** Default: the quarter the user names. If it isn't over yet, the script compares the same number of days in the prior quarter and flags `partial_window`. If no quarter is named, use the most recent one.
- **The archive rule.** Default: 24 calendar months from the invoice date, with a warning for invoices within 90 days of their archive date. **This rule isn't final at ClaimFox yet.** Show the rule used on every card, and change it with `--archive-months` and `--warn-days`.
- **The as-of date.** Default: today. Archive deadlines are measured from today, not from the export date. Say both on each card.

## The numbers come from code

```
python3 scripts/claimfox_metrics.py requestor-card --data <folder> \
  --requestor "RecordPoint Retrieval" --requestor "Morrison & Pratt LLP" \
  --start 2026-07-01 --end 2026-09-30 [--as-of 2026-09-29 --archive-months 24 --warn-days 90]
```

Each card returns:
- Volume vs the prior window (same number of days if partial), and the breakdown by carrier client and request type.
- Invoices billed, open and cancelled, with the requestor's **own** unpaid and cancel rates and the cancel reasons.
- Pending requests.
- **All-time open unpaid by invoice year.**
- Invoices already past their archive date, and those within the warning window, each with archive date, amount and request ID.
- A **12-month archive countdown** (count and dollars reaching the archive date each month).
- Support tickets per 100 requests, with top categories (ties included).
- How many unpaid invoices also had a portal-login ticket.
- **Same-type peer benchmarks**, plus all other requestors.

Never count or total by hand. For anything else, write and run a snippet.

## Each card has

1. **Header**: requestor, type, window, data through date, as-of date.
2. **Volume**: requests this quarter vs last, and the top 3 carriers.
3. **Money**: billed, open unpaid (count, dollars, and rate vs the peer rate), cancelled invoices and the main reason.
4. **Aging**: all-time open unpaid by year, then the callout:
   > **"N invoices ($X) reach the 24-month archive date by <as-of date + warning days>. After that they're archived, cancelled and destroyed, and the records would have to be requested again."**

   The date in the callout is the end of the warning window (as-of date plus `--warn-days`). If any invoices are already past their archive date, say so first. Also show `open_unpaid_by_age` (0-30 days = just billed, 31-90, 91-365, over 1 year), so recent billing isn't mistaken for a collection problem. Add a small **archive countdown chart** of dollars by month for the next 12 months. The next big wave is often the real story.
5. **Support**: tickets per 100 requests vs peers, and the top reasons.
6. **What the data suggests**: 2 or 3 observations, each tied to a number. For example: "Portal login is the top ticket reason, and 41 unpaid invoices had a login ticket. A 15-minute portal walkthrough would likely cut both."
7. **CX comments**: a blank section headed *What's working / What's not / Upcoming improvements (API, etc.)* for Michelle to fill in. Don't write it for her.

## Outputs (in the working folder)

- `Requestor Report Cards - <quarter>.html` (and `.pdf` if asked): one page per requestor, plus an appendix listing each invoice in the warning window. Use the ClaimFox brand skill if installed. Otherwise use navy `#1C2A39`, orange `#F15A29` for the single most urgent callout (usually the archive warning), slate `#576374` and light grey `#EEEFF1`, in Open Sans. Put anything internal-only on a separate last page labeled INTERNAL.
- `Requestor Report Cards - <quarter>.xlsx`, built with `scripts/build_workbook.py`:
  - `Summary`: one row per requestor with the key figures. Use `"formats"` for currency and dates.
  - `Archive watchlist`: every invoice past or within the warning window.
  - `Countdown`: dollars by month.
- **Statement of open invoices** per requestor (on request, or offer it): invoice ID, request ID, date, amount and pay-by date (the archive date). List invoices already past their archive date separately, marked for CX to decide, not as payable, as a clean page Michelle can attach to her follow-up email. Every check-in ends with a clear ask.

## Rules

1. Every figure comes from the script or from code run this session.
2. Show the archive rule, as-of date and data-through date on every card.
3. The card must be shareable with the requestor. No internal jokes, no blame.
4. If a requestor name matches nothing, stop and show the script's closest matches. Don't guess.
5. If `profile` reports data-quality issues (for example, invoices dated after the export), mention them once, in the internal page.

## Learn from this run

After Michelle reviews the cards, ask what she changed and whether it should become standard (a new section, a different benchmark, a requestor to always include). Offer to record it below.

## Standing list and preferences

*(empty. For example: "Quarterly list: RecordPoint Retrieval, Morrison & Pratt LLP, ..." or "Archive rule confirmed at 24 months on <date> by <name>.")*

## Customize before real use

- [ ] Confirm the archive rule and update the defaults here: `[FILL IN]`.
- [ ] Save the standing list of requestors for the quarterly run.
- [ ] Note where each export comes from (requests: Ecosystem; invoices: `[FILL IN]`; tickets: `[FILL IN]`) and the column mapping.
- [ ] Run it for one requestor you know well and check the numbers.
