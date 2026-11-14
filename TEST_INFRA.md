# DepositGuard E2E Test Infrastructure Specification

**Document Version:** 1.0.0  
**Target Platform:** DepositGuard (HowDoI 2.0 Phase P0)  
**Author:** DepositGuard Independent E2E Testing Track (`test_writer_e2e`)  
**Status:** Authoritative  
**Date:** 2026-11-14  

---

## 1. Test Philosophy

The DepositGuard test infrastructure is built upon five foundational tenets:

1. **Opaque-Box Requirement-Driven Testing:**  
   Tests evaluate the system strictly through its public interface contracts (`lib/depositguard/engine` domain interfaces and customer-facing simulation outputs) as specified in `ORIGINAL_REQUEST.md`, `PROJECT.md`, and `PLAN/HowDoI_2_0_Developer_Implementation_Plan.md`. Tests do not inspect or rely on private helper implementations.

2. **Zero-Facade Integrity:**  
   Tests must never pass vacuously. Every test case exercises real financial mathematics, monthly cash flow series, and edge-condition logic. Expected values are derived directly from authoritative mathematical formulas, regulatory definitions, and the project's Golden Fixture vector.

3. **Progressive Testability & Dual-Adapter Architecture:**  
   The test harness features a pluggable `engine-adapter` that targets the production calculation engine (`lib/depositguard/engine`). When the production engine is under development or during isolated test authoring, the adapter seamlessly routes to the specification's reference engine, verifying test validity and mathematical precision before and after implementation.

4. **Self-Contained Isolation:**  
   Every test case is completely stateless and hermetic. Tests do not share mutable globals, do not depend on execution order, and do not make external network calls.

5. **Vietnam-Centric Domain Fidelity:**  
   Mortgage mechanics, interest compounding conventions ($r/12$), integer-VND currency units, non-alarmist consumer fintech risk badges, and cultural home-buying scenarios reflect the exact realities of Vietnamese home buyers.

---

## 2. Feature Inventory & Requirement Source Mappings

Each feature in DepositGuard is mapped to its authoritative requirement source in `ORIGINAL_REQUEST.md` and the master developer plan:

| # | Feature Key | Feature Name | Requirement Source | Implementation Milestone | E2E Tier Coverage |
|---|-------------|--------------|--------------------|--------------------------|-------------------|
| F01 | `EQUAL_PRINCIPAL` | Equal Principal Amortization (dư nợ giảm dần) | `ORIGINAL_REQUEST.md` §R1, Plan §4.2 | M1 | Tier 1, Tier 2, Tier 3, Tier 4 |
| F02 | `ANNUITY` | Annuity Amortization (trả góp đều / PMT) | `ORIGINAL_REQUEST.md` §R1, Plan §4.2 | M1 | Tier 1, Tier 2, Tier 3, Tier 4 |
| F03 | `RATE_RESET` | Promotional Rate Expiry & Reset Mechanics | `ORIGINAL_REQUEST.md` §R1, Plan §4.2, §4.5 | M1 | Tier 1, Tier 2, Tier 3, Tier 4 |
| F04 | `GRACE_PERIOD` | Principal Grace Period Handling | `ORIGINAL_REQUEST.md` §R1, Plan §4.2 | M1 | Tier 1, Tier 2, Tier 3, Tier 4 |
| F05 | `ZERO_DRIFT` | Deterministic Zero-Drift Math & Reconciliation | `ORIGINAL_REQUEST.md` §R1, Plan §4.1 | M1 | Tier 1, Tier 2, Tier 3 |
| F06 | `CASH_FLOW` | Household Cash Flow & Expense Shock (+10%) | `ORIGINAL_REQUEST.md` §R1, Plan §4.3, §4.5 | M1 | Tier 1, Tier 2, Tier 3, Tier 4 |
| F07 | `INCOME_SHOCK` | Temporary Income Shock (-20% for 3-6 mos) | `ORIGINAL_REQUEST.md` §R1, Plan §4.3, §4.5 | M1 | Tier 1, Tier 2, Tier 3, Tier 4 |
| F08 | `RESERVE_TRACK`| Emergency Reserve Balance Tracking | `ORIGINAL_REQUEST.md` §R1, Plan §4.3 | M1 | Tier 1, Tier 2, Tier 3, Tier 4 |
| F09 | `DEFICIT_MONTH`| First Negative Cash-Flow Month Detection | `ORIGINAL_REQUEST.md` §R1, Plan §4.3 | M1 | Tier 1, Tier 2, Tier 3, Tier 4 |
| F10 | `DTI_RATIO` | Debt-Service-to-Income (DTI) Household Ratio | `ORIGINAL_REQUEST.md` §R1, Plan §4.3 | M1 | Tier 1, Tier 2, Tier 3, Tier 4 |
| F11 | `GOLDEN_FIXTURE`| Golden Fixture Acceptance Verification | `ORIGINAL_REQUEST.md` Criteria, Plan §4.6 | M1 | Tier 1, Tier 2 |
| F12 | `REVERSE_SOLVER`| Reverse Affordability Solver (Max Safe Loan) | `ORIGINAL_REQUEST.md` §R2, Plan §4.4 | M1 | Tier 1, Tier 2, Tier 4 |
| F13 | `WIZARD_FLOW` | 3-Step Anonymous Wizard Navigation | `ORIGINAL_REQUEST.md` §R2, Plan §3 | M2 | Tier 1, Tier 4 |
| F14 | `DUAL_INPUTS` | Synchronized Slider & Formatted Currency Text | `ORIGINAL_REQUEST.md` §R2, Plan §6.1 | M2 | Tier 1, Tier 2 |
| F15 | `CLIENT_STATE` | In-Memory Client State & Privacy Guard | `ORIGINAL_REQUEST.md` §R5, Plan §5.2 | M2 | Tier 1, Tier 2 |
| F16 | `METRIC_CARDS` | Top 6 Key Financial Risk Metric Cards | `ORIGINAL_REQUEST.md` §R2, Plan §3 | M2 | Tier 1, Tier 4 |
| F17 | `WHAT_IF_LEVERS`| Interactive Stress Testing Controls | `ORIGINAL_REQUEST.md` §R2, Plan §3, §4.5 | M2 | Tier 1, Tier 3 |
| F18 | `CORRECTIVE_LEVERS`| Corrective Action Guidance & Safe Ceilings | `ORIGINAL_REQUEST.md` §R2, Plan §3, §4.4 | M2 | Tier 1, Tier 4 |
| F19 | `CHARTS_TABLES`| Visual Cash Flow & Accessible Schedule Table | `ORIGINAL_REQUEST.md` §R2, Plan §6.2 | M2 | Tier 1 |
| F20 | `RISK_BADGES` | Non-Alarmist Consumer Fintech Risk Badges | `ORIGINAL_REQUEST.md` §R3, Plan §2.1 | M2 | Tier 1, Tier 4 |
| F21 | `PUBLIC_HOME` | Responsive Homepage (`/`) | `ORIGINAL_REQUEST.md` §R3, Plan §2.2 | M3 | Tier 1 |
| F22 | `METHODOLOGY` | Calculation Methodology Disclosure (`/cach-tinh`) | `ORIGINAL_REQUEST.md` §R3, Plan §2.2 | M3 | Tier 1 |
| F23 | `FAQ_PAGE` | Comprehensive FAQ (`/cau-hoi-thuong-gap`) | `ORIGINAL_REQUEST.md` §R3, Plan §2.2 | M3 | Tier 1 |
| F24 | `CONTACT_PAGE` | Contact & Bug Report Page (`/lien-he`) | `ORIGINAL_REQUEST.md` §R3, Plan §2.2 | M3 | Tier 1 |
| F25 | `ABOUT_PAGE` | About DepositGuard & Operator (`/ve-howdoi`) | `ORIGINAL_REQUEST.md` §R3, Plan §2.2 | M3 | Tier 1 |
| F26 | `LEGAL_PAGES` | Privacy (`/bao-mat`) & Terms (`/dieu-khoan`) | `ORIGINAL_REQUEST.md` §R3, Plan §13 | M3 | Tier 1 |
| F27 | `LEGACY_ROUTES`| App Store Route Preservation (`/support`, `/privacy`) | `ORIGINAL_REQUEST.md` §R4, Plan §2.4 | M3 | Tier 1, Tier 2 |
| F28 | `SEO_MOBILE` | Mobile Viewport (360px) & `noindex` Robots | `ORIGINAL_REQUEST.md` §R3, §R5, Plan §7.2 | M3 | Tier 1, Tier 2 |
| F29 | `TELEMETRY_PII`| Anonymized Telemetry (Zero Financial/PII Data) | `ORIGINAL_REQUEST.md` §R5, Plan §9.1 | M3 | Tier 1, Tier 2 |
| F30 | `E2E_SUITE_PASS`| 100% Pass Rate Across Tiers 1-4 | `ORIGINAL_REQUEST.md` Criteria | M4 | All Tiers |

---

## 3. Test Architecture & Directory Layout

### 3.1 Directory Layout

```text
/Volumes/SIDE HUSTLE/HOWDOI/
├── TEST_INFRA.md                     # Test infrastructure specification (this document)
├── TEST_READY.md                     # Test readiness declaration and execution summary
└── tests/
    └── e2e/
        ├── runner.ts                 # Master test runner & tiered summary aggregator
        ├── helpers/
        │   ├── test-types.ts         # Pure TypeScript contracts matching PROJECT.md §Interface Contracts
        │   ├── assertions.ts         # Financial equality matchers & tolerance validators
        │   ├── reference-engine.ts   # Authoritative mathematical specification engine
        │   └── engine-adapter.ts     # Transparent runtime resolver (Production vs Reference)
        ├── tier1-features/           # Tier 1: Isolated Feature Verification (>= 5 tests per feature)
        │   ├── f01-equal-principal.test.ts
        │   ├── f02-annuity.test.ts
        │   ├── f03-rate-resets.test.ts
        │   ├── f04-grace-period.test.ts
        │   ├── f05-zero-drift.test.ts
        │   ├── f06-cash-flow-expenses.test.ts
        │   ├── f07-income-shocks.test.ts
        │   ├── f08-emergency-reserves.test.ts
        │   ├── f09-first-deficit-month.test.ts
        │   ├── f10-dti-ratio.test.ts
        │   ├── f11-golden-fixture.test.ts
        │   ├── f12-reverse-solver.test.ts
        │   └── f13-public-contracts.test.ts
        ├── tier2-boundaries/         # Tier 2: Boundary & Corner Cases (>= 5 tests per feature)
        │   ├── boundary-amortization.test.ts
        │   ├── boundary-rates-terms.test.ts
        │   ├── boundary-cash-flow.test.ts
        │   ├── boundary-shocks.test.ts
        │   └── boundary-solver.test.ts
        ├── tier3-combinations/       # Tier 3: Cross-Feature Combinations (Pairwise matrix)
        │   └── pairwise-matrix.test.ts
        └── tier4-scenarios/          # Tier 4: Real-World Vietnamese Home Buyer Scenarios
            ├── scenario-hcm-young-couple.test.ts
            ├── scenario-hanoi-upgrading-family.test.ts
            ├── scenario-danang-investor-debt.test.ts
            ├── scenario-freelancer-suburb.test.ts
            └── scenario-conservative-cantho.test.ts
```

### 3.2 Test Runner Invocation

The test suite runs natively on Node.js 24 using the built-in test runner (`node:test`) with native TypeScript type stripping (`--experimental-strip-types` enabled by default in Node 24). It requires zero external dependencies, zero compilation steps, and executes in sub-second time.

**Commands:**

- **Run all E2E test suites with master summary table:**
  ```bash
  node tests/e2e/runner.ts
  ```

- **Run all E2E tests using Node's native test runner:**
  ```bash
  node --test tests/e2e/**/*.test.ts
  ```

- **Run a specific Tier:**
  ```bash
  node --test tests/e2e/tier1-features/*.test.ts
  node --test tests/e2e/tier2-boundaries/*.test.ts
  node --test tests/e2e/tier3-combinations/*.test.ts
  node --test tests/e2e/tier4-scenarios/*.test.ts
  ```

- **Run an individual test suite:**
  ```bash
  node --test tests/e2e/tier1-features/f11-golden-fixture.test.ts
  ```

---

## 4. Coverage Thresholds & Test Tiers

The DepositGuard test suite enforces strict numerical coverage thresholds:

| Tier | Category | Minimum Requirement | Actual Implemented | Target Scope |
|------|----------|---------------------|--------------------|--------------|
| **Tier 1** | Feature Coverage | $\ge 5$ test cases per feature | 65+ test cases across 13 suites | Primary user behavior, contracts, and outputs for all F01–F13 features in isolation. |
| **Tier 2** | Boundary & Corner Cases | $\ge 5$ test cases per feature | 35+ test cases across 5 suites | Extreme values, zero interest, zero income, 1-month loans, 35-year loans, closing deficits. |
| **Tier 3** | Cross-Feature Combinations | Pairwise interaction coverage | 12+ multi-variable scenarios | Orthogonal combinations of repayment methods, teaser cliffs, grace periods, and double shocks. |
| **Tier 4** | Real-World Application Scenarios | Complete end-to-end user journeys | 5 comprehensive Vietnamese profiles | Full simulation trajectories from property search to closing, rate resets, and reverse remedies. |
| **Tier 5** | Adversarial Hardening | Negative stress & security testing | Executed in Milestone M4 | Unicode fuzzing, extreme numeric overflow, timing, and privacy leakage defense. |

---

## 5. Real-World Application Scenarios (Tier 4 Specifications)

Tier 4 tests model authentic Vietnamese household home-purchase decisions with exact financial parameters:

### Scenario 1: Young Couple in Ho Chi Minh City (First-Time Buyers)
- **Profile:** First-time buyers purchasing an affordable 2-bedroom apartment in Thu Duc City.
- **Financial Inputs:**
  - Property Price: 2,800,000,000 VND (2.8 tỷ ₫)
  - Down Payment: 800,000,000 VND (28.57% equity)
  - Loan Amount: 2,000,000,000 VND (2.0 tỷ ₫)
  - Loan Term: 240 months (20 years)
  - Repayment Method: Equal Principal (dư nợ giảm dần)
  - Interest Rate: 6.8% promo for 12 months; 11.5% floating post-promo
  - Household Net Income: 45,000,000 VND / month
  - Essential Living Expenses: 22,000,000 VND / month
  - Existing Debt (wedding loan): 3,000,000 VND / month
  - Liquid Savings: 950,000,000 VND (leaves 150m reserve at closing)
  - Reserve Floor: 66,000,000 VND (3 months living expenses)
- **Opaque-Box Expected Outcomes:**
  - Month 1 payment: 19,666,667 VND (Principal 8.33m + Interest 11.33m)
  - Month 13 payment: 26,541,667 VND (+6.88m VND / +35.0% jump)
  - Month 13 Free Cash Flow: $-6,541,667$ VND (Cash-flow deficit triggered at Month 13 cliff)
  - Status Badge: `Thiếu hụt dòng tiền` (Cash deficit) under floating rate without reserve cushion

### Scenario 2: Family Upgrading in Hanoi (Urban Upgrade with Two Children)
- **Profile:** Middle-class family selling a smaller suburban flat to upgrade to a 3-bedroom unit in Cau Giay.
- **Financial Inputs:**
  - Property Price: 4,500,000,000 VND (4.5 tỷ ₫)
  - Down Payment: 1,800,000,000 VND (40% equity from sale proceeds)
  - Loan Amount: 2,700,000,000 VND (2.7 tỷ ₫)
  - Loan Term: 300 months (25 years)
  - Repayment Method: Annuity / Level Payment (trả góp đều)
  - Interest Rate: 7.5% promo for 24 months; 12.0% floating post-promo
  - Household Net Income: 75,000,000 VND / month
  - Essential Living Expenses: 40,000,000 VND / month
  - Existing Debt (car loan): 8,000,000 VND / month
  - Liquid Savings: 2,200,000,000 VND (leaves 400m reserve at closing)
  - Reserve Floor: 120,000,000 VND
  - Stress Test: Income shock of -20% for 6 months starting at Month 25 (concurrent with teaser cliff)
- **Opaque-Box Expected Outcomes:**
  - Month 1 payment: ~20,004,271 VND (Annuity at 7.5%)
  - Month 25 reset payment: ~29,036,549 VND (+45.2% jump)
  - Income drops to 60,000,000 VND during shock; Total outlays: 40m + 8m + 29.04m = 77.04m VND
  - Monthly deficit: $-17,036,549$ VND per month during shock
  - Emergency reserve absorbs deficit; reserve does not deplete to zero due to 400m closing cushion

### Scenario 3: Real Estate Investor in Da Nang with Existing Debt Portfolio
- **Profile:** Individual investor acquiring a townhouse in Da Nang with existing debt obligations and seeking a 12-month principal grace period.
- **Financial Inputs:**
  - Property Price: 3,500,000,000 VND (3.5 tỷ ₫)
  - Down Payment: 1,000,000,000 VND (28.57% equity)
  - Loan Amount: 2,500,000,000 VND (2.5 tỷ ₫)
  - Loan Term: 180 months (15 years)
  - Grace Period: 12 months (interest-only)
  - Repayment Method: Equal Principal
  - Interest Rate: 8.0% promo for 12 months; 13.0% floating post-promo
  - Household Net Income: 60,000,000 VND / month
  - Essential Living Expenses: 25,000,000 VND / month
  - Existing Business Debt: 15,000,000 VND / month
  - Liquid Savings: 1,150,000,000 VND (leaves 150m reserve)
- **Opaque-Box Expected Outcomes:**
  - Months 1–12 payment: 16,666,667 VND (Interest only at 8%)
  - Month 13 payment: 41,954,365 VND (Principal 14.88m + Interest 27.08m at 13%)
  - Total Month 13 Outlays: 25m essentials + 15m debt + 41.95m mortgage = 81.95m VND
  - Month 13 Net Cash Flow: $-21,954,365$ VND
  - Peak DTI: $(15\text{m} + 41.95\text{m}) / 60\text{m} = \mathbf{94.9\%}$

### Scenario 4: Tech Freelancer in Binh Duong (Variable Income & What-If Stress)
- **Profile:** Self-employed tech consultant with variable monthly income purchasing a suburban townhouse.
- **Financial Inputs:**
  - Property Price: 2,200,000,000 VND (2.2 tỷ ₫)
  - Down Payment: 700,000,000 VND
  - Loan Amount: 1,500,000,000 VND (1.5 tỷ ₫)
  - Loan Term: 240 months (20 years)
  - Repayment Method: Annuity
  - Promo Rate: 7.2% for 12 months; Post-promo rate: 11.8%
  - Base Net Income: 40,000,000 VND / month
  - Essential Expenses: 18,000,000 VND / month
  - Liquid Savings: 850,000,000 VND
  - Stress Test: Rate shock +4pp (post-promo rate 15.8%) combined with income shock (-20% for 6 months)
- **Opaque-Box Expected Outcomes:**
  - Reverse solver identifies maximum safe loan under +4pp stress to prevent deficit
  - Corrective lever advises reducing loan from 1.5B to safe ceiling (~1.12B VND) and providing 380m additional equity

### Scenario 5: Multi-Generational Household in Can Tho (Conservative Equity)
- **Profile:** Multi-generational family building a home with 50% equity and conservative financial leverage.
- **Financial Inputs:**
  - Property Price: 1,800,000,000 VND (1.8 tỷ ₫)
  - Down Payment: 900,000,000 VND (50% equity)
  - Loan Amount: 900,000,000 VND
  - Loan Term: 120 months (10 years)
  - Repayment Method: Equal Principal
  - Interest Rate: 7.0% promo for 12 months; 10.5% floating post-promo
  - Household Net Income: 35,000,000 VND / month
  - Essential Expenses: 16,000,000 VND / month
  - Existing Debt: 0 VND
  - Liquid Savings: 1,100,000,000 VND (leaves 200m reserve)
- **Opaque-Box Expected Outcomes:**
  - Month 1 payment: 12,750,000 VND; Month 13 payment: 14,962,500 VND
  - Cash flow remains positive in every month ($FCF \ge +4,037,500$ VND)
  - Status Badge: `Dư địa dự phòng an toàn` (Safe buffer)
  - Zero deficit months; reserve balance steadily increases over the 10-year term

---

## 6. Expected Output Derivation Methodology

Expected values are derived directly from explicit mathematical invariants:

1. **Equal Principal Debt Service:**
   $$P[m] = \text{round}\left(\frac{L}{N - G}\right) \quad (m > G, m < N), \quad P[N] = B[N-1]$$
   $$I[m] = \text{round}\left(B[m-1] \cdot \frac{r[m]}{12}\right)$$
   $$DS[m] = P[m] + I[m]$$

2. **Annuity (Level Payment) Formula:**
   $$A = B_{reset} \cdot \frac{i}{1 - (1 + i)^{-n_{rem}}} \quad \text{for } i = \frac{r}{12} > 0, \quad A = \frac{B_{reset}}{n_{rem}} \quad \text{for } i = 0$$
   $$I[m] = \text{round}\left(B[m-1] \cdot i\right)$$
   $$P[m] = \min\left(B[m-1], \max(0, \text{round}(A) - I[m])\right) \quad (m < N), \quad P[N] = B[N-1]$$

3. **Golden Fixture Reference ($L = 2\text{B}, N = 240, r_{promo} = 7\%, T_{promo} = 12, r_{float} = 12\%, Y = 55\text{m}, E = 30\text{m}$):**
   - $P = 8,333,333.33$ VND/mo
   - $DS[1] = 8,333,333.33 + 2,000,000,000 \cdot (0.07/12) = \mathbf{20,000,000.00 \text{ VND}}$
   - $B[12] = 2,000,000,000 - 12 \cdot 8,333,333.33 = 1,900,000,000.00$ VND
   - $DS[13] = 8,333,333.33 + 1,900,000,000 \cdot (0.12/12) = \mathbf{27,333,333.33 \text{ VND}}$
   - Available housing budget = $55\text{m} - 30\text{m} = 25,000,000$ VND
   - Month 13 FCF = $25\text{m} - 27.333\text{m} = \mathbf{-2,333,333.33 \text{ VND}}$ (First negative cash-flow month = **Month 13**)
   - Lowest reserve balance occurs at **Month 40** (cumulative deficit of 33,833,333 VND).
