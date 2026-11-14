import test from 'node:test';
import assert from 'node:assert';
import { runSimulation } from '../helpers/engine-adapter';
import { assertScheduleReconciliation, assertCurrencyClose } from '../helpers/assertions';
import type { LoanInput, HouseholdInput, StressScenarioInput } from '../helpers/test-types';

test('Tier 3: Cross-Feature Combinations — Pairwise & Multi-Variable Stress Matrix', async (t) => {
  await t.test('Combo 1: Equal Principal + Promo Reset (7%->12%) + 12m Grace Period + Healthy Reserve', async () => {
    const loan: LoanInput = {
      propertyPrice: 2_500_000_000,
      downPayment: 500_000_000,
      loanAmount: 2_000_000_000,
      loanTermMonths: 240,
      gracePeriodMonths: 12,
      repaymentMethod: 'EQUAL_PRINCIPAL',
      promoInterestRate: 7.0,
      promoPeriodMonths: 12,
      postPromoRate: 12.0,
    };
    const household: HouseholdInput = {
      monthlyNetIncome: 65_000_000,
      essentialLivingExpenses: 28_000_000,
      existingDebtPayments: 0,
      liquidSavings: 800_000_000, // 300m initial buffer
    };

    const res = await runSimulation(loan, household);
    // Grace ends AND promo ends simultaneously at month 13
    // M12 payment (grace promo): Interest only = 2B * (0.07/12) = 11,666,667 VND
    // M13 payment (post-grace post-promo): P = 2B/228 = 8,771,930; I = 2B * (0.12/12) = 20,000,000 => DS = 28,771,930
    assertCurrencyClose(res.schedule[11].totalDebtService, 11_666_667, 2, 'Month 12 payment');
    assertCurrencyClose(res.schedule[12].totalDebtService, 28_771_930, 5, 'Month 13 payment');
    assertScheduleReconciliation(res.schedule, loan.loanAmount);
  });

  await t.test('Combo 2: Annuity + Rate Reset (7%->12%) + 24m Grace Period + Income Shock (-20% 6m at m25)', async () => {
    const loan: LoanInput = {
      propertyPrice: 3_000_000_000,
      downPayment: 600_000_000,
      loanAmount: 2_400_000_000,
      loanTermMonths: 240,
      gracePeriodMonths: 24,
      repaymentMethod: 'ANNUITY',
      promoInterestRate: 7.0,
      promoPeriodMonths: 24,
      postPromoRate: 12.0,
    };
    const household: HouseholdInput = {
      monthlyNetIncome: 70_000_000,
      essentialLivingExpenses: 30_000_000,
      existingDebtPayments: 0,
      liquidSavings: 900_000_000,
    };
    const shock: StressScenarioInput = {
      rateShockPp: 0,
      incomeShockPercent: -20.0,
      incomeShockDurationMonths: 6,
      incomeShockStartMonth: 25,
      expenseShockPercent: 0,
    };

    const res = await runSimulation(loan, household, shock);
    assert.strictEqual(res.postPromoMonth, 25);
    // Months 25-30 net income drops to 56m
    for (let m = 25; m <= 30; m++) {
      assertCurrencyClose(res.schedule[m - 1].netIncome, 56_000_000, 1);
    }
    assertScheduleReconciliation(res.schedule, loan.loanAmount);
  });

  await t.test('Combo 3: Equal Principal + +4pp Extreme Rate Shock + Expense Shock (+10%)', async () => {
    const loan: LoanInput = {
      propertyPrice: 2_000_000_000,
      downPayment: 500_000_000,
      loanAmount: 1_500_000_000,
      loanTermMonths: 240,
      repaymentMethod: 'EQUAL_PRINCIPAL',
      promoInterestRate: 7.0,
      promoPeriodMonths: 12,
      postPromoRate: 12.0,
    };
    const household: HouseholdInput = {
      monthlyNetIncome: 50_000_000,
      essentialLivingExpenses: 25_000_000,
      existingDebtPayments: 0,
      liquidSavings: 600_000_000,
    };
    const shock: StressScenarioInput = {
      rateShockPp: 4.0, // Floating rate jumps to 16.0%
      incomeShockPercent: 0,
      incomeShockDurationMonths: 0,
      expenseShockPercent: 10.0, // Expenses become 27.5m
    };

    const res = await runSimulation(loan, household, shock);
    assert.strictEqual(res.schedule[12].interestRate, 16.0);
    assert.strictEqual(res.schedule[0].essentialExpenses, 27_500_000);
    assert.strictEqual(res.firstNegativeCashFlowMonth, 13, 'Deficit triggered at Month 13');
    assertScheduleReconciliation(res.schedule, loan.loanAmount);
  });

  await t.test('Combo 4: Annuity + Existing Debt + Rate Shock (+2pp) + Zero Initial Liquidity Buffer', async () => {
    const loan: LoanInput = {
      propertyPrice: 1_800_000_000,
      downPayment: 400_000_000,
      loanAmount: 1_400_000_000,
      loanTermMonths: 180,
      repaymentMethod: 'ANNUITY',
      promoInterestRate: 7.5,
      promoPeriodMonths: 12,
      postPromoRate: 11.5,
    };
    const household: HouseholdInput = {
      monthlyNetIncome: 45_000_000,
      essentialLivingExpenses: 20_000_000,
      existingDebtPayments: 8_000_000,
      liquidSavings: 400_000_000, // Exactly equals down payment => Initial reserve = 0
    };
    const shock: StressScenarioInput = {
      rateShockPp: 2.0, // Floating rate becomes 13.5%
      incomeShockPercent: 0,
      incomeShockDurationMonths: 0,
      expenseShockPercent: 0,
    };

    const res = await runSimulation(loan, household, shock);
    assert.strictEqual(res.initialReserveBalance, 0);
    assert.strictEqual(res.schedule[12].interestRate, 13.5);
    assertScheduleReconciliation(res.schedule, loan.loanAmount);
  });

  await t.test('Combo 5: Equal Principal + Triple Shock (+4pp Rate, -20% Income 6m, +10% Expense)', async () => {
    const loan: LoanInput = {
      propertyPrice: 2_500_000_000,
      downPayment: 500_000_000,
      loanAmount: 2_000_000_000,
      loanTermMonths: 240,
      repaymentMethod: 'EQUAL_PRINCIPAL',
      promoInterestRate: 7.0,
      promoPeriodMonths: 12,
      postPromoRate: 12.0,
    };
    const household: HouseholdInput = {
      monthlyNetIncome: 65_000_000,
      essentialLivingExpenses: 28_000_000,
      existingDebtPayments: 0,
      liquidSavings: 800_000_000,
    };
    const tripleShock: StressScenarioInput = {
      rateShockPp: 4.0, // 16%
      incomeShockPercent: -20.0, // 52m
      incomeShockDurationMonths: 6,
      incomeShockStartMonth: 13,
      expenseShockPercent: 10.0, // 30.8m
    };

    const res = await runSimulation(loan, household, tripleShock);
    assert.strictEqual(res.firstNegativeCashFlowMonth, 13);
    assert.strictEqual(res.affordabilityStatus, 'DEFICIT');
    assertScheduleReconciliation(res.schedule, loan.loanAmount);
  });

  await t.test('Combo 6: Annuity + Triple Shock (+2pp Rate, -20% Income 3m, +10% Expense)', async () => {
    const loan: LoanInput = {
      propertyPrice: 2_000_000_000,
      downPayment: 500_000_000,
      loanAmount: 1_500_000_000,
      loanTermMonths: 240,
      repaymentMethod: 'ANNUITY',
      promoInterestRate: 7.2,
      promoPeriodMonths: 12,
      postPromoRate: 11.8,
    };
    const household: HouseholdInput = {
      monthlyNetIncome: 55_000_000,
      essentialLivingExpenses: 22_000_000,
      existingDebtPayments: 0,
      liquidSavings: 700_000_000,
    };
    const shock: StressScenarioInput = {
      rateShockPp: 2.0,
      incomeShockPercent: -20.0,
      incomeShockDurationMonths: 3,
      incomeShockStartMonth: 13,
      expenseShockPercent: 10.0,
    };

    const res = await runSimulation(loan, household, shock);
    assertScheduleReconciliation(res.schedule, loan.loanAmount);
  });

  await t.test('Combo 7: Equal Principal + Short 60m Term + High Down Payment (60% equity)', async () => {
    const loan: LoanInput = {
      propertyPrice: 2_000_000_000,
      downPayment: 1_200_000_000,
      loanAmount: 800_000_000,
      loanTermMonths: 60,
      repaymentMethod: 'EQUAL_PRINCIPAL',
      promoInterestRate: 6.5,
      promoPeriodMonths: 12,
      postPromoRate: 10.5,
    };
    const household: HouseholdInput = {
      monthlyNetIncome: 60_000_000,
      essentialLivingExpenses: 25_000_000,
      existingDebtPayments: 0,
      liquidSavings: 1_400_000_000,
    };

    const res = await runSimulation(loan, household);
    assert.strictEqual(res.schedule.length, 60);
    assert.strictEqual(res.firstNegativeCashFlowMonth, null, 'Conservative loan has no deficit');
    assert.strictEqual(res.affordabilityStatus, 'SAFE');
    assertScheduleReconciliation(res.schedule, loan.loanAmount);
  });

  await t.test('Combo 8: Annuity + Long 360m Term + Low Promo (5.5%) + High Floating (13.5%)', async () => {
    const loan: LoanInput = {
      propertyPrice: 3_500_000_000,
      downPayment: 700_000_000,
      loanAmount: 2_800_000_000,
      loanTermMonths: 360,
      repaymentMethod: 'ANNUITY',
      promoInterestRate: 5.5,
      promoPeriodMonths: 24,
      postPromoRate: 13.5,
    };
    const household: HouseholdInput = {
      monthlyNetIncome: 75_000_000,
      essentialLivingExpenses: 35_000_000,
      existingDebtPayments: 0,
      liquidSavings: 900_000_000,
    };

    const res = await runSimulation(loan, household);
    assert.strictEqual(res.postPromoMonth, 25);
    assert.ok(res.paymentJumpAmount > 0, 'Sharp payment jump at month 25');
    assertScheduleReconciliation(res.schedule, loan.loanAmount);
  });

  await t.test('Combo 9: Equal Principal + Zero Promo + Grace Period (12m)', async () => {
    const loan: LoanInput = {
      propertyPrice: 1_500_000_000,
      downPayment: 300_000_000,
      loanAmount: 1_200_000_000,
      loanTermMonths: 120,
      gracePeriodMonths: 12,
      repaymentMethod: 'EQUAL_PRINCIPAL',
      promoInterestRate: 11.0,
      promoPeriodMonths: 0, // No promo
      postPromoRate: 11.0,
    };
    const household: HouseholdInput = {
      monthlyNetIncome: 45_000_000,
      essentialLivingExpenses: 20_000_000,
      existingDebtPayments: 0,
      liquidSavings: 450_000_000,
    };

    const res = await runSimulation(loan, household);
    // Principal starts at month 13
    assert.strictEqual(res.schedule[0].principalPayment, 0);
    assert.strictEqual(res.schedule[11].principalPayment, 0);
    assert.ok(res.schedule[12].principalPayment > 0);
    assertScheduleReconciliation(res.schedule, loan.loanAmount);
  });

  await t.test('Combo 10: Annuity + Initial Deficit (Savings < Down Payment) + Rate Shock', async () => {
    const loan: LoanInput = {
      propertyPrice: 2_000_000_000,
      downPayment: 600_000_000,
      loanAmount: 1_400_000_000,
      loanTermMonths: 240,
      repaymentMethod: 'ANNUITY',
      promoInterestRate: 7.0,
      promoPeriodMonths: 12,
      postPromoRate: 11.5,
    };
    const household: HouseholdInput = {
      monthlyNetIncome: 50_000_000,
      essentialLivingExpenses: 22_000_000,
      existingDebtPayments: 0,
      liquidSavings: 450_000_000, // 150m shortfall at closing
    };
    const shock: StressScenarioInput = {
      rateShockPp: 2.0,
      incomeShockPercent: 0,
      incomeShockDurationMonths: 0,
      expenseShockPercent: 0,
    };

    const res = await runSimulation(loan, household, shock);
    assert.strictEqual(res.initialReserveBalance, -150_000_000);
    assert.strictEqual(res.affordabilityStatus, 'DEFICIT');
    assertScheduleReconciliation(res.schedule, loan.loanAmount);
  });

  await t.test('Combo 11: Equal Principal + High Existing Debt (15m/mo) + Rate Shock (+2pp)', async () => {
    const loan: LoanInput = {
      propertyPrice: 2_200_000_000,
      downPayment: 500_000_000,
      loanAmount: 1_700_000_000,
      loanTermMonths: 240,
      repaymentMethod: 'EQUAL_PRINCIPAL',
      promoInterestRate: 6.8,
      promoPeriodMonths: 12,
      postPromoRate: 11.8,
    };
    const household: HouseholdInput = {
      monthlyNetIncome: 55_000_000,
      essentialLivingExpenses: 20_000_000,
      existingDebtPayments: 15_000_000,
      liquidSavings: 700_000_000,
    };
    const shock: StressScenarioInput = {
      rateShockPp: 2.0,
      incomeShockPercent: 0,
      incomeShockDurationMonths: 0,
      expenseShockPercent: 0,
    };

    const res = await runSimulation(loan, household, shock);
    // Month 13 DTI: (15m debt + DS[13]) / 55m
    assert.ok((res.postPromoDtiRatio ?? 0) > 0.65, 'DTI exceeds 65%');
    assertScheduleReconciliation(res.schedule, loan.loanAmount);
  });

  await t.test('Combo 12: Annuity + Full 360m Term + Grace Period (12m) + Income Shock (-20% 6m)', async () => {
    const loan: LoanInput = {
      propertyPrice: 2_500_000_000,
      downPayment: 500_000_000,
      loanAmount: 2_000_000_000,
      loanTermMonths: 360,
      gracePeriodMonths: 12,
      repaymentMethod: 'ANNUITY',
      promoInterestRate: 7.0,
      promoPeriodMonths: 12,
      postPromoRate: 11.5,
    };
    const household: HouseholdInput = {
      monthlyNetIncome: 55_000_000,
      essentialLivingExpenses: 25_000_000,
      existingDebtPayments: 0,
      liquidSavings: 750_000_000,
    };
    const shock: StressScenarioInput = {
      rateShockPp: 0,
      incomeShockPercent: -20.0,
      incomeShockDurationMonths: 6,
      incomeShockStartMonth: 13,
      expenseShockPercent: 0,
    };

    const res = await runSimulation(loan, household, shock);
    assertScheduleReconciliation(res.schedule, loan.loanAmount);
  });
});
