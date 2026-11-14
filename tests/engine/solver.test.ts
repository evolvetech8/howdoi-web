import { describe, it, expect } from 'vitest';
import {
  solveAffordability,
  calculateSimulation,
  LoanInput,
  HouseholdInput,
} from '@/lib/depositguard/engine';

describe('Reverse Affordability Solver (Binary Search)', () => {
  const baseLoan: LoanInput = {
    propertyPrice: 2_500_000_000,
    downPayment: 500_000_000,
    loanAmount: 2_000_000_000,
    loanTermMonths: 240,
    repaymentMethod: 'EQUAL_PRINCIPAL',
    promoInterestRate: 7.0,
    promoPeriodMonths: 12,
    postPromoRate: 12.0,
  };

  const baseHousehold: HouseholdInput = {
    monthlyNetIncome: 55_000_000,
    essentialLivingExpenses: 30_000_000,
    existingDebtPayments: 0,
    liquidSavings: 800_000_000,
  };

  it('1. Confirms monotonicity: peak debt service increases strictly monotonically with loan amount', () => {
    const candidateAmounts = [
      500_000_000,
      1_000_000_000,
      1_500_000_000,
      2_000_000_000,
      2_500_000_000,
    ];

    let lastMaxPayment = 0;
    for (const amount of candidateAmounts) {
      const sim = calculateSimulation({ ...baseLoan, loanAmount: amount }, baseHousehold);
      expect(sim.maxDebtServicePayment).toBeGreaterThan(lastMaxPayment);
      lastMaxPayment = sim.maxDebtServicePayment;
    }
  });

  it('2. Solves maximum safe loan for Golden Fixture budget (~1.829 Billion VND)', () => {
    // Budget: 55m - 30m = 25m/month
    const result = solveAffordability(baseLoan, baseHousehold);

    // Analytical derivation: 25,000,000 / (1/240 + (228/240) * 0.01) = 1,829,268,293 VND
    expect(result.maxSafeLoanAmount).toBeGreaterThan(1_829_000_000);
    expect(result.maxSafeLoanAmount).toBeLessThan(1_830_000_000);

    // Verify candidate at solved maxSafeLoanAmount has no cash flow deficit
    const safeSim = calculateSimulation(
      { ...baseLoan, loanAmount: result.maxSafeLoanAmount },
      baseHousehold
    );
    expect(safeSim.firstNegativeCashFlowMonth).toBeNull();

    // Verify candidate at (maxSafeLoanAmount + 2,000 VND) triggers deficit
    const breachSim = calculateSimulation(
      { ...baseLoan, loanAmount: result.maxSafeLoanAmount + 2_000 },
      baseHousehold
    );
    expect(breachSim.firstNegativeCashFlowMonth).not.toBeNull();
  });

  it('3. Accurately calculates financing gap and additional equity needed', () => {
    const result = solveAffordability(baseLoan, baseHousehold);

    const expectedEquityGap = baseLoan.loanAmount - result.maxSafeLoanAmount;
    expect(result.additionalEquityNeeded).toBe(expectedEquityGap);
    expect(result.financingGap).toBe(expectedEquityGap);
    expect(result.safePropertyPrice).toBe(baseLoan.downPayment + result.maxSafeLoanAmount);
  });

  it('4. Handles completely unaffordable scenario (essential expenses >= net income)', () => {
    const unaffordableHousehold: HouseholdInput = {
      monthlyNetIncome: 30_000_000,
      essentialLivingExpenses: 35_000_000, // Deficit before mortgage
      existingDebtPayments: 0,
      liquidSavings: 500_000_000,
    };

    const result = solveAffordability(baseLoan, unaffordableHousehold);

    expect(result.maxSafeLoanAmount).toBe(0);
    expect(result.additionalEquityNeeded).toBe(baseLoan.loanAmount);
    expect(result.safePropertyPrice).toBe(baseLoan.downPayment);
    expect(result.recommendedAction).toBe('UNSUSTAINABLE');
  });

  it('5. Evaluates liquid savings feasibility and recommends appropriate corrective action', () => {
    // Household with ample liquid savings: 1 Billion VND liquid savings
    // Down payment is 500m, equity gap is ~171m => Total cash needed ~671m <= 1B => Feasible!
    const wealthyHousehold: HouseholdInput = {
      ...baseHousehold,
      liquidSavings: 1_000_000_000,
    };

    const wealthyResult = solveAffordability(baseLoan, wealthyHousehold);
    expect(wealthyResult.canAffordWithCurrentLiquidSavings).toBe(true);
    expect(wealthyResult.recommendedAction).toBe('INCREASE_DOWN_PAYMENT');

    // Household with tight savings: exactly 500m (covers down payment only, no extra equity)
    const tightHousehold: HouseholdInput = {
      ...baseHousehold,
      liquidSavings: 500_000_000,
    };

    const tightResult = solveAffordability(baseLoan, tightHousehold);
    expect(tightResult.canAffordWithCurrentLiquidSavings).toBe(false);
    expect(['EXTEND_TERM', 'REDUCE_PRICE']).toContain(tightResult.recommendedAction);
  });
});
