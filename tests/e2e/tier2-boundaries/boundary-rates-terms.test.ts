import test from 'node:test';
import assert from 'node:assert';
import { runSimulation } from '../helpers/engine-adapter';
import { assertCurrencyClose, assertScheduleReconciliation } from '../helpers/assertions';
import type { LoanInput, HouseholdInput } from '../helpers/test-types';

test('Tier 2: Boundary & Corner Cases — Rates & Term Structures', async (t) => {
  const baseHousehold: HouseholdInput = {
    monthlyNetIncome: 70_000_000,
    essentialLivingExpenses: 25_000_000,
    existingDebtPayments: 0,
    liquidSavings: 800_000_000,
  };

  await t.test('1. Zero interest rate on Annuity evaluates A = B / n without NaN or division by zero', async () => {
    const loan: LoanInput = {
      propertyPrice: 2_400_000_000,
      downPayment: 0,
      loanAmount: 2_400_000_000,
      loanTermMonths: 240,
      repaymentMethod: 'ANNUITY',
      promoInterestRate: 0,
      promoPeriodMonths: 240,
      postPromoRate: 0,
    };
    const res = await runSimulation(loan, baseHousehold);
    assert.strictEqual(res.month1Payment, 10_000_000, 'Month 1 payment for 2.4B over 240m at 0%');
    assert.strictEqual(res.schedule[0].interestPayment, 0, 'Zero interest');
    assertScheduleReconciliation(res.schedule, loan.loanAmount);
  });

  await t.test('2. Micro interest rate of 0.01% per annum', async () => {
    const loan: LoanInput = {
      propertyPrice: 1_200_000_000,
      downPayment: 200_000_000,
      loanAmount: 1_000_000_000,
      loanTermMonths: 120,
      repaymentMethod: 'EQUAL_PRINCIPAL',
      promoInterestRate: 0.01,
      promoPeriodMonths: 12,
      postPromoRate: 0.01,
    };
    const res = await runSimulation(loan, baseHousehold);
    assertScheduleReconciliation(res.schedule, loan.loanAmount);
  });

  await t.test('3. Extreme distress interest rate of 30.0% per annum', async () => {
    const loan: LoanInput = {
      propertyPrice: 1_500_000_000,
      downPayment: 500_000_000,
      loanAmount: 1_000_000_000,
      loanTermMonths: 120,
      repaymentMethod: 'EQUAL_PRINCIPAL',
      promoInterestRate: 15.0,
      promoPeriodMonths: 12,
      postPromoRate: 30.0,
    };
    const res = await runSimulation(loan, baseHousehold);
    // Month 13 interest at 30%: B[12] = 1B - 12 * 8.33m = 900m; I = 900m * (0.30 / 12) = 22,500,000 VND
    assertCurrencyClose(res.schedule[12].interestPayment, 22_500_000, 2, 'Month 13 interest at 30%');
    assertScheduleReconciliation(res.schedule, loan.loanAmount);
  });

  await t.test('4. Grace period equal to N - 1 (239 months grace on 240-month loan)', async () => {
    const loan: LoanInput = {
      propertyPrice: 1_000_000_000,
      downPayment: 200_000_000,
      loanAmount: 800_000_000,
      loanTermMonths: 240,
      gracePeriodMonths: 239,
      repaymentMethod: 'EQUAL_PRINCIPAL',
      promoInterestRate: 6.0,
      promoPeriodMonths: 12,
      postPromoRate: 10.0,
    };
    const res = await runSimulation(loan, baseHousehold);

    // Month 1 to 239: principal = 0
    for (let m = 1; m <= 239; m++) {
      assert.strictEqual(res.schedule[m - 1].principalPayment, 0);
    }

    // Month 240: entire 800m principal repaid in single balloon month
    assert.strictEqual(res.schedule[239].principalPayment, 800_000_000);
    assertScheduleReconciliation(res.schedule, loan.loanAmount);
  });

  await t.test('5. Inverted teaser rate (promo rate higher than post-promo floating rate)', async () => {
    const loan: LoanInput = {
      propertyPrice: 2_000_000_000,
      downPayment: 500_000_000,
      loanAmount: 1_500_000_000,
      loanTermMonths: 240,
      repaymentMethod: 'EQUAL_PRINCIPAL',
      promoInterestRate: 14.0, // High promo
      promoPeriodMonths: 12,
      postPromoRate: 9.0,      // Low floating
    };
    const res = await runSimulation(loan, baseHousehold);

    // Negative payment jump (payment decreases at month 13)
    assert.ok(
      res.paymentJumpAmount < 0,
      'Payment jump should be negative when promo rate exceeds floating rate'
    );
  });

  await t.test('6. Promo period covering full term exhibits zero post-promo reset jump', async () => {
    const loan: LoanInput = {
      propertyPrice: 1_000_000_000,
      downPayment: 200_000_000,
      loanAmount: 800_000_000,
      loanTermMonths: 120,
      repaymentMethod: 'ANNUITY',
      promoInterestRate: 7.0,
      promoPeriodMonths: 120,
      postPromoRate: 12.0,
    };
    const res = await runSimulation(loan, baseHousehold);
    assert.strictEqual(res.paymentJumpAmount, 0, 'No payment jump when promo covers full term');
  });

  await t.test('7. Zero promo duration starts immediately on floating rate', async () => {
    const loan: LoanInput = {
      propertyPrice: 1_000_000_000,
      downPayment: 200_000_000,
      loanAmount: 800_000_000,
      loanTermMonths: 120,
      repaymentMethod: 'ANNUITY',
      promoInterestRate: 6.0,
      promoPeriodMonths: 0,
      postPromoRate: 11.5,
    };
    const res = await runSimulation(loan, baseHousehold);
    assert.strictEqual(res.schedule[0].interestRate, 11.5, 'Month 1 rate is floating rate');
    assert.strictEqual(res.paymentJumpAmount, 0, 'No jump when promo duration is 0');
  });
});
