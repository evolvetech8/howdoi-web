import test from 'node:test';
import assert from 'node:assert';
import { runSimulation } from '../helpers/engine-adapter';
import { assertCurrencyClose } from '../helpers/assertions';
import type { LoanInput, HouseholdInput, StressScenarioInput } from '../helpers/test-types';

test('F07: Income Shock Modeling', async (t) => {
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
    monthlyNetIncome: 50_000_000,
    essentialLivingExpenses: 25_000_000,
    existingDebtPayments: 0,
    liquidSavings: 700_000_000,
  };

  await t.test('1. -20% income shock for 3 months reduces net income strictly during shock window', async () => {
    const shock3m: StressScenarioInput = {
      rateShockPp: 0,
      incomeShockPercent: -20.0,
      incomeShockDurationMonths: 3,
      incomeShockStartMonth: 13,
      expenseShockPercent: 0,
    };
    const res = await runSimulation(baseLoan, baseHousehold, shock3m);
    const expectedShockedIncome = Math.round(baseHousehold.monthlyNetIncome * 0.80); // 40,000,000

    // Months 1-12: normal income
    for (let m = 1; m <= 12; m++) {
      assert.strictEqual(res.schedule[m - 1].netIncome, baseHousehold.monthlyNetIncome);
    }

    // Months 13-15: shocked income
    for (let m = 13; m <= 15; m++) {
      assertCurrencyClose(
        res.schedule[m - 1].netIncome,
        expectedShockedIncome,
        1,
        `Income in shock month ${m}`
      );
    }

    // Month 16 onwards: restored normal income
    assert.strictEqual(
      res.schedule[15].netIncome,
      baseHousehold.monthlyNetIncome,
      'Income must restore in month 16'
    );
  });

  await t.test('2. -20% income shock for 6 months reduces net income across 6 consecutive months', async () => {
    const shock6m: StressScenarioInput = {
      rateShockPp: 0,
      incomeShockPercent: -20.0,
      incomeShockDurationMonths: 6,
      incomeShockStartMonth: 13,
      expenseShockPercent: 0,
    };
    const res = await runSimulation(baseLoan, baseHousehold, shock6m);
    const expectedShockedIncome = Math.round(baseHousehold.monthlyNetIncome * 0.80);

    for (let m = 13; m <= 18; m++) {
      assertCurrencyClose(res.schedule[m - 1].netIncome, expectedShockedIncome, 1);
    }
    assert.strictEqual(res.schedule[18].netIncome, baseHousehold.monthlyNetIncome, 'Month 19 restored');
  });

  await t.test('3. Income shock at month 25 (concurrent with year 2 rate reset)', async () => {
    const loan24m: LoanInput = {
      ...baseLoan,
      promoPeriodMonths: 24,
    };
    const shock25m: StressScenarioInput = {
      rateShockPp: 0,
      incomeShockPercent: -20.0,
      incomeShockDurationMonths: 6,
      incomeShockStartMonth: 25,
      expenseShockPercent: 0,
    };
    const res = await runSimulation(loan24m, baseHousehold, shock25m);

    assert.strictEqual(res.schedule[23].netIncome, baseHousehold.monthlyNetIncome, 'Month 24 normal');
    assert.strictEqual(res.schedule[24].netIncome, 40_000_000, 'Month 25 shocked');
    assert.strictEqual(res.schedule[29].netIncome, 40_000_000, 'Month 30 shocked');
    assert.strictEqual(res.schedule[30].netIncome, baseHousehold.monthlyNetIncome, 'Month 31 restored');
  });

  await t.test('4. Income shock sharpens reserve burn during shock period', async () => {
    const noShockRes = await runSimulation(baseLoan, baseHousehold);
    const shockRes = await runSimulation(baseLoan, baseHousehold, {
      rateShockPp: 0,
      incomeShockPercent: -20.0,
      incomeShockDurationMonths: 3,
      incomeShockStartMonth: 13,
      expenseShockPercent: 0,
    });

    const reserveDiffAtM15 = noShockRes.schedule[14].reserveBalance - shockRes.schedule[14].reserveBalance;
    const expectedLoss = 3 * 10_000_000; // 3 months * 10m loss
    assertCurrencyClose(reserveDiffAtM15, expectedLoss, 5, 'Reserve deficit matches 3 months of 20% cut');
  });

  await t.test('5. Zero percent income shock parameter leaves baseline unchanged', async () => {
    const zeroShock: StressScenarioInput = {
      rateShockPp: 0,
      incomeShockPercent: 0,
      incomeShockDurationMonths: 6,
      expenseShockPercent: 0,
    };
    const res = await runSimulation(baseLoan, baseHousehold, zeroShock);
    for (const item of res.schedule) {
      assert.strictEqual(item.netIncome, baseHousehold.monthlyNetIncome);
    }
  });
});
