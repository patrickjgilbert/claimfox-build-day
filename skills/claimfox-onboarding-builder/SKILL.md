---
name: claimfox-onboarding-builder
description: "Builds a role-specific onboarding package for new ClaimFox hires from a job title, job description or list of responsibilities: a countdown of what's due now if the start date is close, pre-start checklist (equipment, system access, HR and payroll setup, training prep, welcome communications), first-day itinerary, day-by-day first-week schedule, 30/60/90-day milestones, a readiness gate before anyone touches real claim data, checklists by owner, per-hire welcome emails, and draft messages that close every open item in one pass. Handles a cohort of several hires. Never invents company policy; anything not provided is listed for HR to confirm. Use when asked to onboard a new hire, build an onboarding plan, checklist or first-week schedule, prepare for a start date, or create a 30/60/90 plan."
---

# ClaimFox Role-Based Onboarding Builder

Give HR and hiring managers a consistent starting point for every new hire, one that still reads like it was written for this specific role.

Owner: Kaela French (HR Manager).

## What you need

- **The role**: a job title, job description or list of responsibilities. Required.
- **Start date**, **number of hires**, and if known **names, work states and time zones**. Several hires starting together get a cohort plan.
- **Manager, trainer and access approvers**, if known. If a role is vacant, use a named placeholder (`[Intake Team Lead - vacant]`), treat filling it as a blocking item, and route that role's approvals to the next manager up (`[VP of Operations or acting lead - confirm]`) until someone is named.
- **Reference files.** These count as "provided": anything in this skill's `references/` folder, anything the user attaches or points to, and **approved ClaimFox policies** (status Approved) the user makes available. Cite them by document and section. Drafts don't count.
  - `references/systems-and-access.md`: every system, who gets it, and who grants it. Use `systems-and-access.SAMPLE.md` until the real one exists, and say so.
  - The **employee handbook** and the **required-training list**.
  - `references/role-notes.md` (optional): lessons from past onboardings, by role.

## HR guardrails: these come first

1. **Never invent policy.** Company policies, required trainings, benefits, performance targets, probation terms and internal processes appear only if they're in a provided file. If the plan needs one and it's missing, write `[To confirm #n (owner): ...]`, numbered, with the owner who can answer (HR, IT, Security or Manager), and add it to the Missing information list.
2. **Never state legal requirements as fact** (I-9 timing, state notices, pay rules) unless a provided file includes them. List them as To confirm (HR).
3. **Tag everything you didn't get from a file.** Use exactly two tags:
   - *(inferred from JD)*: a conclusion drawn from the job description. For example: reviews subpoenas, so needs Ecosystem Intake access.
   - *(suggested, not policy)*: your own design choice. For example: 100% QA review of week-2 work.
4. **Keep it humane.** Every day includes at least one human touchpoint. A first week that's all systems and no people is a bad first week.
5. **Watching counts as access.** Shadowing someone working on live claim files exposes real personal data, so it also waits for the readiness gate unless a provided policy says otherwise. Before the gate, shadow on sample data or a practice environment.
6. **Protect client data.** Any role that touches claim files trains on practice or sample data until a **readiness gate** is met: the background check is cleared (if policy requires one), confidentiality and PII training is done, and the manager has signed off. List the gate per hire.

## Tailor to the role

Before drafting, state in one short paragraph:
- Seniority.
- Department and the core work in ClaimFox terms: intake, review (page selection and redaction), billing, CX, finance, technology or leadership.
- Systems needed, matched against the systems list.
- How sensitive the data is.
- The independence expected by day 30, 60 and 90.

## The package

1. **Countdown.** Default lead times, *(suggested, not policy)* until ClaimFox sets its own: equipment shipped 7 business days before start, system accounts requested 5 days before, background check started 10 days before, welcome email 3 days before. If the start is closer than these, open with three lists: **Late already**, **Due today**, **Due this week**. Each item gets an owner. Skip this section if there's plenty of time.
2. **Pre-start checklist**, grouped by owner. Owners are always: HR, Hiring manager, Trainer, IT, Security, New hire. Each item has a due date relative to the start ("Start minus 5 business days"), converted to a real date.
3. **First-day itinerary**, hour by hour, in the hires' time zone (or ET, stated). It covers HR onboarding, introductions, system setup and login checks, role overview, a first training block and an end-of-day check-in.
4. **First-week schedule**, day by day: role-specific training, shadowing, meetings with key people, practice on sample data, and manager check-ins. Extend it to multiple weeks if the role needs it.
5. **30/60/90-day milestones**, specific and measurable where possible. Targets come only from provided files, otherwise `[To confirm]`.
6. **Readiness gate**, per hire: each condition, who confirms it, and the date it's expected.
7. **Missing information**: every `[To confirm #n]`, grouped by who can answer it (HR, IT, Security, Manager), blocking items first.
8. **Draft messages that close the gaps**: one short message per owner group, listing only their items. Three messages instead of thirty lookups. Don't send them.
9. **Welcome email per hire**, from the manager (or `[Manager]`), with the day-1 time in the hire's time zone.

## Outputs (in the working folder)

- `Onboarding Plan - <Role> - <start date>.docx`: the package above. Use the ClaimFox brand skill (Heidy's) if installed. Otherwise use navy `#1C2A39` headings, orange `#F15A29` accents used sparingly, and Open Sans.
- `Onboarding Checklists - <Role> - <start date>.xlsx`: one tab per owner. Columns: Item, Due date, Owner, Blocking? (Y/N), one status column per hire (with a dropdown: Not started / In progress / Done / N/A), and Notes.
- Optional, on request: calendar invites (`.ics`) for day 1 and the week-1 sessions.
- In chat: a 3-line summary, the Missing information count (and how many are blocking), and anything due today.

## Learn from this run

After the plan is used, ask Kaela and the manager what they changed and what the new hires struggled with. Offer to save role-specific lessons to `references/role-notes.md`. For example (hypothetical): "Intake associates need Ecosystem access by 10am on day 1, or the afternoon is wasted." Each onboarding makes the next one better.

## Customize before real use

- [ ] Replace `references/systems-and-access.SAMPLE.md` with the real systems list and rename it.
- [ ] Add the employee handbook, the mandatory training list and standard day-1 logistics (equipment shipping, laptop setup, who sends the welcome email) to `references/`.
- [ ] Add each role's targets once they're decided, so milestones stop needing confirmation.
- [ ] Generate a plan for a role you recently onboarded and compare it with what actually happened.
