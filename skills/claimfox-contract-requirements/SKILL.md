---
name: claimfox-contract-requirements
description: "Reads ClaimFox client agreements (MSA plus every amendment, schedule and exhibit) and builds a standard requirements matrix: turnaround, subpoena and court-order timing, redaction and withholding rules, release restrictions, security, incident notice, data location, AI and automation limits, subcontracting, retention, reporting, audit, insurance, term and renewal. Every row cites the clause it came from and is compared to ClaimFox's standard process, so anything stricter, looser, added or missing is flagged, with an owner and a key-dates list. Handles several clients at once with a side-by-side portfolio view. Use when asked what a client's contract requires, to build a contract matrix, compare clients to our standard, check an agreement before onboarding, an audit or a renewal, answer 'does Harborline allow X', or review a new or amended contract."
---

# ClaimFox Contract Requirements Matrix

Turn client agreements into one workbook that operations, security and account management can all work from. Every requirement is traced to the exact clause it came from and compared to how ClaimFox normally works.

Owner: Barbara Molina (VP of Operations). Source of truth: the SharePoint client-contract folder.

## What you need

1. **Every document in force for each client:** the base agreement plus all amendments, schedules, exhibits and business-rule attachments. Pull them from SharePoint through the Microsoft 365 connector, or use files dropped in the chat or working folder.
2. **The ClaimFox standard** in `references/standard-process.md`. If only `standard-process.SAMPLE.md` exists, say so on the first line of the chat summary and in the workbook subtitle: "Compared against the SAMPLE standard, not ClaimFox's real one."

If the user names a client but gives no files, look for that client's folder in the connected SharePoint first. If nothing is there, ask for the documents. Never work from memory of what a contract "usually" says.

## Rules

1. **Cite everything.** Every requirement gets the document, the section and, for PDFs, the page. Word documents have no reliable page numbers, so cite document and section only. A requirement with no citation doesn't go in the matrix.
2. **Amendments win.** Read the documents in effective-date order. When a later document replaces a clause, show the current term and note what it replaced ("5 business days. Amend. 2 s.1, replacing MSA s.2.1, which said 7"). Never report a superseded term as current.
3. **Missing documents make the matrix provisional. Don't stop.** If a document is referenced but not provided ("Exhibit B, as amended"), or a numbering gap implies one exists (Amendment No. 2 implies No. 1), build the matrix anyway. Put `PROVISIONAL: <what's missing>` in the workbook banner, and draft a short request to the account owner for the missing documents.
4. **Silence is a finding.** If the contract doesn't cover a category on the standard list, the row says **Not specified**, and the operations column says the ClaimFox standard applies by default. Don't copy the standard in as if the contract said it.
5. **Vague language is a finding.** For "promptly," "reasonable" or "as soon as practicable," quote the wording and mark it **Unclear**. Never turn it into a number.
6. **Quote, then paraphrase.** Put the short exact wording in the Contract language column. The Requirement column is the plain-English version.
7. **Always check for AI and automation.** Clauses on automated decision-making, machine learning, AI or offshore processing get their own row and go at the top of the summary, wherever they sit in the contract. ClaimFox uses automated page selection and redaction, so these clauses decide how the work can be done. Whether the current workflow complies is a question for counsel. Describe what the clause says and route that question.
8. **Don't give legal advice.** Describe what the text says and where it differs. Interpreting it is for the account owner or counsel.

## Status values (each row compared to the standard)

| Status | Meaning |
|---|---|
| **Stricter** | The client asks for more than standard (faster, more redaction, shorter retention, an approval step). Operations must work differently. |
| **Adds** | A requirement the standard doesn't cover at all (service credits, additional-insured status, a term clause). |
| **Looser** | The client asks for less than standard. Usually fine, but worth knowing. |
| **Matches** | Same as standard. |
| **Not specified** | The contract is silent. The standard applies by default. |
| **Unclear** | Vague or contradictory wording. Someone needs to confirm it. |

If a clause is stricter on one point and looser on another, split it into two rows.

## Workflow

1. **Inventory** each client's documents: type, effective date, and whether anything referenced is missing (see rule 3).
2. **Extract** every operational, security, compliance, retention, redaction, turnaround, term and reporting requirement, clause by clause. Work through the standard's categories so nothing gets skipped, then add whatever else the contract covers.
3. **Apply amendments** in date order and record each change.
4. **Compare** each row to the standard, assign a status, and assign an **owner**: Operations, Security, Finance, Account management or Legal.
5. **Check the system against the contract** (only if the request export is available): run `python3 scripts/claimfox_metrics.py profile --data <folder>`. Its `sla_clocks_by_client_and_type` lists the clock the system uses for each client and request type. List every place the system's clock differs from the contract (for example, WC Board requests set to 10 days when the contract says 5) on a `System vs contract` sheet. These are often the most valuable findings.
6. **Pull key dates:** the renewal notice deadline (compute it), certification-evidence dates, audit windows, report due dates.
7. **Build one workbook** with `scripts/build_workbook.py`, using a JSON spec (the format is in the script's docstring). Save it in the working folder as `Contract Requirements - <Client or "Portfolio"> - <YYYY-MM-DD>.xlsx`. Sheets:
   - **One matrix per client.** Columns: Category, Requirement, Contract language, Source, ClaimFox standard, Status, Owner, What operations must do differently. Set `status_columns: ["Status"]`.
   - **Portfolio**, when there are 2 or more clients: categories down the side, clients across the top. Each cell **starts with the status word**, then the short requirement ("Stricter: 24h incident notice"). The script colors cells by their first word. Set `status_columns` to every client column. This is the view that answers "who needs 24-hour incident notice?" at a glance.
   - **Actions**: every Stricter, Adds and Unclear row as a task (client, what to do, owner, due date if known).
   - **Key dates**: date, client, what happens, source clause.
   - **Change log**: document, effective date, section, what changed.
8. **Summarize in chat**, one block per client:
   - The documents read, and whether the matrix is provisional.
   - **AI and automation clauses**, quoted.
   - **Top 5 stricter-than-standard items**, most urgent first. The rest are in the workbook, so say how many there are.
   - Items to confirm with the client (Not specified that matter, and Unclear).
   - The single question you'd put to the account owner.
   - When there are 2 or more clients, end with 2 or 3 lines on what the portfolio view shows.

## If asked a question instead of a matrix

Take "Can we release Harborline records to an adverse carrier?" Answer in 2 or 3 sentences with the citation, then offer the full matrix. The same rules apply: current terms only, cite the clause, and say "not specified" when the contract doesn't say.

## Learn from this run

When the user corrects a row ("that's not what 3.2 means," "we treat 'promptly' as 3 days for this client"), ask: **"Want me to add that to this skill so it's right next time?"** If yes, add it under Client-specific notes below with today's date.

## Client-specific notes

*(empty. Claude adds confirmed interpretations here, e.g. "2026-09-29 Harborline: 'claim representative' in 3.2 means the assigned adjuster, per B. Molina.")*

## Customize before real use

- [ ] Replace `references/standard-process.SAMPLE.md` with ClaimFox's real standard, and rename it `standard-process.md`.
- [ ] Add the SharePoint folder path for client contracts: `[FILL IN]`.
- [ ] Add any categories Barbara tracks that aren't on the standard list.
- [ ] Run it on one contract you know well and fix anything it gets wrong.
