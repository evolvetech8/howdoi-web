import test from 'node:test';
import assert from 'node:assert';
import { runSimulation } from '../helpers/engine-adapter';
import { assertCurrencyClose, assertScheduleReconciliation } from '../helpers/assertions';
import type { LoanInput, HouseholdInput, StressScenarioInput } from '../helpers/test-types';

test('Tier 4: Scenario 2 — Family Upgrading in Hanoi (Urban Upgrade with Two Children)', async (t) => {
  const loan: LoanInput = {
    propertyPrice: 4_500_000_000, // 4.5 tỷ ₫ (Cau Giay 3BR)
    downPayment: 1_800_000_000,   // 1.8 tỷ ₫ (from sale of small apartment)
    loanAmount: 2_700_000_000,    // 2.7 tỷ ₫
    loanTermMonths: 300,          // 25 years
    repaymentMethod: 'ANNUITY',
    promoInterestRate: 7.5,       // 7.5% for 24 months
    promoPeriodMonths: 24,
    postPromoRate: 12.0,          // 12.0% floating
  };

  const household: HouseholdInput = {
    monthlyNetIncome: 75_000_000,         // Combined net 75m VND
    essentialLivingExpenses: 40_000_000,  // Two kids, schooling, living 40m VND
    existingDebtPayments: 8_000_000,      // Car loan 8m VND
    liquidSavings: 2_200_000_000,         // Leaves 400m emergency fund after 1.8B down payment
    plannedEmergencyReserveFloor: 120_000_000, // 3 months essentials
  };

  await t.test('1. Initial closing position and 24-month promotional stability', async () => {
    const res = await runSimulation(loan, household);
    // Initial reserve: 2.2B - 1.8B = 400,000,000 VND
    assert.strictEqual(res.initialReserveBalance, 400_000_000);

    // Month 1 payment (annuity at 7.5% for 300 months): 19,952,762 VND
    assertCurrencyClose(res.month1Payment, 19_952_762, 5, 'Month 1 Annuity payment');
    // Payments remain steady through Month 24
    for (let m = 1; m <= 24; m++) {
      assertCurrencyClose(res.schedule[m - 1].totalDebtService, res.month1Payment, 5);
      assert.ok(res.schedule[m - 1].operatingCashFlow > 0);
    }
  });

  await t.test('2. Month 25 reset payment jump to ~28.00m VND', async () => {
    const res = await runSimulation(loan, household);
    assert.strictEqual(res.postPromoMonth, 25);
    // Recalculated level payment for remaining 276 months at 12.0%: 28,002,523 VND
    assertCurrencyClose(res.postPromoPayment, 28_002_523, 10, 'Month 25 reset payment');
    // In baseline scenario without shock: 75m - 40m - 8m - 28.00m = -1.00m deficit
    assert.strictEqual(res.firstNegativeCashFlowMonth, 25);
  });

  await t.test('3. Stress Test: Maternity/Business Income Shock (-20% for 6 months at month 25)', async () => {
    const maternityShock: StressScenarioInput = {
      rateShockPp: 0,
      incomeShockPercent: -20.0, // Drops from 75m to 60m
      incomeShockDurationMonths: 6,
      incomeShockStartMonth: 25,
      expenseShockPercent: 0,
    };
    const res = await runSimulation(loan, household, maternityShock);

    // During shock (months 25-30):
    // Inflow: 60,000,000 VND
    // Outflows: 40m (essentials) + 8m (car) + 28.00m (mortgage) = 76.00m VND
    // Monthly deficit: -16,002,523 VND
    for (let m = 25; m <= 30; m++) {
      assertCurrencyClose(res.schedule[m - 1].operatingCashFlow, -16_002_523, 10);
    }

    // Cumulative 6-month shock burn: ~102m VND
    // Because initial reserve had 400m + accumulated surplus, reserve remains well above 0
    assert.ok(
      res.lowestReserveBalance > 0,
      `Reserve remains positive (${res.lowestReserveBalance}) due to strong 400m initial cushion`
    );
    assertScheduleReconciliation(res.schedule, loan.loanAmount);
  });
});
