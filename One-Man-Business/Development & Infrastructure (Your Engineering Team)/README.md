# Development & Infrastructure (Your Engineering Team)

**Mapped Sub-Agent**: [`development-infra-agent`](../../.agents/agents/development-infra-agent.md)  
**Lead Role**: Principal Software Engineer & Systems Architect  
**Core Stack**: Next.js 15, TypeScript, Tailwind CSS, Recharts, Vitest  
**Verification Baseline**: 100% test pass rate, zero TypeScript errors, clean production build

---

## 1. Department Overview

The **Development & Infrastructure** department owns the technical implementation, mathematical rigor, automated test suites, and site reliability of the HOWDOI platform.

This workspace houses architecture decision records (ADRs), build verification logs, deployment checklists, and technical specifications.

---

## 2. Key Operational Domains

### A. Deterministic Financial Calculation Engine (`lib/depositguard/engine/`)
The calculation engine provides bit-exact, deterministic computations for homebuyer mortgage simulations:
- `amortization.ts`: Computes monthly repayment schedules for equal principal (*dư nợ giảm dần*) and annuity (*niên kim cố định*) methods up to 360 months; promotional rate expiration; post-promo interest rate jumps (+2pp, +4pp); guaranteed terminal zero balance (`Math.round`).
- `cashflow.ts`: Models household monthly cash flows factoring in net income, essential living expenses, income shocks (-20% for 3–6 months), inflation (+10%), emergency reserve floor tracking, and first negative operating cash-flow month identification.
- `solver.ts`: Monotonic binary search solver determining the maximum safe borrowing amount and required additional equity given a target Debt-to-Income (DTI) ratio.
- `types.ts`: Fully typed interface definitions for simulation inputs, schedules, cash flows, and stress toggles.

### B. Next.js App Router Architecture
- `/kiem-tra-mua-nha`: 3-step anonymous wizard (Step 1: Property details, Step 2: Household finances, Step 3: Loan parameters) with real-time input validation and VND formatting.
- `/ket-qua`: Interactive simulation dashboard with synchronized Recharts graphs, tabular alternatives for accessibility, what-if stress toggle controls, and `noindex` robot directives.
- Public trust routes: `/cach-tinh`, `/cau-hoi-thuong-gap`, `/ve-howdoi`, `/lien-he`, `/bao-mat`, `/dieu-khoan`.
- Legacy App Store support routes: `/support`, `/privacy`, `/api/support`.

### C. Automated Test Harness (Vitest)
- **Golden Fixture Verification (Plan §4.6)**: VND 2,000,000,000 loan, 240 months, equal principal, 7% first 12 months, 12% from month 13; net income VND 55M, essentials VND 30M; verifying Month 1 payment (~VND 20M), Month 13 payment (~VND 27.33M), and first negative cash-flow month at Month 13 within 1 VND precision.
- **Edge Case Tests**: 65+ unit tests covering 0% interest, 0 VND income, living expenses exceeding income, grace periods, boundary conditions, and division-by-zero guards.
- **Type Safety**: Enforced via `npx tsc --noEmit`.
- **Production Build**: Enforced via `npm run build`.

### D. Client-Side Privacy Isolation (Law 91/2025/QH15)
- All financial calculation runs client-side in React Context.
- Raw financial inputs (salary, loan amount, property value) are strictly prohibited from URL query parameters, server logs, or unredacted telemetry.

---

## 3. Department Deliverables & Artifacts

| Artifact | File Path | Purpose |
|---|---|---|
| **Build Verification Log** | `BUILD_VERIFICATION.md` | Verification command outputs (`npm test`, `npm run build`, `tsc`) |
| **Architecture Decision Records** | `ADR/` | Documented architectural decisions and engineering rationales |
| **Engineering Checklists** | `checklists/` | Pre-commit, deployment, and security verification checklists |

---

## 4. Standard Operating Procedures (SOPs)

- **SOP-DEV-01: Engine Feature Implementation & Regression Verification**: Review types, write failing unit test, implement deterministic arithmetic, verify Golden Fixture and all unit tests pass.
- **SOP-DEV-02: Next.js Component Refactoring & Mobile Validation**: Implement responsive UI changes using Tailwind CSS, verify down to 360px mobile viewports, check hydration.
- **SOP-DEV-03: Build Gatekeeper Execution**: Run `npx tsc --noEmit`, `npm test`, and `npm run build`; verify legacy endpoints compile cleanly; log outputs to `BUILD_VERIFICATION.md`.

---

## 5. Compliance & Invariants

1. **Deterministic Arithmetic**: Never use raw floating-point calculations for multi-year financial totals. Use explicit integer VND rounding (`Math.round()`).
2. **Client-Side Privacy**: No sensitive financial figures transmitted over the wire or persisted server-side.
3. **Route Preservation**: Never delete, move, or break `/support`, `/privacy`, or `/api/support` endpoints.
4. **Zero Build Errors**: Every release must pass with 0 TypeScript errors and 100% test pass rate.
