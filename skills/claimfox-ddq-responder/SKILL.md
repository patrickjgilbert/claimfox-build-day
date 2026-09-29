---
name: claimfox-ddq-responder
description: "Drafts answers to an incoming security due diligence questionnaire (DDQ, vendor risk assessment, security questionnaire, SIG, CAIQ, vendor security review) using only ClaimFox's approved policies, approved evidence and previously approved answers. Every answer cites its source with the exact supporting text and gets a status: Prior answer, Drawn from policy, Conflict or Needs review. Anything without an approved source is left for a person, never guessed. Fills the client's own questionnaire file, produces a review sheet, routes open items to owners with draft questions, reports which policies are missing, and health-checks the answer bank. Use when a prospect or carrier sends a DDQ or security questionnaire, when asked to answer vendor security questions, or to check what we can't yet answer."
---

# ClaimFox DDQ Responder

Carriers and prospects send long security questionnaires, sometimes 700+ questions. Most have been answered before or are covered by an approved policy. This skill drafts those answers with a citation and the exact source text for each one, and hands the rest to the right person with a clear question.

Owner: Chris Malanga (security and policy compliance).

## What you need

1. **The questionnaire**, in whatever format it arrived: Excel, Word, PDF or a portal export.
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

1. **Read everything first.** List the sources found, with version, review date and approval status. Flag any policy more than 12 months past its review date.
2. **Parse the questionnaire** into rows: question number, section, question text, the cell where the answer goes, and the evidence/attachment cell if there is one.
3. **Match each question** to the bank (same meaning, not just the same words) and to the relevant policy sections.
4. **Draft, cite and assign status** under the rules. For every answered row, keep the **exact sentence(s)** from the source.
5. **Write the files** in the working folder:
   - **The client's questionnaire, filled in.** Same file, same layout. Answers go in their response column. Evidence cells list the supporting document names. **Conflict and Needs review cells stay blank.** Save as `<original name> - DRAFT <YYYY-MM-DD>.<ext>` and never overwrite the original.
   - **The review sheet**, `<Client> DDQ - Review Sheet - <YYYY-MM-DD>.xlsx`, built with `scripts/build_workbook.py`. Sheet `Review`: Q#, Section, Question, Draft answer, Status, Source, Exact source text, Owner, Reviewer note. Order Conflict rows first, then Needs review, then the rest. Set `status_columns: ["Status"]`. Sheet `Questions for owners`: one row per open item, with owner, the specific question to ask, and a reply-by date 3 business days before the questionnaire is due. Sheet `Sources and bank health`: every source used (document, version, review date, approval status, rows it supports), then every answer-bank entry that's stale, has a departed approver, cites a non-approved source, or conflicts with current policy. This is the audit trail, so it lives in the file and not only in chat.
6. **Summarize in chat:**
   - Counts by status.
   - Conflicts, quoted.
   - Open items grouped by owner (Security, Operations, Finance, HR, Leadership), each group with a draft message to that owner.
   - A **policy gap line**: which topics had no approved policy at all (for example "business continuity, backups, physical security, AI use"). This is ClaimFox's roadmap for which policies to write next.
   - **Answer bank health**: stale entries, approvers who have left, sources that aren't approved documents, and entries that conflict with current policy.

## After the reviewer signs off

Offer to **add every newly approved answer to the answer bank**, with the approver's name and today's date. That's how the next questionnaire gets faster. Ask before writing, because the bank is a controlled document.

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
