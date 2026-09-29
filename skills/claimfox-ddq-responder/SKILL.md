---
name: claimfox-ddq-responder
description: "Drafts answers to an incoming security due diligence questionnaire (DDQ, vendor risk assessment, security questionnaire, SIG, CAIQ, vendor security review) using only ClaimFox's approved policies, evidence and previously approved answers. Every answer cites its exact source text and gets a status: Prior answer, Drawn from policy, Conflict or Needs review. Anything without an approved source is left for a person, never guessed. Asks first whether the answers go back in the file or into a vendor portal; returns the file in its original format (dropdowns, limits, layout intact), or offers to drive a browser and fill the portal. Flags contradictions, vague answers and incomplete answers, routes open items to owners, reports missing policies, and health-checks the answer bank. Use when a prospect or carrier sends a DDQ or security questionnaire, when asked to answer vendor security questions or fill a vendor risk portal, or to check what we can't yet answer."
---

# ClaimFox DDQ Responder

Carriers and prospects send long security questionnaires, sometimes 700+ questions. Most have been answered before or are covered by an approved policy. This skill drafts those answers with a citation and the exact source text for each one, and hands the rest to the right person with a clear question.

Owner: Chris Malanga (security and policy compliance).

## What you need

1. **The questionnaire**, in whatever format it arrived: Excel, Word, PDF, a portal export, or a portal link.
2. **Approved policies:** current signed-off versions.
3. **The approved answer bank**, a CSV with `question, approved_answer, source, approved_by, approved_date`. Start one from `references/approved-answer-bank.TEMPLATE.csv` if none exists.

**Where to look:** files the user points to come first. Next, `references/policies/` and `references/approved-answer-bank.csv` in this skill. Then the connected SharePoint security folder `[FILL IN]`. If policies or the bank are missing, say so before starting ("No answer bank, so every answer below comes from policy text").

## Rules: what makes the output trustworthy

1. **No source, no answer.** Every drafted answer comes from an approved policy, approved evidence or an approved prior answer. If none covers it, the status is **Needs review** and the answer cell stays blank. Never fill a gap from general knowledge of "what security programs usually do."
2. **What counts as a source:** approved policies (status Approved); certificates and audit reports; the certificate of insurance; signed attestations; answer-bank entries whose approver is still at ClaimFox. Treat an approver as gone if the bank says so ("Former ...") or they're missing from Approvers by area once that list is filled in. Until it is, flag unfamiliar approvers in the reviewer note instead of dropping the answer. Ignore anything marked Draft, Not approved, Superseded or For discussion, and say you ignored it. A draft can appear in a reviewer note ("a draft AI policy exists but isn't approved yet"), never in an answer.
3. **Current beats old.** If a bank answer disagrees with a current approved policy, the status is **Conflict**. Quote both, and a person decides. Bank entries more than 12 months old get a staleness note even when they agree.
4. **Combining is fine; say so.** An answer that joins a bank entry with policy text is **Drawn from policy**, and the Source column lists both.
5. **Answer the question asked, at the length asked.** Yes/No questions start with Yes or No. Don't volunteer extra detail, because every added sentence is a commitment.
6. **Never invent numbers, names, dates or certifications.** RTO/RPO, limits, certification dates and named owners appear only if a source states them.
7. **Existing clients may be owed stricter terms.** Only if the user says the sender is a current client, or a contract matrix for them is available: check for tighter promises (for example 24-hour incident notice when policy says 72) and note them in the reviewer column.

## Status values

- **Prior answer**: an approved bank answer covers it and doesn't contradict current policy.
- **Drawn from policy**: written from approved policy or evidence text, possibly combined with a bank answer. Cite section numbers.
- **Conflict**: the sources disagree. Quote both. A person decides.
- **Needs review**: no approved source, only partial coverage, or something only a person can confirm (incident history, named contacts, attachments).

## Workflow

1. **Ask where the answers go** (see "Step 1: the deliverable" below). Don't draft until you know whether the result is a file or a portal.
2. **Read everything.** List the sources found, with version, review date and approval status. Flag any policy more than 12 months past its review date. If the deliverable is a file, take the format inventory described in "Matching the original format".
3. **Parse the questionnaire** into rows: question number, section, question text, the cell where the answer goes, the evidence/attachment cell if there is one, and any constraint on the answer cell (dropdown values, character limit, required).
4. **Match each question** to the bank (same meaning, not just the same words) and to the relevant policy sections.
5. **Draft, cite and assign status** under the rules. For every answered row, keep the **exact sentence(s)** from the source. Where a cell has a dropdown, the draft answer is one of its values.
6. **Run the quality check** (see "Quality check" below) on the full set of drafts.
7. **Write the files** in the working folder:
   - **The client's questionnaire, filled in** (file deliverables only). Answers go in their response cells. Evidence cells list the supporting document names. **Conflict and Needs review cells stay blank.** Save as `<original name> - DRAFT <YYYY-MM-DD>.<ext>` and never overwrite the original. Follow "Matching the original format", then run its format check.
   - **The review sheet**, `<Client> DDQ - Review Sheet - <YYYY-MM-DD>.xlsx`, built with `scripts/build_workbook.py`. Put the deliverable in the subtitle ("Deliverable: Excel file back to requester" or "Deliverable: portal at <URL>").
     - Sheet `Review`: Q#, Section, Question, Draft answer, Status, Source, Exact source text, Owner, Reviewer note. Order Conflict rows first, then Needs review, then the rest. Set `status_columns: ["Status"]`.
     - Sheet `Quality check`: Q#, Type, Quoted text, Problem, Suggested fix. Type is one of Contradiction, Vague, Incomplete or Ambiguous question. Set `status_columns: ["Type"]` (the script colors all four).
     - Sheet `Questions for owners`: one row per open item, with owner, the specific question to ask, and a reply-by date 3 business days before the questionnaire is due.
     - Sheet `Sources and bank health`: every source used (document, version, review date, approval status, rows it supports), then every answer-bank entry that's stale, has a departed approver, cites a non-approved source, or conflicts with current policy. This is the audit trail, so it lives in the file and not only in chat.
8. **Summarize in chat:**
   - The deliverable (file or portal URL) and, for files, the format check result.
   - Counts by status.
   - Conflicts, quoted.
   - **Quality check findings**: contradictions first, then incomplete, vague and ambiguous, each with the Q# and quoted text. If there are none, write "Quality check: no contradictions, vague or incomplete answers found." Never leave this line out.
   - Open items grouped by owner (Security, Operations, Finance, HR, Leadership), each group with a draft message to that owner.
   - A **policy gap line**: which topics had no approved policy at all (for example "business continuity, backups, physical security, AI use"). This is ClaimFox's roadmap for which policies to write next.
   - **Answer bank health**: stale entries, approvers who have left, sources that aren't approved documents, and entries that conflict with current policy.

## Step 1: the deliverable

Before drafting, find out where the final answers go. Check the questionnaire (including any instructions tab or cover page) and the email it came with first, and only ask about what they don't answer. Ask everything in one message:

1. **Where do the answers go?** Back into the file they sent (Excel, Word, PDF), or into an online vendor-risk portal?
2. **If it's a portal, what's the URL?** Look for it in the documentation first: links in the questionnaire, its instructions, or the cover email, and phrases like "complete in", "log in to", "vendor portal" or "assessment link". If you find one, confirm it: "The instructions point to `<URL>`. Is that where this goes?" If you can't find one or it's unclear, ask the user for it. Never guess a URL.
3. **What did the requester specify?** Allowed answer values (Yes/No/N/A only), character limits, required attachments, and who submits.

## Matching the original format

The filled file must look and behave exactly like the one that was sent. The requester may import it into their own system, and a broken dropdown or a moved column can reject the whole file.

**Inventory the original before writing:** every sheet, including hidden ones; data-validation dropdowns with their allowed values and cell ranges; text-length limits; required-field markers; merged cells; protected sheets or locked cells; formulas; conditional formatting; column widths, fonts and fills; comments; images or logos.

- **Dropdown cells take a value from their list, spelled exactly as listed** ("Yes", not "Yes."). If the real answer needs nuance ("Yes, except service accounts"), put the dropdown value in the dropdown cell and the nuance in the comment or explanation column. If there's no such column, flag it in the reviewer note. Never type free text into a dropdown cell.
- **Respect limits.** Stay within any character limit. If an approved answer won't fit, propose a shorter version in the reviewer note rather than cutting it silently.
- **Write only into answer and evidence cells.** Add no columns, sheets, colors or notes to the client's file. Reviewer material belongs in the review sheet.
- **Keep the file type.** `.xlsx` stays `.xlsx`. `.xlsm` keeps its macros (openpyxl `keep_vba=True`). Word stays Word, with tables filled in place and styles kept. A fillable PDF gets its form fields filled, not a new PDF.
- **Format check after saving.** Reopen the original and the draft and compare sheet names and order, data validations (count, ranges, allowed values), merged ranges, protection, column widths, and cell text outside the answer columns. openpyxl can silently drop images, charts and some newer dropdown types (stored in `extLst`; openpyxl warns "Data Validation extension is not supported"). If anything was lost, don't hand over that file. Edit the file's XML directly instead, or tell the user exactly what couldn't be preserved.

## Quality check

Before writing files, read every draft answer start to finish, the way the requester's reviewer will, and flag:

- **Contradiction between answers.** One answer says no data leaves the US while another names an offshore vendor. One says no shared accounts while another mentions a shared service login. Two answers give different retention periods.
- **Contradiction with the source.** The answer drifted from the cited text: a number changed, "at least annually" became "annually", or it promises more than the policy does. Fix drafting drift yourself and say so in the reviewer note. Anything else goes to a person.
- **Contradiction within one answer.** For example, "within 4 hours, and on the same business day in all cases" states two deadlines. Say which one the reviewer should commit to, or ask.
- **Too vague.** Words the requester will push back on: "regularly", "periodically", "as needed", "appropriate", "industry standard", "where possible", "generally", or an unnamed party ("a third party") when the question asked who.
- **Incomplete.** A multi-part question with a part unanswered. For example, the question asked for name and title and the answer gives only the title, or it asked how often and by whom and the answer gives only how often.
- **Ambiguous question.** The requester's question can be read two ways ("our data": claim files only, or delivery logs too?). Note which reading the draft uses. If the reading changes the answer, draft a clarifying question to send the requester.

Each finding gets the Q#, type, exact quoted text, the problem, and a suggested fix.

## Entering answers in a portal

When the deliverable is a portal, draft and review in the review sheet exactly as for a file. Once the reviewer has signed off, offer: "Want me to take control of a browser window and enter the approved answers in the portal? You log in, I fill in the answers, and I stop before submitting."

If the user says yes:

1. **Use the browser tool that's available** (Claude in Chrome or the built-in browser). If none is available, say so, and give the user the approved answers as a copy-ready list in portal order instead.
2. **The user logs in.** Never type passwords or MFA codes, and never accept terms or consent screens for the user.
3. **Map the portal before typing anything.** Walk every section and match each question to its field: field type (free text, dropdown, radio, checkbox, upload), character limit, and whether it's required. Report any question the portal has that the file didn't, or the reverse. Portals often differ from their spreadsheet export.
4. **Look for a bulk import.** If the portal accepts an uploaded template, offer that route. It's faster and less error-prone than typing.
5. **Enter only reviewer-approved answers.** Leave Needs review and Conflict fields blank. For dropdowns and radio buttons, pick the option that matches the approved answer exactly and put any nuance in the portal's comment field. If no option fits, stop and ask. Don't shorten an answer to fit a limit without approval.
6. **Upload an attachment only after the user confirms that file.**
7. **Save a draft section by section** if the portal allows it. **Never click the final Submit.** The user submits.
8. **Verify.** Re-read each filled page against the review sheet and report any mismatch. Then tell the user it's ready for them to review and submit.

## After the reviewer signs off

Offer to **add every newly approved answer to the answer bank**, with the approver's name and today's date. That's how the next questionnaire gets faster. Ask before writing, because the bank is a controlled document.

If the deliverable is a portal, this is also when you make the browser offer in "Entering answers in a portal".

## Learn from this run

When the reviewer rewrites an answer, ask whether the rewrite should replace the bank entry, and whether it reveals a rule worth adding here (for example "never say 'all employees', say 'all personnel with access to client data'"). Record rules below with the date.

## House rules for answers

*(empty. Add confirmed wording rules here.)*

## Approvers by area

*(fill in: Security `[name]`, Operations `[name]`, Finance and insurance `[name]`, HR `[name]`, Leadership `[name]`)*

## Customize before real use

- [ ] Put the current approved policies in `references/policies/`, or note the SharePoint path above.
- [ ] Load the existing answer bank into `references/approved-answer-bank.csv`. Heidy already keeps prior DDQ answers in Claude, so start there.
- [ ] Fill in Approvers by area.
- [ ] Run it on a questionnaire you've already answered and compare.
