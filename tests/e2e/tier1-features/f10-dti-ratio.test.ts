import test from 'node:test';
import assert from 'node:assert';
import { runSimulation } from '../helpers/engine-adapter';
import { assertPercentClose, assertValidDti } from '../helpers/assertions';
import type { LoanInput, HouseholdInput } from '../helpers/test-types';

test('F10: DTI (Debt-Service-to-Income) Ratio & Division-by-Zero Guard', async (t) => {
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
    liquidSavings: 700_000_000,
  };

  await t.test('1. Golden Fixture Month 1 DTI: 20m / 55m = 36.36%', async () => {
    const res = await runSimulation(baseLoan, baseHousehold);
    assert.ok(res.month1DtiRatio !== null, 'Month 1 DTI cannot be null');
    const expectedDti = 20_000_000 / 55_000_000; // 0.363636
    assertPercentClose(res.month1DtiRatio * 100, expectedDti * 100, 0.05, 'Month 1 DTI ratio');
  });

  await t.test('2. Golden Fixture Post-promo DTI at month 13: 27.333m / 55m = 49.70%', async () => {
    const res = await runSimulation(baseLoan, baseHousehold);
    assert.ok(res.postPromoDtiRatio !== null, 'Post-promo DTI cannot be null');
    const expectedDti = 27_333_333.33 / 55_000_000; // 0.496969
    assertPercentClose(res.postPromoDtiRatio * 100, expectedDti * 100, 0.05, 'Post-promo DTI ratio');
  });

  await t.test('3. DTI with existing debt payments: (ExistingDebt + DS) / Income', async () => {
    const householdWithDebt: HouseholdInput = {
      ...baseHousehold,
      existingDebtPayments: 5_000_000,
    };
    const res = await runSimulation(baseLoan, householdWithDebt);
    // (5m + 20m) / 55m = 25m / 55m = 45.45%
    const expectedDti = 25_000_000 / 55_000_000;
    assert.ok(res.month1DtiRatio !== null);
    assertPercentClose(res.month1DtiRatio * 100, expectedDti * 100, 0.05, 'Month 1 DTI with debt');
  });

  await t.test('4. Division-by-zero guard: DTI returns null when net income is zero', async () => {
    const zeroIncomeHousehold: HouseholdInput = {
      ...baseHousehold,
      monthlyNetIncome: 0,
    };
    const res = await runSimulation(baseLoan, zeroIncomeHousehold);
    assert.strictEqual(res.month1DtiRatio, null, 'Month 1 DTI must be null when income is 0');
    assert.strictEqual(res.postPromoDtiRatio, null, 'Post-promo DTI must be null when income is 0');
    assertValidDti(res.month1DtiRatio, 0);
  });

  await t.test('5. DTI ratio declines over time as principal balance amortizes under Equal Principal', async () => {
    const res = await runSimulation(baseLoan, baseHousehold);

    // After rate reset, compare month 13 vs month 120
    const dtiM13 = res.schedule[12].dtiRatio;
    const dtiM120 = res.schedule[119].dtiRatio;

    assert.ok(dtiM13 !== null && dtiM120 !== null);
    assert.ok(
      dtiM13 > dtiM120,
      `DTI in month 13 (${dtiM13}) must be higher than month 120 (${dtiM120}) as loan amortizes`
    );
  });
});
