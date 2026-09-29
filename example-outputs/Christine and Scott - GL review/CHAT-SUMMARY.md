# August 2026 GL review

Christine, Scott: **No, the close is not clean.** The GL is out of balance by $45.00, one bill is posted twice, two lines are miscoded, a $25,000 manual entry has no support, and $28,953.50 of August vendor payments aren't in the GL at all. Details below. Nothing in the books was changed.

**Header:** gl_2026-08.csv, 176 lines in 87 journal entries. Total debits $618,545.94 vs credits $618,500.94, out of balance by $45.00. Compared against July (variance) and June + July (recurring vendors). Thresholds: default (variance 25% and $1,000, round amount $10,000, near-duplicate window 14 days, split limit $500). Script found 23 exceptions: 5 High, 12 Medium, 6 Low.

## Fix before close (High)

1. **JE-9104 is unbalanced by $45.00** (c.iacangelo, 8/31, "Reclass annual E&O renewal to prepaid"). Debits $12,450.00 to 1400, credits $12,405.00 to 6700. The difference divides by 9, so two digits were likely swapped. Every entry must have debits equal to credits. **Fix:** void and re-post from the E&O invoice. See also follow-up item A below: the reclass itself looks wrong.
2. **Iron Mountain invoice IRO-202608-855 ($1,842.50) is posted twice**, JE-6162 (8/5) and JE-6163 (8/7). Only one payment went out (register and bank both show one $1,842.50). **Fix:** void JE-6163.
3. **JE-9105, $25,000.00, by s.morck** (Dr 6600 Professional Fees / Cr 2100 Accrued Expenses). Posted on a Sunday (8/23), round amount, memo "adj per discussion", no reference. This is a control step, not an accusation: it needs the support and a second approver, `[FILL IN: CFO or CEO]`, since the Controller posted it.
4. **Bank rec, Kemper & Lau CHK 4473:** register shows $3,215.00, bank cleared $3,251.00 ($36.00 difference, divisible by 9). Follow-up: Kemper's August bill is $3,500.00 (KEM-202608-784), so the payment matches neither record. **Fix:** pull the cleared check image before correcting anything.
5. **Bank rec, $85.00 monthly service charge (8/31)** is on the statement but not in the books. **Fix:** Dr 6800 Bank Fees / Cr 1000.

## Explain or confirm (Medium, grouped by cause)

- **6600 Professional Fees +$34,500.00 (+985.7%, $3,500.00 to $38,000.00).** Fully explained by two items: the $25,000 JE-9105 above, and two Dunmore Legal bills of $4,750.00 each (JE-9101 "Legal review - carrier MSA" DLA-5521 on 8/11; JE-9102 "Legal review" DLA-5534 on 8/20). Dunmore is new this month. Different invoice numbers and descriptions suggest separate matters, but pull both invoices to confirm.
- **6500 Records Storage +$1,842.50 (+74.2%).** Exactly the Iron Mountain duplicate. Clears when JE-6163 is voided.
- **6100 Office Supplies +$1,821.45 (+53.2%).** Anthropic Claude Team ($1,500.00, JE-6167) is coded to Office Supplies; the rule says 6420 Software Subscriptions (it was in 6420 in June and July). After the reclass, 6100 is up $321.45 (+9.4%), which the Staples split-purchase item below covers.
- **6200 Rent** (not flagged, +$2,980.00, +16.1%) and **6450 Cloud Hosting**: AWS Marketplace Textract add-on ($2,980.00, JE-9103) is coded to Rent; the rule says Cloud Hosting. After the reclass, Rent is back to $18,500.00.
- **6450 Cloud Hosting +$5,903.43 (+41.2%, $14,342.18 to $20,245.61). Still unexplained.** It's one AWS monthly bill (JE-6164). After the Textract reclass the increase grows to $8,883.43 (+61.9%). Needs the AWS invoice detail.
- **6300 Telephone & Internet −$1,265.40 (−76.4%).** Verizon Business billed in June and July (last $1,265.40, 7/12) but nothing in August. Accrue it or confirm the service ended.
- **6700 Insurance −$12,405.00, now a negative balance of −$10,195.00.** Caused by JE-9104. See follow-up item A.
- **AP never relieved:** $199,372.85 of bills credited to AP across June to August, and not one payment debits AP. Either payments post somewhere else or AP is overstated. See follow-up item B.
- **Check 4472 is missing** from the register (between 4471 and 4473). Not in the GL either. Confirm it was voided and kept.

## Worth a look (Low)

Split purchases on one day, each under $500: Staples 4 charges $748.27 (8/24), Grubhub 3 charges $646.59 (8/10), Hilton Garden Inn 2 charges $586.29 (8/10). Adobe: 6 card charges of exactly $55.00 ($330.00); see follow-up item C.

## Bank rec

Activity reconciliation only: the statement has no opening or closing balance. Please send the full statement so balances can be tied.

- 7 bank lines, 8 book lines (3 GL cash + 5 register payments), 5 matched.
- Reconciling items: deposit in transit $41,990.26 (requestor copy fees, 8/28); outstanding check 4474 Hartwell $2,210.00; Kemper amount difference $36.00; bank fee not booked $85.00.
- **It ties.** Book activity −$408,302.34, less deposit in transit, plus outstanding check, less the $36.00 and $85.00 = −$448,203.60, which equals bank activity. Unexplained difference $0.00 (computed).
- Note that "book" here includes the register. The GL cash account alone shows −$379,384.84, because the $28,953.50 of vendor payments (at the cleared Kemper amount) were never recorded in 1000.

## Found by follow-up analysis (not in the script's counts)

- **A. JE-9104 reclasses an expense that was never booked.** No E&O charge exists in 6700 in June, July or August; the only insurance expense is Hartwell Cyber $2,210.00 a month. Crediting 6700 for $12,405.00 is what drives Insurance negative. The re-post is probably Dr 1400 / Cr 2000 from the E&O invoice, plus the first month of amortization.
- **B. August vendor payments are missing from GL cash.** The 5 register payments total $28,953.50 at bank-cleared amounts. None appears in 1000 or 2000. This is the concrete August piece of the AP finding.
- **C. Adobe is paid two ways.** JE-9106 amortizes a prepaid annual Adobe license ($410.00, "1/12 of $4,920 annual"), while 6 separate $55.00 Adobe card charges continue (5 in June, 7 in July). Confirm the card seats aren't covered by the annual license.
- **D. No AR collections in three months.** 1100 carrier receivables were debited $38,593.61 (Jun), $38,243.26 (Jul), $38,200.17 (Aug) with zero credits, and the August statement has no deposits at all. Confirm where carrier receipts are recorded.
- **E. 1400 Prepaid had no activity in June or July**, so the Adobe prepaid balance JE-9106 draws from isn't in these exports. Confirm the opening balance.

Checks I ran that came back clean: prior months (June, July) each balance to $0.00; every account in all three months exists in the chart of accounts with a matching name; all August dates fall 8/1 to 8/31.

## Checks that found nothing

None. All 12 script checks returned at least one finding.

## Next step (drafts only, nothing posted)

`DRAFT-correcting-entries-2026-08.csv` has 8 proposed entries. Four are ready after your review: void the Iron Mountain duplicate, the two reclasses, and the bank fee (net effect −$1,757.50 of expense). Four are on hold for support: re-post JE-9104 from the E&O invoice, the Verizon accrual, reversing JE-9105 if unsupported, and recording August payments against AP.

I can draft a short note asking for JE-9105's support and a second approver. I won't send it.

If any of this is expected (e.g. Dunmore billing per matter), tell me and I'll ask whether to remember it so it isn't flagged next month.

Files: `gl-review-2026-08/gl-review.xlsx` (Exceptions, Proof, Account variance, Checks run, GL data), `exceptions.csv`, `summary.json`, `account_variance.csv`. **Proof tab:** I opened it with openpyxl and confirmed the formulas point at the right columns (B journal_ref, D account, F vendor, H reference, I debit, J credit). I recomputed all 11 formulas from the raw rows and each matches the script's number (`proof-check.txt`).
