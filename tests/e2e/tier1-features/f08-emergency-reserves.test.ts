import test from 'node:test';
import assert from 'node:assert';
import { runSimulation } from '../helpers/engine-adapter';
import type { LoanInput, HouseholdInput } from '../helpers/test-types';

test('F08: Emergency Reserve Tracking & Lowest Reserve', async (t) => {
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
    monthlyNetIncome: 55_000_000,
    essentialLivingExpenses: 30_000_000,
    existingDebtPayments: 0,
    liquidSavings: 700_000_000,
    plannedEmergencyReserveFloor: 90_000_000, // 3 months essentials
  };

  await t.test('1. Initial reserve at month 0 equals liquid savings minus down payment', async () => {
    const res = await runSimulation(baseLoan, baseHousehold);
    const expectedInitialReserve = baseHousehold.liquidSavings - baseLoan.downPayment; // 200,000,000
    assert.strictEqual(res.initialReserveBalance, expectedInitialReserve);
    assert.strictEqual(res.upfrontCashRequired, baseLoan.downPayment);
  });

  await t.test('2. Running monthly reserve balance is updated accurately every month', async () => {
    const res = await runSimulation(baseLoan, baseHousehold);
    let expectedBalance = res.initialReserveBalance;

    for (const item of res.schedule) {
      expectedBalance += item.operatingCashFlow;
      assert.strictEqual(
        item.reserveBalance,
        expectedBalance,
        `Reserve balance at month ${item.month}`
      );
    }
  });

  await t.test('3. Accurately pinpoints lowest reserve balance and corresponding month index', async () => {
    const res = await runSimulation(baseLoan, baseHousehold);

    let minBal = res.initialReserveBalance;
    let minMonth = 0;
    for (const item of res.schedule) {
      if (item.reserveBalance < minBal) {
        minBal = item.reserveBalance;
        minMonth = item.month;
      }
    }

    assert.strictEqual(res.lowestReserveBalance, minBal, 'Lowest reserve balance match');
    assert.strictEqual(res.lowestReserveMonth, minMonth, 'Lowest reserve month match');
  });

  await t.test('4. Detects initial liquidity shortfall when savings < down payment', async () => {
    const deficitSavingsHousehold: HouseholdInput = {
      ...baseHousehold,
      liquidSavings: 400_000_000, // 100m less than 500m down payment
    };
    const res = await runSimulation(baseLoan, deficitSavingsHousehold);

    assert.strictEqual(res.initialReserveBalance, -100_000_000, 'Initial reserve must be negative');
    assert.strictEqual(res.affordabilityStatus, 'DEFICIT', 'Status must be DEFICIT');
  });

  await t.test('5. Identifies reserve floor breach when reserve dips below planned safety buffer', async () => {
    const tightSavingsHousehold: HouseholdInput = {
      ...baseHousehold,
      liquidSavings: 550_000_000, // leaves 50m reserve at closing (< 90m floor)
      plannedEmergencyReserveFloor: 90_000_000,
    };
    const res = await runSimulation(baseLoan, tightSavingsHousehold);

    assert.ok(
      res.lowestReserveBalance < (tightSavingsHousehold.plannedEmergencyReserveFloor ?? 0),
      'Lowest reserve dips below emergency floor'
    );
  });
});
