import test from 'node:test';
import assert from 'node:assert';
import { runSimulation } from '../helpers/engine-adapter';
import type { LoanInput, HouseholdInput } from '../helpers/test-types';

test('Tier 2: Boundary & Corner Cases — Household Cash Flow & Reserves', async (t) => {
  const baseLoan: LoanInput = {
    propertyPrice: 2_000_000_000,
    downPayment: 500_000_000,
    loanAmount: 1_500_000_000,
    loanTermMonths: 240,
    repaymentMethod: 'EQUAL_PRINCIPAL',
    promoInterestRate: 7.0,
    promoPeriodMonths: 12,
    postPromoRate: 11.5,
  };

  await t.test('1. Zero net income: DTI is null, deficit flagged at month 1', async () => {
    const household: HouseholdInput = {
      monthlyNetIncome: 0,
      essentialLivingExpenses: 20_000_000,
      existingDebtPayments: 0,
      liquidSavings: 600_000_000,
    };
    const res = await runSimulation(baseLoan, household);
    assert.strictEqual(res.month1DtiRatio, null, 'DTI must be null');
    assert.strictEqual(res.firstNegativeCashFlowMonth, 1, 'First deficit at month 1');
    assert.strictEqual(res.affordabilityStatus, 'DEFICIT');
  });

  await t.test('2. Living expenses equal net income: Zero margin before mortgage guarantees deficit', async () => {
    const household: HouseholdInput = {
      monthlyNetIncome: 30_000_000,
      essentialLivingExpenses: 30_000_000, // Essentials == Income
      existingDebtPayments: 0,
      liquidSavings: 600_000_000,
    };
    const res = await runSimulation(baseLoan, household);
    assert.strictEqual(res.firstNegativeCashFlowMonth, 1, 'Deficit starts at month 1');
    // Month 1 FCF = 30m - (30m + DS) = -DS
    assert.strictEqual(res.schedule[0].operatingCashFlow, -res.month1Payment);
  });

  await t.test('3. Living expenses exceed net income (E > Y) before any mortgage payments', async () => {
    const household: HouseholdInput = {
      monthlyNetIncome: 25_000_000,
      essentialLivingExpenses: 30_000_000, // Deficit of 5m even with zero debt
      existingDebtPayments: 0,
      liquidSavings: 700_000_000,
    };
    const res = await runSimulation(baseLoan, household);
    assert.strictEqual(res.firstNegativeCashFlowMonth, 1);
    assert.ok(res.schedule[0].operatingCashFlow < -res.month1Payment);
  });

  await t.test('4. Zero liquid savings: Immediate closing cash shortfall', async () => {
    const household: HouseholdInput = {
      monthlyNetIncome: 60_000_000,
      essentialLivingExpenses: 25_000_000,
      existingDebtPayments: 0,
      liquidSavings: 0,
    };
    const res = await runSimulation(baseLoan, household);
    assert.strictEqual(res.initialReserveBalance, -baseLoan.downPayment);
    assert.strictEqual(res.affordabilityStatus, 'DEFICIT');
  });

  await t.test('5. Liquid savings exactly equal down payment: Month 0 buffer is exactly 0', async () => {
    const household: HouseholdInput = {
      monthlyNetIncome: 60_000_000,
      essentialLivingExpenses: 25_000_000,
      existingDebtPayments: 0,
      liquidSavings: baseLoan.downPayment, // 500,000,000
    };
    const res = await runSimulation(baseLoan, household);
    assert.strictEqual(res.initialReserveBalance, 0, 'Initial reserve is 0 VND');
  });

  await t.test('6. Planned emergency reserve floor set to 0 VND', async () => {
    const household: HouseholdInput = {
      monthlyNetIncome: 60_000_000,
      essentialLivingExpenses: 25_000_000,
      existingDebtPayments: 0,
      liquidSavings: 700_000_000,
      plannedEmergencyReserveFloor: 0,
    };
    const res = await runSimulation(baseLoan, household);
    assert.strictEqual(res.affordabilityStatus, 'SAFE');
  });

  await t.test('7. Planned emergency reserve floor larger than liquid savings flags VULNERABLE', async () => {
    const household: HouseholdInput = {
      monthlyNetIncome: 60_000_000,
      essentialLivingExpenses: 25_000_000,
      existingDebtPayments: 0,
      liquidSavings: 600_000_000, // Leaves 100m reserve
      plannedEmergencyReserveFloor: 300_000_000, // User wants 300m floor
    };
    const res = await runSimulation(baseLoan, household);
    // Reserves never drop below 0, but are below 300m floor => VULNERABLE
    assert.ok(res.lowestReserveBalance < 300_000_000);
    assert.strictEqual(res.affordabilityStatus, 'VULNERABLE');
  });
});
