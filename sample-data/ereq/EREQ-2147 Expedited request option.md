# EREQ-2147: Add an "Expedited" option to requestor intake

*SAMPLE TICKET FOR TRAINING. Fictional.*

**Requested by:** Customer Experience  ·  **Priority:** High  ·  **Target release:** 2026.11  ·  **Systems:** Requestor Portal, Ecosystem (intake, queue, billing, notifications)

## Background
Requestors, mostly plaintiff firms, keep calling to ask for faster turnaround on specific requests. We want to offer a paid expedite option.

## Change
1. Add an "Expedite this request (+$35)" checkbox to the requestor portal intake form.
2. Expedited requests get a 2-business-day turnaround clock instead of the client's contracted clock.
3. Expedited requests go to the top of the review queue and show a red EXPEDITE badge for reviewers.
4. Billing adds a $35 "Expedite fee" line to the requestor invoice.
5. The requestor gets a confirmation email that states the expedited due date.
6. Add an "Expedited" filter and column to the daily SLA report.

## Acceptance criteria (from CX)
- Checkbox appears on the intake form and is saved with the request.
- Expedited requests show the badge and sort first in the queue.
- Invoice shows the $35 line.
- Confirmation email shows the correct due date.
