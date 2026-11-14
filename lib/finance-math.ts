/**
 * EvolveTech (evolvetech.biz.vn) - Financial Calculation Core Algorithms
 * Shared logic between Web Platform and upcoming iOS App
 */

// 1. VIETNAMESE CURRENCY FORMATTER
export function formatVND(amount: number): string {
  if (isNaN(amount)) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactVND(amount: number): string {
  if (isNaN(amount) || amount === 0) return "0 ₫";
  const abs = Math.abs(amount);
  if (abs >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(2).replace(/\.00$/, "")} tỷ ₫`;
  }
  if (abs >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1).replace(/\.0$/, "")} tr ₫`;
  }
  return formatVND(amount);
}

// 2. COMPOUND INTEREST (LÃI KÉP & ĐẦU TƯ TÍCH LŨY)
export interface CompoundInterestInput {
  initialInvestment: number;      // Vốn ban đầu (VND)
  monthlyContribution: number;    // Góp hàng tháng (VND)
  annualRate: number;             // Lãi suất kỳ vọng hàng năm (%)
  years: number;                  // Thời gian đầu tư (Năm)
}

export interface CompoundYearData {
  year: number;
  totalContributions: number;     // Tổng vốn gốc đã bỏ ra
  totalInterest: number;          // Tổng tiền lãi tích lũy
  futureValue: number;            // Tổng giá trị tài sản
}

export function calculateCompoundInterest(input: CompoundInterestInput): {
  summary: CompoundYearData;
  yearlyBreakdown: CompoundYearData[];
} {
  const { initialInvestment, monthlyContribution, annualRate, years } = input;
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = years * 12;

  let currentBalance = initialInvestment;
  let totalContributed = initialInvestment;
  const yearlyBreakdown: CompoundYearData[] = [];

  // Year 0
  yearlyBreakdown.push({
    year: 0,
    totalContributions: initialInvestment,
    totalInterest: 0,
    futureValue: initialInvestment,
  });

  for (let month = 1; month <= totalMonths; month++) {
    currentBalance = (currentBalance + monthlyContribution) * (1 + monthlyRate);
    totalContributed += monthlyContribution;

    if (month % 12 === 0) {
      const yearIndex = month / 12;
      const totalInterest = Math.max(0, currentBalance - totalContributed);
      yearlyBreakdown.push({
        year: yearIndex,
        totalContributions: Math.round(totalContributed),
        totalInterest: Math.round(totalInterest),
        futureValue: Math.round(currentBalance),
      });
    }
  }

  const finalYear = yearlyBreakdown[yearlyBreakdown.length - 1];
  return {
    summary: finalYear,
    yearlyBreakdown,
  };
}

// 3. VIETNAMESE GROSS TO NET SALARY (LƯƠNG GROSS SANG NET & THUẾ TNCN)
// Legal base: Social Insurance max cap = 20 * Basic salary (2,340,000 * 20 = 46,800,000 VND)
// Unemployment Insurance max cap = 20 * Regional minimum (Region 1 = 4,960,000 * 20 = 99,200,000 VND)
// Personal deduction: 11,000,000 VND/month; Dependent deduction: 4,400,000 VND/person/month
export interface GrossToNetInput {
  grossSalary: number;            // Lương Gross (VND)
  dependents: number;             // Số người phụ thuộc
  region: 1 | 2 | 3 | 4;          // Vùng (1: Hà Nội, TP.HCM,...)
}

export interface GrossToNetOutput {
  grossSalary: number;
  socialInsurance: number;        // BHXH (8%)
  healthInsurance: number;        // BHYT (1.5%)
  unemploymentInsurance: number;  // BHTN (1%)
  totalInsurance: number;
  incomeBeforeTax: number;
  personalDeduction: number;
  dependentDeduction: number;
  taxableIncome: number;          // Thu nhập tính thuế
  personalIncomeTax: number;      // Thuế TNCN
  netSalary: number;              // Lương Net thực nhận
}

export function calculateGrossToNet(input: GrossToNetInput): GrossToNetOutput {
  const { grossSalary, dependents } = input;

  // Max cap for BHXH & BHYT
  const basicSalaryCap = 2_340_000 * 20; // 46,800,000 VND
  const bhxhBase = Math.min(grossSalary, basicSalaryCap);
  const socialInsurance = bhxhBase * 0.08;
  const healthInsurance = bhxhBase * 0.015;

  // Max cap for BHTN (Region 1 standard)
  const region1Cap = 4_960_000 * 20; // 99,200,000 VND
  const bhtnBase = Math.min(grossSalary, region1Cap);
  const unemploymentInsurance = bhtnBase * 0.01;

  const totalInsurance = socialInsurance + healthInsurance + unemploymentInsurance;
  const incomeBeforeTax = Math.max(0, grossSalary - totalInsurance);

  const personalDeduction = 11_000_000;
  const dependentDeduction = dependents * 4_400_000;
  const totalDeduction = personalDeduction + dependentDeduction;

  const taxableIncome = Math.max(0, incomeBeforeTax - totalDeduction);

  // Progressive Tax Calculation (Biểu thuế lũy tiến từng phần 7 bậc)
  let pit = 0;
  if (taxableIncome <= 5_000_000) {
    pit = taxableIncome * 0.05;
  } else if (taxableIncome <= 10_000_000) {
    pit = taxableIncome * 0.1 - 250_000;
  } else if (taxableIncome <= 18_000_000) {
    pit = taxableIncome * 0.15 - 750_000;
  } else if (taxableIncome <= 32_000_000) {
    pit = taxableIncome * 0.2 - 1_650_000;
  } else if (taxableIncome <= 52_000_000) {
    pit = taxableIncome * 0.25 - 3_250_000;
  } else if (taxableIncome <= 80_000_000) {
    pit = taxableIncome * 0.3 - 5_850_000;
  } else {
    pit = taxableIncome * 0.35 - 9_850_000;
  }

  const personalIncomeTax = Math.max(0, Math.round(pit));
  const netSalary = Math.round(incomeBeforeTax - personalIncomeTax);

  return {
    grossSalary,
    socialInsurance: Math.round(socialInsurance),
    healthInsurance: Math.round(healthInsurance),
    unemploymentInsurance: Math.round(unemploymentInsurance),
    totalInsurance: Math.round(totalInsurance),
    incomeBeforeTax: Math.round(incomeBeforeTax),
    personalDeduction,
    dependentDeduction,
    taxableIncome: Math.round(taxableIncome),
    personalIncomeTax,
    netSalary,
  };
}

// 4. BUDGETING ALLOCATION (50/30/20 & 6 JARS)
export function calculate503020(monthlyIncome: number) {
  return {
    needs: Math.round(monthlyIncome * 0.5),      // 50% Thiết yếu (Nhà, ăn uống, điện nước)
    wants: Math.round(monthlyIncome * 0.3),      // 30% Sở thích (Giải trí, mua sắm, giao tiếp)
    savings: Math.round(monthlyIncome * 0.2),    // 20% Tiết kiệm & Đầu tư xây dựng tương lai
  };
}

export function calculate6Jars(monthlyIncome: number) {
  return {
    nec: Math.round(monthlyIncome * 0.55), // 55% Nhu cầu thiết yếu
    ffa: Math.round(monthlyIncome * 0.10), // 10% Tự do tài chính (Đầu tư)
    ltss: Math.round(monthlyIncome * 0.10),// 10% Tiết kiệm dài hạn (Quỹ khẩn cấp, mua nhà/xe)
    edu: Math.round(monthlyIncome * 0.10), // 10% Giáo dục & Phát triển bản thân
    play: Math.round(monthlyIncome * 0.10),// 10% Hưởng thụ cá nhân
    give: Math.round(monthlyIncome * 0.05),// 5% Cho đi & Giúp đỡ gia đình/xã hội
  };
}

// 5. MORTGAGE & BANK LOAN (VAY MUA NHÀ / XE TRẢ GÓP)
export interface LoanCalculationInput {
  loanAmount: number;         // Số tiền vay (VND)
  loanTermMonths: number;     // Thời hạn vay (Tháng)
  annualInterestRate: number; // Lãi suất năm (%)
  method: "reducing" | "flat"; // Dư nợ giảm dần vs. Cố định ban đầu
}

export function calculateLoan(input: LoanCalculationInput) {
  const { loanAmount, loanTermMonths, annualInterestRate, method } = input;
  const monthlyRate = annualInterestRate / 100 / 12;

  let totalInterest = 0;
  let firstMonthPayment = 0;
  const schedule: { month: number; principal: number; interest: number; totalPayment: number; remainingBalance: number }[] = [];

  if (method === "reducing") {
    const monthlyPrincipal = loanAmount / loanTermMonths;
    let remaining = loanAmount;

    for (let m = 1; m <= loanTermMonths; m++) {
      const interest = remaining * monthlyRate;
      const totalPayment = monthlyPrincipal + interest;
      remaining -= monthlyPrincipal;
      totalInterest += interest;

      if (m === 1) firstMonthPayment = totalPayment;

      schedule.push({
        month: m,
        principal: Math.round(monthlyPrincipal),
        interest: Math.round(interest),
        totalPayment: Math.round(totalPayment),
        remainingBalance: Math.max(0, Math.round(remaining)),
      });
    }
  } else {
    // Flat rate
    const monthlyInterest = (loanAmount * (annualInterestRate / 100)) / 12;
    const monthlyPrincipal = loanAmount / loanTermMonths;
    const monthlyTotal = monthlyPrincipal + monthlyInterest;
    totalInterest = monthlyInterest * loanTermMonths;
    firstMonthPayment = monthlyTotal;

    let remaining = loanAmount;
    for (let m = 1; m <= loanTermMonths; m++) {
      remaining -= monthlyPrincipal;
      schedule.push({
        month: m,
        principal: Math.round(monthlyPrincipal),
        interest: Math.round(monthlyInterest),
        totalPayment: Math.round(monthlyTotal),
        remainingBalance: Math.max(0, Math.round(remaining)),
      });
    }
  }

  return {
    loanAmount,
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(loanAmount + totalInterest),
    firstMonthPayment: Math.round(firstMonthPayment),
    schedule,
  };
}
