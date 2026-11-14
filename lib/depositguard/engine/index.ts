/**
 * DepositGuard Deterministic Calculation Engine
 * Unified barrel export
 */

export * from './types';
export {
  generateAmortizationSchedule,
  calculateAnnuityPayment,
  calculateMonthlyRate,
  roundVND,
  validateLoanInput,
} from './amortization';
export {
  calculateSimulation,
  runSimulation,
  evaluateAffordabilityStatus,
} from './cashflow';
export {
  solveAffordability,
  solveReverseAffordability,
} from './solver';
