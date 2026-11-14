import { describe, it, expect } from 'vitest';
import {
  calculateSimulation,
  generateAmortizationSchedule,
  LoanInput,
  HouseholdInput,
} from '@/lib/depositguard/engine';

describe('Boundary Validations & Invariant Edge Cases', () => {
  const baseLoan: LoanInput = {
    propertyPrice: 2_000_000_000,
    downPayment: 500_000_000,
    loanAmount: 1_500_000_000,
    loanTermMonths: 120,
    repaymentMethod: 'EQUAL_PRINCIPAL',
    promoInterestRate: 8.0,
    promoPeriodMonths: 12,
    postPromoRate: 11.0,
  };

  it('1. Guards zero net household income (Y = 0) to return null DTI and avoid division by zero', () => {
    const zeroIncomeHousehold: HouseholdInput = {
      monthlyNetIncome: 0,
      essentialLivingExpenses: 20_000_000,
      existingDebtPayments: 5_000_000,
      liquidSavings: 600_000_000,
    };

    const res = calculateSimulation(baseLoan, zeroIncomeHousehold);

    expect(res.month1DtiRatio).toBeNull();
    expect(res.postPromoDtiRatio).toBeNull();
    for (const item of res.schedule) {
      expect(item.dtiRatio).toBeNull();
      expect(item.operatingCashFlow).toBeLessThan(0);
      expect(item.isDeficit).toBe(true);
    }
  });

  it('2. Correctly handles zero existing debt payments (D = 0)', () => {
    const noDebtHousehold: HouseholdInput = {
      monthlyNetIncome: 50_000_000,
      essentialLivingExpenses: 20_000_000,
      existingDebtPayments: 0,
      liquidSavings: 800_000_000,
    };

    const res = calculateSimulation(baseLoan, noDebtHousehold);

    expect(res.schedule[0].existingDebt).toBe(0);
    expect(res.month1DtiRatio).toBe(res.month1Payment / 50_000_000);
  });

  it('3. Flags DEFICIT status when initial closing cash is negative (liquid savings < upfront costs)', () => {
    const insufficientSavingsHousehold: HouseholdInput = {
      monthlyNetIncome: 60_000_000,
      essentialLivingExpenses: 25_000_000,
      existingDebtPayments: 0,
      liquidSavings: 400_000_000, // Down payment is 500m
    };

    const res = calculateSimulation(baseLoan, insufficientSavingsHousehold);

    expect(res.initialReserveBalance).toBe(-100_000_000); // 400m - 500m
    expect(res.affordabilityStatus).toBe('DEFICIT');
  });

  it('4. Successfully computes single-month loan (N = 1)', () => {
    const singleMonthLoan: LoanInput = {
      propertyPrice: 100_000_000,
      downPayment: 50_000_000,
      loanAmount: 50_000_000,
      loanTermMonths: 1,
      repaymentMethod: 'EQUAL_PRINCIPAL',
      promoInterestRate: 12.0,
      promoPeriodMonths: 0,
      postPromoRate: 12.0,
    };

    const schedule = generateAmortizationSchedule(singleMonthLoan);

    expect(schedule).toHaveLength(1);
    expect(schedule[0].beginningBalance).toBe(50_000_000);
    expect(schedule[0].principalPayment).toBe(50_000_000);
    expect(schedule[0].interestPayment).toBe(500_000); // 50m * 0.12 / 12
    expect(schedule[0].endingBalance).toBe(0);
  });

  it('5. Successfully computes 360-month loan (30 years) with zero floating point drift', () => {
    const longTermLoan: LoanInput = {
      propertyPrice: 4_000_000_000,
      downPayment: 1_000_000_000,
      loanAmount: 3_000_000_000,
      loanTermMonths: 360,
      repaymentMethod: 'ANNUITY',
      promoInterestRate: 6.5,
      promoPeriodMonths: 24,
      postPromoRate: 10.5,
    };

    const schedule = generateAmortizationSchedule(longTermLoan);

    expect(schedule).toHaveLength(360);
    expect(schedule[359].endingBalance).toBe(0);

    const totalPrincipal = schedule.reduce((acc, m) => acc + m.principalPayment, 0);
    expect(totalPrincipal).toBe(3_000_000_000);
  });

  it('6. Enforces invariant: ending balance never drops below zero at any month', () => {
    const schedule = generateAmortizationSchedule(baseLoan);

    for (const item of schedule) {
      expect(item.endingBalance).toBeGreaterThanOrEqual(0);
      expect(item.principalPayment).toBeLessThanOrEqual(item.beginningBalance);
    }
  });

  it('7. Maintains exact integer VND precision for very large Vietnamese loans (50 Billion VND)', () => {
    const largeLoan: LoanInput = {
      propertyPrice: 70_000_000_000,
      downPayment: 20_000_000_000,
      loanAmount: 50_000_000_000,
      loanTermMonths: 300,
      repaymentMethod: 'EQUAL_PRINCIPAL',
      promoInterestRate: 7.5,
      promoPeriodMonths: 36,
      postPromoRate: 11.5,
    };

    const schedule = generateAmortizationSchedule(largeLoan);

    expect(schedule).toHaveLength(300);
    expect(schedule[299].endingBalance).toBe(0);

    const totalPrincipal = schedule.reduce((acc, m) => acc + m.principalPayment, 0);
    expect(totalPrincipal).toBe(50_000_000_000);
  });

  it('8. Handles zero promotional duration (T_promo = 0) with zero payment jump', () => {
    const noPromoLoan: LoanInput = {
      ...baseLoan,
      promoPeriodMonths: 0,
    };

    const household: HouseholdInput = {
      monthlyNetIncome: 60_000_000,
      essentialLivingExpenses: 25_000_000,
      existingDebtPayments: 0,
      liquidSavings: 800_000_000,
    };

    const res = calculateSimulation(noPromoLoan, household);

    expect(res.schedule[0].interestRate).toBe(11.0); // Floating rate from month 1
    expect(res.paymentJumpAmount).toBe(0);
    expect(res.paymentJumpPercentage).toBe(0);
  });

  it('9. Handles promotional duration covering full term (T_promo >= N) with zero payment jump', () => {
    const fullPromoLoan: LoanInput = {
      ...baseLoan,
      promoPeriodMonths: 120, // Equal to term
    };

    const household: HouseholdInput = {
      monthlyNetIncome: 60_000_000,
      essentialLivingExpenses: 25_000_000,
      existingDebtPayments: 0,
      liquidSavings: 800_000_000,
    };

    const res = calculateSimulation(fullPromoLoan, household);

    expect(res.schedule[119].interestRate).toBe(8.0);
    expect(res.paymentJumpAmount).toBe(0);
    expect(res.paymentJumpPercentage).toBe(0);
  });

  it('10. Rejects invalid loan term (N <= 0) and negative loan amount with RangeError', () => {
    const invalidTermLoan: LoanInput = {
      ...baseLoan,
      loanTermMonths: 0,
    };

    expect(() => generateAmortizationSchedule(invalidTermLoan)).toThrow(RangeError);

    const negativeLoan: LoanInput = {
      ...baseLoan,
      loanAmount: -1_000_000,
    };

    expect(() => generateAmortizationSchedule(negativeLoan)).toThrow(RangeError);
  });
});
