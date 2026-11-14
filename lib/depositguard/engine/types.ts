/**
 * DepositGuard Deterministic Financial Engine - Type Definitions
 * Pure TypeScript interfaces - zero runtime dependencies.
 */

export type RepaymentMethod = 'EQUAL_PRINCIPAL' | 'ANNUITY';

export type AffordabilityStatus = 'SAFE' | 'VULNERABLE' | 'DEFICIT';

export type RecommendedAction =
  | 'PROCEED'
  | 'INCREASE_DOWN_PAYMENT'
  | 'REDUCE_PRICE'
  | 'EXTEND_TERM'
  | 'UNSUSTAINABLE';

export interface LoanInput {
  propertyPrice: number;              // Total property purchase price (VND)
  downPayment: number;                // Down payment / equity contribution (VND)
  loanAmount: number;                 // Total borrowed principal (VND)
  loanTermMonths: number;             // Loan duration in months (e.g. 240)
  repaymentMethod: RepaymentMethod;   // 'EQUAL_PRINCIPAL' | 'ANNUITY'
  promoInterestRate: number;          // Annual rate as % during promotional period (e.g. 7.0)
  promoPeriodMonths: number;          // Promotional duration in months (e.g. 12)
  postPromoRate: number;              // Annual floating rate as % post-promo (e.g. 12.0)
  gracePeriodMonths?: number;         // Principal grace period in months (default: 0)
}

export interface HouseholdInput {
  monthlyNetIncome: number;           // Monthly net take-home household income (VND)
  essentialLivingExpenses: number;    // Mandatory living expenses (VND)
  existingDebtPayments?: number;      // Other non-mortgage monthly debts (VND, default: 0)
  liquidSavings: number;              // Available liquid cash before purchase (VND)
  plannedEmergencyReserveFloor?: number; // Minimum target emergency reserve (VND, default: 0)
  recurringPropertyCosts?: number;    // Monthly maintenance/HOA/property costs (VND, default: 0)
  transactionCosts?: number;          // Upfront notary, registration, taxes (VND, default: 0)
  initialSetupCosts?: number;         // Upfront move-in, furnishings, renovation (VND, default: 0)
}

export interface StressScenarioInput {
  rateShockPp: number;                // Percentage point add to post-promo rate (e.g. 0, +2, +4)
  incomeShockPercent: number;         // Net income percentage change (e.g. 0, -20)
  incomeShockDurationMonths: number;  // Duration of income shock (months, e.g. 3, 6)
  incomeShockStartMonth?: number;     // Month income shock begins (default: promoPeriodMonths + 1)
  expenseShockPercent: number;        // Percentage change in living expenses (e.g. 0, +10)
}

export interface AmortizationScheduleMonth {
  month: number;                      // Month number (1..N)
  beginningBalance: number;           // Principal balance at start of month (VND)
  principalPayment: number;           // Principal repayment this month (VND)
  interestPayment: number;            // Interest accrued and due this month (VND)
  totalDebtService: number;           // Total monthly mortgage payment (VND)
  endingBalance: number;              // Principal balance at end of month (VND)
  interestRate: number;               // Annual interest rate applied this month (%)
  isPromo: boolean;                   // Whether this month is within the promotional period
  isGracePeriod?: boolean;            // Whether this month is in principal grace period
}

export interface MonthlyCashFlowItem extends AmortizationScheduleMonth {
  netIncome: number;                  // Monthly net household income (VND)
  essentialExpenses: number;          // Monthly essential expenses (VND)
  existingDebt: number;               // Non-mortgage monthly debt service (VND)
  recurringPropertyCosts?: number;    // Monthly property upkeep / HOA (VND)
  totalOutflows?: number;             // Total monthly cash outflows (VND)
  operatingCashFlow: number;          // netIncome - totalOutflows (VND)
  reserveBalance: number;             // Running emergency reserve balance (VND)
  isDeficit: boolean;                 // Whether operatingCashFlow < 0
  isBelowReserveFloor?: boolean;      // Whether reserveBalance < plannedEmergencyReserveFloor
  dtiRatio: number | null;            // (existingDebt + totalDebtService) / netIncome (null if netIncome <= 0)
}

export interface SimulationResult {
  schedule: MonthlyCashFlowItem[];
  month1Payment: number;              // Total debt service in Month 1 (VND)
  postPromoMonth: number;             // Calendar month when floating rate begins (e.g. 13)
  postPromoPayment: number;           // Total debt service in postPromoMonth (VND)
  paymentJumpAmount: number;          // postPromoPayment - month12Payment (VND)
  paymentJumpPercentage: number;      // Jump percentage relative to pre-reset payment (%)
  maxDebtServicePayment: number;      // Highest monthly payment across loan tenure (VND)
  maxDebtServiceMonth?: number;       // Month when peak debt service occurs (1..N)
  firstNegativeCashFlowMonth: number | null; // Earliest month where operatingCashFlow < 0 (null if none)
  firstReserveBreachMonth?: number | null;    // Earliest month where reserve falls below floor (null if none)
  lowestReserveBalance: number;       // Lowest emergency reserve reached during loan tenure (VND)
  lowestReserveMonth: number;         // Month index when lowest reserve occurs
  initialReserveBalance: number;      // Closing liquid reserve after upfront costs (VND)
  upfrontCashRequired: number;        // Down payment + transaction costs + setup costs (VND)
  month1DtiRatio: number | null;      // DTI in Month 1 (null if netIncome <= 0)
  postPromoDtiRatio: number | null;   // DTI in post-promo month (null if netIncome <= 0)
  maxDtiRatio?: number | null;        // Peak DTI across loan tenure
  maxDtiMonth?: number | null;        // Month of peak DTI
  affordabilityStatus: AffordabilityStatus; // 'SAFE' | 'VULNERABLE' | 'DEFICIT'
  totalInterestPaid?: number;         // Cumulative interest paid over loan (VND)
  totalPrincipalPaid?: number;        // Cumulative principal repaid (VND)
  totalCashShortfall?: number;        // Cumulative sum of negative cash flows (VND)
}

export interface AffordabilitySolverResult {
  maxSafeLoanAmount: number;          // Maximum loan with non-negative cash flow (VND)
  additionalEquityNeeded: number;     // Extra cash equity needed to cover financing gap (VND)
  safePropertyPrice: number;          // maxSafeLoanAmount + downPayment (VND)
  targetLoanAmount?: number;          // Requested loan amount (VND)
  financingGap?: number;              // targetLoanAmount - maxSafeLoanAmount (VND, >= 0)
  maxAffordableDownPayment?: number;  // liquidSavings - upfront costs - reserveFloor (VND)
  canAffordWithCurrentLiquidSavings?: boolean; // Whether liquid savings cover additional equity
  recommendedAction?: RecommendedAction;
}
