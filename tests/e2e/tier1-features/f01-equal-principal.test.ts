import test from 'node:test';
import assert from 'node:assert';
import { runSimulation } from '../helpers/engine-adapter';
import { assertCurrencyClose, assertScheduleReconciliation } from '../helpers/assertions';
import type { LoanInput, HouseholdInput } from '../helpers/test-types';

test('F01: Equal Principal Amortization (dư nợ giảm dần)', async (t) => {
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
    monthlyNetIncome: 60_000_000,
    essentialLivingExpenses: 25_000_000,
    existingDebtPayments: 0,
    liquidSavings: 800_000_000,
  };

  await t.test('1. Constant monthly principal across non-terminal months', async () => {
    const res = await runSimulation(baseLoan, baseHousehold);
    const expectedMonthlyPrincipal = Math.round(baseLoan.loanAmount / baseLoan.loanTermMonths); // 8,333,333

    for (let m = 1; m < baseLoan.loanTermMonths; m++) {
      assertCurrencyClose(
        res.schedule[m - 1].principalPayment,
        expectedMonthlyPrincipal,
        1,
        `Principal at month ${m} should equal standard allocation`
      );
    }
  });

  await t.test('2. Declining interest payments within fixed promo period', async () => {
    const res = await runSimulation(baseLoan, baseHousehold);

    for (let m = 1; m < baseLoan.promoPeriodMonths; m++) {
      const currentInterest = res.schedule[m - 1].interestPayment;
      const nextInterest = res.schedule[m].interestPayment;
      assert.ok(
        currentInterest > nextInterest,
        `Interest in month ${m} (${currentInterest}) must exceed month ${m + 1} (${nextInterest})`
      );
    }
  });

  await t.test('3. Terminal balance reconciliation to exact zero', async () => {
    const res = await runSimulation(baseLoan, baseHousehold);
    assertScheduleReconciliation(res.schedule, baseLoan.loanAmount);
  });

  await t.test('4. Monotonically declining debt service after rate reset (month 13 to 240)', async () => {
    const res = await runSimulation(baseLoan, baseHousehold);

    for (let m = 13; m < baseLoan.loanTermMonths; m++) {
      const currentDS = res.schedule[m - 1].totalDebtService;
      const nextDS = res.schedule[m].totalDebtService;
      assert.ok(
        currentDS > nextDS,
        `Post-promo debt service in month ${m} (${currentDS}) must exceed month ${m + 1} (${nextDS})`
      );
    }
  });

  await t.test('5. Mid-term balance accuracy at month 120 (half-term)', async () => {
    const res = await runSimulation(baseLoan, baseHousehold);
    const month120 = res.schedule[119];
    const expectedHalfBalance = baseLoan.loanAmount / 2; // 1,000,000,000

    assertCurrencyClose(
      month120.endingBalance,
      expectedHalfBalance,
      100,
      'Ending balance at half-term must equal ~50% of original loan'
    );
  });

  await t.test('6. Month 1 payment composition matches standard formula', async () => {
    const res = await runSimulation(baseLoan, baseHousehold);
    // P = 2B / 240 = 8,333,333.33; I = 2B * (0.07 / 12) = 11,666,666.67 => Total = 20,000,000
    assertCurrencyClose(res.month1Payment, 20_000_000, 5, 'Month 1 total payment');
    assertCurrencyClose(res.schedule[0].principalPayment, 8_333_333, 2, 'Month 1 principal');
    assertCurrencyClose(res.schedule[0].interestPayment, 11_666_667, 2, 'Month 1 interest');
  });
});
