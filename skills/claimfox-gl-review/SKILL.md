---
name: claimfox-gl-review
description: "Month-end general ledger review and bank reconciliation for ClaimFox finance. Runs deterministic code checks on a GL export and returns an exception list with entry references: unbalanced journal entries (with digit-swap detection), duplicate and near-duplicate bills, split purchases, repeated identical charges, miscoded accounts, recurring vendors missing this month, account swings vs prior month linked to their likely cause, manual entries that need a second look, missing check numbers, and bank-to-book differences. Includes a Proof tab of live Excel formulas so every total can be checked by hand. Claude writes and runs code for every number and never does arithmetic in its head. Use when asked to review the GL, check month-end close, find errors or duplicates, reconcile the bank, explain a variance, or validate a reconciliation before sign-off."
---

# ClaimFox GL Review and Bank Reconciliation

Month-end close has plenty of places for small errors to hide: a bill entered twice, a subscription coded to office supplies, a journal entry off by $45. This skill runs the same checks every month, the same way, and gives finance a short list of rows to look at. It never changes the books.

Owners: Christine Iacangelo (Assistant Comptroller) and Scott Morck (Controller).

## Why code, not Claude

Language models read numbers as chunks of text and predict what comes next. They are not calculators. Ask one to add up 170 amounts and it can give a confident, wrong total. So **every count, total, comparison and match here comes from `scripts/validate_gl.py`** or from code Claude writes and runs in the session. Claude's job is to run the checks, read the results and explain them. Never state a figure that didn't come from code run in this session.

And so nobody has to take the script's word for it, the workbook's **Proof tab** recomputes the key totals with ordinary Excel formulas (SUM, SUMIF, COUNTIFS) over the raw rows. Click any cell to see the formula.

## What you need

- **This month's GL export** (CSV or Excel). Required.
- **Prior months' GL exports.** One gives the variance check. Two or more give the missing-recurring-vendor check.
- `references/chart_of_accounts.csv` and `references/coding_rules.csv` (vendor pattern to expected account).
- Optional, for the bank rec: **the bank statement** for operating cash and **the disbursements register** (checks and ACH sent).

## Workflow

1. **Check the columns.** The script expects `date, journal_ref, account, account_name, vendor_or_customer, description, reference, debit, credit, source, entered_by, memo` (and `entry_id` if the system has one). If the export uses other names, write a short script that renames them into a working copy, show the mapping, and never edit the original. Convert Excel files to CSV first.
2. **Run the checks.** Write output to the working folder, never inside the skill folder:
   ```
   python3 scripts/validate_gl.py --gl <this month> --prior <last month> <month before> \
     --coa references/chart_of_accounts.csv --rules references/coding_rules.csv \
     --bank <statement> --disbursements <register> --out gl-review-<YYYY-MM>
   ```
   These thresholds can change on request: `--variance-pct 25 --variance-floor 1000 --round-threshold 10000 --near-dup-days 14 --split-limit 500`. Say which ones you used.
3. **Read** `summary.json` and `exceptions.csv`. The workbook `gl-review.xlsx` has the tabs Exceptions, Proof, Account variance, Checks run (every check, including those that found nothing), and the raw GL data.
4. **Connect the dots before reporting.** The script's `linked_findings` column shows other findings on the same account. Use it to group each variance with its likely cause, so finance sees the real issues and not a long list of rows. Anything with no link is **still unexplained**. Say so.
5. **Report in chat:**
   - **Header line:** file, lines checked, total debits vs credits and the out-of-balance amount (from the script), plus the thresholds used.
   - **Fix before close:** High items, each with its reference, amount and the specific correction.
   - **Explain or confirm:** Medium items, grouped as in step 4.
   - **Worth a look:** Low items (split purchases, repeated charges, timing items), in one or two lines.
   - **Bank rec:** matched count, reconciling items by type, and whether activity ties once they're applied (compute it). If the statement has no opening or closing balance, say it's an activity reconciliation and ask for the full statement.
   - **Checks that found nothing:** one line, so a clean result is visible, not assumed.
6. **Prepare the next step as a draft:** correcting journal entries in a CSV labeled DRAFT (never posted). The default fix for an unbalanced entry is void and re-post from the source document. Offer, but don't send, a note to anyone whose manual entry needs support.

## Rules

1. **Read-only.** Never modify a GL file. Corrections are proposals in a separate file labeled DRAFT.
2. **Every finding carries a reference** (entry ID or journal ref), so it can be found in the source system in seconds.
3. **Name people neutrally.** "JE-9105 by s.morck needs support and a second approver" is a control step, not an accusation. If the Controller posted it, the approver is `[FILL IN: CFO or CEO]`.
4. **Explain each check in one plain sentence** the first time it appears. The `why_flagged` column has the wording.
5. **Extra findings are welcome, labeled.** If your own follow-up code finds something the script didn't, report it under "Found by follow-up analysis" with the code's result. Don't mix it into the script's counts.
6. **"Is the close clean?"** is answered from the script output plus any labeled follow-up. Never from a feeling.

## Learn from this run

When finance marks a finding as expected ("Dunmore bills per matter, so two identical amounts can both be right," "AWS always spikes in August for the annual backup"), ask: **"Want me to remember that so it isn't flagged next month?"** If yes, add it to Known patterns below, with the date and who confirmed it. Add coding corrections to `references/coding_rules.csv`. The list of false alarms should shrink every month.

## Known patterns

*(empty. Claude adds confirmed patterns here, e.g. "2026-09-29, C. Iacangelo: Dunmore Legal bills per matter. Same-amount bills with different matter numbers are not duplicates.")*

## Customize before real use

- [ ] Replace `references/chart_of_accounts.csv` with ClaimFox's real chart of accounts. The sample is invented.
- [ ] Expand `references/coding_rules.csv` with your real vendors and accounts. Most of the value comes from here.
- [ ] Note the exact export steps from the accounting system here: `[FILL IN]`, plus the column mapping if it differs.
- [ ] Set thresholds that fit ClaimFox: variance %, dollar floor, round-number threshold, split-purchase limit.
- [ ] Back-test: run it on a month you already closed and confirm it finds what you found. Note the result here.
