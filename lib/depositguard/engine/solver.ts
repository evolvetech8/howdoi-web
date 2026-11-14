/**
 * DepositGuard Deterministic Calculation Engine - Reverse Affordability Solver
 * Finds maximum safe borrowing capacity, additional equity needed, and safe purchase price
 * using monotonic binary search.
 */

import {
  LoanInput,
  HouseholdInput,
  StressScenarioInput,
  AffordabilitySolverResult,
  RecommendedAction,
} from './types';
import { calculateSimulation } from './cashflow';

/**
 * Solves for the maximum safe loan amount that does not produce any negative monthly cash flow.
 * Uses monotonic binary search with sub-millisecond convergence.
 */
export function solveAffordability(
  loan: LoanInput,
  household: HouseholdInput,
  stress?: Partial<StressScenarioInput>
): AffordabilitySolverResult {
  const existingDebt = household.existingDebtPayments || 0;
  const transactionCosts = household.transactionCosts || 0;
  const initialSetupCosts = household.initialSetupCosts || 0;
  const reserveFloor = household.plannedEmergencyReserveFloor || 0;

  const availableBudget = Math.max(
    0,
    household.monthlyNetIncome - household.essentialLivingExpenses - existingDebt
  );

  // If household living expenses and existing debts equal or exceed net income, no safe loan is possible
  if (availableBudget <= 0) {
    const safeLoan = 0;
    const additionalEquity = loan.loanAmount;
    const safePrice = loan.downPayment;
    return {
      maxSafeLoanAmount: safeLoan,
      additionalEquityNeeded: additionalEquity,
      safePropertyPrice: safePrice,
      targetLoanAmount: loan.loanAmount,
      financingGap: additionalEquity,
      maxAffordableDownPayment: Math.max(
        0,
        household.liquidSavings - transactionCosts - initialSetupCosts - reserveFloor
      ),
      canAffordWithCurrentLiquidSavings: false,
      recommendedAction: 'UNSUSTAINABLE',
    };
  }

  // Monotonic Binary Search for maximum sustainable loan
  let low = 0;
  let high = Math.max(loan.propertyPrice * 2, loan.loanAmount * 2, 50_000_000_000);
  let bestSafeLoan = 0;

  // 40 binary search iterations yield precision < 0.1 VND across 50+ billion VND range
  for (let iter = 0; iter < 40; iter++) {
    const mid = Math.round((low + high) / 2);
    const candidateLoan: LoanInput = {
      ...loan,
      loanAmount: mid,
    };
    const sim = calculateSimulation(candidateLoan, household, stress);

    if (sim.firstNegativeCashFlowMonth === null) {
      bestSafeLoan = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  const maxSafeLoanAmount = bestSafeLoan;
  const targetLoanAmount = loan.loanAmount;
  const financingGap = Math.max(0, targetLoanAmount - maxSafeLoanAmount);
  const additionalEquityNeeded = financingGap;
  const safePropertyPrice = loan.downPayment + maxSafeLoanAmount;

  const maxAffordableDownPayment = Math.max(
    0,
    household.liquidSavings - transactionCosts - initialSetupCosts - reserveFloor
  );

  const totalCashNeeded =
    loan.downPayment + transactionCosts + initialSetupCosts + reserveFloor + additionalEquityNeeded;
  const canAffordWithCurrentLiquidSavings = household.liquidSavings >= totalCashNeeded;

  let recommendedAction: RecommendedAction = 'PROCEED';
  if (financingGap > 0) {
    if (canAffordWithCurrentLiquidSavings) {
      recommendedAction = 'INCREASE_DOWN_PAYMENT';
    } else if (loan.loanTermMonths < 360) {
      recommendedAction = 'EXTEND_TERM';
    } else if (safePropertyPrice < loan.propertyPrice) {
      recommendedAction = 'REDUCE_PRICE';
    } else {
      recommendedAction = 'UNSUSTAINABLE';
    }
  }

  return {
    maxSafeLoanAmount,
    additionalEquityNeeded,
    safePropertyPrice,
    targetLoanAmount,
    financingGap,
    maxAffordableDownPayment,
    canAffordWithCurrentLiquidSavings,
    recommendedAction,
  };
}

/**
 * Alias for solveAffordability.
 */
export const solveReverseAffordability = solveAffordability;
