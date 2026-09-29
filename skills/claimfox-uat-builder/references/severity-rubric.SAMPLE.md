# Severity rubric (SAMPLE, edit to match how ClaimFox triages)

> Written for training. Mary: change the definitions, examples and response times to match how you actually triage, then rename this file `severity-rubric.md`.

The same scale is used two ways:
- **Risk if it fails**, on each test case: how bad it would be if this case failed in production.
- **Severity**, on each defect found: how bad the defect actually is.

| Level | Definition | ClaimFox examples | Release decision | Fix target |
|---|---|---|---|---|
| **S1 Critical** | Wrong records could be released, personal data exposed, or money or due dates calculated wrong **across many requests**. No workaround. | A redaction is skipped; a request is attached to the wrong claim; the due-date calculation is wrong for a request type or client; invoices bill the wrong amount | **Blocks release** | Before release |
| **S2 Major** | A core step fails or gives wrong results **for some requests**, or a single request shows a wrong date or amount. A workaround exists but is manual or risky. | The expedite fee is missing on some invoices; the queue doesn't sort expedited requests first; one confirmation email shows the wrong date | Blocks release unless the owner signs off on a workaround | Before release, or a hotfix within 5 business days |
| **S3 Minor** | Works, but confusing, inconsistent or slow. No data or money impact. | Badge color is hard to read; a report column is mislabeled; a missing tooltip | Doesn't block | Next release |
| **S4 Cosmetic** | Typos, spacing, visual polish. | Misspelled label; misaligned button | Doesn't block | Backlog |

**Triage rules**
1. Anything touching **redaction, page selection, claim matching, or who receives records** starts at S1 until proven otherwise.
2. **Money or due dates**: S1 if the calculation itself is wrong (it will be wrong everywhere), S2 if one request or one screen shows the wrong value.
3. If a defect can't be reproduced twice, log it as **Needs repro**, not a severity.
