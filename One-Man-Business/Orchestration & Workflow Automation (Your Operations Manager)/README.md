# Orchestration & Workflow Automation (Your Operations Manager)

**Mapped Sub-Agent**: [`orchestration-workflow-agent`](../../.agents/agents/orchestration-workflow-agent.md)  
**Lead Role**: Chief of Staff & Operations Orchestrator  
**Operational Scope**: Project management, cross-department coordination, daily standups, release gatekeeping, milestone governance  
**Core Motto**: *"Clarity before action, verification before release, zero defect tolerance in financial math."*

---

## 1. Department Overview

The **Orchestration & Workflow Automation** department functions as the mission control center for the solo founder. It synchronizes workstreams across Customer Success, Engineering, and Marketing, automates daily standups, enforces release quality gates, and tracks milestone progress.

This workspace houses daily founder briefings, sprint backlog plans, formal release gatekeeper sign-offs, and master standard operating procedures.

---

## 2. Key Operational Domains

### A. Cross-Department Coordination & Workflow Dispatch
- Synthesizes priorities across the specialized sub-agents:
  - `client-support-agent`: Customer inquiries, 24h SLA compliance, App Store route integrity, beta feedback synthesis.
  - `development-infra-agent`: Deterministic math engine, Next.js components, test suite integrity, type safety, build verification.
  - `lead-generation-sales-agent`: 30-day Facebook community plan, 5 content pillars, media asset management, commercial validation.
- Prevents cross-functional misalignments and enforces dependency sequencing (e.g. verifying that calculation engine features are fully tested before marketing campaigns launch).

### B. Daily Founder Operations Standup
- Automates the daily morning briefing by inspecting:
  - Open support tickets in `data/support-tickets.json` (flagging any ticket exceeding 18 hours toward the 24h SLA).
  - Test suite health (`npm test`) and git branch status.
  - Beta feedback submissions and simulation metrics.
- Produces the daily executive briefing: `DAILY_BRIEFING.md`.

### C. Release Gatekeeping & Launch Checklist
- Enforces the non-negotiable **Release Gatekeeper Checklist** (`RELEASE_GATEKEEPER.md`) before any production deployment:
  1. *Engine Math*: Golden Fixture unit test passes with <= 1 VND rounding tolerance.
  2. *Automated Tests*: 100% of Vitest unit/integration tests pass.
  3. *Type Safety*: `npx tsc --noEmit` returns 0 errors.
  4. *Build Health*: `npm run build` exits 0.
  5. *Legacy Routes*: `/support`, `/privacy`, `/api/support` return HTTP 200 OK.
  6. *Privacy Audit*: Client-side isolation verified; zero financial figures in URLs or telemetry logs.
  7. *Copy Disclaimers*: Non-underwriting disclaimer visible on all financial simulation views.

### D. Milestone Tracking & Commercial Governance
- Maintains the master project roadmap in `PROJECT.md`.
- Tracks progress across production milestones:
  - Phase P0: Free Anonymous Risk Simulator
  - Beta Validation: 10–20 qualitative user interviews completed
  - Commercial Test: 3 paid Pre-Deposit Report transactions (VND 299,000)
- Protects platform integrity: preserves `.agents/teamwork/` as strictly metadata-only.

---

## 3. Department Deliverables & Artifacts

| Artifact | File Path | Purpose |
|---|---|---|
| **Daily Operations Briefing** | `DAILY_BRIEFING.md` | Daily 1-page founder morning standup aggregating tickets, tests, and tasks |
| **Sprint Priority Backlog** | `SPRINT_PLAN.md` | Prioritized workstreams and dependencies across the 3 sub-agent domains |
| **Release Readiness Sign-Off** | `RELEASE_GATEKEEPER.md` | Rigorous 7-point pre-deployment verification audit |
| **Master SOP Index** | `SOP_MASTER_INDEX.md` | Central registry of all operational procedures across the enterprise |

---

## 4. Standard Operating Procedures (SOPs)

- **SOP-OPS-01: Daily Operations Health Check**: Inspect `data/support-tickets.json` for SLA breaches, run `npm test`, compile `DAILY_BRIEFING.md`.
- **SOP-OPS-02: Cross-Functional Sprint Dispatch**: Break milestone objectives into discrete tasks with explicit success criteria for specialized sub-agents.
- **SOP-OPS-03: Release Gatekeeper Verification**: Run the 7-point release gatekeeper checklist; verify tests, type check, build, legacy routes, and privacy; sign off on release.
- **SOP-OPS-04: Repository & Privacy Compliance Audit**: Audit codebase to ensure `.agents/teamwork/` quarantine is preserved and no PII or financial data is logged.

---

## 5. Compliance & Invariants

1. **Gatekeeper Independence**: Never bypass release criteria for speed. If a test fails or a disclaimer is missing, the release is blocked.
2. **Platform Boundary Compliance**: Ensure `.agents/teamwork/` contains ONLY session metadata (`BRIEFING.md`, `progress.md`, `handoff.md`). Never allow code or operational agent definitions inside `.agents/teamwork/`.
3. **Regulatory Governance**: Ensure all platform features comply with Vietnamese Consumer Privacy Law 91/2025/QH15 and Apple Review Guideline 5.1.1.
4. **Transparent Communication**: Maintain concise, honest logs of project risks, blockers, and technical debt.
