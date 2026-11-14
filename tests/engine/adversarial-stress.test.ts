/**
 * Adversarial Stress & Property-Based Test Harness
 * Author: teamwork_challenger (challenger_m1_1)
 *
 * Stress-tests DepositGuard Financial Calculation Engine:
 * 1. 1,000+ randomized parameter variations across loan amounts (50M - 100B VND),
 *    tenures (1 - 360 months), promo rates (0% - 20%), reset rates (0% - 30%), grace periods.
 * 2. Boundary extremes: 0% interest, 0 income, 0 expenses, 0 savings, 1-month and 360-month loans.
 * 3. Zero floating point drift verification across 360 months.
 * 4. Terminal balance invariant ($B_{end}[N] \equiv 0$).
 * 5. Sum of principal payments invariant ($\sum P[m] \equiv L$).
 * 6. Non-negative balance invariant ($B_{end}[m] \ge 0$).
 * 7. Division by zero safety ($Y = 0 \implies DTI = null$, no NaN or Infinity).
 * 8. Reverse affordability solver: monotonic convergence, bounds safety, no infinite loops.
 */

import { describe, it, expect } from 'vitest';
import {
  generateAmortizationSchedule,
  calculateSimulation,
  solveAffordability,
  LoanInput,
  HouseholdInput,
  StressScenarioInput,
} from '@/lib/depositguard/engine';

// Deterministic Pseudo-Random Generator (Linear Congruential Generator) for reproducible fuzzing
class PRNG {
  private state: number;

  constructor(seed: number = 42) {
    this.state = seed >>> 0;
  }

  // Returns pseudo-random float in [0, 1)
  next(): number {
    this.state = (1664525 * this.state + 1013904223) >>> 0;
    return this.state / 4294967296;
  }

  // Returns integer in [min, max] inclusive
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  // Returns float in [min, max]
  nextFloat(min: number, max: number, decimals: number = 2): number {
    const factor = Math.pow(10, decimals);
    const val = this.next() * (max - min) + min;
    return Math.round(val * factor) / factor;
  }

  pick<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)];
  }
}

describe('Adversarial Challenger: Stress & Invariant Hardening', () => {
  const prng = new PRNG(20261114);

  describe('1. 1,000+ Randomized Parameter Variations (Fuzzing & Invariants)', () => {
    const TOTAL_VARIATIONS = 1200;

    it(
      `should satisfy all 9 core mathematical invariants across ${TOTAL_VARIATIONS} randomized loan scenarios`,
      () => {
        let equalPrincipalCount = 0;
        let annuityCount = 0;

      for (let i = 0; i < TOTAL_VARIATIONS; i++) {
        // Loan parameter generation: 50M to 100B VND
        const loanAmount = prng.nextInt(50_000_000, 100_000_000_000);
        const propertyPrice = Math.round(loanAmount * prng.nextFloat(1.1, 2.5));
        const downPayment = propertyPrice - loanAmount;
        const loanTermMonths = prng.nextInt(1, 360);
        const repaymentMethod = prng.pick<LoanInput['repaymentMethod']>([
          'EQUAL_PRINCIPAL',
          'ANNUITY',
        ]);
        if (repaymentMethod === 'EQUAL_PRINCIPAL') equalPrincipalCount++;
        else annuityCount++;

        const promoInterestRate = prng.nextFloat(0, 20, 2);
        const postPromoRate = prng.nextFloat(0, 30, 2);
        const promoPeriodMonths = prng.nextInt(0, loanTermMonths);
        const gracePeriodMonths =
          loanTermMonths > 1 ? prng.nextInt(0, loanTermMonths - 1) : 0;

        const loan: LoanInput = {
          propertyPrice,
          downPayment,
          loanAmount,
          loanTermMonths,
          repaymentMethod,
          promoInterestRate,
          promoPeriodMonths,
          postPromoRate,
          gracePeriodMonths,
        };

        const rateShockPp = prng.nextFloat(-5, 10, 1);
        const incomeShockPercent = prng.pick([0, -10, -20, -30, -50]);
        const incomeShockDurationMonths = prng.nextInt(0, 12);
        const incomeShockStartMonth = prng.nextInt(1, Math.min(36, loanTermMonths));
        const expenseShockPercent = prng.nextFloat(0, 30, 1);

        const stress: Partial<StressScenarioInput> = {
          rateShockPp,
          incomeShockPercent,
          incomeShockDurationMonths,
          incomeShockStartMonth,
          expenseShockPercent,
        };

        const monthlyNetIncome = prng.nextInt(0, 500_000_000);
        const essentialLivingExpenses = prng.nextInt(0, 300_000_000);
        const existingDebtPayments = prng.nextInt(0, 100_000_000);
        const liquidSavings = prng.nextInt(0, 100_000_000_000);
        const plannedEmergencyReserveFloor = prng.nextInt(0, 500_000_000);

        const household: HouseholdInput = {
          monthlyNetIncome,
          essentialLivingExpenses,
          existingDebtPayments,
          liquidSavings,
          plannedEmergencyReserveFloor,
        };

        // Execute simulation
        const result = calculateSimulation(loan, household, stress);

        // INVARIANT 1: Schedule length must exactly equal loanTermMonths
        expect(result.schedule.length).toBe(loanTermMonths);

        // INVARIANT 2: Terminal balance at month N must be EXACTLY 0
        const terminalItem = result.schedule[loanTermMonths - 1];
        expect(terminalItem.endingBalance).toBe(0);

        // INVARIANT 3: Sum of principal payments must equal initial loan amount EXACTLY
        let totalPrincipalRepaid = 0;
        let prevEndingBalance = loanAmount;

        for (let m = 0; m < loanTermMonths; m++) {
          const item = result.schedule[m];
          const monthNum = m + 1;

          // INVARIANT 4: Continuity - Beginning balance matches previous ending balance
          expect(item.beginningBalance).toBe(prevEndingBalance);

          // INVARIANT 5: Non-negative balance - Balances never negative
          expect(item.beginningBalance).toBeGreaterThanOrEqual(0);
          expect(item.endingBalance).toBeGreaterThanOrEqual(0);
          expect(item.principalPayment).toBeGreaterThanOrEqual(0);
          expect(item.interestPayment).toBeGreaterThanOrEqual(0);
          expect(item.totalDebtService).toBeGreaterThanOrEqual(0);

          // INVARIANT 6: Exact Integer VND - No fractional cents/sub-units
          expect(Number.isInteger(item.beginningBalance)).toBe(true);
          expect(Number.isInteger(item.principalPayment)).toBe(true);
          expect(Number.isInteger(item.interestPayment)).toBe(true);
          expect(Number.isInteger(item.totalDebtService)).toBe(true);
          expect(Number.isInteger(item.endingBalance)).toBe(true);
          expect(Number.isInteger(item.netIncome)).toBe(true);
          expect(Number.isInteger(item.essentialExpenses)).toBe(true);
          expect(Number.isInteger(item.operatingCashFlow)).toBe(true);
          expect(Number.isInteger(item.reserveBalance)).toBe(true);

          // INVARIANT 7: No NaN or Infinity in any numeric output
          expect(Number.isNaN(item.totalDebtService)).toBe(false);
          expect(Number.isFinite(item.totalDebtService)).toBe(true);
          expect(Number.isNaN(item.operatingCashFlow)).toBe(false);
          expect(Number.isFinite(item.operatingCashFlow)).toBe(true);

          // INVARIANT 8: Grace period enforces 0 scheduled principal payment
          if (monthNum <= gracePeriodMonths) {
            expect(item.principalPayment).toBe(0);
            expect(item.isGracePeriod).toBe(true);
          }

          // INVARIANT 9: Division by zero safety on DTI ratio
          if (item.netIncome <= 0) {
            expect(item.dtiRatio).toBeNull();
          } else {
            expect(item.dtiRatio).not.toBeNull();
            expect(Number.isFinite(item.dtiRatio)).toBe(true);
            expect(item.dtiRatio!).toBeGreaterThanOrEqual(0);
          }

          totalPrincipalRepaid += item.principalPayment;
          prevEndingBalance = item.endingBalance;
        }

        expect(totalPrincipalRepaid).toBe(loanAmount);
      }

      // Assert that both repayment methods were tested thoroughly
      expect(equalPrincipalCount).toBeGreaterThan(500);
      expect(annuityCount).toBeGreaterThan(500);
    }, 30000);
  });

  describe('2. Boundary Extremes & Edge Cases', () => {
    it('handles 0% interest rate with zero drift under both repayment methods', () => {
      const zeroRateLoanEqual: LoanInput = {
        propertyPrice: 1_000_000_000,
        downPayment: 200_000_000,
        loanAmount: 800_000_000,
        loanTermMonths: 240,
        repaymentMethod: 'EQUAL_PRINCIPAL',
        promoInterestRate: 0,
        promoPeriodMonths: 12,
        postPromoRate: 0,
      };

      const schedEqual = generateAmortizationSchedule(zeroRateLoanEqual);
      expect(schedEqual[0].interestPayment).toBe(0);
      expect(schedEqual[239].interestPayment).toBe(0);
      expect(schedEqual[239].endingBalance).toBe(0);
      const totalPEqual = schedEqual.reduce((s, i) => s + i.principalPayment, 0);
      expect(totalPEqual).toBe(800_000_000);

      const zeroRateLoanAnnuity: LoanInput = {
        ...zeroRateLoanEqual,
        repaymentMethod: 'ANNUITY',
      };
      const schedAnnuity = generateAmortizationSchedule(zeroRateLoanAnnuity);
      expect(schedAnnuity[0].interestPayment).toBe(0);
      expect(schedAnnuity[239].interestPayment).toBe(0);
      expect(schedAnnuity[239].endingBalance).toBe(0);
      const totalPAnnuity = schedAnnuity.reduce((s, i) => s + i.principalPayment, 0);
      expect(totalPAnnuity).toBe(800_000_000);
    });

    it('handles zero income household safely (DTI null, no NaN or crash)', () => {
      const loan: LoanInput = {
        propertyPrice: 2_000_000_000,
        downPayment: 500_000_000,
        loanAmount: 1_500_000_000,
        loanTermMonths: 240,
        repaymentMethod: 'EQUAL_PRINCIPAL',
        promoInterestRate: 7,
        promoPeriodMonths: 12,
        postPromoRate: 11,
      };

      const zeroIncomeHousehold: HouseholdInput = {
        monthlyNetIncome: 0,
        essentialLivingExpenses: 15_000_000,
        existingDebtPayments: 0,
        liquidSavings: 600_000_000,
      };

      const res = calculateSimulation(loan, zeroIncomeHousehold);
      expect(res.month1DtiRatio).toBeNull();
      expect(res.postPromoDtiRatio).toBeNull();
      expect(res.maxDtiRatio).toBeNull();
      expect(res.firstNegativeCashFlowMonth).toBe(1);
      expect(res.affordabilityStatus).toBe('DEFICIT');

      for (const row of res.schedule) {
        expect(row.dtiRatio).toBeNull();
        expect(row.isDeficit).toBe(true);
        expect(Number.isNaN(row.operatingCashFlow)).toBe(false);
      }
    });

    it('handles zero living expenses and zero liquid savings', () => {
      const loan: LoanInput = {
        propertyPrice: 1_000_000_000,
        downPayment: 300_000_000,
        loanAmount: 700_000_000,
        loanTermMonths: 120,
        repaymentMethod: 'ANNUITY',
        promoInterestRate: 8,
        promoPeriodMonths: 24,
        postPromoRate: 12,
      };

      const household: HouseholdInput = {
        monthlyNetIncome: 50_000_000,
        essentialLivingExpenses: 0,
        existingDebtPayments: 0,
        liquidSavings: 0,
      };

      const res = calculateSimulation(loan, household);
      expect(res.initialReserveBalance).toBe(-300_000_000);
      expect(res.affordabilityStatus).toBe('DEFICIT');
    });

    it('handles 1-month loans (tenure = 1)', () => {
      for (const method of ['EQUAL_PRINCIPAL', 'ANNUITY'] as const) {
        const loan: LoanInput = {
          propertyPrice: 500_000_000,
          downPayment: 100_000_000,
          loanAmount: 400_000_000,
          loanTermMonths: 1,
          repaymentMethod: method,
          promoInterestRate: 6.0,
          promoPeriodMonths: 1,
          postPromoRate: 10.0,
          gracePeriodMonths: 0,
        };

        const sched = generateAmortizationSchedule(loan);
        expect(sched.length).toBe(1);
        expect(sched[0].beginningBalance).toBe(400_000_000);
        expect(sched[0].principalPayment).toBe(400_000_000);
        expect(sched[0].interestPayment).toBe(2_000_000); // 400m * 6% / 12
        expect(sched[0].endingBalance).toBe(0);
      }
    });

    it('handles 360-month (30 years) maximum tenure with zero drift', () => {
      const loan: LoanInput = {
        propertyPrice: 10_000_000_000,
        downPayment: 3_000_000_000,
        loanAmount: 7_000_000_000,
        loanTermMonths: 360,
        repaymentMethod: 'ANNUITY',
        promoInterestRate: 6.5,
        promoPeriodMonths: 36,
        postPromoRate: 11.5,
        gracePeriodMonths: 24,
      };

      const sched = generateAmortizationSchedule(loan);
      expect(sched.length).toBe(360);
      expect(sched[359].endingBalance).toBe(0);
      const totalPrincipal = sched.reduce((sum, item) => sum + item.principalPayment, 0);
      expect(totalPrincipal).toBe(7_000_000_000);
    });

    it('validates and rejects invalid input ranges with RangeError', () => {
      const base: LoanInput = {
        propertyPrice: 1_000_000_000,
        downPayment: 200_000_000,
        loanAmount: 800_000_000,
        loanTermMonths: 120,
        repaymentMethod: 'EQUAL_PRINCIPAL',
        promoInterestRate: 7,
        promoPeriodMonths: 12,
        postPromoRate: 12,
      };

      expect(() => generateAmortizationSchedule({ ...base, loanAmount: -100 })).toThrow(RangeError);
      expect(() => generateAmortizationSchedule({ ...base, loanTermMonths: 0 })).toThrow(RangeError);
      expect(() => generateAmortizationSchedule({ ...base, loanTermMonths: -12 })).toThrow(RangeError);
      expect(() => generateAmortizationSchedule({ ...base, gracePeriodMonths: 120 })).toThrow(RangeError);
      expect(() => generateAmortizationSchedule({ ...base, gracePeriodMonths: 150 })).toThrow(RangeError);
      expect(() => generateAmortizationSchedule({ ...base, promoInterestRate: -5 })).toThrow(RangeError);
      expect(() => generateAmortizationSchedule({ ...base, postPromoRate: -1 })).toThrow(RangeError);
    });
  });

  describe('3. Pathological Floating-Point Drift Stress (Zero Float Drift)', () => {
    it('maintains exact 0 terminal balance and exact principal sum on non-divisible prime amounts', () => {
      const pathologicalCases = [
        { amount: 1_000_000_007, months: 239, promoRate: 7.13579, postRate: 11.97531 },
        { amount: 3_333_333_333, months: 71, promoRate: 6.66666, postRate: 13.33333 },
        { amount: 99_999_999_999, months: 360, promoRate: 5.99999, postRate: 14.12345 },
        { amount: 777_777_777, months: 17, promoRate: 0.00001, postRate: 29.99999 },
      ];

      for (const tc of pathologicalCases) {
        for (const method of ['EQUAL_PRINCIPAL', 'ANNUITY'] as const) {
          const loan: LoanInput = {
            propertyPrice: tc.amount * 2,
            downPayment: tc.amount,
            loanAmount: tc.amount,
            loanTermMonths: tc.months,
            repaymentMethod: method,
            promoInterestRate: tc.promoRate,
            promoPeriodMonths: Math.floor(tc.months / 3),
            postPromoRate: tc.postRate,
            gracePeriodMonths: Math.floor(tc.months / 5),
          };

          const sched = generateAmortizationSchedule(loan);
          expect(sched[sched.length - 1].endingBalance).toBe(0);

          const totalP = sched.reduce((sum, item) => sum + item.principalPayment, 0);
          expect(totalP).toBe(tc.amount);

          for (const item of sched) {
            expect(Number.isInteger(item.beginningBalance)).toBe(true);
            expect(Number.isInteger(item.principalPayment)).toBe(true);
            expect(Number.isInteger(item.interestPayment)).toBe(true);
            expect(Number.isInteger(item.endingBalance)).toBe(true);
          }
        }
      }
    });
  });

  describe('4. Reverse Affordability Solver Adversarial Stress & Monotonicity', () => {
    it('converges monotonically without infinite loops across 100 randomized profiles', () => {
      const SOLVER_RUNS = 100;
      const startTime = performance.now();

      for (let s = 0; s < SOLVER_RUNS; s++) {
        const loanAmount = prng.nextInt(500_000_000, 50_000_000_000);
        const propertyPrice = Math.round(loanAmount * prng.nextFloat(1.2, 2.0));
        const downPayment = propertyPrice - loanAmount;
        const loanTermMonths = prng.nextInt(60, 360);
        const promoInterestRate = prng.nextFloat(5, 10, 2);
        const postPromoRate = prng.nextFloat(9, 15, 2);
        const promoPeriodMonths = prng.nextInt(12, 36);

        const loan: LoanInput = {
          propertyPrice,
          downPayment,
          loanAmount,
          loanTermMonths,
          repaymentMethod: prng.pick(['EQUAL_PRINCIPAL', 'ANNUITY']),
          promoInterestRate,
          promoPeriodMonths,
          postPromoRate,
        };

        const monthlyNetIncome = prng.nextInt(30_000_000, 200_000_000);
        const essentialLivingExpenses = Math.round(monthlyNetIncome * prng.nextFloat(0.3, 0.7));
        const existingDebtPayments = prng.nextInt(0, 10_000_000);
        const liquidSavings = prng.nextInt(500_000_000, 20_000_000_000);

        const household: HouseholdInput = {
          monthlyNetIncome,
          essentialLivingExpenses,
          existingDebtPayments,
          liquidSavings,
        };

        const solved = solveAffordability(loan, household);

        // Verification 1: Safe loan must be non-negative
        expect(solved.maxSafeLoanAmount).toBeGreaterThanOrEqual(0);

        // Verification 2: Monotonic validation - simulating at maxSafeLoanAmount must have 0 deficit months
        if (solved.maxSafeLoanAmount > 0) {
          const testLoan: LoanInput = {
            ...loan,
            loanAmount: solved.maxSafeLoanAmount,
          };
          const simSafe = calculateSimulation(testLoan, household);
          expect(simSafe.firstNegativeCashFlowMonth).toBeNull();
        }

        // Verification 3: Recommended action must be valid
        expect([
          'PROCEED',
          'INCREASE_DOWN_PAYMENT',
          'REDUCE_PRICE',
          'EXTEND_TERM',
          'UNSUSTAINABLE',
        ]).toContain(solved.recommendedAction);
      }

      const elapsed = performance.now() - startTime;
      // All 100 solver searches (4,000 full simulations) must complete rapidly (< 5000ms, ~20ms per search)
      expect(elapsed).toBeLessThan(5000);
    }, 15000);

    it('handles unaffordable household budgets correctly', () => {
      const loan: LoanInput = {
        propertyPrice: 3_000_000_000,
        downPayment: 1_000_000_000,
        loanAmount: 2_000_000_000,
        loanTermMonths: 240,
        repaymentMethod: 'EQUAL_PRINCIPAL',
        promoInterestRate: 7,
        promoPeriodMonths: 12,
        postPromoRate: 12,
      };

      const negativeBudgetHousehold: HouseholdInput = {
        monthlyNetIncome: 30_000_000,
        essentialLivingExpenses: 35_000_000, // Essentials exceed income!
        existingDebtPayments: 5_000_000,
        liquidSavings: 500_000_000,
      };

      const solved = solveAffordability(loan, negativeBudgetHousehold);
      expect(solved.maxSafeLoanAmount).toBe(0);
      expect(solved.additionalEquityNeeded).toBe(2_000_000_000);
      expect(solved.recommendedAction).toBe('UNSUSTAINABLE');
      expect(solved.canAffordWithCurrentLiquidSavings).toBe(false);
    });
  });
});
