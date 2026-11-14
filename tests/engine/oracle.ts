/**
 * DepositGuard Milestone 1 - Independent BigInt Mathematical Differential Oracle
 * 
 * Standalone reference implementation written by EMPIRICAL CHALLENGER (challenger_m1_2).
 * Pure mathematical model using native JavaScript BigInt rational arithmetic.
 * Zero external dependencies. Zero imports from worker code.
 */

import { LoanInput, HouseholdInput, StressScenarioInput } from '@/lib/depositguard/engine/types';

export namespace BigIntOracle {
  /**
   * Exact integer rational division with half-up rounding for non-negative values.
   */
  export function roundDiv(x: bigint, y: bigint): bigint {
    if (y === 0n) throw new Error('Division by zero in BigInt rational arithmetic');
    return (2n * x + y) / (2n * y);
  }

  /**
   * Independent rational annuity formula:
   * A = B * [ i / (1 - (1 + i)^(-n)) ]
   * For i = r / 1200:
   * Let rInt = r * 10000, D = 12000000 (rate scaled to 4 decimal places).
   * 1 + i = (D + rInt) / D.
   * (1 + i)^n = (D + rInt)^n / D^n.
   * A = [ B * rInt * (D + rInt)^n ] / [ D * ((D + rInt)^n - D^n) ].
   */
  export function calculateAnnuityPayment(
    principal: bigint,
    ratePercent: number,
    remainingMonths: number
  ): bigint {
    if (remainingMonths <= 0 || principal <= 0n) return 0n;
    if (ratePercent <= 0) return roundDiv(principal, BigInt(remainingMonths));

    const scale = 10000n;
    const rInt = BigInt(Math.round(ratePercent * 10000));
    const D = 1200n * scale; // 12,000,000n
    const n = BigInt(remainingMonths);

    const D_plus_r = D + rInt;
    const powPlus = D_plus_r ** n;
    const powD = D ** n;

    const num = principal * rInt * powPlus;
    const den = D * (powPlus - powD);

    return roundDiv(num, den);
  }

  /**
   * Independent month-by-month amortization schedule generator.
   */
  export function generateSchedule(loan: LoanInput, rateShockPp: number = 0) {
    const N = loan.loanTermMonths;
    const G = Math.max(0, loan.gracePeriodMonths || 0);
    const promoMonths = Math.max(0, loan.promoPeriodMonths);
    const effectivePostPromoRate = Math.max(0, loan.postPromoRate + rateShockPp);

    if (loan.loanAmount === 0) {
      return Array.from({ length: N }, (_, idx) => ({
        month: idx + 1,
        beginningBalance: 0n,
        principalPayment: 0n,
        interestPayment: 0n,
        totalDebtService: 0n,
        endingBalance: 0n,
        interestRate: idx < promoMonths ? loan.promoInterestRate : effectivePostPromoRate,
        isPromo: idx < promoMonths,
        isGracePeriod: idx < G,
      }));
    }

    const nonGraceMonths = BigInt(N - G);
    const equalPrincipalMonthly = roundDiv(BigInt(loan.loanAmount), nonGraceMonths);

    let currentBalance = BigInt(loan.loanAmount);
    let currentAnnuityPayment = 0n;
    let lastRate = -1;

    const schedule = [];

    for (let m = 1; m <= N; m++) {
      const isPromo = promoMonths > 0 && m <= promoMonths;
      const isGracePeriod = m <= G;
      const currentRate = isPromo ? loan.promoInterestRate : effectivePostPromoRate;

      const rInt = BigInt(Math.round(currentRate * 10000));
      const D = 12000000n;
      const beginningBalance = currentBalance;
      const interestPayment = roundDiv(currentBalance * rInt, D);

      let principalPayment = 0n;

      if (isGracePeriod) {
        principalPayment = 0n;
      } else if (m === N) {
        // Terminal reconciliation
        principalPayment = beginningBalance;
      } else if (loan.repaymentMethod === 'EQUAL_PRINCIPAL') {
        principalPayment = beginningBalance < equalPrincipalMonthly ? beginningBalance : equalPrincipalMonthly;
      } else {
        // Annuity
        const remMonths = N - m + 1;
        if (currentRate !== lastRate || m === G + 1) {
          currentAnnuityPayment = calculateAnnuityPayment(currentBalance, currentRate, remMonths);
          lastRate = currentRate;
        }
        const candidateP = currentAnnuityPayment > interestPayment ? currentAnnuityPayment - interestPayment : 0n;
        principalPayment = candidateP > beginningBalance ? beginningBalance : candidateP;
      }

      const endingBalance = beginningBalance > principalPayment ? beginningBalance - principalPayment : 0n;
      const totalDebtService = principalPayment + interestPayment;

      schedule.push({
        month: m,
        beginningBalance,
        principalPayment,
        interestPayment,
        totalDebtService,
        endingBalance,
        interestRate: currentRate,
        isPromo,
        isGracePeriod,
      });

      currentBalance = endingBalance;
    }

    return schedule;
  }

  /**
   * Independent household cash flow and stress simulator.
   */
  export function simulate(
    loan: LoanInput,
    household: HouseholdInput,
    stress?: Partial<StressScenarioInput>
  ) {
    const transactionCosts = BigInt(household.transactionCosts || 0);
    const initialSetupCosts = BigInt(household.initialSetupCosts || 0);
    const upfrontCashRequired = BigInt(loan.downPayment) + transactionCosts + initialSetupCosts;
    const initialReserveBalance = BigInt(household.liquidSavings) - upfrontCashRequired;
    const reserveFloor = BigInt(household.plannedEmergencyReserveFloor || 0);

    const rateShockPp = stress?.rateShockPp || 0;
    const rawIncomeShock = stress?.incomeShockPercent || 0;
    const incomeShockPercent = rawIncomeShock > 0 ? -rawIncomeShock : rawIncomeShock;
    const incomeShockDuration = stress?.incomeShockDurationMonths || 0;
    const incomeShockStart = stress?.incomeShockStartMonth || (loan.promoPeriodMonths + 1);
    const expenseShockPercent = stress?.expenseShockPercent || 0;

    const amortSchedule = generateSchedule(loan, rateShockPp);

    const schedule = [];
    let currentReserve = initialReserveBalance;
    let firstNegativeCashFlowMonth: number | null = null;
    let lowestReserveBalance = initialReserveBalance;
    let lowestReserveMonth = 0;
    let maxDebtServicePayment = 0n;
    let maxDebtServiceMonth = 1;

    for (const item of amortSchedule) {
      const m = item.month;

      // Net income
      let netIncome = BigInt(household.monthlyNetIncome);
      if (
        incomeShockPercent !== 0 &&
        incomeShockDuration > 0 &&
        m >= incomeShockStart &&
        m < incomeShockStart + incomeShockDuration
      ) {
        const factor = 100 + incomeShockPercent;
        netIncome = roundDiv(netIncome * BigInt(factor), 100n);
      }

      // Essential living expenses
      let essentialExpenses = BigInt(household.essentialLivingExpenses);
      if (expenseShockPercent !== 0) {
        const factor = 100 + expenseShockPercent;
        essentialExpenses = roundDiv(essentialExpenses * BigInt(factor), 100n);
      }

      const existingDebt = BigInt(household.existingDebtPayments || 0);
      const recurringPropertyCosts = BigInt(household.recurringPropertyCosts || 0);

      const totalOutflows = essentialExpenses + existingDebt + recurringPropertyCosts + item.totalDebtService;
      const operatingCashFlow = netIncome - totalOutflows;

      currentReserve += operatingCashFlow;

      const isDeficit = operatingCashFlow < 0n;
      if (isDeficit && firstNegativeCashFlowMonth === null) {
        firstNegativeCashFlowMonth = m;
      }

      if (currentReserve < lowestReserveBalance) {
        lowestReserveBalance = currentReserve;
        lowestReserveMonth = m;
      }

      if (item.totalDebtService > maxDebtServicePayment) {
        maxDebtServicePayment = item.totalDebtService;
        maxDebtServiceMonth = m;
      }

      const dtiRatio = netIncome > 0n
        ? Number(existingDebt + item.totalDebtService) / Number(netIncome)
        : null;

      schedule.push({
        ...item,
        netIncome,
        essentialExpenses,
        existingDebt,
        recurringPropertyCosts,
        totalOutflows,
        operatingCashFlow,
        reserveBalance: currentReserve,
        isDeficit,
        dtiRatio,
      });
    }

    const month1Payment = schedule[0]?.totalDebtService || 0n;
    let postPromoMonth = loan.promoPeriodMonths + 1;
    let postPromoPayment = month1Payment;
    let paymentJumpAmount = 0n;

    if (loan.promoPeriodMonths === 0) {
      postPromoMonth = 1;
      postPromoPayment = schedule[0]?.totalDebtService || 0n;
      paymentJumpAmount = 0n;
    } else if (loan.promoPeriodMonths >= loan.loanTermMonths) {
      postPromoMonth = loan.loanTermMonths;
      postPromoPayment = schedule[loan.loanTermMonths - 1]?.totalDebtService || 0n;
      paymentJumpAmount = 0n;
    } else {
      postPromoMonth = Math.min(loan.loanTermMonths, loan.promoPeriodMonths + 1);
      postPromoPayment = schedule[postPromoMonth - 1]?.totalDebtService || 0n;
      const preResetPayment = schedule[loan.promoPeriodMonths - 1]?.totalDebtService || 0n;
      paymentJumpAmount = postPromoPayment - preResetPayment;
    }

    return {
      schedule,
      month1Payment,
      postPromoMonth,
      postPromoPayment,
      paymentJumpAmount,
      maxDebtServicePayment,
      maxDebtServiceMonth,
      firstNegativeCashFlowMonth,
      lowestReserveBalance,
      lowestReserveMonth,
      initialReserveBalance,
      upfrontCashRequired,
    };
  }
}
