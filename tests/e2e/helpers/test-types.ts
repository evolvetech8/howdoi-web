/**
 * Opaque-box TypeScript type definitions for DepositGuard E2E test suites.
 * Strictly aligned with PROJECT.md § Interface Contracts.
 */

export type RepaymentMethod = 'EQUAL_PRINCIPAL' | 'ANNUITY';

export interface LoanInput {
  propertyPrice: number;              // VND
  downPayment: number;                // VND
  loanAmount: number;                 // VND
  loanTermMonths: number;             // months (e.g. 240)
  repaymentMethod: RepaymentMethod;
  promoInterestRate: number;          // annual rate as percentage (e.g. 7.0 for 7%)
  promoPeriodMonths: number;          // e.g. 12
  postPromoRate: number;              // annual rate as percentage (e.g. 12.0 for 12%)
  gracePeriodMonths?: number;         // default 0
}

export interface HouseholdInput {
  monthlyNetIncome: number;           // VND
  essentialLivingExpenses: number;    // VND
  existingDebtPayments: number;       // VND (other monthly loans)
  liquidSavings: number;              // VND
  plannedEmergencyReserveFloor?: number; // VND
}

export interface StressScenarioInput {
  rateShockPp: number;                // e.g. 0, +2, +4 (percentage points)
  incomeShockPercent: number;         // e.g. 0, -20 (%)
  incomeShockDurationMonths: number;  // e.g. 3, 6 (months)
  incomeShockStartMonth?: number;     // e.g. 13
  expenseShockPercent: number;        // e.g. 0, +10 (%)
}

export interface AmortizationScheduleMonth {
  month: number;
  beginningBalance: number;
  principalPayment: number;
  interestPayment: number;
  totalDebtService: number;
  endingBalance: number;
  interestRate: number;
  isPromo: boolean;
}

export interface MonthlyCashFlowItem extends AmortizationScheduleMonth {
  netIncome: number;
  essentialExpenses: number;
  existingDebt: number;
  operatingCashFlow: number;         // netIncome - (essentialExpenses + existingDebt + totalDebtService)
  reserveBalance: number;            // running emergency cash reserve
  isDeficit: boolean;
  dtiRatio: number | null;           // (existingDebt + totalDebtService) / netIncome
}

export interface SimulationResult {
  schedule: MonthlyCashFlowItem[];
  month1Payment: number;
  postPromoMonth: number;
  postPromoPayment: number;
  paymentJumpAmount: number;
  paymentJumpPercentage: number;
  maxDebtServicePayment: number;
  firstNegativeCashFlowMonth: number | null; // null if no deficit
  lowestReserveBalance: number;
  lowestReserveMonth: number;
  initialReserveBalance: number;
  upfrontCashRequired: number;       // downPayment + fees
  month1DtiRatio: number | null;
  postPromoDtiRatio: number | null;
  affordabilityStatus: 'SAFE' | 'VULNERABLE' | 'DEFICIT';
}

export interface AffordabilitySolverResult {
  maxSafeLoanAmount: number;
  additionalEquityNeeded: number;
  safePropertyPrice: number;
}
