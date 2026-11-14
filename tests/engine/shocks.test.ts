import { describe, it, expect } from 'vitest';
import {
  calculateSimulation,
  LoanInput,
  HouseholdInput,
  StressScenarioInput,
} from '@/lib/depositguard/engine';

describe('Stress Scenarios: Rate Shocks, Income Shocks, and Expense Shocks', () => {
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
  };

  it('1. Applies +2pp rate shock elevating Month 13 rate to 14% and payment to 30,500,000 VND', () => {
    const shock2pp: StressScenarioInput = {
      rateShockPp: 2.0,
      incomeShockPercent: 0,
      incomeShockDurationMonths: 0,
      expenseShockPercent: 0,
    };

    const res = calculateSimulation(baseLoan, baseHousehold, shock2pp);

    expect(res.schedule[12].interestRate).toBe(14.0);
    // Balance at m12 = 1.9B; Interest at 14% = 1.9B * 0.14 / 12 = 22,166,667 VND; P = 8,333,333 => DS = 30,500,000 VND
    expect(res.postPromoPayment).toBe(30_500_000);
    expect(res.schedule[12].totalDebtService).toBe(30_500_000);
    expect(res.schedule[12].operatingCashFlow).toBe(55_000_000 - 30_000_000 - 30_500_000); // -5,500,000 VND
  });

  it('2. Applies +4pp rate shock elevating Month 13 rate to 16% and payment to 33,666,667 VND', () => {
    const shock4pp: StressScenarioInput = {
      rateShockPp: 4.0,
      incomeShockPercent: 0,
      incomeShockDurationMonths: 0,
      expenseShockPercent: 0,
    };

    const res = calculateSimulation(baseLoan, baseHousehold, shock4pp);

    expect(res.schedule[12].interestRate).toBe(16.0);
    // Balance at m12 = 1.9B; Interest at 16% = 1.9B * 0.16 / 12 = 25,333,333 VND; P = 8,333,333 => DS = 33,666,666 VND
    expect(res.postPromoPayment).toBe(33_666_666);
    expect(res.schedule[12].totalDebtService).toBe(33_666_666);
    expect(res.schedule[12].operatingCashFlow).toBe(55_000_000 - 30_000_000 - 33_666_666); // -8,666,666 VND
  });

  it('3. Applies -20% income shock for 3 months strictly reducing net income during shock window', () => {
    const incomeShock3m: StressScenarioInput = {
      rateShockPp: 0,
      incomeShockPercent: -20.0,
      incomeShockDurationMonths: 3,
      incomeShockStartMonth: 13,
      expenseShockPercent: 0,
    };

    const res = calculateSimulation(baseLoan, baseHousehold, incomeShock3m);
    const expectedShockedIncome = 44_000_000; // 55m * 0.8

    // Normal income for months 1..12
    for (let m = 1; m <= 12; m++) {
      expect(res.schedule[m - 1].netIncome).toBe(55_000_000);
    }

    // Shocked income for months 13..15
    for (let m = 13; m <= 15; m++) {
      expect(res.schedule[m - 1].netIncome).toBe(expectedShockedIncome);
    }

    // Restored income at month 16
    expect(res.schedule[15].netIncome).toBe(55_000_000);
  });

  it('4. Applies -20% income shock for 6 months across 6 consecutive months', () => {
    const incomeShock6m: StressScenarioInput = {
      rateShockPp: 0,
      incomeShockPercent: -20.0,
      incomeShockDurationMonths: 6,
      incomeShockStartMonth: 13,
      expenseShockPercent: 0,
    };

    const res = calculateSimulation(baseLoan, baseHousehold, incomeShock6m);

    for (let m = 13; m <= 18; m++) {
      expect(res.schedule[m - 1].netIncome).toBe(44_000_000);
    }
    expect(res.schedule[18].netIncome).toBe(55_000_000); // Month 19 restored
  });

  it('5. Triggers immediate deficit when income shock occurs during promotional period (Month 1..3)', () => {
    const promoIncomeShock: StressScenarioInput = {
      rateShockPp: 0,
      incomeShockPercent: -20.0,
      incomeShockDurationMonths: 3,
      incomeShockStartMonth: 1,
      expenseShockPercent: 0,
    };

    const res = calculateSimulation(baseLoan, baseHousehold, promoIncomeShock);

    // Month 1 income is 44m. Outlays = 30m + 20m = 50m. FCF = 44m - 50m = -6m.
    expect(res.firstNegativeCashFlowMonth).toBe(1);
    expect(res.schedule[0].operatingCashFlow).toBe(-6_000_000);
    expect(res.schedule[0].isDeficit).toBe(true);
  });

  it('6. Applies +10% essential expense shock across all months', () => {
    const expenseShock: StressScenarioInput = {
      rateShockPp: 0,
      incomeShockPercent: 0,
      incomeShockDurationMonths: 0,
      expenseShockPercent: 10.0,
    };

    const res = calculateSimulation(baseLoan, baseHousehold, expenseShock);
    const expectedEssentials = 33_000_000; // 30m * 1.10

    for (const item of res.schedule) {
      expect(item.essentialExpenses).toBe(expectedEssentials);
    }

    // Month 13 FCF = 55m - 33m - 27.333m = -5.333m
    expect(res.schedule[12].operatingCashFlow).toBe(55_000_000 - 33_000_000 - 27_333_333);
  });

  it('7. Accurately tracks running emergency reserve balance and identifies lowest reserve point', () => {
    const res = calculateSimulation(baseLoan, baseHousehold);

    // Initial reserve: 700m - 500m = 200,000,000 VND
    expect(res.initialReserveBalance).toBe(200_000_000);

    let running = res.initialReserveBalance;
    for (const item of res.schedule) {
      running += item.operatingCashFlow;
      expect(item.reserveBalance).toBe(running);
    }

    // In baseline scenario, months 1..12 accumulate +63.2m surplus before the -33.8m deficit trough,
    // so global minimum across the 240-month timeline occurs at month 0 (closing).
    expect(res.lowestReserveBalance).toBe(200_000_000);
    expect(res.lowestReserveMonth).toBe(0);

    // Post-reset deficit trough reaches its local minimum at Month 40
    const postResetReserves = res.schedule.slice(12).map((item) => item.reserveBalance);
    const minPostReset = Math.min(...postResetReserves);
    const minPostResetMonth = res.schedule.findIndex((item) => item.reserveBalance === minPostReset) + 1;
    expect(minPostResetMonth).toBe(40);

    // Under severe rate shock (+4pp), deficit depletes reserves below initial closing balance
    const shock4ppRes = calculateSimulation(baseLoan, baseHousehold, {
      rateShockPp: 4.0,
      incomeShockPercent: 0,
      incomeShockDurationMonths: 0,
      expenseShockPercent: 0,
    });
    expect(shock4ppRes.lowestReserveBalance).toBeLessThan(shock4ppRes.initialReserveBalance);
    expect(shock4ppRes.lowestReserveMonth).toBeGreaterThan(0);
  });
});
