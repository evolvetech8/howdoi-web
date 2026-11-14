/**
 * Authoritative Mathematical Specification Reference Engine.
 * Implements the exact formulas defined in:
 * - ORIGINAL_REQUEST.md §R1
 * - PROJECT.md §Interface Contracts
 * - PLAN/HowDoI_2_0_Developer_Implementation_Plan.md §4
 */

import type {
  LoanInput,
  HouseholdInput,
  StressScenarioInput,
  MonthlyCashFlowItem,
  SimulationResult,
  AffordabilitySolverResult,
} from './test-types';

export function runSimulationReference(
  loan: LoanInput,
  household: HouseholdInput,
  scenario?: StressScenarioInput
): SimulationResult {
  const N = loan.loanTermMonths;
  const G = loan.gracePeriodMonths ?? 0;
  const promoMonths = loan.promoPeriodMonths;
  const rateShock = scenario?.rateShockPp ?? 0;
  const incomeShockPct = scenario?.incomeShockPercent ?? 0;
  const incomeShockDuration = scenario?.incomeShockDurationMonths ?? 0;
  const incomeShockStart = scenario?.incomeShockStartMonth ?? 13;
  const expenseShockPct = scenario?.expenseShockPercent ?? 0;

  const basePromoRate = loan.promoInterestRate / 100;
  const basePostPromoRate = (loan.postPromoRate + rateShock) / 100;

  const schedule: MonthlyCashFlowItem[] = [];
  let currentBalance = loan.loanAmount;

  // Track upfront cash & starting reserve at month 0
  const upfrontCash = loan.downPayment;
  const initialReserve = household.liquidSavings - upfrontCash;
  let runningReserve = initialReserve;

  // Annuity level payment state
  let currentAnnuityPayment = 0;
  let lastRateUsed = -1;

  for (let m = 1; m <= N; m++) {
    const isPromo = m <= promoMonths;
    const annualRate = isPromo ? basePromoRate : basePostPromoRate;
    const monthlyRate = annualRate / 12;

    const beginningBalance = currentBalance;
    const isGrace = m <= G;

    let interestPayment = Math.round(beginningBalance * monthlyRate);
    let principalPayment = 0;

    if (m === N) {
      // Terminal month reconciliation: exact payoff
      principalPayment = beginningBalance;
      currentBalance = 0;
    } else if (isGrace) {
      principalPayment = 0;
      currentBalance = beginningBalance;
    } else {
      if (loan.repaymentMethod === 'EQUAL_PRINCIPAL') {
        const remainingNonGraceMonths = N - Math.max(G, m - 1);
        const standardPrincipal = Math.round(loan.loanAmount / (N - G));
        principalPayment = Math.min(beginningBalance, standardPrincipal);
        currentBalance = Math.max(0, beginningBalance - principalPayment);
      } else {
        // Annuity (Level payment)
        const remainingMonths = N - m + 1;
        if (annualRate !== lastRateUsed || currentAnnuityPayment === 0) {
          if (monthlyRate === 0) {
            currentAnnuityPayment = Math.round(beginningBalance / remainingMonths);
          } else {
            const factor = Math.pow(1 + monthlyRate, -remainingMonths);
            currentAnnuityPayment = Math.round((beginningBalance * monthlyRate) / (1 - factor));
          }
          lastRateUsed = annualRate;
        }

        principalPayment = Math.min(
          beginningBalance,
          Math.max(0, currentAnnuityPayment - interestPayment)
        );
        currentBalance = Math.max(0, beginningBalance - principalPayment);
      }
    }

    const totalDebtService = principalPayment + interestPayment;

    // Household cash flows
    let netIncome = household.monthlyNetIncome;
    if (
      incomeShockPct !== 0 &&
      m >= incomeShockStart &&
      m < incomeShockStart + incomeShockDuration
    ) {
      netIncome = Math.round(household.monthlyNetIncome * (1 + incomeShockPct / 100));
    }

    const essentialExpenses = Math.round(
      household.essentialLivingExpenses * (1 + expenseShockPct / 100)
    );
    const existingDebt = household.existingDebtPayments;

    const operatingCashFlow = netIncome - (essentialExpenses + existingDebt + totalDebtService);
    runningReserve += operatingCashFlow;
    const isDeficit = operatingCashFlow < 0;

    const dtiRatio =
      netIncome > 0 ? (existingDebt + totalDebtService) / netIncome : null;

    schedule.push({
      month: m,
      beginningBalance,
      principalPayment,
      interestPayment,
      totalDebtService,
      endingBalance: currentBalance,
      interestRate: Math.round(annualRate * 10000) / 100,
      isPromo,
      netIncome,
      essentialExpenses,
      existingDebt,
      operatingCashFlow,
      reserveBalance: runningReserve,
      isDeficit,
      dtiRatio,
    });
  }

  // Summary Metrics
  const month1Payment = schedule[0]?.totalDebtService ?? 0;
  const postPromoMonth = promoMonths + 1 <= N ? promoMonths + 1 : N;
  const postPromoPayment =
    schedule[postPromoMonth - 1]?.totalDebtService ?? month1Payment;
  const promoEndPayment =
    promoMonths > 0 && promoMonths <= N
      ? schedule[promoMonths - 1].totalDebtService
      : month1Payment;
  const paymentJumpAmount = postPromoPayment - promoEndPayment;
  const paymentJumpPercentage =
    promoEndPayment > 0 ? (paymentJumpAmount / promoEndPayment) * 100 : 0;

  let maxDebtServicePayment = 0;
  let firstNegativeCashFlowMonth: number | null = null;
  let lowestReserveBalance = initialReserve;
  let lowestReserveMonth = 0;

  for (const item of schedule) {
    if (item.totalDebtService > maxDebtServicePayment) {
      maxDebtServicePayment = item.totalDebtService;
    }
    if (item.operatingCashFlow < 0 && firstNegativeCashFlowMonth === null) {
      firstNegativeCashFlowMonth = item.month;
    }
    if (item.reserveBalance < lowestReserveBalance) {
      lowestReserveBalance = item.reserveBalance;
      lowestReserveMonth = item.month;
    }
  }

  const month1DtiRatio = schedule[0]?.dtiRatio ?? null;
  const postPromoDtiRatio = schedule[postPromoMonth - 1]?.dtiRatio ?? null;

  // Affordability status categorization
  const reserveFloor = household.plannedEmergencyReserveFloor ?? 0;
  let affordabilityStatus: 'SAFE' | 'VULNERABLE' | 'DEFICIT' = 'SAFE';

  if (firstNegativeCashFlowMonth !== null || initialReserve < 0 || lowestReserveBalance < 0) {
    affordabilityStatus = 'DEFICIT';
  } else if (
    lowestReserveBalance < reserveFloor ||
    (postPromoDtiRatio !== null && postPromoDtiRatio > 0.5)
  ) {
    affordabilityStatus = 'VULNERABLE';
  }

  return {
    schedule,
    month1Payment,
    postPromoMonth,
    postPromoPayment,
    paymentJumpAmount,
    paymentJumpPercentage,
    maxDebtServicePayment,
    firstNegativeCashFlowMonth,
    lowestReserveBalance,
    lowestReserveMonth,
    initialReserveBalance: initialReserve,
    upfrontCashRequired: upfrontCash,
    month1DtiRatio,
    postPromoDtiRatio,
    affordabilityStatus,
  };
}

export function solveReverseAffordabilityReference(
  loan: LoanInput,
  household: HouseholdInput,
  scenario?: StressScenarioInput
): AffordabilitySolverResult {
  const availableBudget = Math.max(
    0,
    household.monthlyNetIncome -
      household.essentialLivingExpenses -
      household.existingDebtPayments
  );

  if (availableBudget <= 0) {
    return {
      maxSafeLoanAmount: 0,
      additionalEquityNeeded: loan.loanAmount,
      safePropertyPrice: loan.downPayment,
    };
  }

  // Binary search for maximum safe loan
  let low = 0;
  let high = loan.propertyPrice * 2;
  let bestSafeLoan = 0;

  for (let iter = 0; iter < 40; iter++) {
    const mid = Math.round((low + high) / 2);
    const candidateLoan: LoanInput = {
      ...loan,
      loanAmount: mid,
    };
    const res = runSimulationReference(candidateLoan, household, scenario);

    if (res.firstNegativeCashFlowMonth === null) {
      bestSafeLoan = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  const targetLoan = loan.loanAmount;
  const additionalEquityNeeded = Math.max(0, targetLoan - bestSafeLoan);
  const safePropertyPrice = loan.downPayment + bestSafeLoan;

  return {
    maxSafeLoanAmount: bestSafeLoan,
    additionalEquityNeeded,
    safePropertyPrice,
  };
}
