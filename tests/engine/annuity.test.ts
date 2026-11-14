import { describe, it, expect } from 'vitest';
import { generateAmortizationSchedule, LoanInput } from '@/lib/depositguard/engine';

describe('Annuity Amortization (trả góp đều)', () => {
  const baseAnnuityLoan: LoanInput = {
    propertyPrice: 2_500_000_000,
    downPayment: 500_000_000,
    loanAmount: 2_000_000_000,
    loanTermMonths: 240,
    repaymentMethod: 'ANNUITY',
    promoInterestRate: 7.0,
    promoPeriodMonths: 12,
    postPromoRate: 12.0,
  };

  it('1. Maintains constant total debt service throughout promotional period', () => {
    const schedule = generateAmortizationSchedule(baseAnnuityLoan);
    const m1Payment = schedule[0].totalDebtService;

    // PMT formula: 2,000,000,000 * (0.07/12) / (1 - (1 + 0.07/12)^-240) = 15,505,979 VND
    expect(m1Payment).toBe(15_505_979);

    for (let m = 1; m <= 12; m++) {
      expect(schedule[m - 1].totalDebtService).toBe(m1Payment);
    }
  });

  it('2. Dynamically recalculates level payment at Month 13 rate reset based on remaining term', () => {
    const schedule = generateAmortizationSchedule(baseAnnuityLoan);
    const m13Payment = schedule[12].totalDebtService;

    // At month 13, balance is ~1,950,564,364 VND, remaining term is 228 months, rate is 12%
    // PMT recomputed to 21,777,024 VND
    expect(m13Payment).toBe(21_777_024);
    expect(m13Payment).toBeGreaterThan(schedule[11].totalDebtService);

    // Remains level post-reset across non-terminal months
    for (let m = 13; m < 240; m++) {
      expect(schedule[m - 1].totalDebtService).toBe(m13Payment);
    }
  });

  it('3. Inverts principal and interest breakdown: interest decreases while principal increases', () => {
    const schedule = generateAmortizationSchedule(baseAnnuityLoan);

    for (let m = 1; m < 12; m++) {
      const current = schedule[m - 1];
      const next = schedule[m];

      expect(current.interestPayment).toBeGreaterThan(next.interestPayment);
      expect(current.principalPayment).toBeLessThan(next.principalPayment);
    }
  });

  it('4. Reconciles terminal balance to exactly 0 VND with full principal repayment', () => {
    const schedule = generateAmortizationSchedule(baseAnnuityLoan);
    expect(schedule).toHaveLength(240);

    const finalMonth = schedule[239];
    expect(finalMonth.endingBalance).toBe(0);

    const totalPrincipal = schedule.reduce((acc, m) => acc + m.principalPayment, 0);
    expect(totalPrincipal).toBe(2_000_000_000);
  });

  it('5. Handles zero interest rate edge case (0%) as exact straight-line principal division', () => {
    const zeroInterestLoan: LoanInput = {
      propertyPrice: 300_000_000,
      downPayment: 60_000_000,
      loanAmount: 240_000_000,
      loanTermMonths: 24,
      repaymentMethod: 'ANNUITY',
      promoInterestRate: 0,
      promoPeriodMonths: 12,
      postPromoRate: 0,
    };

    const schedule = generateAmortizationSchedule(zeroInterestLoan);
    const expectedMonthly = 10_000_000; // 240m / 24

    for (const item of schedule) {
      expect(item.interestPayment).toBe(0);
      expect(item.principalPayment).toBe(expectedMonthly);
      expect(item.totalDebtService).toBe(expectedMonthly);
    }

    expect(schedule[23].endingBalance).toBe(0);
  });

  it('6. Handles post-promo rate reduction where payment decreases smoothly', () => {
    const rateDropLoan: LoanInput = {
      propertyPrice: 1_000_000_000,
      downPayment: 200_000_000,
      loanAmount: 800_000_000,
      loanTermMonths: 120,
      repaymentMethod: 'ANNUITY',
      promoInterestRate: 11.0,
      promoPeriodMonths: 12,
      postPromoRate: 8.0,
    };

    const schedule = generateAmortizationSchedule(rateDropLoan);
    const m12Payment = schedule[11].totalDebtService;
    const m13Payment = schedule[12].totalDebtService;

    expect(m13Payment).toBeLessThan(m12Payment);
    expect(schedule[119].endingBalance).toBe(0);
  });
});
