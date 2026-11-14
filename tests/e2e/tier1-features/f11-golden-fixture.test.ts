import test from 'node:test';
import assert from 'node:assert';
import { runSimulation } from '../helpers/engine-adapter';
import { assertCurrencyClose, assertPercentClose } from '../helpers/assertions';
import type { LoanInput, HouseholdInput } from '../helpers/test-types';

test('F11: Golden Fixture Verification (PRD §4.6 & Acceptance Criteria §34)', async (t) => {
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

  await t.test('1. Month 1 payment is ~VND 20m (exact: 20,000,000 VND)', async () => {
    const res = await runSimulation(goldenLoan, goldenHousehold);
    assertCurrencyClose(res.month1Payment, 20_000_000, 2, 'Month 1 payment');
    assertCurrencyClose(res.schedule[0].principalPayment, 8_333_333, 1, 'Month 1 principal');
    assertCurrencyClose(res.schedule[0].interestPayment, 11_666_667, 1, 'Month 1 interest');
  });

  await t.test('2. Month 12 payment is ~VND 19.47m before promo expiry', async () => {
    const res = await runSimulation(goldenLoan, goldenHousehold);
    // B[11] = 1,908,333,333.33 => I[12] = 11,131,944.44; P = 8,333,333.33 => DS = 19,465,278
    assertCurrencyClose(res.schedule[11].totalDebtService, 19_465_278, 5, 'Month 12 payment');
    assert.ok(res.schedule[11].operatingCashFlow > 0, 'Month 12 cash flow is positive');
  });

  await t.test('3. Month 13 payment jumps to ~VND 27.33m (exact integer: 27,333,333 VND)', async () => {
    const res = await runSimulation(goldenLoan, goldenHousehold);
    assertCurrencyClose(res.postPromoPayment, 27_333_333, 2, 'Month 13 payment');
    assertCurrencyClose(res.schedule[12].principalPayment, 8_333_333, 1, 'Month 13 principal');
    assertCurrencyClose(res.schedule[12].interestPayment, 19_000_000, 1, 'Month 13 interest');
  });

  await t.test('4. First negative cash-flow month occurs at Month 13 with -2.33m deficit', async () => {
    const res = await runSimulation(goldenLoan, goldenHousehold);
    assert.strictEqual(res.firstNegativeCashFlowMonth, 13, 'First negative month');
    // FCF = 55m - 30m - 27.333m = -2,333,333 VND
    assertCurrencyClose(res.schedule[12].operatingCashFlow, -2_333_333, 2, 'Month 13 FCF deficit');
  });

  await t.test('5. Payment jump at reset is +7.87m VND (+40.42%)', async () => {
    const res = await runSimulation(goldenLoan, goldenHousehold);
    assertCurrencyClose(res.paymentJumpAmount, 7_868_056, 5, 'Payment jump amount');
    assertPercentClose(res.paymentJumpPercentage, 40.42, 0.1, 'Payment jump percentage');
  });

  await t.test('6. Deficit cycle ends at Month 41 where cash flow returns to 0', async () => {
    const res = await runSimulation(goldenLoan, goldenHousehold);
    // At month 41: B[40] = 2B - 40 * 8.333m = 1.666667B => I = 16.666m => DS = 25.000m => FCF = 0
    assert.ok(
      res.schedule[39].operatingCashFlow < 0,
      'Month 40 must still be negative'
    );
    assertCurrencyClose(
      res.schedule[40].operatingCashFlow,
      0,
      5,
      'Month 41 cash flow must break even (approx 0)'
    );
    assert.ok(
      res.schedule[41].operatingCashFlow > 0,
      'Month 42 cash flow must be positive'
    );
  });
});
