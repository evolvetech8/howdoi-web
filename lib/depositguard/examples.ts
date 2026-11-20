import { LoanInput, HouseholdInput, StressScenarioInput } from "./engine/types";
import { calculateSimulation } from "./engine/cashflow";
import { solveAffordability } from "./engine/solver";
export const BASE_STRESS: StressScenarioInput = {
  rateShockPp: 0,
  incomeShockPercent: 0,
  incomeShockDurationMonths: 6,
  expenseShockPercent: 0,
};
export const EXAMPLES: {
  id: string;
  title: string;
  loan: LoanInput;
  household: HouseholdInput;
}[] = [
  {
    id: "hcm",
    title: "Gia đình mua căn nhà đầu tiên",
    loan: {
      propertyPrice: 2_500_000_000,
      downPayment: 500_000_000,
      loanAmount: 2_000_000_000,
      loanTermMonths: 240,
      repaymentMethod: "EQUAL_PRINCIPAL",
      promoInterestRate: 7,
      promoPeriodMonths: 12,
      postPromoRate: 12,
      gracePeriodMonths: 0,
    },
    household: {
      monthlyNetIncome: 55_000_000,
      essentialLivingExpenses: 30_000_000,
      existingDebtPayments: 0,
      liquidSavings: 700_000_000,
      plannedEmergencyReserveFloor: 90_000_000,
      transactionCosts: 0,
      initialSetupCosts: 0,
      recurringPropertyCosts: 0,
    },
  },
  {
    id: "hanoi",
    title: "Gia đình nâng cấp nhà, ân hạn gốc 24 tháng",
    loan: {
      propertyPrice: 4_200_000_000,
      downPayment: 1_400_000_000,
      loanAmount: 2_800_000_000,
      loanTermMonths: 240,
      repaymentMethod: "EQUAL_PRINCIPAL",
      promoInterestRate: 7.5,
      promoPeriodMonths: 24,
      postPromoRate: 12.5,
      gracePeriodMonths: 24,
    },
    household: {
      monthlyNetIncome: 75_000_000,
      essentialLivingExpenses: 40_000_000,
      existingDebtPayments: 0,
      liquidSavings: 1_650_000_000,
      plannedEmergencyReserveFloor: 180_000_000,
      transactionCosts: 0,
      initialSetupCosts: 0,
      recurringPropertyCosts: 0,
    },
  },
  {
    id: "buffer",
    title: "Gia đình giữ lại quỹ dự phòng",
    loan: {
      propertyPrice: 2_400_000_000,
      downPayment: 1_080_000_000,
      loanAmount: 1_320_000_000,
      loanTermMonths: 240,
      repaymentMethod: "EQUAL_PRINCIPAL",
      promoInterestRate: 7,
      promoPeriodMonths: 12,
      postPromoRate: 11.5,
      gracePeriodMonths: 0,
    },
    household: {
      monthlyNetIncome: 48_000_000,
      essentialLivingExpenses: 22_000_000,
      existingDebtPayments: 0,
      liquidSavings: 1_350_000_000,
      plannedEmergencyReserveFloor: 132_000_000,
      transactionCosts: 0,
      initialSetupCosts: 0,
      recurringPropertyCosts: 0,
    },
  },
];
export function evaluateExample(example = EXAMPLES[0], stress = BASE_STRESS) {
  return {
    result: calculateSimulation(example.loan, example.household, stress),
    solver: solveAffordability(example.loan, example.household, stress),
  };
}
