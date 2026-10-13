import type { DebtInput } from "@/lib/finance-math";

// Ví dụ dùng chung cho công cụ Kế hoạch trả nợ và phần giải thích trên trang.
export const EXAMPLE_DEBTS: DebtInput[] = [
  { id: "d1", name: "Thẻ tín dụng", balance: 20_000_000, annualRate: 30, minPayment: 1_000_000 },
  { id: "d2", name: "Vay tiêu dùng", balance: 60_000_000, annualRate: 22, minPayment: 2_300_000 },
  { id: "d3", name: "Vay người thân", balance: 15_000_000, annualRate: 0, minPayment: 500_000 },
];

export const EXAMPLE_EXTRA_PAYMENT = 2_000_000;
