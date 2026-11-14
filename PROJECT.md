# Project: HOWDOI & One-Man-Business Operations

## Architecture
HOWDOI is a comprehensive solo-founder venture integrating consumer fintech applications (DepositGuard financial risk simulator, iOS app support commitments) with an automated enterprise management structure based on `One-Man-Business`.

The repository is organized into four distinct architectural layers:
1. **Business Operations Layer (`One-Man-Business/`)**:
   Cloned from `/Users/frankie/Desktop/One-Man-Business`. Contains the 4 department workspaces:
   - `Client Support & Documentation (Your Customer Success Team)`
   - `Development & Infrastructure (Your Engineering Team)`
   - `Lead Generation & Sales (Your Marketing Team)`
   - `Orchestration & Workflow Automation (Your Operations Manager)`
   Each workspace houses domain-specific SOPs, runbooks, templates, and campaign assets.

2. **Operational Sub-Agent Infrastructure (`.agents/`)**:
   Autonomous, specialist sub-agents registered in Antigravity via declarative YAML frontmatter + Markdown system prompts:
   - `.agents/agents/client-support-agent.md`: Customer Success, FAQ updates, App Store support route maintenance.
   - `.agents/agents/development-infra-agent.md`: Next.js engineering, deterministic math engine, test suites.
   - `.agents/agents/lead-generation-sales-agent.md`: Homebuyer marketing, Facebook infographics, acquisition funnels.
   - `.agents/agents/orchestration-workflow-agent.md`: Cross-department task coordination, daily standups, release gates.
   - `.agents/README.md`: Master operational guide for the project owner.
   - `.agents/agents.json`: Customization discovery manifest.

3. **Production Application Layer (`app/`, `lib/`, `components/`, `tests/`)**:
   - `lib/depositguard/engine/`: Deterministic client-side financial engine (VND arithmetic, amortization, cash flows).
   - `app/`: Next.js 15 web application (/kiem-tra-mua-nha, /ket-qua, /cach-tinh, /cau-hoi-thuong-gap, /support, /privacy).
   - `tests/`: Unit and E2E test suites (Vitest).

4. **Teamwork Orchestration Metadata (`.agents/teamwork/`)**:
   Strictly reserved for multi-agent dispatch metadata (`BRIEFING.md`, `progress.md`, `handoff.md`). Quarantined from operational agent definitions.

## Code Layout
```
/Volumes/SIDE HUSTLE/HOWDOI/
├── One-Man-Business/
│   ├── README.md
│   ├── Client Support & Documentation (Your Customer Success Team)/
│   │   └── README.md
│   ├── Development & Infrastructure (Your Engineering Team)/
│   │   └── README.md
│   ├── Lead Generation & Sales (Your Marketing Team)/
│   │   └── README.md
│   └── Orchestration & Workflow Automation (Your Operations Manager)/
│       └── README.md
├── .agents/
│   ├── README.md
│   ├── agents.json
│   ├── agents/
│   │   ├── client-support-agent.md
│   │   ├── development-infra-agent.md
│   │   ├── lead-generation-sales-agent.md
│   │   └── orchestration-workflow-agent.md
│   └── teamwork/                      # Orchestrator session metadata ONLY
├── app/                               # Next.js Application
├── components/                        # React Components
├── lib/                               # DepositGuard Financial Engine & Context
├── PLAN/                              # Project Plans & Media Assets
└── tests/                             # Vitest Test Suites
```

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Clone OMB Hierarchy | Clone `/Users/frankie/Desktop/One-Man-Business` preserving all 4 departments and `.DS_Store` | M-OMB | ORIGINAL_REQUEST §R1 |
| 2 | Client Support Sub-Agent | Configure `client-support-agent.md` in `.agents/agents/` with tools, SOPs, and App Store support scope | M-OMB | ORIGINAL_REQUEST §R2 |
| 3 | Development & Infra Sub-Agent | Configure `development-infra-agent.md` in `.agents/agents/` with engine and test harness scope | M-OMB | ORIGINAL_REQUEST §R2 |
| 4 | Lead Gen & Sales Sub-Agent | Configure `lead-generation-sales-agent.md` in `.agents/agents/` with media and Facebook campaign scope | M-OMB | ORIGINAL_REQUEST §R2 |
| 5 | Orchestration Sub-Agent | Configure `orchestration-workflow-agent.md` in `.agents/agents/` with cross-domain coordination scope | M-OMB | ORIGINAL_REQUEST §R2 |
| 6 | Master Operational Guide | Provide `.agents/README.md` documenting founder delegation protocols, inputs/outputs, and matrices | M-OMB | ORIGINAL_REQUEST §R3 |
| 7 | Departmental Workspace Integration | Link One-Man-Business department folders to sub-agents with department READMEs and SOP templates | M-OMB | ORIGINAL_REQUEST §R3 |
| 8 | Discovery Manifest | Provide `.agents/agents.json` declaring sub-agents for explicit Antigravity discovery | M-OMB | Survey Spec |
| 9 | Forensic Integrity & Verification | Verify 100% clone fidelity, YAML syntax, tool permissions, and zero leakage into `.agents/teamwork/` | M-VERIFY | Acceptance Criteria |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M-OMB | One-Man-Business & Operational Sub-Agents | Clone structure, configure 4 sub-agents in `.agents/agents/`, generate `.agents/README.md`, department READMEs, and `agents.json` | none | DONE |
| M-VERIFY | Review, Challenger & Forensic Audit Verification | 2 Reviewers, 2 Challengers, 1 Forensic Auditor validating directory integrity, subagent contracts, and operational guidance | M-OMB | DONE (Gate PASS: 2 APPROVE, 2 APPROVE, CLEAN audit) |

## Interface Contracts
### Sub-Agent Definition Contract (`.agents/agents/<name>.md`)
- Format: Valid YAML frontmatter bounded by `---` containing:
  - `name`: string (unique kebab-case identifier)
  - `description`: string (semantic purpose and trigger description)
  - `tools`: string[] (explicit tool whitelist)
  - `subagent`: boolean (`true`)
  - `mainAgent`: boolean (`true`)
  - `commandExecutionPolicy`: string (`auto`)
- Body:
  - Identity & Persona
  - Operational Scope & Responsibilities (HOWDOI specific)
  - Input Expectations & Output Deliverables
  - Standard Operating Procedures (SOPs)
  - Quality, Security & Legal Compliance Guardrails

### Cloning Contract
- Source: `/Users/frankie/Desktop/One-Man-Business`
- Destination: `/Volumes/SIDE HUSTLE/HOWDOI/One-Man-Business`
- Command: `ditto "/Users/frankie/Desktop/One-Man-Business" "/Volumes/SIDE HUSTLE/HOWDOI/One-Man-Business"`
- Fidelity: Zero missing files, exact mode preservation, zero modification to original source folder.
