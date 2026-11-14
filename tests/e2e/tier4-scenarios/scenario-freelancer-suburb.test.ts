import test from 'node:test';
import assert from 'node:assert';
import { runSimulation, solveReverseAffordability } from '../helpers/engine-adapter';
import { assertCurrencyClose, assertScheduleReconciliation } from '../helpers/assertions';
import type { LoanInput, HouseholdInput, StressScenarioInput } from '../helpers/test-types';

test('Tier 4: Scenario 4 — Tech Freelancer in Binh Duong / Suburban Metro (Variable Income)', async (t) => {
  const loan: LoanInput = {
    propertyPrice: 2_200_000_000, // 2.2 tỷ ₫
    downPayment: 700_000_000,     // 700 tr ₫
    loanAmount: 1_500_000_000,    // 1.5 tỷ ₫
    loanTermMonths: 240,          // 20 years
    repaymentMethod: 'ANNUITY',
    promoInterestRate: 7.2,       // 7.2% promo for 12m
    promoPeriodMonths: 12,
    postPromoRate: 11.8,          // 11.8% floating
  };

  const household: HouseholdInput = {
    monthlyNetIncome: 40_000_000,         // Average 40m VND
    essentialLivingExpenses: 18_000_000,  // Essentials 18m VND
    existingDebtPayments: 0,
    liquidSavings: 850_000_000,           // Leaves 150m buffer at closing
    plannedEmergencyReserveFloor: 54_000_000, // 3 months essentials
  };

  await t.test('1. Baseline simulation without stress shock shows vulnerable margin after reset', async () => {
    const res = await runSimulation(loan, household);
    // Initial reserve: 850m - 700m = 150,000,000 VND
    assert.strictEqual(res.initialReserveBalance, 150_000_000);

    // Month 1 payment (annuity at 7.2%): 11,810,239 VND
    assertCurrencyClose(res.month1Payment, 11_810_239, 5);

    // Month 13 post-promo reset (annuity at 11.8%): 16,141,027 VND
    assertCurrencyClose(res.postPromoPayment, 16_141_027, 5);

    // Baseline FCF after reset: 40m - 18m - 16.05m = +5.95m/mo (positive in baseline)
    assert.strictEqual(res.firstNegativeCashFlowMonth, null);
    assertScheduleReconciliation(res.schedule, loan.loanAmount);
  });

  await t.test('2. Combined Stress: +4pp Rate Shock (15.8%) and 6-Month Income Shock (-20%)', async () => {
    const combinedShock: StressScenarioInput = {
      rateShockPp: 4.0, // Floating rate jumps to 15.8%
      incomeShockPercent: -20.0, // Freelance income drops from 40m to 32m
      incomeShockDurationMonths: 6,
      incomeShockStartMonth: 13,
      expenseShockPercent: 0,
    };
    const res = await runSimulation(loan, household, combinedShock);

    // Month 13 post-promo reset under +4pp (15.8%): 20,320,695 VND
    assertCurrencyClose(res.postPromoPayment, 20_320_695, 10);

    // Outlays in Month 13: 18m essentials + 20.32m mortgage = 38.32m VND
    // Freelance income in Month 13: 32,000,000 VND
    // Monthly deficit: 32m - 38.32m = -6,320,695 VND
    assert.strictEqual(res.firstNegativeCashFlowMonth, 13);
    assertCurrencyClose(res.schedule[12].operatingCashFlow, -6_320_695, 10);
    assert.strictEqual(res.affordabilityStatus, 'DEFICIT');
  });

  await t.test('3. Reverse Affordability Solver provides actionable loan reduction remedy under stress', async () => {
    const combinedShock: StressScenarioInput = {
      rateShockPp: 4.0,
      incomeShockPercent: -20.0,
      incomeShockDurationMonths: 6,
      incomeShockStartMonth: 13,
      expenseShockPercent: 0,
    };

    const solverRes = await solveReverseAffordability(loan, household, combinedShock);
    // Solves maximum safe loan that keeps cash flow non-negative even during 6-month slump
    assert.ok(
      solverRes.maxSafeLoanAmount < loan.loanAmount,
      'Safe loan ceiling is strictly lower than 1.5B'
    );
    assert.ok(
      solverRes.additionalEquityNeeded > 0,
      'Identifies required extra equity'
    );
  });
});
