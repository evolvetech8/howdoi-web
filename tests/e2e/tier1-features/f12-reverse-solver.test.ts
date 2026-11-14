import test from 'node:test';
import assert from 'node:assert';
import { solveReverseAffordability, runSimulation } from '../helpers/engine-adapter';
import { assertCurrencyClose } from '../helpers/assertions';
import type { LoanInput, HouseholdInput } from '../helpers/test-types';

test('F12: Reverse Affordability Solver', async (t) => {
  const goldenLoan: LoanInput = {
    propertyPrice: 2_500_000_000,
    downPayment: 500_000_000,
    loanAmount: 2_000_000_000,
    loanTermMonths: 240,
    repaymentMethod: 'EQUAL_PRINCIPAL',
    promoInterestRate: 7.0,
    promoPeriodMonths: 12,
    postPromoRate: 12.0,
  };

  const goldenHousehold: HouseholdInput = {
    monthlyNetIncome: 55_000_000,
    essentialLivingExpenses: 30_000_000,
    existingDebtPayments: 0,
    liquidSavings: 700_000_000,
  };

  await t.test('1. Golden Fixture solves max safe loan of ~1.829B VND to prevent Month 13 deficit', async () => {
    const res = await solveReverseAffordability(goldenLoan, goldenHousehold);
    // Analytical value: 25m / (1/240 + 228/240 * 0.01) = 1,829,268,293 VND
    assertCurrencyClose(res.maxSafeLoanAmount, 1_829_268_293, 20_000, 'Max safe loan amount');
    assert.ok(res.maxSafeLoanAmount < goldenLoan.loanAmount, 'Safe loan must be less than 2B');
  });

  await t.test('2. Additional equity needed equals target loan minus max safe loan', async () => {
    const res = await solveReverseAffordability(goldenLoan, goldenHousehold);
    const expectedEquityNeeded = goldenLoan.loanAmount - res.maxSafeLoanAmount;
    assert.strictEqual(res.additionalEquityNeeded, expectedEquityNeeded);
  });

  await t.test('3. Candidate loan at maxSafeLoanAmount yields zero deficit months in simulation', async () => {
    const res = await solveReverseAffordability(goldenLoan, goldenHousehold);
    const safeLoan: LoanInput = {
      ...goldenLoan,
      loanAmount: res.maxSafeLoanAmount,
    };
    const simRes = await runSimulation(safeLoan, goldenHousehold);
    assert.strictEqual(
      simRes.firstNegativeCashFlowMonth,
      null,
      'Simulation with solved safe loan must have 0 deficit months'
    );
  });

  await t.test('4. When living expenses exceed net income, max safe loan is 0 VND', async () => {
    const deficitHousehold: HouseholdInput = {
      monthlyNetIncome: 30_000_000,
      essentialLivingExpenses: 35_000_000, // essentials > income
      existingDebtPayments: 0,
      liquidSavings: 500_000_000,
    };
    const res = await solveReverseAffordability(goldenLoan, deficitHousehold);
    assert.strictEqual(res.maxSafeLoanAmount, 0, 'Max safe loan must be 0 when budget is negative');
    assert.strictEqual(res.additionalEquityNeeded, goldenLoan.loanAmount);
  });

  await t.test('5. Safe property price equals down payment plus max safe loan', async () => {
    const res = await solveReverseAffordability(goldenLoan, goldenHousehold);
    assert.strictEqual(
      res.safePropertyPrice,
      goldenLoan.downPayment + res.maxSafeLoanAmount,
      'Safe property price'
    );
  });
});
