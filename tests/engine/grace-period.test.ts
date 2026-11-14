import { describe, it, expect } from 'vitest';
import { generateAmortizationSchedule, LoanInput } from '@/lib/depositguard/engine';

describe('Principal Grace Period Handling', () => {
  it('1. Verifies zero principal payment and interest-only debt service during grace period', () => {
    const loan: LoanInput = {
      propertyPrice: 1_500_000_000,
      downPayment: 300_000_000,
      loanAmount: 1_200_000_000,
      loanTermMonths: 120,
      repaymentMethod: 'EQUAL_PRINCIPAL',
      promoInterestRate: 8.0,
      promoPeriodMonths: 24,
      postPromoRate: 11.0,
      gracePeriodMonths: 12,
    };

    const schedule = generateAmortizationSchedule(loan);

    // Months 1 to 12: principal payment is 0, balance unchanged at 1.2B
    for (let m = 1; m <= 12; m++) {
      const item = schedule[m - 1];
      expect(item.isGracePeriod).toBe(true);
      expect(item.principalPayment).toBe(0);
      expect(item.beginningBalance).toBe(1_200_000_000);
      expect(item.endingBalance).toBe(1_200_000_000);
      expect(item.totalDebtService).toBe(item.interestPayment);
    }
  });

  it('2. Amortizes principal over remaining term (N - G) following grace period conclusion', () => {
    const loan: LoanInput = {
      propertyPrice: 1_500_000_000,
      downPayment: 300_000_000,
      loanAmount: 1_200_000_000,
      loanTermMonths: 120,
      repaymentMethod: 'EQUAL_PRINCIPAL',
      promoInterestRate: 8.0,
      promoPeriodMonths: 24,
      postPromoRate: 11.0,
      gracePeriodMonths: 12,
    };

    const schedule = generateAmortizationSchedule(loan);
    const nonGraceMonths = 120 - 12; // 108 months
    const expectedMonthlyPrincipal = Math.round(1_200_000_000 / 108); // 11,111,111 VND

    for (let m = 13; m < 120; m++) {
      expect(schedule[m - 1].principalPayment).toBe(expectedMonthlyPrincipal);
    }

    expect(schedule[119].endingBalance).toBe(0);
  });

  it('3. Handles grace period with Annuity repayment method', () => {
    const loan: LoanInput = {
      propertyPrice: 2_000_000_000,
      downPayment: 1_000_000_000,
      loanAmount: 1_000_000_000,
      loanTermMonths: 240,
      repaymentMethod: 'ANNUITY',
      promoInterestRate: 7.5,
      promoPeriodMonths: 36,
      postPromoRate: 10.5,
      gracePeriodMonths: 24,
    };

    const schedule = generateAmortizationSchedule(loan);

    // Months 1..24 interest only
    for (let m = 1; m <= 24; m++) {
      expect(schedule[m - 1].principalPayment).toBe(0);
      expect(schedule[m - 1].endingBalance).toBe(1_000_000_000);
    }

    // Month 25 begins level payment amortization over remaining 216 months
    expect(schedule[24].principalPayment).toBeGreaterThan(0);
    expect(schedule[24].endingBalance).toBeLessThan(1_000_000_000);

    // Terminal reconciliation to exact 0
    expect(schedule[239].endingBalance).toBe(0);
  });

  it('4. Handles simultaneous grace period conclusion and promotional rate expiry (G = T_promo = 12)', () => {
    const loan: LoanInput = {
      propertyPrice: 2_500_000_000,
      downPayment: 500_000_000,
      loanAmount: 2_000_000_000,
      loanTermMonths: 240,
      repaymentMethod: 'EQUAL_PRINCIPAL',
      promoInterestRate: 7.0,
      promoPeriodMonths: 12,
      postPromoRate: 12.0,
      gracePeriodMonths: 12,
    };

    const schedule = generateAmortizationSchedule(loan);

    // Month 12: interest only at 7% on 2.0B = 11,666,667 VND
    expect(schedule[11].totalDebtService).toBe(11_666_667);
    expect(schedule[11].principalPayment).toBe(0);

    // Month 13: grace ends AND rate resets to 12%. Remaining term = 228 months
    // P = 2B / 228 = 8,771,930 VND; Interest = 2B * 12% / 12 = 20,000,000 VND; Total = 28,771,930 VND
    expect(schedule[12].principalPayment).toBe(8_771_930);
    expect(schedule[12].interestPayment).toBe(20_000_000);
    expect(schedule[12].totalDebtService).toBe(28_771_930);

    expect(schedule[239].endingBalance).toBe(0);
  });

  it('5. Throws RangeError when grace period is equal to or exceeds loan term (G >= N)', () => {
    const invalidLoanEqual: LoanInput = {
      propertyPrice: 1_000_000_000,
      downPayment: 200_000_000,
      loanAmount: 800_000_000,
      loanTermMonths: 120,
      repaymentMethod: 'EQUAL_PRINCIPAL',
      promoInterestRate: 8.0,
      promoPeriodMonths: 12,
      postPromoRate: 10.0,
      gracePeriodMonths: 120, // Equal to term
    };

    expect(() => generateAmortizationSchedule(invalidLoanEqual)).toThrow(RangeError);

    const invalidLoanGreater: LoanInput = {
      ...invalidLoanEqual,
      gracePeriodMonths: 130, // Greater than term
    };

    expect(() => generateAmortizationSchedule(invalidLoanGreater)).toThrow(RangeError);
  });
});
