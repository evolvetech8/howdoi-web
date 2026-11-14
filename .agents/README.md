# Antigravity Sub-Agent Operational Architecture & Master Delegation Guide

Welcome to the operational sub-agent framework for **DepositGuard (HowDoI 2.0)** and the **HOWDOI** enterprise ecosystem.

This directory (`.agents/`) contains the declarative agent configurations, tool bindings, discovery manifests, and standard operating procedures (SOPs) that empower the solo-founder ("Frank") to run a multi-department software business using autonomous, specialized AI agents.

---

## 1. System Overview & Department Architecture

The HOWDOI operational system is structured into four functional pillars mapped directly to the cloned department workspaces in `One-Man-Business/`:

```
                             ┌───────────────────────────────────────────┐
                             │         PROJECT OWNER / FOUNDER           │
                             │                 ("Frank")                 │
                             └─────────────────────┬─────────────────────┘
                                                   │
                                       Delegates & Coordinates
                                                   │
                             ┌─────────────────────▼─────────────────────┐
                             │     ORCHESTRATION & WORKFLOW AGENT        │
                             │       (Your Operations Manager)           │
                             │   .agents/agents/orchestration-...        │
                             │   Workspace: One-Man-Business/            │
                             │     Orchestration & Workflow Automation   │
                             └──────┬──────────────┬──────────────┬──────┘
                                    │              │              │
                      Dispatches    │   Coordinates│   Enforces   │
                      Workflows     │   Backlog    │   Gates      │
                                    │              │              │
           ┌────────────────────────▼──┐           │           ┌──▼────────────────────────┐
           │   CLIENT SUPPORT AGENT    │           │           │ DEVELOPMENT & INFRA AGENT │
           │ (Your Customer Success)   │           │           │ (Your Engineering Team)   │
           │ .agents/agents/client-... │           │           │ .agents/agents/develop... │
           │ Workspace: One-Man-Business│          │           │ Workspace: One-Man-Business│
           │   Client Support & Docs   │           │           │   Development & Infra     │
           └───────────────────────────┘           │           └───────────┬───────────────┘
                                                   │                       │
                                       ┌───────────▼───────────────┐       │ Commits Code
                                       │ LEAD GEN & SALES AGENT    │       │ & Runs Tests
                                       │ (Your Marketing Team)     │       │
                                       │ .agents/agents/lead-gen...│       ▼
                                       │ Workspace: One-Man-Business│ ┌───────────────────────┐
                                       │   Lead Generation & Sales │ │ HOWDOI PRODUCTION     │
                                       └───────────────────────────┘ │ (Next.js, Engine,     │
                                                                     │  Vitest, App Routes)    │
                                                                     └───────────────────────┘
```

### Directory Structure & Scope Boundary
```
/Volumes/SIDE HUSTLE/HOWDOI/
├── .agents/
│   ├── README.md                      # This master delegation guide
│   ├── agents.json                    # IDE customization discovery manifest
│   ├── agents/                        # Native Antigravity agent definition markdown files
│   │   ├── client-support-agent.md
│   │   ├── development-infra-agent.md
│   │   ├── lead-generation-sales-agent.md
│   │   └── orchestration-workflow-agent.md
│   └── teamwork/                      # [QUARANTINED] Inter-agent session logs & metadata ONLY
├── One-Man-Business/                  # Department workspaces, SOPs, templates, and logs
└── app/, lib/, components/, tests/    # Next.js production codebase and test suites
```

> **CRITICAL PLATFORM BOUNDARY**:  
> `.agents/teamwork/` is strictly quarantined for multi-agent session coordination metadata (`BRIEFING.md`, `progress.md`, `handoff.md`). Operational sub-agent definitions, application source code, and tests must NEVER be written to `.agents/teamwork/`.

---

## 2. The 4 Operational Sub-Agents

| Sub-Agent Identifier | Department Title | Focus Domain | Key Artifacts |
|---|---|---|---|
| `orchestration-workflow-agent` | Orchestration & Workflow Automation *(Your Operations Manager)* | Founder briefings, release gatekeeping, cross-department sprint dispatch, milestone governance | `DAILY_BRIEFING.md`, `SPRINT_PLAN.md`, `RELEASE_GATEKEEPER.md` |
| `client-support-agent` | Client Support & Documentation *(Your Customer Success Team)* | Support tickets (`/api/support`), 24h SLA, App Store routes (`/support`, `/privacy`), FAQ (`/cau-hoi-thuong-gap`), beta interviews | `TICKET_LOG.md`, `CS_WEEKLY_REPORT.md`, `FAQ_UPDATES.md`, `BETA_FEEDBACK_SYNTHESIS.md` |
| `development-infra-agent` | Development & Infrastructure *(Your Engineering Team)* | Deterministic calculation engine (`lib/depositguard/engine/`), Next.js wizard/results, Vitest test suites, build integrity | Next.js code, `lib/depositguard/engine/*.ts`, `tests/`, `BUILD_VERIFICATION.md` |
| `lead-generation-sales-agent` | Lead Generation & Sales *(Your Marketing Team)* | 30-day Facebook plan, 5 content pillars, `PLAN/Media/` visual assets, privacy-safe UTM tracking, paid report validation | `COMMUNITY_TRACKER.md`, `CONTENT_CALENDAR.md`, `PLAN/Media/README.md`, `CAMPAIGN_ANALYTICS.md` |

---

## 3. How the Project Owner Interacts and Delegates Tasks

As the founder and project owner ("Frank"), you can invoke these agents through three primary methods:

### Method A: Direct Antigravity IDE Interaction
- **Agent Selector**: Choose the specific agent from the Antigravity Agent dropdown card in your chat panel.
- **Mention Syntax**: In any chat prompt, invoke an agent via `@client-support-agent`, `@development-infra-agent`, `@lead-generation-sales-agent`, or `@orchestration-workflow-agent`.

### Method B: Executive Delegation via Operations Manager
For complex or multi-step business goals, delegate directly to the **Operations Manager**, who will break the goal into sub-agent workstreams and enforce quality gates:
> *"Operations Manager: We want to launch Content Pillar 1 on Facebook next Monday. Coordinate with Engineering to confirm Golden Fixture numbers, verify with Marketing that the infographic is ready, and make sure Customer Success has updated the FAQ with teaser rate explanations."*

### Method C: Specialized Task Prompt Templates

#### 1. Delegating to Customer Success (`client-support-agent`)
```text
Task: Triage Support Queue and Check App Store Route Health
Context: Daily customer support check.
Instructions:
1. Ingest pending tickets from data/support-tickets.json and draft response emails.
2. For any bug report, formulate a reproducible issue for Engineering.
3. Verify that /support and /privacy routes return HTTP 200 OK for our iOS app listings.
4. Log all activities in One-Man-Business/Client Support & Documentation.../TICKET_LOG.md.
```

#### 2. Delegating to Engineering (`development-infra-agent`)
```text
Task: Engine Algorithm Refinement & Test Verification
Context: Updating floating rate amortization logic.
Instructions:
1. Review lib/depositguard/engine/amortization.ts and Golden Fixture specs.
2. Ensure integer-VND rounding eliminates floating-point drift over 240 months.
3. Run npm test to verify all 65+ unit tests pass.
4. Run npm run build and confirm zero TypeScript errors.
5. Record verification commands and outputs in One-Man-Business/Development & Infrastructure.../BUILD_VERIFICATION.md.
```

#### 3. Delegating to Marketing (`lead-generation-sales-agent`)
```text
Task: Produce Pillar 1 Facebook Educational Post & Infographic
Context: Launching Week 2 value-first educational campaign.
Instructions:
1. Draft post copy explaining the Month 13 rate reset jump using Golden Fixture figures (2B loan, 7%->12%).
2. Reorganize and rename relevant visual assets in PLAN/Media/ with descriptive kebab-case names.
3. Generate clean 1:1 or 4:5 infographic image for the post.
4. Provide clean UTM link to /kiem-tra-mua-nha without financial parameters.
5. Record copy and schedule in One-Man-Business/Lead Generation & Sales.../CONTENT_CALENDAR.md.
```

#### 4. Delegating to Operations Manager (`orchestration-workflow-agent`)
```text
Task: Daily Founder Operations Standup & Release Gatekeeper Audit
Context: Morning executive review.
Instructions:
1. Scan open tickets in data/support-tickets.json and check for SLA breaches (>18h).
2. Execute npm test to verify green build status.
3. Check status of current milestone deliverables across all 3 departments.
4. Produce today's DAILY_BRIEFING.md in One-Man-Business/Orchestration.../.
5. Highlight any release blockers or policy violations.
```

---

## 4. Task Delegation & Responsibility Matrix

| Operational Capability | Responsible Sub-Agent | Primary Department Workspace | Key Inputs | Primary Deliverables | Verification Command |
|---|---|---|---|---|---|
| **Support Ticket Processing** | `client-support-agent` | `One-Man-Business/Client Support & Documentation...` | `data/support-tickets.json` | Reply drafts, resolved ticket state | Inspection of ticket JSON & logs |
| **App Store Route Preservation** | `client-support-agent` | `One-Man-Business/Client Support & Documentation...` | `/support`, `/privacy` routes | Live bilingual pages, 200 OK | `curl -sI http://localhost:3000/support` |
| **FAQ & Trust Content Sync** | `client-support-agent` | `One-Man-Business/Client Support & Documentation...` | User queries, feedback | Updates to `/cau-hoi-thuong-gap`, `/cach-tinh` | Content inspection & review |
| **Financial Engine Math** | `development-infra-agent` | `One-Man-Business/Development & Infrastructure...` | Financial formulas, specs | `lib/depositguard/engine/*.ts` | `npm test tests/unit/engine.test.ts` |
| **Anonymous Simulation Wizard** | `development-infra-agent` | `One-Man-Business/Development & Infrastructure...` | UI requirements, state flow | `app/kiem-tra-mua-nha/`, `components/` | Mobile viewport test (360px) |
| **Automated Test Harness** | `development-infra-agent` | `One-Man-Business/Development & Infrastructure...` | Vitest suites, fixtures | Passing test harness, ADRs | `npm test` & `npx tsc --noEmit` |
| **Facebook Group Strategy** | `lead-generation-sales-agent` | `One-Man-Business/Lead Generation & Sales...` | Group rules, discussions | `COMMUNITY_TRACKER.md` (10-15 groups) | Review scoring matrix (>=7/10) |
| **5 Content Pillars Copywriting** | `lead-generation-sales-agent` | `One-Man-Business/Lead Generation & Sales...` | Engine figures, post calendar | Long-form posts, carousel drafts | Copy review for disclaimers |
| **Media Asset Reorganization** | `lead-generation-sales-agent` | `PLAN/Media/` | Raw PNG images | Kebab-case named assets, `README.md` | `find "PLAN/Media" -name "*.png"` |
| **Daily Operations Briefing** | `orchestration-workflow-agent` | `One-Man-Business/Orchestration & Workflow...` | Support tickets, CI test logs | `DAILY_BRIEFING.md` | Briefing inspection |
| **Release Gatekeeper Audit** | `orchestration-workflow-agent` | `One-Man-Business/Orchestration & Workflow...` | Codebase state, test results | `RELEASE_GATEKEEPER.md` sign-off | Full gatekeeper checklist run |
| **Regulatory & Privacy Audit** | `orchestration-workflow-agent` | `One-Man-Business/Orchestration & Workflow...` | Legal guidelines, Law 91 | Audit log, disclaimer checks | Codebase grep for PII parameters |

---

## 5. Maintenance Guidelines & Guardrails

### A. Sub-Agent Configuration Updates
- All agent definitions live in `.agents/agents/<name>.md`.
- Each definition begins with YAML frontmatter bounded by `---`:
  - `name`: Must be unique, kebab-case, matching filename without `.md`.
  - `description`: Action-oriented third-person summary describing triggers and domain scope.
  - `tools`: Explicit list of granted tool identifiers.
  - `subagent: true` & `mainAgent: true`: Flags enabling subagent delegation and main chat visibility.
  - `commandExecutionPolicy: auto`: Permits automated command execution in trusted environments.
- When adding new sub-agents, update `.agents/agents.json` to keep discovery manifests synchronized.

### B. Legal & Privacy Invariants (Vietnamese Law 91/2025/QH15)
- **Zero Raw PII Storage**: Never persist user salaries, savings, home values, or identity numbers to database or server logs during anonymous simulations.
- **Client-Side Execution**: All amortization, debt-to-income, and reserve stress calculations execute client-side.
- **URL Cleanliness**: URL query parameters must never contain financial figures or personal identifiers.
- **Mandatory Disclaimers**: All consumer calculations must display the non-underwriting disclaimer:
  > *"DepositGuard cung cấp công cụ mô phỏng tài chính độc lập nhằm giúp người mua nhà nhận diện rủi ro dòng tiền. Kết quả không cấu thành cam kết cấp tín dụng của ngân hàng hay thẩm định pháp lý bất động sản."*

### C. App Store Route Preservation Invariants (Apple Guideline 5.1.1)
- Never delete or redirect the legacy endpoints:
  - `/support` and `/support/cho-con`
  - `/privacy` and `/privacy/cho-con`
  - `/api/support`
- These routes support existing live iOS apps on the Apple App Store. Breaking them causes App Store compliance violations and review rejections.

### D. Mathematical Precision & Golden Fixture Invariants
- Amortization calculation schedules must enforce deterministic integer-VND arithmetic (`Math.round`).
- The Golden Fixture test (2B VND loan, 240 months, 7% first 12m, 12% thereafter; 55M income, 30M essentials) must pass with zero deviation.
- Amortization schedules must terminate at exactly 0 VND remaining principal balance at the final month.
