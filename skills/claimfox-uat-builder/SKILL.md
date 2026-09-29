---
name: claimfox-uat-builder
description: "Turns a ClaimFox EREQ ticket or change description into a complete, runnable UAT package: a test plan (scope, modules affected, risks, entry and exit criteria), step-by-step test cases grouped by system module with exact test data and expected results (due dates computed by a business-day calculator), regression checks for every module the change touches, negative and edge cases, a check against client contracts, a traceability sheet covering every acceptance criterion and every change in the ticket, open questions the ticket doesn't answer, and a workbook testers can run from with Result dropdowns and a live summary. Use when asked to write UAT, a test plan, test cases or test scripts, prepare testing for an EREQ or release, check what a change could break, or review acceptance criteria."
---

# ClaimFox UAT Builder

Every change to the Ecosystem or the requestor portal needs the same thing before it ships: a test plan someone can execute and sign off on. This skill writes it from the ticket, in a standard structure, and spends its extra effort on what the ticket forgot to say.

Owner: Mary Siems (Client Services, works with Heidy on development testing).

## What you need

- **The EREQ ticket** or change description: pasted, as a file, or as an export.
- `references/modules.md`: the system modules, the regression checks that always run when a module is touched, and ClaimFox's business-day rule. Until the real file exists, use `modules.SAMPLE.md` and say so in the plan.
- `references/severity-rubric.md` (or the SAMPLE): used for **risk if it fails** on each case and **severity** on each defect.
- `references/holidays.SAMPLE.csv` and `scripts/business_days.py`: compute every expected due date. Never work out business days in your head.
- **Client contracts**, for any change that touches turnaround, fees, what gets released, redaction or notifications. Use any `Contract Requirements - *.xlsx` workbook (from `/claimfox-contract-requirements`) in the working folder or one the user names. Otherwise read the contract documents if provided. Otherwise add an open question: "Which client contracts restrict this?"

## Workflow

1. **Restate the change** in 3 to 5 plain sentences. Number every change the ticket makes (C-1, C-2, ...) and every acceptance criterion (AC-1, AC-2, ...). If you can't restate the change clearly, the ticket is unclear. Make that the first open question.
2. **Map the blast radius.** List every module the change touches, directly or downstream. For example, a new intake checkbox that changes the SLA clock also touches the queue, billing, notifications, reporting and admin settings. Pull in the standard regression checks for each module from `modules.md`.
3. **Find the gaps. This is the most valuable part.** Look for what the ticket doesn't cover:
   - The new option combined with each existing path: every request type, line of business, requestor type (including ones who aren't charged), cancellations, and requests on hold.
   - **Client contracts**: shorter clocks, fee restrictions, service credits, release rules. List each conflict with its clause.
   - Dates: weekends, holidays, after-cutoff receipt, time zones, and a subpoena return date earlier than the new clock.
   - Money: refunds, cancellations, and what happens when the promised deadline is missed.
   - Who can turn it on or off, per client, and what a requestor sees when it's unavailable.
   - Reporting: does every existing report still total correctly?

   Each gap becomes an **Open question** (OQ-1, OQ-2, ...) and, where possible, a test case that forces the answer.
4. **Compute the dates.** Run `python3 scripts/business_days.py matrix --clocks ... --received ...` for the receipt times your cases use, including a Friday after cutoff, a weekend, and the day before a holiday. Use `due --return-date` for "N days or the return date, whichever is earlier," and `--tz` for receipt times outside Eastern. Add an entry criterion saying how testers will set a request's received time (a clock override or a back-dated test record), since they can't wait for a real Friday at 5:30pm. Put the results on a `Due-date matrix` sheet, and use those exact dates as expected results.
5. **Write the test cases**, one row per case, grouped by module. Cover the happy path, each AC, each C, negative cases, boundaries, permissions and regression. **If an open question blocks a case,** set Blocked by = OQ-n and write the expected result for each possible answer ("If OQ-3 = A: ...; if B: ..."). The tester records which answer applied.
6. **Check your own work with code** before delivering: every AC and C has at least one case, every Blocked by points to a real OQ, every case ID is unique, and no expected result says "works correctly." Fix anything the check finds.

## Test case columns

Case ID (EREQ-####-NN) · Module · Scenario · Covers (AC-n / C-n / Gap / Regression) · Preconditions · Test data · Steps (numbered) · Expected result (specific and checkable: "Due date shows 2026-10-06", never "works correctly") · Risk if it fails (S1–S4) · Blocked by (OQ-n or blank) · Result · Tester · Defect ID · Notes

## Outputs (in the working folder)

1. **The test workbook**, `EREQ-#### UAT - <YYYY-MM-DD>.xlsx`, built with `scripts/build_workbook.py`:
   - `Summary`: live formulas. Case counts by module, by risk and by result, and open questions still unanswered, using `=COUNTIF(...)` or `=COUNTIFS(...)` over the Test cases sheet. The status at a glance is ready to paste into a Teams update.
   - `Test cases`: the columns above, with `dropdowns: {"Result": ["Pass","Fail","Blocked","Not run"]}` and `status_columns: ["Risk if it fails","Result"]`.
   - `Traceability`: every AC and every C, the case IDs covering it, and a count.
   - `Contract conflicts`: client, clause, what it says, how the change interacts with it, and the covering case.
   - `Due-date matrix`: from step 4.
   - `Open questions`: ID, question, why it matters, who should answer, the cases it blocks.
   - `Test data`: the fake requestors, claims and files the cases use.
   - `Test data setup`: a build checklist for whoever prepares the environment. One row per item to create (claim, file, planted page such as an SIU note on page 4 or a mental-health page, requestor account, user role, client setting), with who builds it and a Done column. The Test data sheet describes data; this sheet gets it built.
   - `Defect log`: empty rows with a Severity dropdown (S1–S4) and a Status dropdown.
   - `Severity rubric`: copied from the reference.
2. **The test plan**, `EREQ-#### UAT Test Plan - <YYYY-MM-DD>.docx`, short: change summary, modules in and out of scope, environment and test data needed, entry criteria, exit criteria (for example, all S1 and S2 cases pass and all blocking OQs are answered), roles, and a schedule placeholder.
3. **Chat summary**: case counts by module and risk, the top 3 open questions, any contract conflicts, and the riskiest part of the change in one sentence.

## Workbook tips

- `build_workbook.py` puts the header row after the title lines: row 1 with no title; with title, subtitle and banner, row 5. Point Summary formulas at the right rows.
- `COUNTIF` wildcards are loose: `"*C-1*"` also matches `AC-1`. Use exact IDs or `SUMPRODUCT(--ISNUMBER(FIND(", C-1,", ", "&range&",")))`.

## Rules

1. Expected results must be observable. If you can't say what the tester will see, the case isn't finished.
2. Don't assume answers to open questions. Use the Blocked by pattern from step 5.
3. Use realistic but fake test data. Never real claimant names or claim numbers.
4. A tester should be able to run any unblocked case without asking you anything.

## Learn from this run

After UAT, ask Mary which defects were found that no test case covered. Offer to add each one as a standard regression check in `modules.md`. Every future ticket that touches that module then tests for it automatically, and the skill builds up institutional memory.

## Customize before real use

- [ ] Replace `references/modules.SAMPLE.md` with the real module list, regression checks and business-day rule, then rename it `modules.md`.
- [ ] Replace `references/severity-rubric.SAMPLE.md` with how ClaimFox actually triages.
- [ ] Replace `references/holidays.SAMPLE.csv` with ClaimFox's observed holidays, and confirm the cutoff time.
- [ ] Note the test environment URL and how to get test accounts: `[FILL IN]`.
- [ ] Run it on the last EREQ you tested by hand and compare the coverage.
