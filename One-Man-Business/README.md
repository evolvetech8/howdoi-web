# One-Man-Business: Operational Department Workspaces

Welcome to the **One-Man-Business** operational system for **HOWDOI & DepositGuard (HowDoI 2.0)**.

This directory tree was cloned from `/Users/frankie/Desktop/One-Man-Business` and serves as the operational headquarters and business workspace layer for running a modern, solo-founder software enterprise.

---

## 1. Enterprise Architecture & Sub-Agent Pairing

Each department folder functions as the working domain, document repository, and persistent memory for a specialized autonomous sub-agent defined in `.agents/agents/`:

| Department Workspace | Mapped Operational Sub-Agent | Primary Business Domain |
|---|---|---|
| **[Client Support & Documentation (Your Customer Success Team)](./Client%20Support%20%26%20Documentation%20(Your%20Customer%20Success%20Team)/)** | [`client-support-agent`](../.agents/agents/client-support-agent.md) | Customer Success, support tickets (`/api/support`), 24h SLA, App Store support route preservation (`/support`, `/privacy`), FAQ & methodology documentation. |
| **[Development & Infrastructure (Your Engineering Team)](./Development%20%26%20Infrastructure%20(Your%20Engineering%20Team)/)** | [`development-infra-agent`](../.agents/agents/development-infra-agent.md) | Software engineering, deterministic calculation engine (`lib/depositguard/engine/`), Next.js App Router, Vitest test suites, build & type safety. |
| **[Lead Generation & Sales (Your Marketing Team)](./Lead%20Generation%20%26%20Sales%20(Your%20Marketing%20Team)/)** | [`lead-generation-sales-agent`](../.agents/agents/lead-generation-sales-agent.md) | Homebuyer marketing, 30-day Facebook community launch, 5 content pillars, `PLAN/Media/` visual assets, privacy-safe acquisition funnels. |
| **[Orchestration & Workflow Automation (Your Operations Manager)](./Orchestration%20%26%20Workflow%20Automation%20(Your%20Operations%20Manager)/)** | [`orchestration-workflow-agent`](../.agents/agents/orchestration-workflow-agent.md) | Operations management, founder daily standups, cross-department task coordination, release gatekeeping, milestone tracking. |

---

## 2. Directory Layout & Standards

```
/Volumes/SIDE HUSTLE/HOWDOI/One-Man-Business/
├── README.md                                                        # This master document
├── Client Support & Documentation (Your Customer Success Team)/
│   ├── README.md                                                    # Department operational guide
│   ├── TICKET_LOG.md                                                # Ticket triage and resolution log
│   ├── CS_WEEKLY_REPORT.md                                          # Weekly sentiment and escalation summary
│   ├── FAQ_UPDATES.md                                               # Drafts for /cau-hoi-thuong-gap and /cach-tinh
│   └── SOP/                                                         # Support SOPs and App Store runbooks
├── Development & Infrastructure (Your Engineering Team)/
│   ├── README.md                                                    # Department operational guide
│   ├── BUILD_VERIFICATION.md                                        # Verification logs and test outputs
│   ├── ADR/                                                         # Architecture Decision Records
│   └── checklists/                                                  # Engineering checklists (pre-commit, release)
├── Lead Generation & Sales (Your Marketing Team)/
│   ├── README.md                                                    # Department operational guide
│   ├── COMMUNITY_TRACKER.md                                         # Target Facebook groups scoring matrix
│   ├── CONTENT_CALENDAR.md                                          # 30-Day schedule across 5 content pillars
│   └── CAMPAIGN_ANALYTICS.md                                        # Funnel conversion and UTM performance
└── Orchestration & Workflow Automation (Your Operations Manager)/
    ├── README.md                                                    # Department operational guide
    ├── DAILY_BRIEFING.md                                            # Daily 1-page founder morning standup
    ├── SPRINT_PLAN.md                                               # Cross-department sprint priorities
    ├── RELEASE_GATEKEEPER.md                                        # Pre-deployment verification gate
    └── SOP_MASTER_INDEX.md                                          # Master directory of business procedures
```

---

## 3. Operational Rhythm for the Solo Founder

1. **Morning Briefing (08:30 - 09:00)**:
   - Invoke `orchestration-workflow-agent` to generate `DAILY_BRIEFING.md`.
   - Review pending support tickets in `data/support-tickets.json` approaching 18 hours toward the 24h SLA.
   - Check automated test health (`npm test`).

2. **Daily Execution & Dispatch**:
   - Customer tickets and FAQ adjustments -> Handed to `client-support-agent`.
   - Engine math fixes, features, or UI improvements -> Handed to `development-infra-agent`.
   - Community post drafts, infographic creation, or campaign tracking -> Handed to `lead-generation-sales-agent`.

3. **Release & Gatekeeping**:
   - Before deploying any production updates or launching marketing pushes, run the **Release Gatekeeper Checklist** (`RELEASE_GATEKEEPER.md`) via `orchestration-workflow-agent`.

---

## 4. Operational Invariants

- **Legal & Privacy**: Strict compliance with Vietnamese Consumer Privacy Law 91/2025/QH15. Zero customer financial credentials stored server-side.
- **Apple App Store Preservation**: Keep `/support`, `/privacy`, and `/api/support` routes live (HTTP 200 OK) at all times for existing iOS apps.
- **Platform Separation**: Keep `.agents/teamwork/` restricted strictly to agent metadata. Never place business assets or code in `.agents/teamwork/`.
