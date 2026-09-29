---
name: claimfox-client-review
description: "Builds a monthly, quarterly or annual operations review for one ClaimFox carrier client from the request data: volume and trend, the months where performance shifted, seasonality, turnaround and SLA against that client's contracted clocks (including by request type), what drove the change, request and requestor mix, pages released, rework, and service-credit exposure. All numbers come from a script. Claude writes a client-facing one-page review plus an internal cover note, and answers follow-up questions against the same data. Use when asked for a client review, QBR, quarterly business review, monthly or annual client report, how a carrier is trending, why a client's SLA slipped, which requestors drove volume, or to prep for a client meeting."
---

# ClaimFox Client Operations Review

A carrier review should answer three things fast: how much work we did for you, how well we did it, and what's changing. This skill produces the same review every time, with numbers you can defend and a story a client will actually read. It also produces a private cover note for Amanda with the things the client shouldn't see.

Owner: Amanda Cortes (Director of Operations).

## What you need

- **The request export** as `requests.csv` in a folder, plus `invoices.csv` and `support_tickets.csv` if you have them. The expected columns are listed at the top of `scripts/claimfox_metrics.py`. If yours differ, write a short script that maps them into a working copy, and show the mapping.
- **The client name**, exactly as it appears in the data. Run `profile` if unsure. It also runs data-quality checks.
- **The cadence** (month, quarter or year) and the period end date. The default is the most recent quarter, even if it isn't over yet.
- **The contract terms.** SLA clocks by request type, and any service-credit clause. Use the `/claimfox-contract-requirements` matrix if it's available. If not, read the contract documents if they're provided. If neither exists, use the SLA on each data row and say "SLA per system data, not checked against the contract."

## The numbers come from code

Never count, total or average by hand.

```
python3 scripts/claimfox_metrics.py profile --data <folder>
python3 scripts/claimfox_metrics.py client-review --data <folder> --client "<client>" --period quarter --end 2026-09-30 \
  [--credit-threshold 5 --credit-effective 2026-02-01 --credit-exclude-types Subpoena]
python3 scripts/claimfox_metrics.py drivers --data <folder> --client "<client>" --dimension requestor_name --period quarter --end 2026-09-30 --compare last-year
```

`client-review` returns:
- Current, prior period and same period last year. If the period isn't finished, all three are cut to the same number of days, flagged `partial_period`.
- Percent and point changes.
- An 18-month monthly trend.
- **Break points**: the months where the SLA hit rate or turnaround shifted.
- Seasonality, with how many years of data each month rests on.
- SLA by request type, with the contracted clock for each.
- Request and requestor mix.
- Reviewer rework (internal only).
- With `--credit-threshold`, the months where the miss rate exceeded a service-credit trigger. Pass the clause's effective date and exclude request types the clause doesn't cover. Read the clause for both.
- If the contracted clocks changed between this period and last year, last year is also rescored on today's clocks (`sla_hit_rate_on_todays_clocks_pct`) with a warning. Compare like with like, and say which basis you used.

`drivers` answers the follow-up "who or what drove the change?" by requestor, requestor type, request type, reviewer or any other column. For any other question, write and run a snippet against the same file and show the result.

## Check the SLA basis first

If the contract says one clock and the data says another (for example, subpoenas at 3 days in the contract but 5 in the system), **say so at the top of the internal note**, and recompute on the contract basis with a snippet. That mismatch matters more to the client than any trend.

## Build the story

Aim for one page.

1. **Headline**: one sentence with the single most important thing and its number. Name a cause only when the data shows one. The break points tell you *when* something changed. Compare that date against volume and contract changes before you say *why*. Example of the shape only, with invented numbers: "Volume rose 18% on last year; on-time delivery fell from 92% to 71%, and the drop started in March, two months before the volume increase."
2. **Scorecard**: requests, SLA hit rate, average turnaround, pages released, rework rate. Each shows prior period and last year beside it.
3. **What drove it**: 2 to 4 findings. Each is a number plus the reason, when the data shows the reason. Use `drivers` for volume and `sla_by_request_type` for SLA. If the data doesn't show the reason, say so and name what would.
4. **Seasonality**: only if the next period usually runs hot or cold, and only if that month rests on 3+ years of data. Otherwise call it a hint.
5. **What we're doing about it**: **leave this for Amanda.** Write `[Amanda: actions]`. Don't invent commitments to a client.
6. **Questions for the client**: 1 to 3, drawn from the data.

## Outputs

1. **The client review.** One page, as HTML or PDF, saved in the working folder as `<Client> - <Cadence> Review - <period>.<ext>`. Use the ClaimFox brand skill if it's installed. Otherwise use navy `#1C2A39`, ClaimFox orange `#F15A29` for the single most important number or line, slate `#576374` for secondary text and light grey `#EEEFF1` for panels, in Open Sans. Use a two-panel chart (volume bars on top, SLA line below), never one chart with two axes. Label partial months. The client version leaves out reviewer names, rework by person, internal staffing and share of total ClaimFox volume.
2. **The internal cover note.** A second page or file for Amanda only:
   - SLA basis mismatches.
   - **Service-credit exposure** (months over the trigger, and the contract clause).
   - Reviewer outliers.
   - Data-quality warnings from `profile`.
   - Anything you left out of the client version, and why.
3. **Chat summary**: the headline, the 3 numbers that matter, and the internal flags.

Deck or Word versions on request (use the pptx or docx skill).

## Rules

1. Every number in either document comes from the script or from code run this session.
2. Say "partial period" whenever it applies.
3. No blame language in the client version. "Our team was short-staffed" becomes "we're adding capacity on your queue."
4. Service-credit exposure never goes in the client version unless Amanda says so.

## Learn from this run

After Amanda edits the draft, ask what she changed and why. If it's a pattern ("never show rework to Harborline," "Tri-County wants WC Board requests broken out"), offer to add it under Client preferences below.

## Client preferences

*(empty. Claude adds confirmed per-client preferences here, with dates.)*

## Customize before real use

- [ ] Note how to pull the request export from the Ecosystem, and who can pull it: `[FILL IN]`.
- [ ] Confirm the column mapping on a real export and record it here.
- [ ] Record each client's contracted SLA clocks and credit triggers here, or keep the contract matrices current: `[FILL IN]`.
- [ ] Build one review for a client you know well and check every number.
