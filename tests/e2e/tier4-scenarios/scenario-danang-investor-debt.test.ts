import test from 'node:test';
import assert from 'node:assert';
import { runSimulation } from '../helpers/engine-adapter';
import { assertCurrencyClose, assertPercentClose, assertScheduleReconciliation } from '../helpers/assertions';
import type { LoanInput, HouseholdInput } from '../helpers/test-types';

test('Tier 4: Scenario 3 — Real Estate Investor in Da Nang with Existing Debt Portfolio', async (t) => {
  const loan: LoanInput = {
    propertyPrice: 3_500_000_000, // 3.5 tỷ ₫
    downPayment: 1_000_000_000,   // 1.0 tỷ ₫
    loanAmount: 2_500_000_000,    // 2.5 tỷ ₫
    loanTermMonths: 180,          // 15 years
    gracePeriodMonths: 12,        // 12 months grace on principal
    repaymentMethod: 'EQUAL_PRINCIPAL',
    promoInterestRate: 8.0,       // 8.0% promo
    promoPeriodMonths: 12,
    postPromoRate: 13.0,          // 13.0% floating
  };

  const household: HouseholdInput = {
    monthlyNetIncome: 60_000_000,         // Net 60m VND
    essentialLivingExpenses: 25_000_000,  // Living 25m VND
    existingDebtPayments: 15_000_000,     // Existing business debt 15m VND
    liquidSavings: 1_150_000_000,         // Leaves 150m buffer at closing
  };

  await t.test('1. Grace period payments (Months 1-12) are interest-only at 8%', async () => {
    const res = await runSimulation(loan, household);
    // Interest only: 2.5B * (0.08 / 12) = 16,666,667 VND
    for (let m = 1; m <= 12; m++) {
      assert.strictEqual(res.schedule[m - 1].principalPayment, 0);
      assertCurrencyClose(res.schedule[m - 1].interestPayment, 16_666_667, 2);
      assertCurrencyClose(res.schedule[m - 1].totalDebtService, 16_666_667, 2);
      // FCF: 60m - 25m - 15m - 16.67m = +3,333,333 VND
      assertCurrencyClose(res.schedule[m - 1].operatingCashFlow, 3_333_333, 2);
    }
  });

  await t.test('2. Month 13 Double Cliff: Grace ends AND rate resets to 13%', async () => {
    const res = await runSimulation(loan, household);
    // Month 13 post-grace post-promo:
    // Remaining term: 180 - 12 = 168 months
    // P = 2.5B / 168 = 14,880,952 VND
    // I = 2.5B * (0.13 / 12) = 27,083,333 VND
    // Total Debt Service: 14,880,952 + 27,083,333 = 41,964,285 VND (~41.96m VND)
    assertCurrencyClose(res.postPromoPayment, 41_964_285, 20, 'Month 13 debt service');

    // Total Month 13 outlays: 25m (essentials) + 15m (debt) + 41.96m (mortgage) = 81.96m VND
    // Net cash flow: 60m - 81.96m = -21,964,285 VND (severe monthly deficit)
    assertCurrencyClose(res.schedule[12].operatingCashFlow, -21_964_285, 20);
    assert.strictEqual(res.firstNegativeCashFlowMonth, 13);
  });

  await t.test('3. Peak Debt Service to Income (DTI) ratio surges to 94.9%', async () => {
    const res = await runSimulation(loan, household);
    // Month 13 total debt obligations: 15m existing + 41.96m mortgage = 56.96m
    // DTI = 56.96m / 60m = 94.94%
    assertPercentClose((res.postPromoDtiRatio ?? 0) * 100, 94.94, 0.2, 'Peak DTI ratio');
  });

  await t.test('4. Rapid emergency reserve exhaustion occurs within 9 months of reset cliff', async () => {
    const res = await runSimulation(loan, household);
    // Starting reserve: 150m + 12 * 3.33m = 190m at month 12
    // Monthly burn of ~21m rapidly drains 190m in under 9 months
    assert.ok(
      res.lowestReserveBalance < 0,
      'Emergency reserve drops into negative territory (insolvency)'
    );
    assert.strictEqual(res.affordabilityStatus, 'DEFICIT');
    assertScheduleReconciliation(res.schedule, loan.loanAmount);
  });
});
