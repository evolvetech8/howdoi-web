import { describe, it, expect } from 'vitest';
import { calculateSimulation, LoanInput, HouseholdInput } from '@/lib/depositguard/engine';

describe('Golden Fixture Verification (Section 4.6)', () => {
  const goldenLoan: LoanInput = {
    propertyPrice: 2_500_000_000,
    downPayment: 500_000_000,
    loanAmount: 2_000_000_000,
    loanTermMonths: 240,
    repaymentMethod: 'EQUAL_PRINCIPAL',
    promoInterestRate: 7.0,
    promoPeriodMonths: 12,
    postPromoRate: 12.0,
    gracePeriodMonths: 0,
  };

  const goldenHousehold: HouseholdInput = {
    monthlyNetIncome: 55_000_000,
    essentialLivingExpenses: 30_000_000,
    existingDebtPayments: 0,
    liquidSavings: 700_000_000,
  };

  it('1. Verifies Month 1 payment is ~20m VND (exact 20,000,000 VND) and DTI is ~36.36%', () => {
    const res = calculateSimulation(goldenLoan, goldenHousehold);

    expect(res.month1Payment).toBe(20_000_000);
    expect(res.schedule[0].principalPayment).toBe(8_333_333);
    expect(res.schedule[0].interestPayment).toBe(11_666_667);
    expect(res.schedule[0].totalDebtService).toBe(20_000_000);
    expect(res.schedule[0].operatingCashFlow).toBe(5_000_000); // 55m - 30m - 20m = +5m
    expect(res.month1DtiRatio).toBeCloseTo(20_000_000 / 55_000_000, 4);
  });

  it('2. Verifies Month 12 payment and accumulated surplus prior to reset', () => {
    const res = calculateSimulation(goldenLoan, goldenHousehold);
    const m12 = res.schedule[11];

    expect(m12.principalPayment).toBe(8_333_333);
    expect(m12.interestPayment).toBe(11_131_944);
    expect(m12.totalDebtService).toBe(19_465_277);
    expect(m12.operatingCashFlow).toBe(5_534_723);
    expect(m12.isDeficit).toBe(false);
  });

  it('3. Verifies Month 13 payment jump to ~27.33m VND (exact 27,333,333 VND) and post-promo jump calculation', () => {
    const res = calculateSimulation(goldenLoan, goldenHousehold);

    expect(res.postPromoMonth).toBe(13);
    expect(res.postPromoPayment).toBe(27_333_333);
    expect(res.paymentJumpAmount).toBe(27_333_333 - 19_465_277); // +7,868,056 VND
    expect(res.paymentJumpPercentage).toBeCloseTo((7_868_056 / 19_465_277) * 100, 2); // +40.42%
    expect(res.postPromoDtiRatio).toBeCloseTo(27_333_333 / 55_000_000, 4); // ~49.70%
  });

  it('4. Identifies first negative cash-flow month exactly at Month 13', () => {
    const res = calculateSimulation(goldenLoan, goldenHousehold);

    expect(res.firstNegativeCashFlowMonth).toBe(13);
    expect(res.schedule[11].operatingCashFlow).toBeGreaterThan(0);
    expect(res.schedule[12].operatingCashFlow).toBe(-2_333_333); // 55m - 30m - 27.333m = -2.333m
    expect(res.schedule[12].isDeficit).toBe(true);
  });

  it('5. Verifies deficit trajectory spans Months 13 to 40 and deficit clears at Month 41', () => {
    const res = calculateSimulation(goldenLoan, goldenHousehold);

    // Deficit active through Month 40
    expect(res.schedule[39].month).toBe(40);
    expect(res.schedule[39].totalDebtService).toBe(25_083_333);
    expect(res.schedule[39].operatingCashFlow).toBe(-83_333);
    expect(res.schedule[39].isDeficit).toBe(true);

    // Month 41: debt service hits exactly 25,000,000 VND, breaking even
    expect(res.schedule[40].month).toBe(41);
    expect(res.schedule[40].totalDebtService).toBe(25_000_000);
    expect(res.schedule[40].operatingCashFlow).toBe(0);
    expect(res.schedule[40].isDeficit).toBe(false);

    // Month 42: surplus returns
    expect(res.schedule[41].month).toBe(42);
    expect(res.schedule[41].operatingCashFlow).toBe(83_334);
    expect(res.schedule[41].isDeficit).toBe(false);
  });

  it('6. Verifies exact terminal balance reconciliation to 0 VND and total principal repaid', () => {
    const res = calculateSimulation(goldenLoan, goldenHousehold);

    expect(res.schedule).toHaveLength(240);
    const finalMonth = res.schedule[239];
    expect(finalMonth.endingBalance).toBe(0);

    const totalPrincipal = res.schedule.reduce((acc, m) => acc + m.principalPayment, 0);
    expect(totalPrincipal).toBe(2_000_000_000);
  });
});
