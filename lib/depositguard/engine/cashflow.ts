/**
 * DepositGuard Deterministic Calculation Engine - Household Cash Flow & Stress Modeling
 * Simulates monthly household cash flows, emergency reserve balances, stress shocks,
 * and key risk metrics without float drift.
 */

import {
  LoanInput,
  HouseholdInput,
  StressScenarioInput,
  MonthlyCashFlowItem,
  SimulationResult,
  AffordabilityStatus,
} from './types';
import { generateAmortizationSchedule, roundVND } from './amortization';

/**
 * Categorizes overall affordability risk based on reserve exhaustion, cash flow deficit, and DTI.
 */
export function evaluateAffordabilityStatus(
  lowestReserveBalance: number,
  firstNegativeCashFlowMonth: number | null,
  maxDtiRatio: number | null,
  initialReserveBalance: number,
  reserveFloor: number = 0,
  postPromoDtiRatio: number | null = null
): AffordabilityStatus {
  // DEFICIT: Initial closing deficit, negative monthly cash flow, or reserve depletion below zero
  if (initialReserveBalance < 0 || lowestReserveBalance < 0 || firstNegativeCashFlowMonth !== null) {
    return 'DEFICIT';
  }
  // VULNERABLE: Reserve dips below target floor or DTI exceeds prudent threshold (>45% or post-promo >50%)
  if (
    lowestReserveBalance < reserveFloor ||
    (maxDtiRatio !== null && maxDtiRatio > 0.45) ||
    (postPromoDtiRatio !== null && postPromoDtiRatio > 0.50)
  ) {
    return 'VULNERABLE';
  }
  // SAFE: Cash flow strictly non-negative, reserves remain above safety floor, and debt service is sustainable
  return 'SAFE';
}

/**
 * Runs a deterministic simulation of mortgage amortization coupled with household cash flows
 * and stress scenarios.
 */
export function calculateSimulation(
  loan: LoanInput,
  household: HouseholdInput,
  stress?: Partial<StressScenarioInput>
): SimulationResult {
  const transactionCosts = household.transactionCosts || 0;
  const initialSetupCosts = household.initialSetupCosts || 0;
  const upfrontCashRequired = loan.downPayment + transactionCosts + initialSetupCosts;
  const initialReserveBalance = household.liquidSavings - upfrontCashRequired;
  const reserveFloor = household.plannedEmergencyReserveFloor || 0;

  const rateShockPp = stress?.rateShockPp || 0;
  const rawIncomeShock = stress?.incomeShockPercent || 0;
  const incomeShockPercent = rawIncomeShock > 0 ? -rawIncomeShock : rawIncomeShock;
  const incomeShockDuration = stress?.incomeShockDurationMonths || 0;
  const incomeShockStart = stress?.incomeShockStartMonth || (loan.promoPeriodMonths + 1);
  const expenseShockPercent = stress?.expenseShockPercent || 0;

  // Generate deterministic amortization schedule
  const amortizationSchedule = generateAmortizationSchedule(loan, rateShockPp);

  const schedule: MonthlyCashFlowItem[] = [];
  let currentReserve = initialReserveBalance;
  let firstNegativeCashFlowMonth: number | null = null;
  let firstReserveBreachMonth: number | null = null;
  let lowestReserveBalance = initialReserveBalance;
  let lowestReserveMonth = 0;
  let maxDebtServicePayment = 0;
  let maxDebtServiceMonth = 1;
  let maxDtiRatio: number | null = null;
  let maxDtiMonth: number | null = null;
  let totalInterestPaid = 0;
  let totalPrincipalPaid = 0;
  let totalCashShortfall = 0;

  for (const item of amortizationSchedule) {
    const m = item.month;

    // Apply income shock if within shock window
    let netIncome = household.monthlyNetIncome;
    if (
      incomeShockPercent !== 0 &&
      incomeShockDuration > 0 &&
      m >= incomeShockStart &&
      m < incomeShockStart + incomeShockDuration
    ) {
      const shockMultiplier = 1 + incomeShockPercent / 100;
      netIncome = Math.max(0, roundVND(household.monthlyNetIncome * shockMultiplier));
    }

    // Apply expense shock
    const essentialExpenses = Math.max(
      0,
      roundVND(household.essentialLivingExpenses * (1 + expenseShockPercent / 100))
    );
    const existingDebt = household.existingDebtPayments || 0;
    const recurringPropertyCosts = household.recurringPropertyCosts || 0;

    const totalOutflows = essentialExpenses + existingDebt + recurringPropertyCosts + item.totalDebtService;
    const operatingCashFlow = netIncome - totalOutflows;

    currentReserve += operatingCashFlow;

    const isDeficit = operatingCashFlow < 0;
    const isBelowReserveFloor = currentReserve < reserveFloor;

    if (isDeficit) {
      totalCashShortfall += Math.abs(operatingCashFlow);
      if (firstNegativeCashFlowMonth === null) {
        firstNegativeCashFlowMonth = m;
      }
    }

    if (isBelowReserveFloor && firstReserveBreachMonth === null) {
      firstReserveBreachMonth = m;
    }

    if (currentReserve < lowestReserveBalance) {
      lowestReserveBalance = currentReserve;
      lowestReserveMonth = m;
    }

    if (item.totalDebtService > maxDebtServicePayment) {
      maxDebtServicePayment = item.totalDebtService;
      maxDebtServiceMonth = m;
    }

    const dtiRatio = netIncome > 0 ? (existingDebt + item.totalDebtService) / netIncome : null;
    if (dtiRatio !== null && (maxDtiRatio === null || dtiRatio > maxDtiRatio)) {
      maxDtiRatio = dtiRatio;
      maxDtiMonth = m;
    }

    totalInterestPaid += item.interestPayment;
    totalPrincipalPaid += item.principalPayment;

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
      isBelowReserveFloor,
      dtiRatio,
    });
  }

  const month1Payment = schedule[0]?.totalDebtService || 0;
  let postPromoMonth = loan.promoPeriodMonths + 1;
  let postPromoPayment = month1Payment;
  let paymentJumpAmount = 0;
  let paymentJumpPercentage = 0;

  if (loan.promoPeriodMonths === 0) {
    postPromoMonth = 1;
    postPromoPayment = schedule[0]?.totalDebtService || 0;
    paymentJumpAmount = 0;
    paymentJumpPercentage = 0;
  } else if (loan.promoPeriodMonths >= loan.loanTermMonths) {
    postPromoMonth = loan.loanTermMonths;
    postPromoPayment = schedule[loan.loanTermMonths - 1]?.totalDebtService || 0;
    paymentJumpAmount = 0;
    paymentJumpPercentage = 0;
  } else {
    postPromoMonth = Math.min(loan.loanTermMonths, loan.promoPeriodMonths + 1);
    postPromoPayment = schedule[postPromoMonth - 1]?.totalDebtService || 0;
    const preResetPayment = schedule[loan.promoPeriodMonths - 1]?.totalDebtService || 0;
    paymentJumpAmount = postPromoPayment - preResetPayment;
    paymentJumpPercentage = preResetPayment > 0 ? (paymentJumpAmount / preResetPayment) * 100 : 0;
  }

  const month1DtiRatio = schedule[0]?.dtiRatio ?? null;
  const postPromoDtiRatio = schedule[postPromoMonth - 1]?.dtiRatio ?? null;

  const affordabilityStatus = evaluateAffordabilityStatus(
    lowestReserveBalance,
    firstNegativeCashFlowMonth,
    maxDtiRatio,
    initialReserveBalance,
    reserveFloor,
    postPromoDtiRatio
  );

  return {
    schedule,
    month1Payment,
    postPromoMonth,
    postPromoPayment,
    paymentJumpAmount,
    paymentJumpPercentage,
    maxDebtServicePayment,
    maxDebtServiceMonth,
    firstNegativeCashFlowMonth,
    firstReserveBreachMonth,
    lowestReserveBalance,
    lowestReserveMonth,
    initialReserveBalance,
    upfrontCashRequired,
    month1DtiRatio,
    postPromoDtiRatio,
    maxDtiRatio,
    maxDtiMonth,
    affordabilityStatus,
    totalInterestPaid,
    totalPrincipalPaid,
    totalCashShortfall,
  };
}

/**
 * Alias for calculateSimulation to support diverse consumer naming conventions.
 */
export const runSimulation = calculateSimulation;
