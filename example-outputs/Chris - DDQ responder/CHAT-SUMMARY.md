Chris, the Pioneer Standard DDQ is drafted. 16 of 24 questions are answered with a source. The other 8 need someone to answer them, and none of them can be filled from what we have on file.

**Files (in this folder)**
- `Pioneer Standard - Vendor Security DDQ - DRAFT 2026-09-28.xlsx`: Pioneer's file with the same layout. The 16 sourced answers are filled in and the other 8 are left blank. The original file is unchanged.
- `Pioneer Standard DDQ - Review Sheet - 2026-09-28.xlsx`: each row has the source, the exact quoted text it came from, an owner and a reviewer note. Open items are sorted to the top. The second tab lists the questions for owners, with replies due **Tue Oct 6** (3 business days before the Oct 9 due date).

**Sources used**
- ISP-01 Information Security Policy v4.2, reviewed Mar 14, 2026, Approved
- ISP-02 Access Control Standard v3.0, reviewed Mar 14, 2026, Approved
- ISP-03 Incident Response Plan v2.4, reviewed Jan 22, 2026 (tabletop Feb 10, 2026), Approved
- ISP-04 Data Retention and Destruction Policy v1.6, reviewed Apr 2, 2026, Approved
- approved-answer-bank.csv (13 entries)
- **Ignored:** "Acceptable Use of AI Tools Policy". It's marked DRAFT - NOT APPROVED, so none of it appears in an answer.

None of the four policies is past its annual review.

**Counts**
- Prior answer: 9
- Drawn from policy: 7
- Conflict: 0
- Needs review: 8

**Conflicts:** none where an approved bank answer contradicts current policy. Two answers look inconsistent, so I held them as Needs review:
- **Q2 (certification).** ISP-01 s.2 says "certified to ISO/IEC 27001:2022". The bank says "Yes. ClaimFox has completed a SOC 2 Type I examination." That bank entry was approved by a Former Security Lead in May 2023, so I didn't use it. Pioneer also wants the certificate date, and there's no certificate in the files.
- **Q13 (subcontractors).** The bank answer says "ClaimFox does not subcontract record review or redaction". That only covers record work, and its source, the "Ops attestation", isn't on file. Meanwhile ISP-01 s.1 says the program covers "contractors", and client data sits in AWS. A flat "no" could be wrong.

**Also check before sending**
- Q23: the $10M cyber limit comes from an approved bank entry, but the COI isn't in the folder. Attach it.
- Q6: 4-hour access revocation is policy wording. Make sure that's what actually happens.
- Q15: I wasn't told whether Pioneer is a current client, so I didn't check any contract for a shorter notice window.

**Open items by owner** (drafts for you to send)

*Security (Director of Technology / Security & Facilities Manager): Q2, Q12, Q16, Q19, Q20, Q24*
> Pioneer Standard's security DDQ is due Oct 9 and I need these back by Tue Oct 6:
> 1. Is our ISO 27001:2022 certificate current? Send the certificate and its issue date. Should we retire the 2023 SOC 2 Type I answer?
> 2. Do we use generative AI on client data today? If yes, which tools, what controls, and does any client data train a model? Can the draft AI policy be approved before Oct 9?
> 3. Any reportable security incident in the past 36 months? Yes or no.
> 4. Do we have a BC/DR plan with a stated RTO and RPO? Please send it.
> 5. Where are backups stored and how often do we test restores?
> 6. What physical access controls apply where client data is accessible?

*Operations (VP of Operations): Q13*
> For the Pioneer Standard DDQ (reply by Oct 6): besides AWS hosting, do any subcontractors or contractors have access to client data? Also, can you send the signed Ops attestation our answer bank cites?

*Finance: Q23*
> For the Pioneer Standard DDQ (reply by Oct 6): can you send the current certificate of insurance and confirm the $10M per-occurrence cyber limit and the policy period?

*Leadership: Q3*
> Pioneer Standard wants the name and title of the person accountable for information security. Policy says it's the Director of Technology. Can you confirm the name and that we're OK naming them externally? I need this by Oct 6.

*HR: nothing open.*

**Policy gaps:** there's no approved policy for business continuity/DR (including RTO/RPO), backups and restore testing, physical security, AI use (a draft exists), or subcontractor/third-party management. There's also no ISO certificate on file. That list is the order I'd write policies next.

**Answer bank health**
- **Retire or re-approve:** "Are you SOC 2 audited?"
  - The approver ("Former Security Lead") has left.
  - The entry is dated 2023-05-11, 28 months old.
  - Its source, the "2023 audit letter", isn't on file.
  - It doesn't match ISP-01's ISO 27001 claim.
- **Sources that aren't documents on file:** "Certificate of insurance 2026", "Ops attestation" (I can't tell if it's signed) and "2023 audit letter".
- **Stale:** all other entries are Feb to Jun 2026, so none are past 12 months.
- **Unverified approvers:** I couldn't confirm that H. Villarreal, K. French, B. Molina and S. Morck are still here, because Approvers by area isn't filled in yet.
- **Conflicts:** no entry contradicts current policy.

Once you've signed off, I can add the new and changed answers to the bank with the approver's name and date. Those are Q1, Q6, Q7, Q11, Q14, Q21, Q22, plus whatever comes back from owners. I'll ask before writing to it.
