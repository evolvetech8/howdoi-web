import test from 'node:test';
import assert from 'node:assert';
import { solveReverseAffordability, runSimulation } from '../helpers/engine-adapter';
import type { LoanInput, HouseholdInput, StressScenarioInput } from '../helpers/test-types';

test('Tier 2: Boundary & Corner Cases — Reverse Affordability Solver', async (t) => {
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

  await t.test('1. Negative cash budget yields exactly 0 VND max safe loan', async () => {
    const insolventHousehold: HouseholdInput = {
      monthlyNetIncome: 20_000_000,
      essentialLivingExpenses: 25_000_000, // Deficit before debt
      existingDebtPayments: 0,
      liquidSavings: 500_000_000,
    };
    const res = await solveReverseAffordability(baseLoan, insolventHousehold);
    assert.strictEqual(res.maxSafeLoanAmount, 0);
    assert.strictEqual(res.additionalEquityNeeded, baseLoan.loanAmount);
  });

  await t.test('2. Wealthy household with massive disposable income solves 0 additional equity', async () => {
    const wealthyHousehold: HouseholdInput = {
      monthlyNetIncome: 300_000_000,
      essentialLivingExpenses: 40_000_000,
      existingDebtPayments: 0,
      liquidSavings: 2_000_000_000,
    };
    const res = await solveReverseAffordability(baseLoan, wealthyHousehold);
    assert.ok(res.maxSafeLoanAmount >= baseLoan.loanAmount, 'Max safe loan covers target loan');
    assert.strictEqual(res.additionalEquityNeeded, 0, 'No additional equity needed');
  });

  await t.test('3. Solves reverse affordability for ultra-short 1-month loan', async () => {
    const shortLoan: LoanInput = {
      ...baseLoan,
      loanTermMonths: 1,
      promoPeriodMonths: 1,
    };
    const household: HouseholdInput = {
      monthlyNetIncome: 100_000_000,
      essentialLivingExpenses: 30_000_000,
      existingDebtPayments: 0,
      liquidSavings: 600_000_000,
    };
    // Available monthly budget = 70,000,000. For 1 month loan at 12%, DS = L * 1.01 => L_max = 70m / 1.01 ~ 69.3m
    const res = await solveReverseAffordability(shortLoan, household);
    assert.ok(res.maxSafeLoanAmount > 0 && res.maxSafeLoanAmount <= 70_000_000);
  });

  await t.test('4. Reverse affordability solver under +4pp rate shock stress scenario', async () => {
    const goldenHousehold: HouseholdInput = {
      monthlyNetIncome: 55_000_000,
      essentialLivingExpenses: 30_000_000,
      existingDebtPayments: 0,
      liquidSavings: 700_000_000,
    };
    const shock4pp: StressScenarioInput = {
      rateShockPp: 4.0, // Floating rate becomes 16%
      incomeShockPercent: 0,
      incomeShockDurationMonths: 0,
      expenseShockPercent: 0,
    };

    const resBase = await solveReverseAffordability(baseLoan, goldenHousehold);
    const resShocked = await solveReverseAffordability(baseLoan, goldenHousehold, shock4pp);

    // Stressed loan ceiling must be strictly lower than base ceiling
    assert.ok(
      resShocked.maxSafeLoanAmount < resBase.maxSafeLoanAmount,
      `Stressed safe loan (${resShocked.maxSafeLoanAmount}) must be less than base (${resBase.maxSafeLoanAmount})`
    );
    assert.ok(
      resShocked.additionalEquityNeeded > resBase.additionalEquityNeeded,
      'Additional equity needed increases under +4pp rate shock'
    );
  });

  await t.test('5. Solved loan candidate has zero deficit months under stressed scenario', async () => {
    const goldenHousehold: HouseholdInput = {
      monthlyNetIncome: 55_000_000,
      essentialLivingExpenses: 30_000_000,
      existingDebtPayments: 0,
      liquidSavings: 700_000_000,
    };
    const shock4pp: StressScenarioInput = {
      rateShockPp: 4.0,
      incomeShockPercent: 0,
      incomeShockDurationMonths: 0,
      expenseShockPercent: 0,
    };

    const resShocked = await solveReverseAffordability(baseLoan, goldenHousehold, shock4pp);
    const candidateLoan: LoanInput = {
      ...baseLoan,
      loanAmount: resShocked.maxSafeLoanAmount,
    };

    const sim = await runSimulation(candidateLoan, goldenHousehold, shock4pp);
    assert.strictEqual(
      sim.firstNegativeCashFlowMonth,
      null,
      'Simulation of solved loan has 0 deficit months under +4pp stress'
    );
  });

  await t.test('6. Monotonicity: Higher income strictly yields greater or equal safe loan', async () => {
    const h1: HouseholdInput = {
      monthlyNetIncome: 50_000_000,
      essentialLivingExpenses: 25_000_000,
      existingDebtPayments: 0,
      liquidSavings: 600_000_000,
    };
    const h2: HouseholdInput = {
      monthlyNetIncome: 65_000_000,
      essentialLivingExpenses: 25_000_000,
      existingDebtPayments: 0,
      liquidSavings: 600_000_000,
    };

    const res1 = await solveReverseAffordability(baseLoan, h1);
    const res2 = await solveReverseAffordability(baseLoan, h2);

    assert.ok(
      res2.maxSafeLoanAmount > res1.maxSafeLoanAmount,
      'Higher income household receives larger safe loan ceiling'
    );
  });

  await t.test('7. Additional equity needed equals target loan when safe loan is 0', async () => {
    const poorHousehold: HouseholdInput = {
      monthlyNetIncome: 10_000_000,
      essentialLivingExpenses: 20_000_000,
      existingDebtPayments: 0,
      liquidSavings: 500_000_000,
    };
    const res = await solveReverseAffordability(baseLoan, poorHousehold);
    assert.strictEqual(res.additionalEquityNeeded, baseLoan.loanAmount);
  });
});
