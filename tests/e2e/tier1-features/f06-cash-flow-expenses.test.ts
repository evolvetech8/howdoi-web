import test from 'node:test';
import assert from 'node:assert';
import { runSimulation } from '../helpers/engine-adapter';
import { assertCurrencyClose } from '../helpers/assertions';
import type { LoanInput, HouseholdInput, StressScenarioInput } from '../helpers/test-types';

test('F06: Household Cash Flow & Expense Shock', async (t) => {
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
    existingDebtPayments: 5_000_000,
    liquidSavings: 700_000_000,
  };

  await t.test('1. Free Cash Flow formula: Inflow - (Essentials + Debt + Mortgage)', async () => {
    const res = await runSimulation(baseLoan, baseHousehold);
    const m1 = res.schedule[0];

    const expectedOutflows = m1.essentialExpenses + m1.existingDebt + m1.totalDebtService;
    const expectedFCF = m1.netIncome - expectedOutflows;

    assert.strictEqual(m1.operatingCashFlow, expectedFCF, 'Operating cash flow month 1');
  });

  await t.test('2. Positive cash flow surplus accumulates into reserve balance month-over-month', async () => {
    const res = await runSimulation(baseLoan, baseHousehold);

    // Initial reserve at closing: 700m - 500m = 200m
    assert.strictEqual(res.initialReserveBalance, 200_000_000);

    const m1 = res.schedule[0];
    assert.strictEqual(
      m1.reserveBalance,
      res.initialReserveBalance + m1.operatingCashFlow,
      'Month 1 ending reserve must equal initial reserve + month 1 FCF'
    );

    const m2 = res.schedule[1];
    assert.strictEqual(
      m2.reserveBalance,
      m1.reserveBalance + m2.operatingCashFlow,
      'Month 2 ending reserve must equal month 1 reserve + month 2 FCF'
    );
  });

  await t.test('3. +10% essential expense shock increases monthly essential costs', async () => {
    const expenseShock: StressScenarioInput = {
      rateShockPp: 0,
      incomeShockPercent: 0,
      incomeShockDurationMonths: 0,
      expenseShockPercent: 10.0,
    };
    const res = await runSimulation(baseLoan, baseHousehold, expenseShock);

    const expectedEssentials = Math.round(baseHousehold.essentialLivingExpenses * 1.10); // 33,000,000
    for (const item of res.schedule) {
      assertCurrencyClose(
        item.essentialExpenses,
        expectedEssentials,
        1,
        `Essential expenses under +10% shock at month ${item.month}`
      );
    }
  });

  await t.test('4. Existing debt payments correctly reduce operating cash flow', async () => {
    const noDebtHousehold: HouseholdInput = {
      ...baseHousehold,
      existingDebtPayments: 0,
    };
    const resWithDebt = await runSimulation(baseLoan, baseHousehold);
    const resNoDebt = await runSimulation(baseLoan, noDebtHousehold);

    const diff = resNoDebt.schedule[0].operatingCashFlow - resWithDebt.schedule[0].operatingCashFlow;
    assert.strictEqual(diff, 5_000_000, 'Difference in FCF must equal existing debt payment');
  });

  await t.test('5. Cash flow deficit flags isDeficit boolean when FCF < 0', async () => {
    // Tight household where outlays exceed income
    const tightHousehold: HouseholdInput = {
      monthlyNetIncome: 30_000_000,
      essentialLivingExpenses: 20_000_000,
      existingDebtPayments: 0,
      liquidSavings: 600_000_000,
    };
    // Month 1 payment is 20m. Outlays = 20m + 20m = 40m > 30m income => FCF = -10m
    const res = await runSimulation(baseLoan, tightHousehold);
    assert.strictEqual(res.schedule[0].isDeficit, true, 'Month 1 isDeficit must be true');
    assert.ok(res.schedule[0].operatingCashFlow < 0, 'Month 1 FCF must be negative');
  });
});
