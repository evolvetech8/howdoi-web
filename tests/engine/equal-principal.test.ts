import { describe, it, expect } from 'vitest';
import { generateAmortizationSchedule, LoanInput } from '@/lib/depositguard/engine';

describe('Equal Principal Amortization (dư nợ giảm dần)', () => {
  it('1. Produces constant monthly principal across non-terminal months', () => {
    const loan: LoanInput = {
      propertyPrice: 2_000_000_000,
      downPayment: 800_000_000,
      loanAmount: 1_200_000_000,
      loanTermMonths: 120,
      repaymentMethod: 'EQUAL_PRINCIPAL',
      promoInterestRate: 9.0,
      promoPeriodMonths: 12,
      postPromoRate: 11.0,
    };

    const schedule = generateAmortizationSchedule(loan);
    const expectedPrincipal = 10_000_000; // 1.2B / 120

    for (let m = 1; m < loan.loanTermMonths; m++) {
      expect(schedule[m - 1].principalPayment).toBe(expectedPrincipal);
    }
  });

  it('2. Demonstrates monotonically declining interest within the promotional period', () => {
    const loan: LoanInput = {
      propertyPrice: 1_000_000_000,
      downPayment: 400_000_000,
      loanAmount: 600_000_000,
      loanTermMonths: 60,
      repaymentMethod: 'EQUAL_PRINCIPAL',
      promoInterestRate: 10.0,
      promoPeriodMonths: 24,
      postPromoRate: 12.0,
    };

    const schedule = generateAmortizationSchedule(loan);

    for (let m = 1; m < 24; m++) {
      const currentInterest = schedule[m - 1].interestPayment;
      const nextInterest = schedule[m].interestPayment;
      expect(currentInterest).toBeGreaterThan(nextInterest);
    }
  });

  it('3. Demonstrates monotonically declining total debt service post-reset', () => {
    const loan: LoanInput = {
      propertyPrice: 1_000_000_000,
      downPayment: 400_000_000,
      loanAmount: 600_000_000,
      loanTermMonths: 60,
      repaymentMethod: 'EQUAL_PRINCIPAL',
      promoInterestRate: 8.0,
      promoPeriodMonths: 12,
      postPromoRate: 12.0,
    };

    const schedule = generateAmortizationSchedule(loan);

    for (let m = 13; m < loan.loanTermMonths; m++) {
      const currentDS = schedule[m - 1].totalDebtService;
      const nextDS = schedule[m].totalDebtService;
      expect(currentDS).toBeGreaterThan(nextDS);
    }
  });

  it('4. Reconciles odd loan amount terminal residue with zero drift', () => {
    // 100,000,000 / 36 = 2,777,777.777...
    const loan: LoanInput = {
      propertyPrice: 150_000_000,
      downPayment: 50_000_000,
      loanAmount: 100_000_000,
      loanTermMonths: 36,
      repaymentMethod: 'EQUAL_PRINCIPAL',
      promoInterestRate: 8.5,
      promoPeriodMonths: 6,
      postPromoRate: 10.5,
    };

    const schedule = generateAmortizationSchedule(loan);
    expect(schedule).toHaveLength(36);

    const finalMonth = schedule[35];
    expect(finalMonth.endingBalance).toBe(0);

    const totalPrincipal = schedule.reduce((acc, m) => acc + m.principalPayment, 0);
    expect(totalPrincipal).toBe(100_000_000);
  });

  it('5. Transitions cleanly on multi-year promotional resets (e.g. 24-month promo)', () => {
    const loan: LoanInput = {
      propertyPrice: 2_000_000_000,
      downPayment: 1_000_000_000,
      loanAmount: 1_000_000_000,
      loanTermMonths: 120,
      repaymentMethod: 'EQUAL_PRINCIPAL',
      promoInterestRate: 8.0,
      promoPeriodMonths: 24,
      postPromoRate: 11.5,
    };

    const schedule = generateAmortizationSchedule(loan);

    expect(schedule[23].isPromo).toBe(true);
    expect(schedule[23].interestRate).toBe(8.0);

    expect(schedule[24].isPromo).toBe(false);
    expect(schedule[24].interestRate).toBe(11.5);
    expect(schedule[24].month).toBe(25);

    // Contiguity of balance: beginning balance of m25 equals ending balance of m24
    expect(schedule[24].beginningBalance).toBe(schedule[23].endingBalance);
  });

  it('6. Verifies mid-term balance accuracy at half-term (month N/2)', () => {
    const loan: LoanInput = {
      propertyPrice: 3_000_000_000,
      downPayment: 1_000_000_000,
      loanAmount: 2_000_000_000,
      loanTermMonths: 240,
      repaymentMethod: 'EQUAL_PRINCIPAL',
      promoInterestRate: 7.0,
      promoPeriodMonths: 12,
      postPromoRate: 12.0,
    };

    const schedule = generateAmortizationSchedule(loan);
    const halfTermMonth = schedule[119]; // Month 120
    const expectedHalfBalance = 1_000_000_000;

    expect(Math.abs(halfTermMonth.endingBalance - expectedHalfBalance)).toBeLessThanOrEqual(100);
  });
});
