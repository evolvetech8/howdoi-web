import { describe, it, expect } from 'vitest';
import { calculateSimulation, solveAffordability } from '@/lib/depositguard/engine';
import {
  DEFAULT_LOAN_INPUT,
  DEFAULT_HOUSEHOLD_INPUT,
  DEFAULT_STRESS_SCENARIO,
} from '@/lib/depositguard/context';
import { formatCompactVND, formatPercent } from '@/lib/depositguard/formatters';

describe('DepositGuard Results Dashboard & Golden Fixture UI Parity', () => {
  // Section 4.6 Golden Fixture
  const goldenLoan = { ...DEFAULT_LOAN_INPUT };
  const goldenHousehold = { ...DEFAULT_HOUSEHOLD_INPUT };

  it('calculates the Top 6 Metric Cards identically to the Golden Fixture', () => {
    const res = calculateSimulation(goldenLoan, goldenHousehold);

    // Card 1: Upfront cash required & initial reserve balance
    expect(res.upfrontCashRequired).toBe(500_000_000);
    expect(res.initialReserveBalance).toBe(200_000_000); // 700m - 500m

    // Card 2: Month 1 payment & free cash flow
    expect(res.month1Payment).toBe(20_000_000);
    const m1OperatingCashFlow = res.schedule[0].operatingCashFlow;
    expect(m1OperatingCashFlow).toBe(5_000_000); // 55m income - 30m essentials - 20m payment

    // Card 3: Post-promo payment jump
    expect(res.postPromoMonth).toBe(13);
    expect(res.postPromoPayment).toBe(27_333_333);
    // Month 12 payment was 19,465,277 VND, jump is 27,333,333 - 19,465,277 = 7,868,056 VND
    expect(res.paymentJumpAmount).toBe(7_868_056);
    expect(formatPercent(res.paymentJumpPercentage, 1)).toBe('40.4%');

    // Card 4: First cash-flow deficit month
    expect(res.firstNegativeCashFlowMonth).toBe(13);
    const m13Deficit = res.schedule[12].operatingCashFlow;
    expect(m13Deficit).toBe(-2_333_333); // 55m - 30m - 27.33m = -2.33m

    // Card 5: Lowest emergency reserve balance
    expect(res.lowestReserveBalance).toBeLessThanOrEqual(res.initialReserveBalance);
    expect(res.lowestReserveBalance).toBe(200_000_000);
    expect(res.lowestReserveMonth).toBe(0);

    // Card 6: DTI ratios
    expect(res.month1DtiRatio).not.toBeNull();
    const dtiMonth1 = formatPercent((res.month1DtiRatio as number) * 100, 1);
    expect(dtiMonth1).toBe('36.4%');

    expect(res.postPromoDtiRatio).not.toBeNull();
    const dtiPostPromo = formatPercent((res.postPromoDtiRatio as number) * 100, 1);
    expect(dtiPostPromo).toBe('49.7%');

    // Overall Risk Classification Status
    expect(res.affordabilityStatus).toBe('DEFICIT');
  });

  it('reacts in real time to What-If Stress Scenarios', () => {
    // 1. Rate shock +2pp (7% -> 12% + 2% = 14%)
    const shockPlus2 = calculateSimulation(goldenLoan, goldenHousehold, { rateShockPp: 2 });
    expect(shockPlus2.postPromoPayment).toBe(30_500_000);
    expect(shockPlus2.firstNegativeCashFlowMonth).toBe(13);

    // 2. Rate shock +4pp (7% -> 12% + 4% = 16%)
    const shockPlus4 = calculateSimulation(goldenLoan, goldenHousehold, { rateShockPp: 4 });
    expect(shockPlus4.postPromoPayment).toBe(33_666_666);

    // 3. Income shock -20% for 3 months starting month 13
    const incomeShock = calculateSimulation(goldenLoan, goldenHousehold, {
      incomeShockPercent: -20,
      incomeShockDurationMonths: 3,
      incomeShockStartMonth: 13,
    });
    const m13 = incomeShock.schedule[12];
    expect(m13.netIncome).toBe(44_000_000); // 55m * 0.8
    expect(m13.operatingCashFlow).toBe(-13_333_333); // 44m - 30m - 27.33m
  });

  it('computes actionable Corrective Levers via Reverse Affordability Solver', () => {
    const solver = solveAffordability(goldenLoan, goldenHousehold);
    expect(solver.maxSafeLoanAmount).toBeGreaterThan(0);
    expect(solver.maxSafeLoanAmount).toBeLessThan(goldenLoan.loanAmount);
    expect(solver.additionalEquityNeeded).toBeGreaterThan(0);
    expect(solver.additionalEquityNeeded).toBe(goldenLoan.loanAmount - solver.maxSafeLoanAmount);
    expect(solver.safePropertyPrice).toBe(solver.maxSafeLoanAmount + goldenLoan.downPayment);
  });

  it('safely handles zero income edge case without NaN or division by zero', () => {
    const zeroIncomeHousehold = { ...goldenHousehold, monthlyNetIncome: 0 };
    const res = calculateSimulation(goldenLoan, zeroIncomeHousehold);
    expect(res.month1DtiRatio).toBeNull();
    expect(res.postPromoDtiRatio).toBeNull();
    expect(res.affordabilityStatus).toBe('DEFICIT');
    expect(res.firstNegativeCashFlowMonth).toBe(1);
  });
});
