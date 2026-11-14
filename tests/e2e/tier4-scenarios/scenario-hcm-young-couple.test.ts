import test from 'node:test';
import assert from 'node:assert';
import { runSimulation, solveReverseAffordability } from '../helpers/engine-adapter';
import { assertCurrencyClose, assertPercentClose, assertScheduleReconciliation } from '../helpers/assertions';
import type { LoanInput, HouseholdInput } from '../helpers/test-types';

test('Tier 4: Scenario 1 — Young Couple in Ho Chi Minh City (First-Time Buyers)', async (t) => {
  const loan: LoanInput = {
    propertyPrice: 2_800_000_000, // 2.8 tỷ ₫ (Thu Duc apartment)
    downPayment: 800_000_000,     // 800 tr ₫
    loanAmount: 2_000_000_000,    // 2.0 tỷ ₫
    loanTermMonths: 240,          // 20 years
    repaymentMethod: 'EQUAL_PRINCIPAL',
    promoInterestRate: 6.8,       // 6.8%
    promoPeriodMonths: 12,        // 12 months
    postPromoRate: 11.5,          // 11.5% floating
  };

  const household: HouseholdInput = {
    monthlyNetIncome: 45_000_000,         // Combined net 45m VND
    essentialLivingExpenses: 22_000_000,  // Rent & essentials 22m VND
    existingDebtPayments: 3_000_000,      // Small wedding debt 3m VND
    liquidSavings: 950_000_000,           // Leaves 150m buffer at closing
    plannedEmergencyReserveFloor: 66_000_000, // 3 months essentials
  };

  await t.test('1. Upfront closing capital & Month 1 affordability', async () => {
    const res = await runSimulation(loan, household);
    // Initial reserve: 950m - 800m = 150,000,000 VND
    assert.strictEqual(res.initialReserveBalance, 150_000_000);
    assert.strictEqual(res.upfrontCashRequired, 800_000_000);

    // Month 1 payment: P = 2B / 240 = 8,333,333; I = 2B * (0.068 / 12) = 11,333,333 => Total = 19,666,667 VND
    assertCurrencyClose(res.month1Payment, 19_666_667, 5, 'Month 1 payment');
    // Month 1 DTI: (3m debt + 19.67m DS) / 45m = 22.67m / 45m = 50.37%
    assertPercentClose((res.month1DtiRatio ?? 0) * 100, 50.37, 0.1, 'Month 1 DTI');
    // Month 1 FCF: 45m - 22m - 3m - 19.67m = +333,333 VND (tight but positive)
    assertCurrencyClose(res.schedule[0].operatingCashFlow, 333_333, 5, 'Month 1 FCF');
  });

  await t.test('2. Teaser rate cliff at Month 13 triggers cash-flow deficit', async () => {
    const res = await runSimulation(loan, household);
    assert.strictEqual(res.postPromoMonth, 13);

    // Month 12 payment (before cliff): B[11] = 1,908,333,333; I = 10,814,167 => DS = 19,147,500
    // Month 13 payment (reset to 11.5%): B[12] = 1.9B; I = 1.9B * (0.115 / 12) = 18,208,333 => DS = 26,541,667
    assertCurrencyClose(res.postPromoPayment, 26_541_667, 5, 'Month 13 payment');
    assertCurrencyClose(res.paymentJumpAmount, 7_394_444, 10, 'Payment jump');

    // Total Month 13 outlays: 22m + 3m + 26.54m = 51.54m > 45m income => Deficit!
    assert.strictEqual(res.firstNegativeCashFlowMonth, 13, 'First deficit month');
    assertCurrencyClose(res.schedule[12].operatingCashFlow, -6_541_667, 5, 'Month 13 FCF deficit');
    assert.strictEqual(res.affordabilityStatus, 'DEFICIT');
  });

  await t.test('3. Emergency reserve burn trajectory and terminal reconciliation', async () => {
    const res = await runSimulation(loan, household);
    // Reserves steadily drain after month 13
    assert.ok(
      res.lowestReserveBalance < household.plannedEmergencyReserveFloor!,
      'Reserve breaches the 66m emergency buffer floor'
    );
    assertScheduleReconciliation(res.schedule, loan.loanAmount);
  });

  await t.test('4. Corrective lever solves safe loan to prevent young couple cash-flow deficit', async () => {
    const solverRes = await solveReverseAffordability(loan, household);
    // Maximum affordable monthly mortgage payment: 45m - 22m - 3m = 20,000,000 VND
    // At month 13 (post-promo floating 11.5%): DS[13] <= 20,000,000 VND
    // L_max = 20m / (1/240 + 228/240 * (0.115/12)) = 20m / (0.0041667 + 0.0091042) = 20m / 0.0132708 ~ 1,507,064,286 VND
    assertCurrencyClose(solverRes.maxSafeLoanAmount, 1_507_064_286, 20_000, 'Solved safe loan ceiling');
    // Extra down payment needed: ~493m VND
    assertCurrencyClose(solverRes.additionalEquityNeeded, 492_935_714, 20_000, 'Extra equity needed');
  });
});
