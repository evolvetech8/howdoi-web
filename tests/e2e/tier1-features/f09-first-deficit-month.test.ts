import test from 'node:test';
import assert from 'node:assert';
import { runSimulation } from '../helpers/engine-adapter';
import type { LoanInput, HouseholdInput, StressScenarioInput } from '../helpers/test-types';

test('F09: First Negative Cash-Flow Month Detection', async (t) => {
  const goldenLoan: LoanInput = {
    propertyPrice: 2_500_000_000,
    downPayment: 500_000_000,
    loanAmount: 2_000_000_000,
    loanTermMonths: 240,
    repaymentMethod: 'EQUAL_PRINCIPAL',
    promoInterestRate: 7.0,
    promoPeriodMonths: 12,
    postPromoRate: 12.0,
  };

  const goldenHousehold: HouseholdInput = {
    monthlyNetIncome: 55_000_000,
    essentialLivingExpenses: 30_000_000,
    existingDebtPayments: 0,
    liquidSavings: 700_000_000,
  };

  await t.test('1. Golden Fixture: Identifies first negative operating cash-flow month at Month 13', async () => {
    const res = await runSimulation(goldenLoan, goldenHousehold);
    assert.strictEqual(
      res.firstNegativeCashFlowMonth,
      13,
      'First negative cash flow month must be 13 for Golden Fixture'
    );
    assert.ok(res.schedule[11].operatingCashFlow > 0, 'Month 12 cash flow must be positive');
    assert.ok(res.schedule[12].operatingCashFlow < 0, 'Month 13 cash flow must be negative');
  });

  await t.test('2. Returns null when cash flow is positive across all months', async () => {
    const highIncomeHousehold: HouseholdInput = {
      monthlyNetIncome: 80_000_000,
      essentialLivingExpenses: 25_000_000,
      existingDebtPayments: 0,
      liquidSavings: 800_000_000,
    };
    const res = await runSimulation(goldenLoan, highIncomeHousehold);
    assert.strictEqual(
      res.firstNegativeCashFlowMonth,
      null,
      'First deficit month must be null when cash flow remains positive'
    );
  });

  await t.test('3. Detects immediate deficit at Month 1 when living costs exceed initial cash flow', async () => {
    const lowIncomeHousehold: HouseholdInput = {
      monthlyNetIncome: 35_000_000,
      essentialLivingExpenses: 20_000_000,
      existingDebtPayments: 0,
      liquidSavings: 600_000_000,
    };
    // Month 1 payment = 20m. Total outlays = 20m + 20m = 40m > 35m income
    const res = await runSimulation(goldenLoan, lowIncomeHousehold);
    assert.strictEqual(res.firstNegativeCashFlowMonth, 1, 'First deficit month must be 1');
  });

  await t.test('4. Detects deficit triggered exclusively by income shock', async () => {
    const comfortableHousehold: HouseholdInput = {
      monthlyNetIncome: 60_000_000,
      essentialLivingExpenses: 30_000_000,
      existingDebtPayments: 0,
      liquidSavings: 700_000_000,
    };
    // Base scenario: Month 13 payment ~27.33m. Available budget = 30m. FCF = +2.67m (no deficit)
    const baseRes = await runSimulation(goldenLoan, comfortableHousehold);
    assert.strictEqual(baseRes.firstNegativeCashFlowMonth, null, 'No deficit under base scenario');

    // With -20% income shock starting at month 13 (income drops from 60m to 48m)
    // Available budget = 48m - 30m = 18m < 27.33m => Deficit triggered!
    const shockRes = await runSimulation(goldenLoan, comfortableHousehold, {
      rateShockPp: 0,
      incomeShockPercent: -20.0,
      incomeShockDurationMonths: 6,
      incomeShockStartMonth: 13,
      expenseShockPercent: 0,
    });
    assert.strictEqual(
      shockRes.firstNegativeCashFlowMonth,
      13,
      'Deficit triggered at month 13 by income shock'
    );
  });

  await t.test('5. First negative cash flow month matches earliest isDeficit row in schedule', async () => {
    const res = await runSimulation(goldenLoan, goldenHousehold);
    const earliestDeficitIndex = res.schedule.findIndex((item) => item.isDeficit);
    assert.ok(earliestDeficitIndex !== -1, 'Deficit row must exist');
    assert.strictEqual(res.firstNegativeCashFlowMonth, res.schedule[earliestDeficitIndex].month);
  });
});
