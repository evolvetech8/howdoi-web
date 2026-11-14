import test from 'node:test';
import assert from 'node:assert';
import { runSimulation } from '../helpers/engine-adapter';
import { assertCurrencyClose } from '../helpers/assertions';
import type { LoanInput, HouseholdInput, StressScenarioInput } from '../helpers/test-types';

test('Tier 2: Boundary & Corner Cases — Stress Testing Shocks', async (t) => {
  const baseLoan: LoanInput = {
    propertyPrice: 2_000_000_000,
    downPayment: 500_000_000,
    loanAmount: 1_500_000_000,
    loanTermMonths: 240,
    repaymentMethod: 'EQUAL_PRINCIPAL',
    promoInterestRate: 7.0,
    promoPeriodMonths: 12,
    postPromoRate: 11.5,
  };

  const baseHousehold: HouseholdInput = {
    monthlyNetIncome: 50_000_000,
    essentialLivingExpenses: 20_000_000,
    existingDebtPayments: 0,
    liquidSavings: 800_000_000,
  };

  await t.test('1. Zero income shock (-0%) yields exact equivalence to un-shocked baseline', async () => {
    const resBase = await runSimulation(baseLoan, baseHousehold);
    const resZeroShock = await runSimulation(baseLoan, baseHousehold, {
      rateShockPp: 0,
      incomeShockPercent: 0,
      incomeShockDurationMonths: 6,
      expenseShockPercent: 0,
    });

    assert.strictEqual(resBase.month1Payment, resZeroShock.month1Payment);
    assert.strictEqual(resBase.lowestReserveBalance, resZeroShock.lowestReserveBalance);
    assert.strictEqual(resBase.firstNegativeCashFlowMonth, resZeroShock.firstNegativeCashFlowMonth);
  });

  await t.test('2. 100% income collapse (-100% for 6 months) reduces net income to 0 during window', async () => {
    const totalLossShock: StressScenarioInput = {
      rateShockPp: 0,
      incomeShockPercent: -100.0,
      incomeShockDurationMonths: 6,
      incomeShockStartMonth: 13,
      expenseShockPercent: 0,
    };
    const res = await runSimulation(baseLoan, baseHousehold, totalLossShock);

    for (let m = 13; m <= 18; m++) {
      assert.strictEqual(res.schedule[m - 1].netIncome, 0, `Income in month ${m} is 0`);
      assert.strictEqual(res.schedule[m - 1].dtiRatio, null, `DTI in month ${m} is null`);
      assert.ok(res.schedule[m - 1].operatingCashFlow < 0, `Month ${m} FCF is negative`);
    }

    assert.strictEqual(res.schedule[18].netIncome, baseHousehold.monthlyNetIncome, 'Month 19 restores');
  });

  await t.test('3. Full-tenure income shock (-20% for 240 months)', async () => {
    const fullTermShock: StressScenarioInput = {
      rateShockPp: 0,
      incomeShockPercent: -20.0,
      incomeShockDurationMonths: 240,
      incomeShockStartMonth: 1,
      expenseShockPercent: 0,
    };
    const res = await runSimulation(baseLoan, baseHousehold, fullTermShock);
    const expectedIncome = Math.round(baseHousehold.monthlyNetIncome * 0.80);

    for (const item of res.schedule) {
      assertCurrencyClose(item.netIncome, expectedIncome, 1);
    }
  });

  await t.test('4. Zero expense shock (+0%) leaves baseline expenses intact', async () => {
    const res = await runSimulation(baseLoan, baseHousehold, {
      rateShockPp: 0,
      incomeShockPercent: 0,
      incomeShockDurationMonths: 0,
      expenseShockPercent: 0,
    });

    for (const item of res.schedule) {
      assert.strictEqual(item.essentialExpenses, baseHousehold.essentialLivingExpenses);
    }
  });

  await t.test('5. Extreme expense shock of +100% (living expenses double)', async () => {
    const doubleExpenseShock: StressScenarioInput = {
      rateShockPp: 0,
      incomeShockPercent: 0,
      incomeShockDurationMonths: 0,
      expenseShockPercent: 100.0,
    };
    const res = await runSimulation(baseLoan, baseHousehold, doubleExpenseShock);

    for (const item of res.schedule) {
      assert.strictEqual(
        item.essentialExpenses,
        baseHousehold.essentialLivingExpenses * 2,
        'Expenses doubled to 40,000,000'
      );
    }
  });

  await t.test('6. Zero rate shock (+0pp) uses base floating rate', async () => {
    const res = await runSimulation(baseLoan, baseHousehold, {
      rateShockPp: 0,
      incomeShockPercent: 0,
      incomeShockDurationMonths: 0,
      expenseShockPercent: 0,
    });
    assert.strictEqual(res.schedule[12].interestRate, baseLoan.postPromoRate);
  });

  await t.test('7. Extreme rate shock of +10pp (+1000 bps) drives floating rate to 21.5%', async () => {
    const extremeRateShock: StressScenarioInput = {
      rateShockPp: 10.0,
      incomeShockPercent: 0,
      incomeShockDurationMonths: 0,
      expenseShockPercent: 0,
    };
    const res = await runSimulation(baseLoan, baseHousehold, extremeRateShock);
    assert.strictEqual(res.schedule[12].interestRate, 21.5, 'Floating rate with +10pp');
    assert.ok(res.postPromoPayment > res.month1Payment * 1.5, 'Payment increases significantly');
  });
});
