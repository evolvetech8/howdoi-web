/**
 * DepositGuard Zod Validation Schemas and Advisory Warning Evaluators
 * Provides user-friendly Vietnamese validation errors and non-blocking advisory warnings.
 */

import { z } from 'zod';

export const PropertyTypeEnum = z.enum(['apartment', 'townhouse', 'land', 'future_apartment']);
export type PropertyType = z.infer<typeof PropertyTypeEnum>;

export const RegionEnum = z.enum(['hcm', 'hanoi', 'danang', 'other']);
export type Region = z.infer<typeof RegionEnum>;

export const RepaymentMethodEnum = z.enum(['EQUAL_PRINCIPAL', 'ANNUITY']);
export type RepaymentMethod = z.infer<typeof RepaymentMethodEnum>;

export const Step1PropertySchema = z
  .object({
    purchasePrice: z.number().positive('Giá mua nhà phải lớn hơn 0').optional(),
    propertyPrice: z.number().positive('Giá mua nhà phải lớn hơn 0').optional(),
    downPayment: z.number().min(0, 'Vốn tự có không được âm'),
    loanAmount: z.number().min(0, 'Số tiền vay không được âm'),
    propertyType: PropertyTypeEnum.optional(),
    region: RegionEnum.optional(),
    transactionCosts: z.number().min(0, 'Chi phí sang tên không được âm').optional(),
    initialSetupCosts: z.number().min(0, 'Chi phí hoàn thiện không được âm').optional(),
  })
  .refine(
    (data) => {
      const price = data.propertyPrice ?? data.purchasePrice;
      return price !== undefined && price > 0;
    },
    {
      message: 'Giá mua nhà phải lớn hơn 0',
      path: ['purchasePrice'],
    }
  )
  .refine(
    (data) => {
      const price = data.propertyPrice ?? data.purchasePrice ?? 0;
      return data.downPayment <= price;
    },
    {
      message: 'Vốn tự có không được vượt quá giá mua nhà',
      path: ['downPayment'],
    }
  );

export type Step1PropertyData = z.infer<typeof Step1PropertySchema>;

export const Step2HouseholdSchema = z.object({
  monthlyNetIncome: z.number().min(0, 'Thu nhập không được âm'),
  essentialLivingExpenses: z.number().min(0, 'Chi phí sinh hoạt không được âm'),
  existingDebtPayments: z.number().min(0, 'Khoản trả nợ khác không được âm'),
  liquidSavings: z.number().min(0, 'Tiền tiết kiệm không được âm'),
  plannedEmergencyReserveFloor: z.number().min(0, 'Quỹ dự phòng không được âm').optional(),
  recurringPropertyCosts: z.number().min(0, 'Chi phí quản lý/bảo trì không được âm').optional(),
});

export type Step2HouseholdData = z.infer<typeof Step2HouseholdSchema>;

export const Step3LoanSchema = z
  .object({
    loanTermMonths: z
      .number()
      .int('Thời hạn vay phải là số nguyên')
      .min(12, 'Thời hạn vay tối thiểu 12 tháng (1 năm)')
      .max(420, 'Thời hạn vay tối đa 420 tháng (35 năm)'),
    repaymentMethod: RepaymentMethodEnum,
    promoInterestRate: z
      .number()
      .min(0, 'Lãi suất ưu đãi không được âm')
      .max(30, 'Lãi suất ưu đãi không hợp lý (>30%/năm)'),
    promoPeriodMonths: z
      .number()
      .int('Thời hạn ưu đãi phải là số nguyên')
      .min(0, 'Thời hạn ưu đãi không được âm'),
    postPromoRate: z
      .number()
      .min(0, 'Lãi suất thả nổi không được âm')
      .max(30, 'Lãi suất thả nổi không hợp lý (>30%/năm)'),
    gracePeriodMonths: z
      .number()
      .int('Thời gian ân hạn phải là số nguyên')
      .min(0, 'Thời gian ân hạn không được âm')
      .optional(),
  })
  .refine((data) => (data.gracePeriodMonths ?? 0) < data.loanTermMonths, {
    message: 'Thời gian ân hạn nợ gốc phải nhỏ hơn thời hạn vay',
    path: ['gracePeriodMonths'],
  });

export type Step3LoanData = z.infer<typeof Step3LoanSchema>;

export interface StepValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  warnings: Record<string, string>;
}

/**
 * Validates Step 1 inputs and produces soft advisory warnings.
 */
export function validateStep1(
  data: Partial<Step1PropertyData> & { propertyPrice?: number; purchasePrice?: number }
): StepValidationResult {
  const effectivePrice = data.purchasePrice !== undefined ? data.purchasePrice : data.propertyPrice;
  const normalizedData = {
    ...data,
    ...(effectivePrice !== undefined ? { purchasePrice: effectivePrice, propertyPrice: effectivePrice } : {}),
  };
  const result = Step1PropertySchema.safeParse(normalizedData);
  const errors: Record<string, string> = {};
  const warnings: Record<string, string> = {};

  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0]?.toString() || 'general';
      if (!errors[field]) {
        errors[field] = issue.message;
      }
    }
    // Mirror error between purchasePrice and propertyPrice for dual compatibility
    if (errors.purchasePrice && !errors.propertyPrice) {
      errors.propertyPrice = errors.purchasePrice;
    }
    if (errors.propertyPrice && !errors.purchasePrice) {
      errors.purchasePrice = errors.propertyPrice;
    }
  }

  // Soft advisory warnings (non-blocking)
  const price = effectivePrice || 0;
  const down = data.downPayment || 0;
  if (price > 0 && down === 0) {
    warnings.downPayment = 'Vay 100% giá trị nhà có rủi ro tài chính cao và đòi hỏi tài sản thế chấp bổ sung.';
  } else if (price > 0 && down > 0 && down / price < 0.2) {
    warnings.downPayment = 'Vốn tự có dưới 20% có thể khó tiếp cận các gói vay ưu đãi từ ngân hàng.';
  }

  return { isValid: result.success, errors, warnings };
}

/**
 * Validates Step 2 inputs and produces soft advisory warnings.
 */
export function validateStep2(
  data: Partial<Step2HouseholdData> & { downPayment?: number }
): StepValidationResult {
  const result = Step2HouseholdSchema.safeParse(data);
  const errors: Record<string, string> = {};
  const warnings: Record<string, string> = {};

  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0]?.toString() || 'general';
      if (!errors[field]) {
        errors[field] = issue.message;
      }
    }
  }

  // Soft advisory warnings
  const income = data.monthlyNetIncome || 0;
  const essentials = data.essentialLivingExpenses || 0;
  const savings = data.liquidSavings || 0;
  const downPayment = data.downPayment || 0;

  if (income > 0 && essentials >= income) {
    warnings.monthlyNetIncome = 'Chi phí sinh hoạt bằng hoặc vượt thu nhập ròng; không còn thặng dư để trả nợ.';
  } else if (income === 0) {
    warnings.monthlyNetIncome = 'Thu nhập bằng 0 sẽ dẫn đến thiếu hụt dòng tiền ngay từ tháng đầu tiên.';
  }

  if (downPayment > 0 && savings < downPayment) {
    warnings.liquidSavings = 'Tiền tiết kiệm hiện có thấp hơn tiền đặt cọc dự kiến. Bạn sẽ cần nguồn tài trợ khác.';
  }

  return { isValid: result.success, errors, warnings };
}

/**
 * Validates Step 3 inputs and produces soft advisory warnings.
 */
export function validateStep3(data: Partial<Step3LoanData>): StepValidationResult {
  const result = Step3LoanSchema.safeParse(data);
  const errors: Record<string, string> = {};
  const warnings: Record<string, string> = {};

  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0]?.toString() || 'general';
      if (!errors[field]) {
        errors[field] = issue.message;
      }
    }
  }

  // Soft advisory warnings
  const promo = data.promoInterestRate || 0;
  const postPromo = data.postPromoRate || 0;
  const promoMonths = data.promoPeriodMonths || 0;

  if (promoMonths > 0 && postPromo - promo >= 4) {
    warnings.postPromoRate = `Lãi suất sau ưu đãi tăng ${postPromo - promo}% sẽ tạo cú sốc tăng tiền trả nợ hàng tháng lớn.`;
  }

  return { isValid: result.success, errors, warnings };
}
