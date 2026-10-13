/**
 * HowDoI (howdoi.id.vn) - Financial Calculation Core Algorithms
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

// Số tiền cần góp mỗi tháng để đạt mục tiêu (cùng giả định với calculateCompoundInterest:
// góp đầu tháng, lãi nhập gốc hàng tháng).
export function calculateMonthlyContributionForTarget(input: {
  target: number;
  initialInvestment: number;
  annualRate: number;
  years: number;
}): number {
  const { target, initialInvestment, annualRate, years } = input;
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = years * 12;
  if (totalMonths <= 0) return Math.max(0, target - initialInvestment);
  if (monthlyRate === 0) return Math.max(0, Math.ceil((target - initialInvestment) / totalMonths));
  const growth = Math.pow(1 + monthlyRate, totalMonths);
  const annuityFactor = ((growth - 1) / monthlyRate) * (1 + monthlyRate);
  return Math.max(0, Math.ceil((target - initialInvestment * growth) / annuityFactor));
}

// 3. VIETNAMESE GROSS TO NET SALARY (LƯƠNG GROSS SANG NET & THUẾ TNCN)
// Mọi con số pháp lý nằm trong SALARY_RULES. Khi luật đổi, chỉ cần sửa ở đây
// (và cập nhật `updatedAt` + `sources` để người đọc biết số liệu lấy từ đâu).
export type Region = 1 | 2 | 3 | 4;

export const SALARY_RULES = {
  updatedAt: "2026-10-13",
  // Lương cơ sở 2.530.000 ₫ từ 01/07/2026 (Nghị định 161/2026/NĐ-CP).
  // Trần đóng BHXH, BHYT = 20 × lương cơ sở = 50.600.000 ₫.
  baseSalary: 2_530_000,
  // Lương tối thiểu vùng từ 01/01/2026 (Nghị định 293/2025/NĐ-CP).
  // Trần đóng BHTN = 20 × lương tối thiểu vùng.
  regionalMinimumWage: {
    1: 5_310_000,
    2: 4_730_000,
    3: 4_140_000,
    4: 3_700_000,
  } as Record<Region, number>,
  insuranceCapMultiplier: 20,
  employeeRates: {
    socialInsurance: 0.08,        // BHXH
    healthInsurance: 0.015,       // BHYT
    unemploymentInsurance: 0.01,  // BHTN
  },
  // Giảm trừ gia cảnh từ kỳ tính thuế 2026 (Nghị quyết 110/2025/UBTVQH15).
  personalDeduction: 15_500_000,
  dependentDeduction: 6_200_000,
  // Biểu thuế lũy tiến từng phần 5 bậc (Luật Thuế TNCN số 109/2025/QH15),
  // áp dụng cho thu nhập từ tiền lương, tiền công từ kỳ tính thuế 2026.
  taxBrackets: [
    { upTo: 10_000_000, rate: 0.05 },
    { upTo: 30_000_000, rate: 0.1 },
    { upTo: 60_000_000, rate: 0.2 },
    { upTo: 100_000_000, rate: 0.3 },
    { upTo: Infinity, rate: 0.35 },
  ],
  sources: [
    { label: "Luật Thuế thu nhập cá nhân số 109/2025/QH15 (biểu thuế 5 bậc)" },
    { label: "Nghị quyết 110/2025/UBTVQH15 (giảm trừ gia cảnh 15,5 triệu / 6,2 triệu)" },
    { label: "Nghị định 161/2026/NĐ-CP (lương cơ sở 2.530.000 ₫ từ 01/07/2026)" },
    { label: "Nghị định 293/2025/NĐ-CP (lương tối thiểu vùng từ 01/01/2026)" },
    { label: "Luật Bảo hiểm xã hội số 41/2024/QH15 (tỷ lệ đóng BHXH, BHYT, BHTN)" },
  ],
} as const;

export const REGION_LABELS: Record<Region, string> = {
  1: "Vùng I",
  2: "Vùng II",
  3: "Vùng III",
  4: "Vùng IV",
};

export interface GrossToNetInput {
  grossSalary: number;            // Lương Gross (VND)
  dependents: number;             // Số người phụ thuộc
  region: Region;                 // Vùng lương tối thiểu (chỉ ảnh hưởng trần đóng BHTN)
}

export interface TaxBracketBreakdown {
  rate: number;
  from: number;
  to: number;
  taxedAmount: number;            // Phần thu nhập rơi vào bậc này
  tax: number;
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
  taxBreakdown: TaxBracketBreakdown[];
  netSalary: number;              // Lương Net thực nhận
}

export function calculateProgressiveTax(taxableIncome: number): {
  total: number;
  breakdown: TaxBracketBreakdown[];
} {
  const breakdown: TaxBracketBreakdown[] = [];
  let lower = 0;
  let total = 0;
  for (const { upTo, rate } of SALARY_RULES.taxBrackets) {
    if (taxableIncome <= lower) break;
    const taxedAmount = Math.min(taxableIncome, upTo) - lower;
    const tax = taxedAmount * rate;
    breakdown.push({ rate, from: lower, to: upTo, taxedAmount, tax: Math.round(tax) });
    total += tax;
    lower = upTo;
  }
  return { total: Math.round(total), breakdown };
}

export function calculateGrossToNet(input: GrossToNetInput): GrossToNetOutput {
  const { grossSalary, dependents, region } = input;
  const rules = SALARY_RULES;

  // BHXH & BHYT: tối đa 20 × lương cơ sở
  const bhxhBase = Math.min(grossSalary, rules.baseSalary * rules.insuranceCapMultiplier);
  const socialInsurance = Math.round(bhxhBase * rules.employeeRates.socialInsurance);
  const healthInsurance = Math.round(bhxhBase * rules.employeeRates.healthInsurance);

  // BHTN: tối đa 20 × lương tối thiểu vùng
  const bhtnBase = Math.min(
    grossSalary,
    rules.regionalMinimumWage[region] * rules.insuranceCapMultiplier,
  );
  const unemploymentInsurance = Math.round(bhtnBase * rules.employeeRates.unemploymentInsurance);

  const totalInsurance = socialInsurance + healthInsurance + unemploymentInsurance;
  const incomeBeforeTax = Math.max(0, grossSalary - totalInsurance);

  const personalDeduction = rules.personalDeduction;
  const dependentDeduction = dependents * rules.dependentDeduction;
  const taxableIncome = Math.max(0, incomeBeforeTax - personalDeduction - dependentDeduction);

  const { total: personalIncomeTax, breakdown: taxBreakdown } = calculateProgressiveTax(taxableIncome);
  const netSalary = incomeBeforeTax - personalIncomeTax;

  return {
    grossSalary,
    socialInsurance,
    healthInsurance,
    unemploymentInsurance,
    totalInsurance,
    incomeBeforeTax,
    personalDeduction,
    dependentDeduction,
    taxableIncome,
    personalIncomeTax,
    taxBreakdown,
    netSalary,
  };
}

// Tìm mức Gross nhỏ nhất cho ra mức Net mong muốn (dùng khi thỏa thuận lương Net).
// Lương Net tăng đơn điệu theo Gross nên có thể tìm nhị phân.
export function calculateNetToGross(input: {
  netSalary: number;
  dependents: number;
  region: Region;
}): GrossToNetOutput {
  const { netSalary, dependents, region } = input;
  let low = Math.max(0, Math.floor(netSalary));
  let high = Math.max(low, 1) * 2;
  while (calculateGrossToNet({ grossSalary: high, dependents, region }).netSalary < netSalary) {
    high *= 2;
  }
  while (high - low > 1) {
    const mid = Math.floor((low + high) / 2);
    if (calculateGrossToNet({ grossSalary: mid, dependents, region }).netSalary >= netSalary) {
      high = mid;
    } else {
      low = mid;
    }
  }
  return calculateGrossToNet({ grossSalary: high, dependents, region });
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

// 6. DEBT PAYOFF PLAN (KẾ HOẠCH TRẢ NỢ: QUẢ CẦU TUYẾT / TUYẾT LỞ)
// Giả định: lãi tính theo tháng trên dư nợ còn lại (lãi năm / 12), khoản trả tối thiểu
// của mỗi khoản nợ cố định. Với "snowball" và "avalanche", tổng tiền trả mỗi tháng giữ
// nguyên (tổng tối thiểu + tiền trả thêm): khoản nào trả xong thì phần tối thiểu của nó
// được dồn sang khoản tiếp theo. "minimum" là phương án đối chứng: chỉ trả tối thiểu.
export type DebtStrategy = "snowball" | "avalanche" | "minimum";

export interface DebtInput {
  id: string;
  name: string;
  balance: number;        // Dư nợ hiện tại (VND)
  annualRate: number;     // Lãi suất (%/năm)
  minPayment: number;     // Trả tối thiểu mỗi tháng (VND)
}

export interface DebtPayoffItem {
  id: string;
  name: string;
  paidOffMonth: number | null;  // Tháng trả xong (1 = tháng đầu tiên), null nếu không trả xong
  interestPaid: number;
}

export interface DebtPayoffResult {
  strategy: DebtStrategy;
  feasible: boolean;              // Trả hết trong DEBT_MAX_MONTHS tháng
  months: number;                 // Số tháng đến khi hết nợ (= DEBT_MAX_MONTHS nếu không trả hết)
  monthlyPayment: number;         // Tổng tiền trả tháng đầu
  totalInterest: number;
  totalPaid: number;
  items: DebtPayoffItem[];        // Theo thứ tự ưu tiên của phương pháp
}

export const DEBT_MAX_MONTHS = 600; // 50 năm

// Thứ tự ưu tiên trả thêm, xác định một lần từ đầu:
// - Quả cầu tuyết: dư nợ nhỏ nhất trước (bằng nhau thì lãi cao hơn trước).
// - Tuyết lở: lãi suất cao nhất trước (bằng nhau thì dư nợ nhỏ hơn trước).
export function orderDebts(debts: DebtInput[], strategy: DebtStrategy): DebtInput[] {
  const sorted = [...debts];
  if (strategy === "snowball") {
    sorted.sort((a, b) => a.balance - b.balance || b.annualRate - a.annualRate);
  } else if (strategy === "avalanche") {
    sorted.sort((a, b) => b.annualRate - a.annualRate || a.balance - b.balance);
  }
  return sorted;
}

export function simulateDebtPayoff(
  debts: DebtInput[],
  extraPayment: number,
  strategy: DebtStrategy,
): DebtPayoffResult {
  const ordered = orderDebts(debts.filter((d) => d.balance > 0), strategy);
  const balances = ordered.map((d) => d.balance);
  const interestPaid = ordered.map(() => 0);
  const paidOffMonth: (number | null)[] = ordered.map(() => null);

  const totalMinimum = ordered.reduce((sum, d) => sum + Math.max(0, d.minPayment), 0);
  const budget = strategy === "minimum" ? totalMinimum : totalMinimum + Math.max(0, extraPayment);

  let totalInterest = 0;
  let totalPaid = 0;
  let months = 0;
  let firstMonthPayment = 0;

  while (balances.some((b) => b > 0) && months < DEBT_MAX_MONTHS) {
    months++;
    let paidThisMonth = 0;

    // 1. Cộng lãi tháng này
    ordered.forEach((d, i) => {
      if (balances[i] <= 0) return;
      const interest = balances[i] * (d.annualRate / 100 / 12);
      balances[i] += interest;
      interestPaid[i] += interest;
      totalInterest += interest;
    });

    // 2. Trả tối thiểu cho mọi khoản còn nợ
    let available = budget;
    ordered.forEach((d, i) => {
      if (balances[i] <= 0) return;
      const pay = Math.min(Math.max(0, d.minPayment), balances[i], available);
      balances[i] -= pay;
      available -= pay;
      paidThisMonth += pay;
    });

    // 3. Phần còn lại dồn vào khoản ưu tiên (chỉ với snowball / avalanche)
    if (strategy !== "minimum") {
      for (let i = 0; i < ordered.length && available > 0; i++) {
        if (balances[i] <= 0) continue;
        const pay = Math.min(available, balances[i]);
        balances[i] -= pay;
        available -= pay;
        paidThisMonth += pay;
      }
    }

    // Dư nợ dưới 1 đồng coi như đã trả xong (sai số làm tròn)
    balances.forEach((b, i) => {
      if (b < 1 && paidOffMonth[i] === null) {
        balances[i] = 0;
        paidOffMonth[i] = months;
      }
    });

    totalPaid += paidThisMonth;
    if (months === 1) firstMonthPayment = paidThisMonth;
  }

  return {
    strategy,
    feasible: balances.every((b) => b <= 0),
    months,
    monthlyPayment: Math.round(firstMonthPayment),
    totalInterest: Math.round(totalInterest),
    totalPaid: Math.round(totalPaid),
    items: ordered.map((d, i) => ({
      id: d.id,
      name: d.name,
      paidOffMonth: paidOffMonth[i],
      interestPaid: Math.round(interestPaid[i]),
    })),
  };
}

// "27 tháng" → "2 năm 3 tháng"
export function formatMonths(totalMonths: number): string {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (years === 0) return `${months} tháng`;
  if (months === 0) return `${years} năm`;
  return `${years} năm ${months} tháng`;
}
