import { describe, it, expect } from 'vitest';
import {
  Step1PropertySchema,
  Step2HouseholdSchema,
  Step3LoanSchema,
  validateStep1,
  validateStep2,
  validateStep3,
} from '@/lib/depositguard/schemas';
import { DEFAULT_LOAN_INPUT } from '@/lib/depositguard/context';

describe('DepositGuard Zod Validation & Step Evaluators Test Suite', () => {
  describe('Step 1: Property Schemas & Invariants', () => {
    it('validates legitimate property inputs', () => {
      const valid = {
        purchasePrice: 2_500_000_000,
        downPayment: 500_000_000,
        loanAmount: 2_000_000_000,
        propertyType: 'apartment' as const,
        region: 'hcm' as const,
      };
      const result = validateStep1(valid);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });

    it('rejects down payment exceeding purchase price', () => {
      const invalid = {
        purchasePrice: 2_500_000_000,
        downPayment: 3_000_000_000,
        loanAmount: 0,
      };
      const result = validateStep1(invalid);
      expect(result.isValid).toBe(false);
      expect(result.errors.downPayment).toContain('không được vượt quá giá mua nhà');
    });

    it('rejects zero or negative purchase price', () => {
      const invalid = {
        purchasePrice: 0,
        downPayment: 0,
        loanAmount: 0,
      };
      const result = validateStep1(invalid);
      expect(result.isValid).toBe(false);
      expect(result.errors.purchasePrice).toContain('lớn hơn 0');
    });

    it('produces advisory warning when down payment is 0 (100% LTV)', () => {
      const zeroDown = {
        purchasePrice: 2_500_000_000,
        downPayment: 0,
        loanAmount: 2_500_000_000,
      };
      const result = validateStep1(zeroDown);
      expect(result.isValid).toBe(true);
      expect(result.warnings.downPayment).toContain('Vay 100%');
    });
  });

  describe('Step 2: Household Profile Schemas & Invariants', () => {
    it('validates legitimate household inputs', () => {
      const valid = {
        monthlyNetIncome: 55_000_000,
        essentialLivingExpenses: 30_000_000,
        existingDebtPayments: 0,
        liquidSavings: 700_000_000,
        plannedEmergencyReserveFloor: 90_000_000,
      };
      const result = validateStep2(valid);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });

    it('rejects negative income or expense values', () => {
      const invalid = {
        monthlyNetIncome: -10_000_000,
        essentialLivingExpenses: 30_000_000,
        existingDebtPayments: 0,
        liquidSavings: 700_000_000,
      };
      const result = validateStep2(invalid);
      expect(result.isValid).toBe(false);
      expect(result.errors.monthlyNetIncome).toContain('không được âm');
    });

    it('triggers warning when liquid savings < down payment', () => {
      const lowSavings = {
        monthlyNetIncome: 55_000_000,
        essentialLivingExpenses: 30_000_000,
        existingDebtPayments: 0,
        liquidSavings: 400_000_000,
        downPayment: 500_000_000,
      };
      const result = validateStep2(lowSavings);
      expect(result.isValid).toBe(true);
      expect(result.warnings.liquidSavings).toContain('thấp hơn tiền đặt cọc dự kiến');
    });

    it('triggers warning when income is 0 or expenses exceed income', () => {
      const zeroIncome = {
        monthlyNetIncome: 0,
        essentialLivingExpenses: 20_000_000,
        existingDebtPayments: 0,
        liquidSavings: 100_000_000,
      };
      const result = validateStep2(zeroIncome);
      expect(result.warnings.monthlyNetIncome).toContain('Thu nhập bằng 0');

      const highExpense = {
        monthlyNetIncome: 30_000_000,
        essentialLivingExpenses: 35_000_000,
        existingDebtPayments: 0,
        liquidSavings: 100_000_000,
      };
      const result2 = validateStep2(highExpense);
      expect(result2.warnings.monthlyNetIncome).toContain('vượt thu nhập ròng');
    });
  });

  describe('Step 3: Loan Parameter Schemas & Invariants', () => {
    it('validates legitimate loan parameters', () => {
      const valid = {
        loanTermMonths: 240,
        repaymentMethod: 'EQUAL_PRINCIPAL' as const,
        promoInterestRate: 7.0,
        promoPeriodMonths: 12,
        postPromoRate: 12.0,
        gracePeriodMonths: 0,
      };
      const result = validateStep3(valid);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });

    it('rejects loan tenure below 12 months or above 420 months', () => {
      expect(validateStep3({ loanTermMonths: 6, repaymentMethod: 'ANNUITY', promoInterestRate: 7, promoPeriodMonths: 6, postPromoRate: 12 }).isValid).toBe(false);
      expect(validateStep3({ loanTermMonths: 500, repaymentMethod: 'ANNUITY', promoInterestRate: 7, promoPeriodMonths: 12, postPromoRate: 12 }).isValid).toBe(false);
    });

    it('rejects grace period >= loan term', () => {
      const invalid = {
        loanTermMonths: 240,
        repaymentMethod: 'EQUAL_PRINCIPAL' as const,
        promoInterestRate: 7.0,
        promoPeriodMonths: 12,
        postPromoRate: 12.0,
        gracePeriodMonths: 240,
      };
      const result = validateStep3(invalid);
      expect(result.isValid).toBe(false);
      expect(result.errors.gracePeriodMonths).toContain('phải nhỏ hơn thời hạn vay');
    });

    it('warns when interest rate jump is 4pp or higher', () => {
      const highJump = {
        loanTermMonths: 240,
        repaymentMethod: 'EQUAL_PRINCIPAL' as const,
        promoInterestRate: 6.0,
        promoPeriodMonths: 12,
        postPromoRate: 12.0, // jump of 6%
        gracePeriodMonths: 0,
      };
      const result = validateStep3(highJump);
      expect(result.isValid).toBe(true);
      expect(result.warnings.postPromoRate).toContain('cú sốc tăng tiền trả nợ');
    });
  });

  describe('Regression Suite: DEFAULT_LOAN_INPUT & Property Price Alias Invariance', () => {
    it('validates DEFAULT_LOAN_INPUT out-of-the-box with zero errors and isValid: true', () => {
      const result = validateStep1(DEFAULT_LOAN_INPUT);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
      expect(result.errors.purchasePrice).toBeUndefined();
      expect(result.errors.propertyPrice).toBeUndefined();
    });

    it('validates Step 1 payload containing only propertyPrice without purchasePrice', () => {
      const payload = {
        ...DEFAULT_LOAN_INPUT,
        propertyPrice: 3_000_000_000,
        downPayment: 600_000_000,
        loanAmount: 2_400_000_000,
      };
      delete (payload as any).purchasePrice;

      const result = validateStep1(payload);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });

    it('validates Step 1 payload containing only purchasePrice without propertyPrice', () => {
      const payload = {
        ...DEFAULT_LOAN_INPUT,
        purchasePrice: 3_000_000_000,
        downPayment: 600_000_000,
        loanAmount: 2_400_000_000,
      };
      delete (payload as any).propertyPrice;

      const result = validateStep1(payload);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });

    it('validates Step 1 payload containing both propertyPrice and purchasePrice consistently', () => {
      const payload = {
        ...DEFAULT_LOAN_INPUT,
        propertyPrice: 3_500_000_000,
        purchasePrice: 3_500_000_000,
        downPayment: 700_000_000,
        loanAmount: 2_800_000_000,
      };
      const result = validateStep1(payload);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });

    it('enforces downPayment <= propertyPrice invariant when only propertyPrice is supplied', () => {
      const invalid = {
        ...DEFAULT_LOAN_INPUT,
        propertyPrice: 2_500_000_000,
        downPayment: 3_000_000_000,
        loanAmount: 0,
      };
      delete (invalid as any).purchasePrice;

      const result = validateStep1(invalid);
      expect(result.isValid).toBe(false);
      expect(result.errors.downPayment).toContain('không được vượt quá giá mua nhà');
    });

    it('rejects zero or negative propertyPrice when only propertyPrice is supplied', () => {
      const invalid = {
        ...DEFAULT_LOAN_INPUT,
        propertyPrice: 0,
        downPayment: 0,
        loanAmount: 0,
      };
      delete (invalid as any).purchasePrice;

      const result = validateStep1(invalid);
      expect(result.isValid).toBe(false);
      const priceError = result.errors.purchasePrice || result.errors.propertyPrice;
      expect(priceError).toBeDefined();
      expect(priceError).toContain('lớn hơn 0');
    });

    it('produces advisory warning when down payment is 0 (100% LTV) with propertyPrice', () => {
      const zeroDown = {
        ...DEFAULT_LOAN_INPUT,
        propertyPrice: 2_500_000_000,
        downPayment: 0,
        loanAmount: 2_500_000_000,
      };
      delete (zeroDown as any).purchasePrice;

      const result = validateStep1(zeroDown);
      expect(result.isValid).toBe(true);
      expect(result.warnings.downPayment).toContain('Vay 100%');
    });
  });
});
