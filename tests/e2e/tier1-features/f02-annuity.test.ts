import test from 'node:test';
import assert from 'node:assert';
import { runSimulation } from '../helpers/engine-adapter';
import { assertCurrencyClose, assertScheduleReconciliation } from '../helpers/assertions';
import type { LoanInput, HouseholdInput } from '../helpers/test-types';

test('F02: Annuity Amortization (trả góp đều)', async (t) => {
  const baseLoan: LoanInput = {
    propertyPrice: 2_500_000_000,
    downPayment: 500_000_000,
    loanAmount: 2_000_000_000,
    loanTermMonths: 240,
    repaymentMethod: 'ANNUITY',
    promoInterestRate: 7.0,
    promoPeriodMonths: 12,
    postPromoRate: 12.0,
  };

  const baseHousehold: HouseholdInput = {
    monthlyNetIncome: 60_000_000,
    essentialLivingExpenses: 25_000_000,
    existingDebtPayments: 0,
    liquidSavings: 800_000_000,
  };

  await t.test('1. Constant total debt service during promotional period (months 1-12)', async () => {
    const res = await runSimulation(baseLoan, baseHousehold);
    const m1DS = res.schedule[0].totalDebtService;

    for (let m = 1; m <= baseLoan.promoPeriodMonths; m++) {
      assertCurrencyClose(
        res.schedule[m - 1].totalDebtService,
        m1DS,
        2,
        `Payment in month ${m} should equal month 1 level payment`
      );
    }
  });

  await t.test('2. Principal component increases monotonically during constant rate period', async () => {
    const res = await runSimulation(baseLoan, baseHousehold);

    for (let m = 1; m < baseLoan.promoPeriodMonths; m++) {
      const pCurrent = res.schedule[m - 1].principalPayment;
      const pNext = res.schedule[m].principalPayment;
      assert.ok(
        pNext > pCurrent,
        `Principal payment in month ${m + 1} (${pNext}) must exceed month ${m} (${pCurrent})`
      );
    }
  });

  await t.test('3. Interest component decreases monotonically during constant rate period', async () => {
    const res = await runSimulation(baseLoan, baseHousehold);

    for (let m = 1; m < baseLoan.promoPeriodMonths; m++) {
      const iCurrent = res.schedule[m - 1].interestPayment;
      const iNext = res.schedule[m].interestPayment;
      assert.ok(
        iCurrent > iNext,
        `Interest payment in month ${m} (${iCurrent}) must exceed month ${m + 1} (${iNext})`
      );
    }
  });

  await t.test('4. Level payment recalculation at rate reset (month 13) and constancy post-reset', async () => {
    const res = await runSimulation(baseLoan, baseHousehold);
    const m12DS = res.schedule[11].totalDebtService;
    const m13DS = res.schedule[12].totalDebtService;

    assert.ok(
      m13DS > m12DS,
      `Month 13 payment (${m13DS}) must be higher than month 12 (${m12DS}) due to rate reset`
    );

    // From month 13 to month 239 (before final month reconciliation), payments must remain constant
    for (let m = 13; m < baseLoan.loanTermMonths; m++) {
      assertCurrencyClose(
        res.schedule[m - 1].totalDebtService,
        m13DS,
        2,
        `Payment in month ${m} should equal month 13 recalculated level payment`
      );
    }
  });

  await t.test('5. Terminal balance reconciles to exact zero', async () => {
    const res = await runSimulation(baseLoan, baseHousehold);
    assertScheduleReconciliation(res.schedule, baseLoan.loanAmount);
  });

  await t.test('6. Zero interest edge case yields exact straight-line principal division', async () => {
    const zeroInterestLoan: LoanInput = {
      ...baseLoan,
      promoInterestRate: 0,
      postPromoRate: 0,
    };
    const res = await runSimulation(zeroInterestLoan, baseHousehold);
    const expectedPerMonth = Math.round(zeroInterestLoan.loanAmount / zeroInterestLoan.loanTermMonths);

    for (let m = 1; m < zeroInterestLoan.loanTermMonths; m++) {
      assert.strictEqual(
        res.schedule[m - 1].interestPayment,
        0,
        `Interest in month ${m} must be 0 for 0% loan`
      );
      assertCurrencyClose(
        res.schedule[m - 1].principalPayment,
        expectedPerMonth,
        1,
        `Principal in month ${m} should equal exact straight-line division`
      );
    }
    assertScheduleReconciliation(res.schedule, zeroInterestLoan.loanAmount);
  });
});
