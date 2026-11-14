# Client Support & Documentation (Your Customer Success Team)

**Mapped Sub-Agent**: [`client-support-agent`](../../.agents/agents/client-support-agent.md)  
**Lead Role**: Head of Customer Success and Trust Officer  
**Primary Support SLA**: Under 24 business hours  
**Official Contact Inbox**: `archonic88@gmail.com`

---

## 1. Department Overview

The **Client Support & Documentation** department manages user trust, customer satisfaction, App Store support compliance, and public documentation for DepositGuard and the HowDoI ecosystem.

This workspace houses operational support logs, customer reply templates, beta interview transcripts, and documentation change drafts.

---

## 2. Key Operational Domains

### A. Support Ticket Ingestion & Processing (`/api/support`)
- Incoming tickets submitted via the web contact form are ingested by `app/api/support/route.ts` and appended to `data/support-tickets.json`.
- The sub-agent periodically scans `data/support-tickets.json`, validates email formatting, categorizes inquiries, and prepares compassionate, accurate responses.
- Active triage and resolution records are logged in `TICKET_LOG.md`.

### B. Legacy App Store Support Preservation (Apple Guideline 5.1.1)
- Maintains active support infrastructure for existing live iOS apps:
  - *"Cho Con - Chuẩn Bị Đón Bé"* (Parenting & pregnancy tool)
  - *"HowDoI — Tài Chính Cá Nhân"* (Personal finance tool)
  - *EvolveTech Ecosystem Apps*
- Guarantees zero downtime on required App Store routes:
  - `/support` and `/support/cho-con`
  - `/privacy` and `/privacy/cho-con`
- Guides users through In-App Purchase issues using the standard iOS **"Restore Purchases"** flow.

### C. DepositGuard Public Documentation & Trust Pages
- Maintains and refines public trust pages:
  - `/cach-tinh`: Transparent explanations of amortization formulas, interest rate resets, and stress scenarios.
  - `/cau-hoi-thuong-gap`: FAQs addressing mortgage terminology, bank teaser rates, and cash-flow traps.
  - `/ve-howdoi`: About DepositGuard, mission statement, independence commitment.
  - `/lien-he`: Contact information and user inquiry handling.
  - `/bao-mat` & `/dieu-khoan`: Privacy policies and terms of service disclaimers.

### D. Qualitative Beta Interview Protocol
- Executes structured 5-question interviews with homebuyer beta testers recruited from Facebook groups.
- Documents findings in `BETA_FEEDBACK_SYNTHESIS.md` to inform product and marketing strategies.

---

## 3. Department Deliverables & Artifacts

| Artifact | File Path | Purpose |
|---|---|---|
| **Ticket Triage Log** | `TICKET_LOG.md` | Log of ingested tickets, categorization, and draft customer replies |
| **Weekly CS Report** | `CS_WEEKLY_REPORT.md` | Weekly customer sentiment summary, ticket volume, bug escalations |
| **FAQ Updates** | `FAQ_UPDATES.md` | Staged copy updates for `/cau-hoi-thuong-gap` and `/cach-tinh` |
| **Beta Feedback Synthesis** | `BETA_FEEDBACK_SYNTHESIS.md` | Synthesized insights from 10–20 qualitative beta interviews |
| **Support Runbooks** | `SOP/` | Standard operating procedures for recurring support scenarios |

---

## 4. Standard Operating Procedures (SOPs)

- **SOP-CS-01: Support Ticket Triage & Resolution**: Read `data/support-tickets.json`, validate inputs, draft response within 24h SLA, mark status.
- **SOP-CS-02: App Store & In-App Purchase Servicing**: Handle restore purchase requests, verify App Store URLs return HTTP 200 OK.
- **SOP-CS-03: DepositGuard Calculation Clarification**: Explain difference between equal principal (*dư nợ giảm dần*) and annuity (*niên kim cố định*) schedules.
- **SOP-CS-04: Qualitative Beta Interview Execution**: Conduct 5-question feedback sessions with prospective homebuyers.
- **SOP-CS-05: Documentation Knowledge Base Synchronization**: Update FAQ and calculation methodology pages to reflect recurring questions.

---

## 5. Compliance & Invariants

1. **Law 91/2025/QH15 Compliance**: Strictly zero PII retention. Never solicit bank account numbers, passwords, or raw income verification documents.
2. **Fintech Non-Underwriting Disclaimer**: Every calculation explanation must include the standard disclaimer stating DepositGuard provides financial simulation, not bank loan underwriting or legal due diligence.
3. **Apple Guideline 5.1.1**: The URLs `/support` and `/privacy` must never return 404 or redirect loops.
