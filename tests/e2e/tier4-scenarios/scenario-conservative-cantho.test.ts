import test from 'node:test';
import assert from 'node:assert';
import { runSimulation } from '../helpers/engine-adapter';
import { assertCurrencyClose, assertScheduleReconciliation } from '../helpers/assertions';
import type { LoanInput, HouseholdInput } from '../helpers/test-types';

test('Tier 4: Scenario 5 — Multi-Generational Household in Can Tho (Conservative Equity)', async (t) => {
  const loan: LoanInput = {
    propertyPrice: 1_800_000_000, // 1.8 tỷ ₫ (Can Tho land + house)
    downPayment: 900_000_000,     // 900 tr ₫ (50% equity)
    loanAmount: 900_000_000,      // 900 tr ₫ loan
    loanTermMonths: 120,          // 10 years (120 months)
    repaymentMethod: 'EQUAL_PRINCIPAL',
    promoInterestRate: 7.0,       // 7.0% promo for 12 months
    promoPeriodMonths: 12,
    postPromoRate: 10.5,          // 10.5% floating
  };

  const household: HouseholdInput = {
    monthlyNetIncome: 35_000_000,         // Household net 35m VND
    essentialLivingExpenses: 16_000_000,  // Essentials 16m VND (Can Tho living costs)
    existingDebtPayments: 0,              // Zero other debt
    liquidSavings: 1_100_000_000,         // Leaves 200m initial buffer
    plannedEmergencyReserveFloor: 48_000_000, // 3 months essentials
  };

  await t.test('1. Initial closing buffer and Month 1 payment composition', async () => {
    const res = await runSimulation(loan, household);
    // Initial reserve: 1.1B - 900m = 200,000,000 VND
    assert.strictEqual(res.initialReserveBalance, 200_000_000);

    // Month 1 payment: P = 900m / 120 = 7,500,000; I = 900m * (0.07 / 12) = 5,250,000 => Total = 12,750,000 VND
    assertCurrencyClose(res.month1Payment, 12_750_000, 2);
    // Month 1 FCF: 35m - 16m - 12.75m = +6,250,000 VND (comfortable surplus)
    assertCurrencyClose(res.schedule[0].operatingCashFlow, 6_250_000, 2);
  });

  await t.test('2. Month 13 post-promo reset payment jump absorbs comfortably without deficit', async () => {
    const res = await runSimulation(loan, household);
    // Month 13: B[12] = 900m - 12 * 7.5m = 810m; I = 810m * (0.105 / 12) = 7,087,500 => DS = 14,587,500 VND
    // Promo end (Month 12): B[11] = 817.5m; I = 817.5m * (0.07 / 12) = 4,768,750 => DS = 12,268,750 VND
    assertCurrencyClose(res.postPromoPayment, 14_587_500, 5);

    // Month 13 FCF: 35m - 16m - 14.59m = +4,412,500 VND (still positive surplus!)
    assertCurrencyClose(res.schedule[12].operatingCashFlow, 4_412_500, 5);
    assert.strictEqual(res.firstNegativeCashFlowMonth, null, 'Zero deficit months across entire term');
  });

  await t.test('3. Non-alarmist status badge categorizes as SAFE buffer', async () => {
    const res = await runSimulation(loan, household);
    assert.strictEqual(res.affordabilityStatus, 'SAFE');
  });

  await t.test('4. Cumulative reserve trajectory steadily increases across all 120 months', async () => {
    const res = await runSimulation(loan, household);
    // Reserves never drop below the initial 200m buffer
    assert.strictEqual(res.lowestReserveBalance, 200_000_000);
    assert.strictEqual(res.lowestReserveMonth, 0);

    const finalMonth = res.schedule[119];
    // By month 120, reserve has grown significantly
    assert.ok(
      finalMonth.reserveBalance > 800_000_000,
      `Ending reserve has grown to ${finalMonth.reserveBalance}`
    );
    assertScheduleReconciliation(res.schedule, loan.loanAmount);
  });
});
