import test from 'node:test';
import assert from 'node:assert';
import { runSimulation } from '../helpers/engine-adapter';
import { assertCurrencyClose, assertScheduleReconciliation } from '../helpers/assertions';
import type { LoanInput, HouseholdInput } from '../helpers/test-types';

test('F04: Principal Grace Period Handling', async (t) => {
  const graceLoan: LoanInput = {
    propertyPrice: 3_000_000_000,
    downPayment: 600_000_000,
    loanAmount: 2_400_000_000,
    loanTermMonths: 240,
    gracePeriodMonths: 12,
    repaymentMethod: 'EQUAL_PRINCIPAL',
    promoInterestRate: 7.0,
    promoPeriodMonths: 12,
    postPromoRate: 11.0,
  };

  const baseHousehold: HouseholdInput = {
    monthlyNetIncome: 65_000_000,
    essentialLivingExpenses: 28_000_000,
    existingDebtPayments: 0,
    liquidSavings: 900_000_000,
  };

  await t.test('1. Zero scheduled principal payment throughout grace period (months 1-12)', async () => {
    const res = await runSimulation(graceLoan, baseHousehold);

    for (let m = 1; m <= 12; m++) {
      assert.strictEqual(
        res.schedule[m - 1].principalPayment,
        0,
        `Principal in grace month ${m} must be 0`
      );
      assert.strictEqual(
        res.schedule[m - 1].endingBalance,
        graceLoan.loanAmount,
        `Ending balance in grace month ${m} must remain at initial principal`
      );
    }
  });

  await t.test('2. Total debt service equals interest payment only during grace period', async () => {
    const res = await runSimulation(graceLoan, baseHousehold);

    for (let m = 1; m <= 12; m++) {
      const item = res.schedule[m - 1];
      assert.strictEqual(
        item.totalDebtService,
        item.interestPayment,
        `Debt service in grace month ${m} must strictly equal interest payment`
      );
    }
  });

  await t.test('3. Post-grace principal calculated over remaining term (N - G months)', async () => {
    const res = await runSimulation(graceLoan, baseHousehold);
    const remainingMonths = graceLoan.loanTermMonths - (graceLoan.gracePeriodMonths ?? 0); // 240 - 12 = 228
    const expectedMonthlyPrincipal = Math.round(graceLoan.loanAmount / remainingMonths); // 2.4B / 228 = 10,526,316

    for (let m = 13; m < graceLoan.loanTermMonths; m++) {
      assertCurrencyClose(
        res.schedule[m - 1].principalPayment,
        expectedMonthlyPrincipal,
        1,
        `Principal at month ${m} should equal remaining term division`
      );
    }
  });

  await t.test('4. Grace period with Annuity schedule begins amortization at month G + 1', async () => {
    const annuityGraceLoan: LoanInput = {
      ...graceLoan,
      repaymentMethod: 'ANNUITY',
    };
    const res = await runSimulation(annuityGraceLoan, baseHousehold);

    // During grace: P = 0
    for (let m = 1; m <= 12; m++) {
      assert.strictEqual(res.schedule[m - 1].principalPayment, 0, `Annuity grace month ${m} principal`);
    }

    // After grace: P > 0
    assert.ok(
      res.schedule[12].principalPayment > 0,
      'Month 13 principal must be greater than 0'
    );
    assertScheduleReconciliation(res.schedule, annuityGraceLoan.loanAmount);
  });

  await t.test('5. Terminal balance reconciles to exact zero with grace period', async () => {
    const res = await runSimulation(graceLoan, baseHousehold);
    assertScheduleReconciliation(res.schedule, graceLoan.loanAmount);
  });
});
