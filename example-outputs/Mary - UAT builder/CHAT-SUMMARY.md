Mary, the EREQ-2147 UAT package is ready:

- **EREQ-2147 UAT - 2026-09-28.xlsx**: 60 test cases, traceability, contract conflicts, due-date matrix, open questions, test data, defect log, severity rubric. The Summary sheet updates as testers fill in Result, and the last row is a status line you can paste into Teams.
- **EREQ-2147 UAT Test Plan - 2026-09-28.docx**: scope, entry and exit criteria, roles, and a schedule placeholder.

**Cases by module and risk**

| Module | Cases | S1 | S2 | S3 |
|---|---|---|---|---|
| Requestor Portal - Intake | 9 | 2 | 7 | 0 |
| Intake Processing | 4 | 2 | 2 | 0 |
| Queue & Assignment | 22 | 17 | 5 | 0 |
| Page Selection | 4 | 4 | 0 | 0 |
| Redaction | 1 | 1 | 0 | 0 |
| Billing | 6 | 2 | 4 | 0 |
| Notifications | 5 | 0 | 5 | 0 |
| Portal Delivery | 2 | 1 | 1 | 0 |
| Reporting | 5 | 0 | 5 | 0 |
| Admin & Configuration | 2 | 0 | 1 | 1 |
| **Total** | **60** | **29** | **30** | **1** |

39 cases can run now. 21 are waiting on one of 13 open questions. Each of those has the expected result written out for every possible answer, so testers can still run them and record which answer applied.

**Top 3 open questions**

1. **OQ-1: when the contract deadline is already shorter than 2 days, which date wins?** The ticket says the 2-day clock replaces the contracted clock. Harborline Amendment 2 Sec. 2.2 says a subpoena is due by its return date if that's earlier. So a subpoena due tomorrow would get a later due date if the requestor pays to expedite it.
2. **OQ-2: who is eligible?** The ticket has no per-client on/off switch, no admin setting, and nothing on requestors we don't charge (for example the Workers' Compensation Board on Tri-County files).
3. **OQ-3 and OQ-4: what happens when we miss the 2-day date?** The ticket doesn't say whether the $35 gets refunded. It also doesn't say which clock the SLA report uses to count a miss, and that decides Harborline's 2% service credit (Amendment 2 Sec. 2.4).

**Contract conflicts** (Contract conflicts sheet, 13 rows)

- Harborline Amendment 2 Sec. 2.2: the subpoena return date can be earlier than the 2-day clock. **Conflict.**
- Harborline MSA Sec. 3.2: we can't release to an adverse carrier until the claim rep approves in writing, so a paid 2-day promise can expire while we wait. **Conflict.**
- Harborline Amendment 2 Sec. 2.4: expedited requests jumping the queue push standard requests toward the 5% miss threshold. **Risk.**
- Tri-County Sec. 2.3: court orders must be handled "promptly", which isn't defined. **Unclear.**
- Neither contract says anything about charging requestors an expedite fee (OQ-11).
- The withholding and redaction clauses (SIU, mental health, 42 CFR Part 2, HIV, VINs) don't change. Each has an S1 regression case on an expedited request.

**Riskiest part:** the due-date calculation. On a 2-day clock, one wrong holiday or cutoff is a 50% error, and it lands on every expedited request and every confirmation email.

**Before you start**

- The module list, severity rubric and holiday calendar are still the SAMPLE files. The sample calendar treats Columbus Day and Christmas Eve as business days, so please confirm that with Heidy (OQ-12).
- Five cases need a test-environment clock override (entry criterion EC-5).
- I only checked the Harborline and Tri-County contracts, because those are the ones in the folder.
- The test environment URL and how to get test accounts are marked [FILL IN].

After UAT, tell me which defects turned up that no test case covered. I'll add each one to the standard regression checks so future tickets test for it automatically.
