import test from 'node:test';
import assert from 'node:assert';
import { runSimulation } from '../helpers/engine-adapter';
import { assertScheduleReconciliation } from '../helpers/assertions';
import type { LoanInput, HouseholdInput } from '../helpers/test-types';

test('F05: Deterministic Zero-Drift Math & Terminal Reconciliation', async (t) => {
  const baseHousehold: HouseholdInput = {
    monthlyNetIncome: 100_000_000,
    essentialLivingExpenses: 30_000_000,
    existingDebtPayments: 0,
    liquidSavings: 1_000_000_000,
  };

  await t.test('1. Non-divisible loan amount (2,000,000,000 / 240) reconciles exact 80 VND residue', async () => {
    const loan: LoanInput = {
      propertyPrice: 2_500_000_000,
      downPayment: 500_000_000,
      loanAmount: 2_000_000_000,
      loanTermMonths: 240,
      repaymentMethod: 'EQUAL_PRINCIPAL',
      promoInterestRate: 7.0,
      promoPeriodMonths: 12,
      postPromoRate: 12.0,
    };
    const res = await runSimulation(loan, baseHousehold);
    assertScheduleReconciliation(res.schedule, loan.loanAmount);
  });

  await t.test('2. Ending balance never drops below zero at any month', async () => {
    const loan: LoanInput = {
      propertyPrice: 1_000_000_000,
      downPayment: 300_000_000,
      loanAmount: 700_000_000,
      loanTermMonths: 180,
      repaymentMethod: 'ANNUITY',
      promoInterestRate: 8.5,
      promoPeriodMonths: 24,
      postPromoRate: 13.0,
    };
    const res = await runSimulation(loan, baseHousehold);

    for (const item of res.schedule) {
      assert.ok(
        item.endingBalance >= 0,
        `Balance at month ${item.month} cannot be negative (${item.endingBalance})`
      );
    }
  });

  await t.test('3. Terminal balance is exactly 0 in final month across different terms (120, 240, 360 months)', async () => {
    const terms = [120, 240, 360];
    for (const term of terms) {
      const loan: LoanInput = {
        propertyPrice: 2_000_000_000,
        downPayment: 400_000_000,
        loanAmount: 1_600_000_000,
        loanTermMonths: term,
        repaymentMethod: 'EQUAL_PRINCIPAL',
        promoInterestRate: 6.5,
        promoPeriodMonths: 12,
        postPromoRate: 11.5,
      };
      const res = await runSimulation(loan, baseHousehold);
      const finalMonth = res.schedule[res.schedule.length - 1];
      assert.strictEqual(finalMonth.endingBalance, 0, `Terminal balance for term ${term} must be 0`);
      assertScheduleReconciliation(res.schedule, loan.loanAmount);
    }
  });

  await t.test('4. Large Vietnamese loan scale (50,000,000,000 VND / 50 tỷ) maintains exact reconciliation', async () => {
    const largeLoan: LoanInput = {
      propertyPrice: 70_000_000_000,
      downPayment: 20_000_000_000,
      loanAmount: 50_000_000_000,
      loanTermMonths: 300,
      repaymentMethod: 'ANNUITY',
      promoInterestRate: 7.5,
      promoPeriodMonths: 24,
      postPromoRate: 12.5,
    };
    const household: HouseholdInput = {
      monthlyNetIncome: 500_000_000,
      essentialLivingExpenses: 100_000_000,
      existingDebtPayments: 0,
      liquidSavings: 25_000_000_000,
    };

    const res = await runSimulation(largeLoan, household);
    assertScheduleReconciliation(res.schedule, largeLoan.loanAmount);
  });

  await t.test('5. Integer VND output consistency across all payments and balances', async () => {
    const loan: LoanInput = {
      propertyPrice: 3_000_000_000,
      downPayment: 1_000_000_000,
      loanAmount: 2_000_000_000,
      loanTermMonths: 120,
      repaymentMethod: 'ANNUITY',
      promoInterestRate: 7.0,
      promoPeriodMonths: 12,
      postPromoRate: 11.0,
    };
    const res = await runSimulation(loan, baseHousehold);

    for (const item of res.schedule) {
      assert.strictEqual(Number.isInteger(item.principalPayment), true, `Principal in m${item.month} is integer`);
      assert.strictEqual(Number.isInteger(item.interestPayment), true, `Interest in m${item.month} is integer`);
      assert.strictEqual(Number.isInteger(item.totalDebtService), true, `Debt service in m${item.month} is integer`);
      assert.strictEqual(Number.isInteger(item.endingBalance), true, `Ending balance in m${item.month} is integer`);
    }
  });
});
