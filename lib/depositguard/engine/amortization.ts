/**
 * DepositGuard Deterministic Calculation Engine - Amortization Schedules
 * Integer-VND deterministic arithmetic with zero drift and exact terminal reconciliation.
 */

import Decimal from 'decimal.js';
import { LoanInput, AmortizationScheduleMonth, RepaymentMethod } from './types';

// Configure Decimal.js for financial precision
Decimal.set({ precision: 28, rounding: Decimal.ROUND_HALF_UP });

/**
 * Rounds a number or Decimal to the nearest integer VND.
 */
export function roundVND(amount: number | Decimal): number {
  if (amount instanceof Decimal) {
    return amount.round().toNumber();
  }
  return Math.round(amount);
}

/**
 * Calculates monthly interest rate from nominal annual percentage rate (e.g. 7.0% -> 0.07 / 12).
 */
export function calculateMonthlyRate(annualRatePercentage: number): Decimal {
  if (annualRatePercentage <= 0) return new Decimal(0);
  return new Decimal(annualRatePercentage).div(100).div(12);
}

/**
 * Calculates level monthly annuity payment (PMT).
 * Formula: A = B * [i / (1 - (1 + i)^(-n))]
 * For i = 0: A = B / n
 */
export function calculateAnnuityPayment(
  principal: Decimal | number,
  monthlyRate: Decimal | number,
  remainingMonths: number
): number {
  if (remainingMonths <= 0) return 0;
  const p = new Decimal(principal);
  const r = new Decimal(monthlyRate);

  if (p.isZero() || p.isNegative()) return 0;
  if (r.isZero() || r.isNegative()) {
    return p.div(remainingMonths).round().toNumber();
  }

  // (1 + r)^(-n)
  const onePlusR = new Decimal(1).plus(r);
  const discountFactor = onePlusR.pow(-remainingMonths);
  const denominator = new Decimal(1).minus(discountFactor);

  if (denominator.isZero()) {
    return p.div(remainingMonths).round().toNumber();
  }

  return p.times(r).div(denominator).round().toNumber();
}

/**
 * Validates loan input parameters.
 */
export function validateLoanInput(loan: LoanInput): void {
  if (loan.loanAmount < 0) {
    throw new RangeError('loanAmount must be non-negative');
  }
  if (loan.loanTermMonths <= 0) {
    throw new RangeError('loanTermMonths must be greater than 0');
  }
  const grace = Math.max(0, loan.gracePeriodMonths || 0);
  if (grace >= loan.loanTermMonths) {
    throw new RangeError('gracePeriodMonths must be strictly less than loanTermMonths');
  }
  if (loan.promoInterestRate < 0 || loan.postPromoRate < 0) {
    throw new RangeError('Interest rates cannot be negative');
  }
}

/**
 * Generates deterministic month-by-month amortization schedule for either
 * EQUAL_PRINCIPAL (dư nợ giảm dần) or ANNUITY (trả góp đều).
 */
export function generateAmortizationSchedule(
  loan: LoanInput,
  rateShockPp: number = 0
): AmortizationScheduleMonth[] {
  validateLoanInput(loan);

  if (loan.loanAmount === 0) {
    return Array.from({ length: loan.loanTermMonths }, (_, idx) => ({
      month: idx + 1,
      beginningBalance: 0,
      principalPayment: 0,
      interestPayment: 0,
      totalDebtService: 0,
      endingBalance: 0,
      interestRate: idx < loan.promoPeriodMonths ? loan.promoInterestRate : loan.postPromoRate + rateShockPp,
      isPromo: idx < loan.promoPeriodMonths,
      isGracePeriod: idx < (loan.gracePeriodMonths || 0),
    }));
  }

  const N = loan.loanTermMonths;
  const G = Math.max(0, loan.gracePeriodMonths || 0);
  const promoMonths = Math.max(0, loan.promoPeriodMonths);
  const effectivePostPromoRate = Math.max(0, loan.postPromoRate + rateShockPp);

  const nonGraceMonths = N - G;
  const equalPrincipalMonthly = roundVND(loan.loanAmount / nonGraceMonths);

  let currentBalance = new Decimal(loan.loanAmount);
  let currentAnnuityPayment = 0;
  let lastRate = -1;

  const schedule: AmortizationScheduleMonth[] = [];

  for (let m = 1; m <= N; m++) {
    const isPromo = promoMonths > 0 && m <= promoMonths;
    const isGracePeriod = m <= G;
    const currentAnnualRate = isPromo ? loan.promoInterestRate : effectivePostPromoRate;
    const monthlyRate = calculateMonthlyRate(currentAnnualRate);

    const beginningBalance = currentBalance.round().toNumber();
    const interestPayment = currentBalance.times(monthlyRate).round().toNumber();

    let principalPayment = 0;

    if (isGracePeriod) {
      principalPayment = 0;
    } else if (m === N) {
      // Terminal reconciliation: final month pays off remaining balance exactly
      principalPayment = beginningBalance;
    } else if (loan.repaymentMethod === 'EQUAL_PRINCIPAL') {
      principalPayment = Math.min(beginningBalance, equalPrincipalMonthly);
    } else {
      // ANNUITY (Level Payment)
      const remainingMonths = N - m + 1;
      // Recalculate level payment when rate changes or grace period concludes
      if (currentAnnualRate !== lastRate || m === G + 1) {
        currentAnnuityPayment = calculateAnnuityPayment(
          currentBalance,
          monthlyRate,
          remainingMonths
        );
        lastRate = currentAnnualRate;
      }
      principalPayment = Math.min(
        beginningBalance,
        Math.max(0, currentAnnuityPayment - interestPayment)
      );
    }

    const endingBalance = Math.max(0, beginningBalance - principalPayment);
    const totalDebtService = principalPayment + interestPayment;

    schedule.push({
      month: m,
      beginningBalance,
      principalPayment,
      interestPayment,
      totalDebtService,
      endingBalance,
      interestRate: currentAnnualRate,
      isPromo,
      isGracePeriod,
    });

    currentBalance = new Decimal(endingBalance);
  }

  return schedule;
}
