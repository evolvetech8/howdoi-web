import test from 'node:test';
import assert from 'node:assert';
import { runSimulation } from '../helpers/engine-adapter';
import { assertCurrencyClose, assertScheduleReconciliation } from '../helpers/assertions';
import type { LoanInput, HouseholdInput } from '../helpers/test-types';

test('Tier 2: Boundary & Corner Cases — Amortization Schedules', async (t) => {
  const baseHousehold: HouseholdInput = {
    monthlyNetIncome: 100_000_000,
    essentialLivingExpenses: 20_000_000,
    existingDebtPayments: 0,
    liquidSavings: 500_000_000,
  };

  await t.test('1. Ultra-short 1-month loan fully pays off in single month with interest', async () => {
    const loan: LoanInput = {
      propertyPrice: 1_000_000_000,
      downPayment: 500_000_000,
      loanAmount: 500_000_000,
      loanTermMonths: 1,
      repaymentMethod: 'EQUAL_PRINCIPAL',
      promoInterestRate: 12.0,
      promoPeriodMonths: 1,
      postPromoRate: 12.0,
    };
    const res = await runSimulation(loan, baseHousehold);
    assert.strictEqual(res.schedule.length, 1, 'Schedule length must be 1');
    assert.strictEqual(res.schedule[0].principalPayment, 500_000_000, 'Principal paid in month 1');
    // Interest for 1 month at 12%: 500m * 0.01 = 5,000,000
    assertCurrencyClose(res.schedule[0].interestPayment, 5_000_000, 2, 'Interest paid in month 1');
    assert.strictEqual(res.schedule[0].endingBalance, 0, 'Ending balance must be 0');
    assertScheduleReconciliation(res.schedule, loan.loanAmount);
  });

  await t.test('2. 420-month (35 years) maximum Vietnamese mortgage tenure reconciles cleanly', async () => {
    const loan: LoanInput = {
      propertyPrice: 3_000_000_000,
      downPayment: 600_000_000,
      loanAmount: 2_400_000_000,
      loanTermMonths: 420,
      repaymentMethod: 'ANNUITY',
      promoInterestRate: 7.5,
      promoPeriodMonths: 24,
      postPromoRate: 12.0,
    };
    const res = await runSimulation(loan, baseHousehold);
    assert.strictEqual(res.schedule.length, 420, 'Schedule length must be 420');
    assertScheduleReconciliation(res.schedule, loan.loanAmount);
  });

  await t.test('3. Small loan amount of 1,000,000 VND (1 million VND)', async () => {
    const loan: LoanInput = {
      propertyPrice: 10_000_000,
      downPayment: 9_000_000,
      loanAmount: 1_000_000,
      loanTermMonths: 12,
      repaymentMethod: 'EQUAL_PRINCIPAL',
      promoInterestRate: 10.0,
      promoPeriodMonths: 6,
      postPromoRate: 12.0,
    };
    const res = await runSimulation(loan, baseHousehold);
    assertScheduleReconciliation(res.schedule, loan.loanAmount);
  });

  await t.test('4. Extreme high-value 100,000,000,000 VND (100 tỷ) luxury penthouse loan', async () => {
    const loan: LoanInput = {
      propertyPrice: 150_000_000_000,
      downPayment: 50_000_000_000,
      loanAmount: 100_000_000_000,
      loanTermMonths: 240,
      repaymentMethod: 'EQUAL_PRINCIPAL',
      promoInterestRate: 8.0,
      promoPeriodMonths: 12,
      postPromoRate: 13.0,
    };
    const wealthyHousehold: HouseholdInput = {
      monthlyNetIncome: 2_000_000_000,
      essentialLivingExpenses: 200_000_000,
      existingDebtPayments: 0,
      liquidSavings: 80_000_000_000,
    };
    const res = await runSimulation(loan, wealthyHousehold);
    assertScheduleReconciliation(res.schedule, loan.loanAmount);
  });

  await t.test('5. Odd loan amount and prime tenure (1,333,333,337 VND over 137 months)', async () => {
    const loan: LoanInput = {
      propertyPrice: 2_000_000_000,
      downPayment: 666_666_663,
      loanAmount: 1_333_333_337,
      loanTermMonths: 137,
      repaymentMethod: 'EQUAL_PRINCIPAL',
      promoInterestRate: 7.3,
      promoPeriodMonths: 13,
      postPromoRate: 11.7,
    };
    const res = await runSimulation(loan, baseHousehold);
    assertScheduleReconciliation(res.schedule, loan.loanAmount);
  });

  await t.test('6. Zero down payment (100% loan-to-value)', async () => {
    const loan: LoanInput = {
      propertyPrice: 1_500_000_000,
      downPayment: 0,
      loanAmount: 1_500_000_000,
      loanTermMonths: 180,
      repaymentMethod: 'ANNUITY',
      promoInterestRate: 7.0,
      promoPeriodMonths: 12,
      postPromoRate: 11.5,
    };
    const res = await runSimulation(loan, baseHousehold);
    assert.strictEqual(res.upfrontCashRequired, 0, 'Upfront cash is 0');
    assertScheduleReconciliation(res.schedule, loan.loanAmount);
  });

  await t.test('7. 99.9% down payment with fractional tiny debt balance', async () => {
    const loan: LoanInput = {
      propertyPrice: 1_000_000_000,
      downPayment: 999_000_000,
      loanAmount: 1_000_000,
      loanTermMonths: 12,
      repaymentMethod: 'ANNUITY',
      promoInterestRate: 6.0,
      promoPeriodMonths: 12,
      postPromoRate: 10.0,
    };
    const res = await runSimulation(loan, baseHousehold);
    assertScheduleReconciliation(res.schedule, loan.loanAmount);
  });
});
