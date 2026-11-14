import test from 'node:test';
import assert from 'node:assert';
import { runSimulation } from '../helpers/engine-adapter';
import { assertCurrencyClose, assertPercentClose } from '../helpers/assertions';
import type { LoanInput, HouseholdInput, StressScenarioInput } from '../helpers/test-types';

test('F03: Promotional Rate Expiry & Reset Mechanics', async (t) => {
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

  await t.test('1. Accurately identifies postPromoMonth as promoPeriodMonths + 1', async () => {
    const res = await runSimulation(baseLoan, baseHousehold);
    assert.strictEqual(res.postPromoMonth, 13, 'Reset month should be 13 for 12-month promo');
  });

  await t.test('2. Computes exact payment jump amount and percentage at reset', async () => {
    const res = await runSimulation(baseLoan, baseHousehold);
    const m12Payment = res.schedule[11].totalDebtService;
    const m13Payment = res.schedule[12].totalDebtService;

    const expectedJump = m13Payment - m12Payment;
    const expectedJumpPct = (expectedJump / m12Payment) * 100;

    assert.strictEqual(res.paymentJumpAmount, expectedJump, 'Payment jump amount');
    assertPercentClose(res.paymentJumpPercentage, expectedJumpPct, 0.01, 'Payment jump percentage');
  });

  await t.test('3. +2pp rate shock elevates month 13 rate to 14% and increases payment jump', async () => {
    const shock2pp: StressScenarioInput = {
      rateShockPp: 2.0,
      incomeShockPercent: 0,
      incomeShockDurationMonths: 0,
      expenseShockPercent: 0,
    };
    const res = await runSimulation(baseLoan, baseHousehold, shock2pp);
    assertPercentClose(res.schedule[12].interestRate, 14.0, 0.01, 'Month 13 interest rate with +2pp shock');
    // Balance at m12 = 1.9B; interest at 14% = 1.9B * (0.14 / 12) = 22,166,666.67; P = 8,333,333.33 => DS = 30,500,000
    assertCurrencyClose(res.postPromoPayment, 30_500_000, 5, 'Month 13 payment with +2pp shock');
  });

  await t.test('4. +4pp rate shock elevates month 13 rate to 16% and further magnifies payment jump', async () => {
    const shock4pp: StressScenarioInput = {
      rateShockPp: 4.0,
      incomeShockPercent: 0,
      incomeShockDurationMonths: 0,
      expenseShockPercent: 0,
    };
    const res = await runSimulation(baseLoan, baseHousehold, shock4pp);
    assertPercentClose(res.schedule[12].interestRate, 16.0, 0.01, 'Month 13 interest rate with +4pp shock');
    // Balance at m12 = 1.9B; interest at 16% = 1.9B * (0.16 / 12) = 25,333,333.33; P = 8,333,333.33 => DS = 33,666,667
    assertCurrencyClose(res.postPromoPayment, 33_666_667, 5, 'Month 13 payment with +4pp shock');
  });

  await t.test('5. Zero promo duration sets floating rate from month 1 with zero payment jump', async () => {
    const noPromoLoan: LoanInput = {
      ...baseLoan,
      promoPeriodMonths: 0,
    };
    const res = await runSimulation(noPromoLoan, baseHousehold);
    assertPercentClose(res.schedule[0].interestRate, 12.0, 0.01, 'Month 1 rate should be floating rate');
    assert.strictEqual(res.paymentJumpAmount, 0, 'No payment jump when promo is 0');
  });

  await t.test('6. Promo duration covering full term exhibits zero post-promo jump', async () => {
    const fullPromoLoan: LoanInput = {
      ...baseLoan,
      promoPeriodMonths: 240,
    };
    const res = await runSimulation(fullPromoLoan, baseHousehold);
    assertPercentClose(res.schedule[239].interestRate, 7.0, 0.01, 'Final month rate still at promo rate');
    assert.strictEqual(res.paymentJumpAmount, 0, 'No payment jump when promo covers full term');
  });
});
