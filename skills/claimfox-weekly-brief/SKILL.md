---
name: claimfox-weekly-brief
description: "Turns the leadership team's weekly updates (emails, Teams messages, notes, pasted text) and this week's request data into a one-page brief for Fig: the 3 things that matter most, what needs her decision, what the updates mean together, where a leader's number and the data disagree, the 6-month trends nobody mentioned, and good questions to ask. Every number comes from a script and shows where it came from. Offers ready-to-send follow-ups. Use when Fig asks for her weekly update, weekly brief, leadership summary, what happened this week, what she needs to know, or a summary of the team's updates."
---

# ClaimFox Weekly Leadership Brief

Fig gets updates from six leaders in six formats. This skill reads them all and gives her one page: what matters, what needs her, and what the updates mean together. It also shows her how the AI got each number, so she learns when to trust it.

Owner: Fig Annunziato (CEO). Anyone preparing Fig's weekly update can run it.

## What you need

- **This week's updates** from each leader, in any form: pasted text, forwarded emails, a Teams export, a notes file. Messy is fine.
- **Optional: the request export** (`requests.csv`, plus `invoices.csv` and `support_tickets.csv`) for this week's numbers.
- **Optional: last week's brief**, to show what's new and what's still open.
- **Other ClaimFox data or skill outputs** (a GL review, a contract matrix) only if the user provides them or they're already in the working folder. Don't go looking elsewhere. If one of them would settle a question, suggest it in "Questions worth asking."

## Numbers come from code

```
python3 scripts/claimfox_metrics.py weekly --data <folder> --end <Friday of the week>
```

This returns:
- The Monday-to-Friday week: requests received vs the prior 4-week average.
- **SLA and turnaround on requests completed this week.**
- The current backlog, including requests awaiting payment.
- Last week's figures, and the change since last week.
- Per-client volume and SLA with each client's contracted clock.
- Invoices: billed this week, total open unpaid, and top requestors by unpaid dollars.
- Tickets vs the 4-week average.
- **6-month trend breaks per client** (volume moves of 30% or more, SLA moves of 10+ points).

Quote only numbers from the script output or from the updates themselves. For anything else, write and run a snippet.

## The brief, in this order

1. **The 3 things that matter this week.** One or two sentences each, with the number. Choose by impact on clients, money or risk, not by how often something was mentioned. The trend breaks often belong here even when no one wrote about them.
2. **Needs you.** Decisions, approvals or conversations only Fig can have, each with who's asking and by when. If nobody asked, list at most 2 items you think need her, labeled *(suggested)*. If there are none, say "Nothing needs a decision from you this week."
3. **Connecting the dots.** This is what a person skimming six updates would miss: the same issue in two updates, or an update that explains a number. Label each connection *confirmed* (stated in the updates or data) or *likely* (inferred). Never present an inference as fact.
4. **Leader vs data.** A short table: what the leader said, what the data shows, and the source. Show both and don't pick a side. This is where the brief earns its keep.
5. **Numbers.** A short table of what moved: volume, SLA, turnaround, backlog, unpaid invoices, tickets. Each shows direction and size, and a tiny *source* note (for example "script: weekly, completed this week").
6. **By department.** One or two lines per leader, in plain language. Keep who said it.
7. **Questions worth asking.** 2 or 3 questions Fig could put to her team, each tied to something above.
8. **Still open from last week**, if last week's brief was provided.

## Output

- **One page**, as HTML or PDF by default, or Word on request. Use the ClaimFox brand skill if installed. Otherwise use navy `#1C2A39`, orange `#F15A29` for the "Needs you" section only, slate `#576374` for secondary text, and Open Sans. Title: `Weekly Brief - week of <Monday's date>`. Save it in the working folder.
- **"How I got this"**: a short footer or second page. For each number, say in one plain-English line how it was produced (for example, "Counted every Harborline request finished Mon to Fri and checked it against its contracted deadline"). No script names, file paths or code. List the files read, and anything left out on purpose (personnel items). This is how Fig sees what the AI actually did, in words she can repeat.
- **In chat**: the 3 things, then offer **ready-to-send follow-ups** for the top items (a note to the leader, a call agenda, a question). Draft them only if she says yes. Never send anything.

## Rules

1. **Don't add facts.** Everything comes from the updates, the data, or clearly labeled inference.
2. **Keep attribution.** Write "Christine flagged...", not "Finance may have...".
3. **Short beats complete.** If it doesn't change what Fig does or asks this week, it goes under By department.
4. **Leave out personnel-sensitive items** (performance, health, compensation) unless Fig asks. Say in "How I got this" that something was left out.

## Learn from this run

Ask Fig two questions after each brief: what was most useful, and what she skipped. Record her answers under Fig's preferences below (for example, "always lead with Harborline until SLA is back under 5 days" or "put cash first"). She should watch the brief learn her taste week by week.

## Fig's preferences

*(empty)*

## Customize before real use

- [ ] Decide where the weekly updates come from (an email folder, a Teams channel, a shared doc) and note it here: `[FILL IN]`.
- [ ] Decide which numbers Fig wants every week and add them to the Numbers section.
- [ ] Run it on last week's real updates and ask Fig what's missing.
