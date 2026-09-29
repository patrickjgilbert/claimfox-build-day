"""Generate the fictional ClaimFox build-day documents (contracts, DDQ, policies, ticket, JD, weekly notes).

All names, carriers, clauses and numbers are invented. Run:
  uv run --with openpyxl python tools/generate_documents.py
Requires pandoc on PATH for the .docx files.

Planted traps the skills should catch:
  contracts - Harborline's Amendment No. 2 overrides the MSA turnaround (7 -> 5 business days)
            - Harborline bans automated decision tools without written approval (matters for AI)
            - Tri-County is silent on court-order turnaround (should be flagged as not specified)
  ddq       - a prior approved answer cites SOC 2 Type I, but current policy says ISO 27001 (conflict)
            - the AI-use policy is an unapproved DRAFT and must not be cited as approved
            - several questions have no supporting source at all (must be Needs review)
  ereq      - acceptance criteria are silent on carriers whose contracts ban expedite fees
"""
import subprocess
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill

ROOT = Path(__file__).resolve().parent.parent / "sample-data"


def docx(path, md):
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(".md")
    tmp.write_text(md.strip() + "\n")
    subprocess.run(["pandoc", str(tmp), "-o", str(path)], check=True)
    tmp.unlink()


def md(path, text):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.strip() + "\n")


# ---------------------------------------------------------------- contracts
docx(ROOT / "contracts" / "Harborline Mutual - Master Services Agreement (2023).docx", """
# MASTER SERVICES AGREEMENT

**Between** Harborline Mutual Insurance Company ("Carrier") **and** ClaimFox, Inc. ("Vendor")

**Effective Date:** March 1, 2023  ·  **Agreement No.** HMI-VND-2023-0147

*SAMPLE DOCUMENT FOR TRAINING. Fictional parties and terms.*

## 1. Services

1.1 Vendor shall receive, review and fulfill requests for copies of Carrier claim files ("Record Requests") received from third parties, including attorneys, record retrieval companies, adverse carriers and state agencies.

1.2 Vendor shall perform page selection and redaction in accordance with the Carrier Business Rules attached as Exhibit B, as amended from time to time.

## 2. Service Levels

2.1 **Turnaround.** Vendor shall fulfill each complete Record Request within seven (7) business days of receipt.

2.2 **Subpoenas.** Record Requests made by subpoena shall be fulfilled within five (5) business days of receipt or by the return date, whichever is earlier.

2.3 **Reporting.** Vendor shall deliver a service level report to Carrier each Monday covering the prior week's volume, turnaround and any missed service levels.

## 3. Release Restrictions

3.1 Vendor shall not release any page containing Special Investigations Unit (SIU) notes, reserve information or internal claim valuations. Such pages shall be withheld in their entirety.

3.2 Vendor shall obtain written approval from Carrier's claim representative before releasing records to an adverse carrier.

3.3 In addition to Vendor's standard redactions, Vendor shall redact driver's license numbers, vehicle license plate numbers and vehicle identification numbers (VINs) of any party other than the requestor's client.

## 4. Data Security

4.1 Vendor shall maintain an information security program certified to ISO/IEC 27001 or a current SOC 2 Type II report, and shall provide evidence of the same annually upon request.

4.2 Vendor shall notify Carrier of any actual or reasonably suspected security incident involving Carrier data within twenty-four (24) hours of discovery.

4.3 Carrier data shall be stored and processed only within the continental United States. Offshore access to Carrier data is prohibited.

4.4 Vendor shall not use automated decision-making tools, including machine learning or artificial intelligence systems, to determine what information is released without Carrier's prior written approval.

## 5. Subcontracting

5.1 Vendor shall not subcontract any portion of the Services without Carrier's prior written consent.

## 6. Retention and Destruction

6.1 Vendor shall securely delete all working copies of Carrier records within fourteen (14) days after delivery of the fulfilled Record Request, and shall retain only the delivery log.

## 7. Audit

7.1 Carrier may audit Vendor's compliance with this Agreement upon ten (10) business days' written notice, not more than once per calendar year.

## 8. Term

8.1 This Agreement shall remain in effect for three (3) years and renew automatically for successive one-year terms unless either party gives ninety (90) days' written notice.
""")

docx(ROOT / "contracts" / "Harborline Mutual - Amendment No. 2 (2026).docx", """
# AMENDMENT NO. 2 TO MASTER SERVICES AGREEMENT HMI-VND-2023-0147

**Between** Harborline Mutual Insurance Company **and** ClaimFox, Inc.  ·  **Amendment Effective Date:** February 1, 2026

*SAMPLE DOCUMENT FOR TRAINING. Fictional parties and terms.*

The parties agree to amend the Agreement as follows. All other terms remain in full force and effect.

1. **Section 2.1 is deleted and replaced with:** "Vendor shall fulfill each complete Record Request within five (5) business days of receipt."

2. **Section 2.2 is deleted and replaced with:** "Record Requests made by subpoena shall be fulfilled within three (3) business days of receipt or by the return date, whichever is earlier."

3. **New Section 2.4 is added:** "If Vendor misses the turnaround in Section 2.1 on more than five percent (5%) of Record Requests in any calendar month, Vendor shall credit Carrier two percent (2%) of that month's service fees."

4. **New Section 3.4 is added:** "Vendor shall withhold any page that references a claimant's mental health treatment unless the authorization presented specifically names mental health records."
""")

docx(ROOT / "contracts" / "Tri-County Workers' Comp Fund - Services Agreement (2024).docx", """
# RECORDS RELEASE SERVICES AGREEMENT

**Between** Tri-County Workers' Compensation Fund ("the Fund") **and** ClaimFox, Inc. ("Provider")

**Effective Date:** July 1, 2024

*SAMPLE DOCUMENT FOR TRAINING. Fictional parties and terms.*

## Article 1. Scope

Provider shall respond on the Fund's behalf to requests for workers' compensation claim file records, including requests from the state Workers' Compensation Board, claimant attorneys, employers and medical providers.

## Article 2. Timeliness

2.1 Provider shall fulfill complete requests within ten (10) business days of receipt.

2.2 Requests from the Workers' Compensation Board shall be fulfilled within five (5) business days of receipt.

2.3 Requests accompanied by a court order shall be handled promptly.

## Article 3. Protected Records

3.1 Provider shall withhold records of psychiatric or psychological treatment unless the authorization specifically names such records.

3.2 Provider shall withhold any records subject to 42 CFR Part 2 (substance use disorder treatment) and any HIV-related information, unless accompanied by a specific authorization or court order meeting applicable law.

3.3 All other redactions shall follow Provider's standard redaction procedures.

## Article 4. Security

4.1 Provider shall notify the Fund of any security incident affecting Fund data within forty-eight (48) hours.

4.2 Provider shall maintain cyber liability insurance of not less than five million dollars ($5,000,000) per occurrence and shall name the Fund as an additional insured.

4.3 Provider shall permit one (1) on-site security review per year at a mutually agreed time.

## Article 5. Retention

5.1 Provider shall retain and destroy Fund records in accordance with Provider's standard retention procedures.

## Article 6. Reporting

6.1 Provider shall deliver a monthly activity report by the tenth (10th) business day of each month.
""")

# ---------------------------------------------------------------- DDQ
wb = Workbook()
ws = wb.active
ws.title = "Vendor Security DDQ"
ws.append(["Pioneer Standard Insurance - Vendor Security Due Diligence Questionnaire (SAMPLE, fictional)"])
ws.append(["Vendor: ClaimFox, Inc.   Due: October 9, 2026   Contact: vendor-risk@pioneerstandard.example"])
ws.append([])
ws.append(["Q#", "Section", "Question", "Vendor Response", "Evidence / Attachment"])
QUESTIONS = [
    ("Governance", "Do you maintain a documented information security program? Provide the name of the governing policy and its last review date."),
    ("Governance", "Is your information security program certified or attested by a third party (e.g., ISO 27001, SOC 2)? Provide the certificate or report date."),
    ("Governance", "Who is accountable for information security at your organization (name and title)?"),
    ("Access Control", "Is multi-factor authentication required for all access to systems that store or process our data?"),
    ("Access Control", "How often are user access rights reviewed, and who approves them?"),
    ("Access Control", "How quickly is access revoked when an employee leaves?"),
    ("Access Control", "Do you use shared or generic accounts on any system that touches our data?"),
    ("Encryption", "Is our data encrypted at rest? State the algorithm and key length."),
    ("Encryption", "Is our data encrypted in transit? State the minimum TLS version."),
    ("Data Handling", "Where (country and region) will our data be stored and processed?"),
    ("Data Handling", "How long do you retain our records after a request is fulfilled, and how are they destroyed?"),
    ("Data Handling", "Do you use generative AI or large language models to process our data? If so, describe the tools, the controls, and whether our data is used to train any model."),
    ("Data Handling", "Do any subcontractors or offshore personnel have access to our data?"),
    ("Incident Response", "Do you maintain a documented incident response plan? When was it last tested?"),
    ("Incident Response", "Within what time frame will you notify us of a security incident involving our data?"),
    ("Incident Response", "Have you experienced a reportable security incident in the past 36 months?"),
    ("Personnel", "Do all employees with access to our data undergo background checks before hire?"),
    ("Personnel", "How often do employees complete security awareness training?"),
    ("Business Continuity", "Do you maintain a business continuity and disaster recovery plan? What are your RTO and RPO?"),
    ("Business Continuity", "Where are backups stored, and how often are restores tested?"),
    ("Vulnerability Mgmt", "How often do you perform external penetration testing, and by whom?"),
    ("Vulnerability Mgmt", "What is your patching SLA for critical vulnerabilities?"),
    ("Insurance", "Do you carry cyber liability insurance? State the per-occurrence limit."),
    ("Physical Security", "Describe physical access controls at any facility where our data is accessible."),
]
for i, (sec, q) in enumerate(QUESTIONS, 1):
    ws.append([i, sec, q, "", ""])
ws["A1"].font = Font(bold=True, size=13)
for c in ws[4]:
    c.font = Font(bold=True, color="FFFFFF")
    c.fill = PatternFill("solid", fgColor="1F3A5F")
for col, w in zip("ABCDE", (5, 18, 70, 60, 28)):
    ws.column_dimensions[col].width = w
for row in ws.iter_rows(min_row=5):
    for c in row:
        c.alignment = Alignment(wrap_text=True, vertical="top")
(ROOT / "ddq").mkdir(parents=True, exist_ok=True)
wb.save(ROOT / "ddq" / "Pioneer Standard - Vendor Security DDQ.xlsx")

POL = ROOT / "ddq" / "policies"
docx(POL / "ISP-01 Information Security Policy.docx", """
# ISP-01 Information Security Policy

**Owner:** Director of Technology  ·  **Approved by:** CEO  ·  **Version 4.2**  ·  **Last reviewed:** March 14, 2026  ·  **Status: APPROVED**

*SAMPLE DOCUMENT FOR TRAINING. Fictional content.*

1. **Purpose.** This policy establishes ClaimFox's information security program and applies to all employees, contractors and systems that store or process client data.
2. **Certification.** ClaimFox maintains an information security management system certified to ISO/IEC 27001:2022. Certification is maintained through annual surveillance audits by an accredited certification body.
3. **Accountability.** The Director of Technology is accountable for the information security program and reports on it to the CEO quarterly. The Security & Facilities Manager is responsible for day-to-day operation of security controls.
4. **Data location.** Client data is stored and processed only in AWS US regions (us-east-1 and us-east-2). Client data is not stored or accessed outside the United States.
5. **Encryption.** Client data is encrypted at rest using AES-256 and in transit using TLS 1.2 or higher.
6. **Training.** All personnel complete security awareness training at hire and annually thereafter, plus quarterly phishing simulations.
7. **Background checks.** All personnel with access to client data complete a criminal background check before their start date.
8. **Review.** This policy is reviewed at least annually.
""")
docx(POL / "ISP-02 Access Control Standard.docx", """
# ISP-02 Access Control Standard

**Owner:** Security & Facilities Manager  ·  **Version 3.0**  ·  **Last reviewed:** March 14, 2026  ·  **Status: APPROVED**

*SAMPLE DOCUMENT FOR TRAINING. Fictional content.*

1. Multi-factor authentication is required for all remote access and for all systems that store or process client data.
2. Access is granted on a least-privilege basis and requires manager approval.
3. User access rights are reviewed quarterly by system owners. Reviews are approved by the Director of Technology.
4. Access for departing personnel is revoked within four (4) hours of separation, and on the same business day in all cases.
5. Shared or generic accounts are prohibited on systems that store or process client data.
""")
docx(POL / "ISP-03 Incident Response Plan.docx", """
# ISP-03 Incident Response Plan

**Owner:** Director of Technology  ·  **Version 2.4**  ·  **Last reviewed:** January 22, 2026  ·  **Last tabletop exercise:** February 10, 2026  ·  **Status: APPROVED**

*SAMPLE DOCUMENT FOR TRAINING. Fictional content.*

1. ClaimFox maintains a documented incident response plan covering detection, containment, eradication, recovery and post-incident review.
2. The plan is tested at least annually through a tabletop exercise.
3. Clients are notified of any confirmed security incident involving their data within seventy-two (72) hours of confirmation, or sooner where a client contract requires it.
4. Critical vulnerabilities are patched within fourteen (14) days of vendor release; high within thirty (30) days.
5. External penetration testing is performed annually by an independent third party.
""")
docx(POL / "ISP-04 Data Retention and Destruction Policy.docx", """
# ISP-04 Data Retention and Destruction Policy

**Owner:** VP of Operations  ·  **Version 1.6**  ·  **Last reviewed:** April 2, 2026  ·  **Status: APPROVED**

*SAMPLE DOCUMENT FOR TRAINING. Fictional content.*

1. Working copies of client records are deleted thirty (30) days after the fulfilled request is delivered, unless a client contract requires a shorter period.
2. Delivery logs are retained for seven (7) years.
3. Electronic deletion uses cryptographic erasure. Any paper is destroyed by a certified shredding vendor, and certificates of destruction are retained.
""")
docx(POL / "DRAFT - Acceptable Use of AI Tools Policy.docx", """
# Acceptable Use of AI Tools Policy

**Status: DRAFT - NOT APPROVED - DO NOT CITE EXTERNALLY**  ·  **Owner:** Director of Technology  ·  **Draft date:** August 30, 2026

*SAMPLE DOCUMENT FOR TRAINING. Fictional content.*

1. Employees may use company-approved AI tools (currently Claude, on the company Team account) for internal work.
2. Client records containing personal information may not be entered into any AI tool unless the tool has been approved for that data class by the Director of Technology.
3. AI output used in client deliverables must be reviewed by a person before it is sent.
4. Client data is not used to train AI models.
""")

import csv
bank_rows = [
    ("Do you maintain a documented information security program?", "Yes. ClaimFox maintains a documented information security program governed by ISP-01 Information Security Policy, reviewed at least annually.", "ISP-01", "H. Villarreal", "2026-03-20"),
    ("Is multi-factor authentication required?", "Yes. MFA is required for all remote access and for every system that stores or processes client data.", "ISP-02 s.1", "H. Villarreal", "2026-03-20"),
    ("How often are user access reviews performed?", "Quarterly, by system owners, with approval by the Director of Technology.", "ISP-02 s.3", "H. Villarreal", "2026-03-20"),
    ("Is data encrypted at rest and in transit?", "Yes. AES-256 at rest and TLS 1.2 or higher in transit.", "ISP-01 s.5", "C. Malanga", "2026-04-02"),
    ("Where is client data stored?", "In AWS US regions only (us-east-1 and us-east-2). No client data is stored or accessed outside the United States.", "ISP-01 s.4", "C. Malanga", "2026-04-02"),
    ("Are you SOC 2 audited?", "Yes. ClaimFox has completed a SOC 2 Type I examination.", "2023 audit letter", "Former Security Lead", "2023-05-11"),
    ("Do employees receive security training?", "Yes, at hire and annually, with quarterly phishing simulations.", "ISP-01 s.6", "K. French", "2026-05-01"),
    ("Do you perform background checks?", "Yes. All personnel with access to client data complete a criminal background check before starting.", "ISP-01 s.7", "K. French", "2026-05-01"),
    ("Do you have an incident response plan?", "Yes. ISP-03 Incident Response Plan, tested annually by tabletop exercise (most recent February 2026).", "ISP-03", "C. Malanga", "2026-02-15"),
    ("How quickly do you notify clients of incidents?", "Within 72 hours of confirmation, or sooner where the client contract requires it.", "ISP-03 s.3", "C. Malanga", "2026-02-15"),
    ("How long do you retain client records?", "Working copies are deleted 30 days after delivery unless a contract requires less. Delivery logs are kept 7 years.", "ISP-04", "B. Molina", "2026-04-05"),
    ("Do you carry cyber insurance?", "Yes. ClaimFox carries cyber liability insurance with a $10,000,000 per-occurrence limit.", "Certificate of insurance 2026", "S. Morck", "2026-06-30"),
    ("Do you use subcontractors?", "ClaimFox does not subcontract record review or redaction. All work is performed by ClaimFox employees in the United States.", "Ops attestation", "B. Molina", "2026-04-05"),
]
with open(ROOT / "ddq" / "approved-answer-bank.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["question", "approved_answer", "source", "approved_by", "approved_date"])
    w.writerows(bank_rows)

# ---------------------------------------------------------------- EREQ, JD, weekly notes
md(ROOT / "ereq" / "EREQ-2147 Expedited request option.md", """
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
""")

md(ROOT / "hr" / "Job Description - Global Intake Associate.md", """
# Global Intake Associate

*SAMPLE JOB DESCRIPTION FOR TRAINING. Written for this exercise.*

**Department:** Operations - Intake  ·  **Reports to:** Intake Team Lead  ·  **Location:** Remote (US)  ·  **Schedule:** Full-time, Monday to Friday

## About the role
The Global Intake Associate is the first person to touch every incoming record request. You'll review requests from attorneys, record retrieval companies and other carriers, confirm they are complete and valid, and enter them accurately into our Ecosystem platform so the review team can fulfill them on time.

## Responsibilities
- Review incoming requests (authorizations, subpoenas, letter requests, court orders) for completeness and validity.
- Enter request details into Ecosystem accurately: claimant, claim number, date of loss, requestor, request type.
- Match each request to the correct carrier client and claim file.
- Identify missing or defective documents and send deficiency notices to requestors.
- Flag subpoenas and court orders with return dates for priority handling.
- Meet daily intake volume and accuracy targets.
- Protect confidential and personal information at all times.

## Requirements
- 1+ years in a data entry, legal, insurance or medical records role.
- High accuracy with detail-heavy documents.
- Comfortable with Microsoft 365 and web-based systems.
- Able to work independently in a remote setting.
""")

md(ROOT / "hr" / "SAMPLE systems and access list.md", """
# ClaimFox systems and access list (SAMPLE, replace with the real one)

*SAMPLE FOR TRAINING. Replace every line with ClaimFox's actual systems before real use.*

| System | Who gets it | Who grants it |
|---|---|---|
| Microsoft 365 (Outlook, Teams, OneDrive) | Everyone | IT |
| Ecosystem - Intake module | Intake team | Intake Team Lead + IT |
| Ecosystem - Review module | Review team | Review Team Lead + IT |
| Requestor Portal admin | Customer Experience | Director of CX |
| HubSpot | Sales, CX, leadership | Director of CX |
| ADP (payroll, time off) | Everyone | HR |
| KnowBe4 (security training) | Everyone | Security & Facilities |
| Claude (Team account) | Leadership and approved staff | Director of Technology |
""")

md(ROOT / "weekly" / "week-of-2026-09-21 - leadership updates.md", """
# Leadership updates, week of Sept 21, 2026

*SAMPLE FOR TRAINING. Fictional notes written the way people actually send them.*

**From Amanda (Ops):** Harborline is still running hot, we were at 5.8 days avg on their stuff this week, contract is 5 now since Feb. Pulled two people from Keystone queue to help. Rework is up on one reviewer, coaching him this week. Beacon basically dried up, maybe 10 requests all week.

**From Christine (Finance):** Aug close done except 2 items. AWS bill came in way higher than July (like 40%), asking Heidy. Found a duplicate Iron Mountain bill, voided. Cash fine. Scott reviewing a $25k adjustment from last month before we finalize.

**From Michelle (CX):** Tickets up 12% w/w, mostly status inquiries and portal logins. RecordPoint again, they have a ton of open invoices and keep saying they can't get into the portal. Want to do a call with them. NPS survey going out Friday.

**From Chris (Security):** Pioneer Standard DDQ came in, due Oct 9, 24 questions. Annual pen test scheduled for Oct 14. Nothing to report on incidents.

**From Kaela (HR):** 3 intake associates starting Oct 5. Still need onboarding plan for them. Open enrollment emails go out Oct 1.

**From Heidy (Tech):** EREQ-2147 (expedite option) in dev, UAT starts next week with Mary. Looking into the AWS spike, think it's the new Textract add-on.
""")

print("documents written")
