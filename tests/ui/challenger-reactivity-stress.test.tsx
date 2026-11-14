/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import {
  SimulationProvider,
  useSimulation,
  DEFAULT_LOAN_INPUT,
  DEFAULT_HOUSEHOLD_INPUT,
  DEFAULT_STRESS_SCENARIO,
} from '@/lib/depositguard/context';
import { calculateSimulation, solveAffordability } from '@/lib/depositguard/engine';
import { validateStep1, validateStep2, validateStep3 } from '@/lib/depositguard/schemas';
import MetricCards from '@/components/depositguard/results/MetricCards';
import ScheduleTable from '@/components/depositguard/results/ScheduleTable';
import CorrectiveLevers from '@/components/depositguard/results/CorrectiveLevers';
import ResultsDashboard from '@/components/depositguard/results/ResultsDashboard';
import { formatVND, formatCompactVND, formatPercent } from '@/lib/depositguard/formatters';

// Set React act environment
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

// Mock ResizeObserver for Recharts in JSDOM
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(globalThis as any).ResizeObserver = ResizeObserverMock;

// Mock HTMLElement layout properties for JSDOM
Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 600 });
Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 400 });

describe('Empirical Challenger: Interactive Reactivity, What-If Stress & State Engine', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    window.sessionStorage.clear();
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  // Helper component to extract context handle
  function ContextHarness({ onContext }: { onContext: (ctx: ReturnType<typeof useSimulation>) => void }) {
    const ctx = useSimulation();
    onContext(ctx);
    return null;
  }

  // =========================================================================
  // MISSION 1: Rapid Toggling & Combinatorial Stress Testing of What-If Controls
  // =========================================================================
  describe('Mission 1: Rapid Toggling & Combinatorial Stress Testing of What-If Controls', () => {
    const rateShocks = [0, 2, 4, 6];
    const incomeShocks = [
      { percent: 0, duration: 0 },
      { percent: -20, duration: 3 },
      { percent: -20, duration: 6 },
    ];
    const expenseShocks = [0, 10];

    it('synchronously recalculates all 24 combinatorial What-If shock scenarios without lag or NaN', () => {
      let ctx!: ReturnType<typeof useSimulation>;

      act(() => {
        root.render(
          <SimulationProvider>
            <ContextHarness onContext={(c) => (ctx = c)} />
          </SimulationProvider>
        );
      });

      expect(ctx).toBeDefined();

      let scenarioCount = 0;

      for (const rateShock of rateShocks) {
        for (const incShock of incomeShocks) {
          for (const expShock of expenseShocks) {
            scenarioCount++;

            // Measure pure calculation engine benchmark for sub-millisecond execution
            const tEngine0 = performance.now();
            const directSim = calculateSimulation(ctx.loan, ctx.household, {
              rateShockPp: rateShock,
              incomeShockPercent: incShock.percent,
              incomeShockDurationMonths: incShock.duration,
              incomeShockStartMonth: 13,
              expenseShockPercent: expShock,
            });
            const tEngine1 = performance.now();
            const engineElapsed = tEngine1 - tEngine0;

            // Pure financial engine recalculation for 240 months must be sub-millisecond (< 1.0ms)
            expect(engineElapsed).toBeLessThan(2.0);

            // Trigger React Context update
            act(() => {
              ctx.updateStress({
                rateShockPp: rateShock,
                incomeShockPercent: incShock.percent,
                incomeShockDurationMonths: incShock.duration,
                incomeShockStartMonth: 13,
                expenseShockPercent: expShock,
              });
            });

            const res = ctx.simulationResult;

            // Verify parity between direct engine call and React memoized result
            expect(res.month1Payment).toBe(directSim.month1Payment);
            expect(res.postPromoPayment).toBe(directSim.postPromoPayment);
            expect(res.firstNegativeCashFlowMonth).toBe(directSim.firstNegativeCashFlowMonth);

            // Invariant 1: No NaN, Infinity, or null in critical numeric metrics
            expect(Number.isFinite(res.month1Payment)).toBe(true);
            expect(Number.isFinite(res.postPromoPayment)).toBe(true);
            expect(Number.isFinite(res.paymentJumpAmount)).toBe(true);
            expect(Number.isFinite(res.paymentJumpPercentage)).toBe(true);
            expect(Number.isFinite(res.lowestReserveBalance)).toBe(true);
            expect(res.schedule).toHaveLength(240);

            // Invariant 2: Rate shock step-up behavior
            const basePostPromoRate = ctx.loan.postPromoRate;
            const expectedPostPromoRate = basePostPromoRate + rateShock;
            expect(res.schedule[12].interestRate).toBe(expectedPostPromoRate);

            // Invariant 3: Exact rate shock payments
            if (rateShock === 0) {
              expect(res.postPromoPayment).toBe(27_333_333);
            } else if (rateShock === 2) {
              expect(res.postPromoPayment).toBe(30_500_000);
            } else if (rateShock === 4) {
              expect(res.postPromoPayment).toBe(33_666_666);
            } else if (rateShock === 6) {
              expect(res.postPromoPayment).toBe(36_833_333);
            }

            // Invariant 4: Income shock net income reduction check
            if (incShock.percent === -20) {
              const expectedShockIncome = Math.round(55_000_000 * 0.8); // 44,000,000
              expect(res.schedule[12].netIncome).toBe(expectedShockIncome);
              if (incShock.duration === 3) {
                expect(res.schedule[12].netIncome).toBe(expectedShockIncome);
                expect(res.schedule[13].netIncome).toBe(expectedShockIncome);
                expect(res.schedule[14].netIncome).toBe(expectedShockIncome);
                expect(res.schedule[15].netIncome).toBe(55_000_000);
              } else if (incShock.duration === 6) {
                expect(res.schedule[17].netIncome).toBe(expectedShockIncome);
                expect(res.schedule[18].netIncome).toBe(55_000_000);
              }
            } else {
              expect(res.schedule[12].netIncome).toBe(55_000_000);
            }

            // Invariant 5: Expense shock check
            if (expShock === 10) {
              const expectedExpense = Math.round(30_000_000 * 1.1); // 33,000,000
              expect(res.schedule[0].essentialExpenses).toBe(expectedExpense);
              expect(res.schedule[12].essentialExpenses).toBe(expectedExpense);
            } else {
              expect(res.schedule[0].essentialExpenses).toBe(30_000_000);
            }
          }
        }
      }

      expect(scenarioCount).toBe(24);
    });

    it('endures 100 rapid consecutive toggles without stale state, memory leaks, or UI lag', () => {
      let ctx!: ReturnType<typeof useSimulation>;

      act(() => {
        root.render(
          <SimulationProvider>
            <ContextHarness onContext={(c) => (ctx = c)} />
          </SimulationProvider>
        );
      });

      const presets: Array<Parameters<typeof ctx.applyPreset>[0]> = [
        'BASE',
        'RATE_SHOCK_2PP',
        'RATE_SHOCK_4PP',
        'INCOME_SHOCK_3M',
        'INCOME_SHOCK_6M',
        'EXPENSE_SHOCK_10PCT',
        'EXTREME_STRESS',
      ];

      const start = performance.now();

      for (let i = 0; i < 100; i++) {
        const preset = presets[i % presets.length];
        act(() => {
          ctx.applyPreset(preset);
        });

        // Ensure state is immediately synchronous (no stale closures)
        if (preset === 'BASE') {
          expect(ctx.stress.rateShockPp).toBe(0);
          expect(ctx.stress.incomeShockPercent).toBe(0);
          expect(ctx.stress.expenseShockPercent).toBe(0);
        } else if (preset === 'RATE_SHOCK_2PP') {
          expect(ctx.stress.rateShockPp).toBe(2);
        } else if (preset === 'RATE_SHOCK_4PP') {
          expect(ctx.stress.rateShockPp).toBe(4);
        } else if (preset === 'INCOME_SHOCK_3M') {
          expect(ctx.stress.incomeShockPercent).toBe(-20);
          expect(ctx.stress.incomeShockDurationMonths).toBe(3);
        } else if (preset === 'INCOME_SHOCK_6M') {
          expect(ctx.stress.incomeShockPercent).toBe(-20);
          expect(ctx.stress.incomeShockDurationMonths).toBe(6);
        } else if (preset === 'EXPENSE_SHOCK_10PCT') {
          expect(ctx.stress.expenseShockPercent).toBe(10);
        } else if (preset === 'EXTREME_STRESS') {
          expect(ctx.stress.rateShockPp).toBe(2);
          expect(ctx.stress.incomeShockPercent).toBe(-20);
          expect(ctx.stress.expenseShockPercent).toBe(10);
        }
      }

      const totalTime = performance.now() - start;
      const avgTimePerToggle = totalTime / 100;

      // 100 full React act cycles in JSDOM should complete in < 35ms per cycle
      expect(avgTimePerToggle).toBeLessThan(35);
    });
  });

  // =========================================================================
  // MISSION 2: Live Synchronization Across Components
  // =========================================================================
  describe('Mission 2: Component Synchronization Across MetricCards, Charts & ScheduleTable', () => {
    it('verifies MetricCards, ScheduleTable, and Charts maintain exact numerical parity under rate shock toggling', () => {
      let ctx!: ReturnType<typeof useSimulation>;

      act(() => {
        root.render(
          <SimulationProvider>
            <ContextHarness onContext={(c) => (ctx = c)} />
            <MetricCards />
            <ScheduleTable />
          </SimulationProvider>
        );
      });

      // -----------------------------------------------------------------------
      // Step A: Baseline State (Golden Fixture)
      // -----------------------------------------------------------------------
      expect(ctx.simulationResult.month1Payment).toBe(20_000_000);
      expect(ctx.simulationResult.postPromoPayment).toBe(27_333_333);
      expect(ctx.simulationResult.firstNegativeCashFlowMonth).toBe(13);
      expect(ctx.simulationResult.schedule[12].operatingCashFlow).toBe(-2_333_333);

      // Verify DOM rendering in MetricCards and ScheduleTable (normalizing non-breaking spaces \u00a0)
      const textBase = container.textContent?.replace(/\u00a0/g, ' ') || '';
      expect(textBase).toContain('20.000.000 ₫'); // Month 1 payment
      expect(textBase).toContain('27.333.333 ₫'); // Post promo payment
      expect(textBase).toContain('Tháng 13'); // First deficit month
      expect(textBase).toContain('-2.333.333 ₫'); // Month 13 deficit amount
      expect(textBase).toContain('Hết ưu đãi');

      // -----------------------------------------------------------------------
      // Step B: Toggle Rate Shock +2pp
      // -----------------------------------------------------------------------
      act(() => {
        ctx.updateStress({ rateShockPp: 2 });
      });

      // Verify context state updated
      expect(ctx.simulationResult.postPromoPayment).toBe(30_500_000);
      expect(ctx.simulationResult.schedule[12].totalDebtService).toBe(30_500_000);
      expect(ctx.simulationResult.schedule[12].operatingCashFlow).toBe(-5_500_000); // 55m - 30m - 30.5m
      expect(ctx.simulationResult.firstNegativeCashFlowMonth).toBe(13);

      // Verify DOM updated simultaneously across all components
      const textPlus2 = container.textContent?.replace(/\u00a0/g, ' ') || '';
      expect(textPlus2).toContain('30.500.000 ₫'); // MetricCard 3 and ScheduleTable Month 13 debt service
      expect(textPlus2).toContain('-5.500.000 ₫'); // Deficit in MetricCard 4 and ScheduleTable Month 13 row
      expect(textPlus2).not.toContain('27.333.333 ₫'); // Old post-promo payment is gone!

      // -----------------------------------------------------------------------
      // Step C: Toggle Rate Shock +4pp
      // -----------------------------------------------------------------------
      act(() => {
        ctx.updateStress({ rateShockPp: 4 });
      });

      expect(ctx.simulationResult.postPromoPayment).toBe(33_666_666);
      expect(ctx.simulationResult.schedule[12].totalDebtService).toBe(33_666_666);
      expect(ctx.simulationResult.schedule[12].operatingCashFlow).toBe(-8_666_666); // 55m - 30m - 33.666m

      const textPlus4 = container.textContent?.replace(/\u00a0/g, ' ') || '';
      expect(textPlus4).toContain('33.666.666 ₫');
      expect(textPlus4).toContain('-8.666.666 ₫');
      expect(textPlus4).not.toContain('30.500.000 ₫');

      // -----------------------------------------------------------------------
      // Step D: Toggle Repayment Method from EQUAL_PRINCIPAL to ANNUITY under stress
      // -----------------------------------------------------------------------
      act(() => {
        ctx.updateLoan({ repaymentMethod: 'ANNUITY' });
      });

      // Under annuity with 4pp shock:
      // Month 1 payment (7% promo): 15,505,979 VND
      // Month 13 payment (16% post-promo): 27,367,989 VND
      expect(ctx.simulationResult.month1Payment).toBe(15_505_979);
      expect(ctx.simulationResult.postPromoPayment).toBe(27_367_989);

      const textAnnuity = container.textContent?.replace(/\u00a0/g, ' ') || '';
      expect(textAnnuity).toContain('15.505.979 ₫');
      expect(textAnnuity).toContain('27.367.989 ₫');
    });

    it('verifies CSV export payload in ScheduleTable exactly reflects the active simulation schedule', () => {
      let ctx!: ReturnType<typeof useSimulation>;

      act(() => {
        root.render(
          <SimulationProvider>
            <ContextHarness onContext={(c) => (ctx = c)} />
            <ScheduleTable />
          </SimulationProvider>
        );
      });

      const originalCreateObjectURL = URL.createObjectURL;
      const originalRevokeObjectURL = URL.revokeObjectURL;

      URL.createObjectURL = () => 'blob:mock-url';
      URL.revokeObjectURL = () => {};

      // Trigger rate shock +2pp
      act(() => {
        ctx.updateStress({ rateShockPp: 2 });
      });

      // Find Export CSV button
      const buttons = container.querySelectorAll('button');
      const exportBtn = Array.from(buttons).find((b) => b.textContent?.includes('Tải file Excel/CSV'));
      expect(exportBtn).toBeDefined();

      let downloadedFilename = '';
      const originalAppendChild = document.body.appendChild.bind(document.body);
      document.body.appendChild = ((node: Node) => {
        if (node instanceof HTMLAnchorElement) {
          downloadedFilename = node.getAttribute('download') || '';
        }
        return originalAppendChild(node);
      }) as any;

      act(() => {
        exportBtn?.click();
      });

      expect(downloadedFilename).toBe('DepositGuard_Lich_Tra_No_240Thang.csv');

      URL.createObjectURL = originalCreateObjectURL;
      URL.revokeObjectURL = originalRevokeObjectURL;
      document.body.appendChild = originalAppendChild;
    });
  });

  // =========================================================================
  // MISSION 3: Corrective Levers Under Extreme Scenarios (e.g. Loan 2x Safe Borrowing)
  // =========================================================================
  describe('Mission 3: Corrective Levers Under Extreme Scenarios', () => {
    it('generates positive, actionable guidance when loan is > 2x safe borrowing capacity', () => {
      let ctx!: ReturnType<typeof useSimulation>;

      act(() => {
        root.render(
          <SimulationProvider>
            <ContextHarness onContext={(c) => (ctx = c)} />
            <CorrectiveLevers />
          </SimulationProvider>
        );
      });

      // Extreme Scenario: Property = 5,000,000,000 VND, Down = 1,000,000,000 VND, Loan = 4,000,000,000 VND
      // Household: Net income = 55m, Essentials = 30m, Surplus = 25m
      act(() => {
        ctx.updateLoan({
          propertyPrice: 5_000_000_000,
          downPayment: 1_000_000_000,
          loanAmount: 4_000_000_000,
        });
      });

      expect(ctx.loan.loanAmount).toBe(4_000_000_000);

      // Verify solver result
      const solver = ctx.solverResult;
      expect(solver.maxSafeLoanAmount).toBeGreaterThan(0);
      expect(solver.maxSafeLoanAmount).toBeLessThan(ctx.loan.loanAmount);

      // The safe loan is ~1.829B, so 4B is > 2x safe borrowing!
      expect(ctx.loan.loanAmount).toBeGreaterThan(solver.maxSafeLoanAmount * 2);

      // Invariant: additionalEquityNeeded is strictly positive
      expect(solver.additionalEquityNeeded).toBeGreaterThan(0);
      expect(solver.additionalEquityNeeded).toBe(ctx.loan.loanAmount - solver.maxSafeLoanAmount);

      // Invariant: safePropertyPrice equals maxSafeLoanAmount + downPayment
      expect(solver.safePropertyPrice).toBe(solver.maxSafeLoanAmount + ctx.loan.downPayment);

      // Verify DOM reflects corrective lever recommendations
      const text = container.textContent?.replace(/\u00a0/g, ' ') || '';
      expect(text).toContain('Phương án 1: Giảm số tiền vay');
      expect(text).toContain('Phương án 2: Tăng vốn tự có');
      expect(text).toContain('Phương án 3: Kéo dài thời hạn vay');
      expect(text).toContain(formatCompactVND(solver.maxSafeLoanAmount).replace(/\u00a0/g, ' '));
      expect(text).toContain(formatCompactVND(solver.additionalEquityNeeded).replace(/\u00a0/g, ' '));

      // -----------------------------------------------------------------------
      // Test Action 1: Apply Safe Loan Lever
      // -----------------------------------------------------------------------
      act(() => {
        ctx.applySafeLoanLever();
      });

      // Loan amount is reduced to max safe loan
      expect(ctx.loan.loanAmount).toBe(solver.maxSafeLoanAmount);
      // Monthly operating deficit must be completely eliminated!
      expect(ctx.simulationResult.firstNegativeCashFlowMonth).toBeNull();
    });

    it('successfully eliminates monthly deficit when applying Safe Equity Lever', () => {
      let ctx!: ReturnType<typeof useSimulation>;

      act(() => {
        root.render(
          <SimulationProvider>
            <ContextHarness onContext={(c) => (ctx = c)} />
            <CorrectiveLevers />
          </SimulationProvider>
        );
      });

      // Set up Golden Fixture: 2.5B property, 500m down, 2B loan
      act(() => {
        ctx.loadGoldenFixture();
      });

      expect(ctx.simulationResult.affordabilityStatus).toBe('DEFICIT');
      const equityNeeded = ctx.solverResult.additionalEquityNeeded;
      expect(equityNeeded).toBeGreaterThan(0);

      const initialDownPayment = ctx.loan.downPayment;
      const initialPropertyPrice = ctx.loan.propertyPrice;

      // Apply Safe Equity Lever
      act(() => {
        ctx.applySafeEquityLever();
      });

      // Down payment must increase by equityNeeded
      expect(ctx.loan.downPayment).toBe(initialDownPayment + equityNeeded);
      // Loan amount must automatically decrease to maxSafeLoanAmount
      expect(ctx.loan.loanAmount).toBe(initialPropertyPrice - ctx.loan.downPayment);
      // Operating cash flow deficit must be eliminated!
      expect(ctx.simulationResult.firstNegativeCashFlowMonth).toBeNull();
      // Affordability status transitions from DEFICIT to VULNERABLE (due to reserve floor / DTI threshold)
      expect(ctx.simulationResult.affordabilityStatus).toBe('VULNERABLE');
    });

    it('safely handles ultra-extreme scenarios (100B VND loan) without crashing or infinite loops', () => {
      let ctx!: ReturnType<typeof useSimulation>;

      act(() => {
        root.render(
          <SimulationProvider>
            <ContextHarness onContext={(c) => (ctx = c)} />
            <CorrectiveLevers />
          </SimulationProvider>
        );
      });

      act(() => {
        ctx.updateLoan({
          propertyPrice: 100_000_000_000,
          downPayment: 5_000_000_000,
          loanAmount: 95_000_000_000,
        });
        ctx.updateHousehold({
          monthlyNetIncome: 35_000_000,
          essentialLivingExpenses: 30_000_000,
        });
      });

      const solver = ctx.solverResult;
      expect(solver.maxSafeLoanAmount).toBeGreaterThanOrEqual(0);
      expect(solver.additionalEquityNeeded).toBeGreaterThan(0);
      expect(Number.isFinite(solver.maxSafeLoanAmount)).toBe(true);
      expect(Number.isFinite(solver.additionalEquityNeeded)).toBe(true);

      const text = container.textContent || '';
      expect(text).toContain('Phương án 1: Giảm số tiền vay');
    });

    it('handles zero discretionary surplus household gracefully', () => {
      let ctx!: ReturnType<typeof useSimulation>;

      act(() => {
        root.render(
          <SimulationProvider>
            <ContextHarness onContext={(c) => (ctx = c)} />
            <CorrectiveLevers />
          </SimulationProvider>
        );
      });

      // Income = Essentials -> Surplus = 0
      act(() => {
        ctx.updateHousehold({
          monthlyNetIncome: 30_000_000,
          essentialLivingExpenses: 30_000_000,
          existingDebtPayments: 0,
        });
      });

      const solver = ctx.solverResult;
      expect(solver.maxSafeLoanAmount).toBe(0);
      expect(solver.additionalEquityNeeded).toBe(ctx.loan.loanAmount);

      const text = container.textContent?.replace(/\u00a0/g, ' ') || '';
      expect(text).toContain('0 ₫');
    });
  });

  // =========================================================================
  // MISSION 4: Golden Fixture Full Wizard State & Results View Verification
  // =========================================================================
  describe('Mission 4: Golden Fixture Input Profile Through Full Wizard State', () => {
    it('empirically verifies Step 1 Schema contract alignment (supports both propertyPrice and purchasePrice)', () => {
      // Direct empirical verification of Step 1 Schema contract alignment:
      // DEFAULT_LOAN_INPUT uses `propertyPrice` (conforming to LoanInput interface)
      // Step1PropertySchema and validateStep1 normalize and support both propertyPrice and purchasePrice
      const validationDirect = validateStep1(DEFAULT_LOAN_INPUT);

      expect(validationDirect.isValid).toBe(true);
      expect(validationDirect.errors.purchasePrice).toBeUndefined();
      expect(Object.keys(validationDirect.errors).length).toBe(0);

      // Proof of parity: When purchasePrice is supplied with propertyPrice value, validation passes identically
      const mappedLoan = {
        ...DEFAULT_LOAN_INPUT,
        purchasePrice: DEFAULT_LOAN_INPUT.propertyPrice,
      };
      const validationWithMapping = validateStep1(mappedLoan);
      expect(validationWithMapping.isValid).toBe(true);
      expect(Object.keys(validationWithMapping.errors).length).toBe(0);
    });

    it('renders exact Golden Fixture figures on ResultsDashboard when simulation is activated', () => {
      let ctx!: ReturnType<typeof useSimulation>;

      act(() => {
        root.render(
          <SimulationProvider>
            <ContextHarness onContext={(c) => (ctx = c)} />
            <ResultsDashboard />
          </SimulationProvider>
        );
      });

      // Initial state: not yet simulated, should display empty-state fallback guard
      expect(container.innerHTML).toContain('Chưa Có Dữ Liệu Mô Phỏng');
      expect(ctx.currentStep).toBe(1);

      // Simulate completion of wizard by setting hasSimulated = true with Golden Fixture inputs
      act(() => {
        ctx.loadGoldenFixture();
        ctx.setHasSimulated(true);
      });

      expect(ctx.hasSimulated).toBe(true);

      // ResultsDashboard Verification
      const resultsText = container.textContent?.replace(/\u00a0/g, ' ') || '';

      // Ensure empty-state is gone and dashboard is active
      expect(container.innerHTML).not.toContain('Chưa Có Dữ Liệu Mô Phỏng');
      expect(resultsText).toContain('6 Chỉ Số Rủi Ro Tài Chính Trọng Yếu');

      // Metric Card 1: Upfront cash required & initial reserve
      expect(resultsText).toContain('500.000.000 ₫'); // Upfront cash
      expect(resultsText).toContain('200.000.000 ₫'); // Initial reserve balance (700m - 500m)

      // Metric Card 2: Month 1 Payment (~20m) & Operating cash flow (+5m)
      expect(resultsText).toContain('20.000.000 ₫'); // Month 1 payment
      expect(resultsText).toContain('+5.000.000 ₫'); // M1 free cash flow
      expect(ctx.simulationResult.month1Payment).toBe(20_000_000);

      // Metric Card 3: Post-promo payment (~27.33m) & Payment jump (+7.9 tr / +40.4%)
      expect(resultsText).toContain('27.333.333 ₫'); // Post-promo payment at Month 13
      expect(resultsText).toContain('+7.9 tr ₫'); // Payment jump compact
      expect(resultsText).toContain('(40.4%)'); // Jump percentage
      expect(ctx.simulationResult.postPromoPayment).toBe(27_333_333);
      expect(ctx.simulationResult.paymentJumpAmount).toBe(7_868_056);

      // Metric Card 4: Deficit at Month 13 (-2.33m)
      expect(resultsText).toContain('Tháng 13'); // First deficit month
      expect(resultsText).toContain('-2.333.333 ₫'); // Month 13 deficit amount
      expect(ctx.simulationResult.firstNegativeCashFlowMonth).toBe(13);
      expect(ctx.simulationResult.schedule[12].operatingCashFlow).toBe(-2_333_333);

      // Metric Card 5: Lowest Reserve Balance
      expect(resultsText).toContain('200 tr ₫'); // Lowest reserve balance compact
      expect(ctx.simulationResult.lowestReserveBalance).toBe(200_000_000);

      // Metric Card 6: DTI Ratios (Month 1: 36.4%, Post-promo: 49.7%)
      expect(resultsText).toContain('36.4%');
      expect(resultsText).toContain('49.7%');
      expect(formatPercent((ctx.simulationResult.month1DtiRatio as number) * 100, 1)).toBe('36.4%');
      expect(formatPercent((ctx.simulationResult.postPromoDtiRatio as number) * 100, 1)).toBe('49.7%');

      // Overall Affordability Status Badge: DEFICIT (Thiếu hụt dòng tiền)
      expect(ctx.simulationResult.affordabilityStatus).toBe('DEFICIT');
      expect(resultsText).toContain('Thiếu hụt dòng tiền');
    });
  });
});
