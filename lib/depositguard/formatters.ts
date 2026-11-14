/**
 * DepositGuard Vietnamese Currency & Number Formatters
 * Strict adherence to vi-VN locale standards and contract specifications.
 */

/**
 * Format a number as Vietnamese Dong currency with symbol (e.g. 2.000.000.000 ₫).
 */
export function formatVND(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

/**
 * Compact Vietnamese currency representation for badges, metric cards, and chart axes.
 * Required Invariants:
 * - formatCompactVND(2_500_000_000) === '2.50 tỷ ₫'
 * - formatCompactVND(45_000_000) === '45 tr ₫'
 */
export function formatCompactVND(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined || amount === 0) return '0 ₫';
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (abs >= 1_000_000_000) {
    const val = (abs / 1_000_000_000).toFixed(2).replace(/\.00$/, '');
    return `${sign}${val} tỷ ₫`;
  }
  if (abs >= 1_000_000) {
    const val = (abs / 1_000_000).toFixed(1).replace(/\.0$/, '');
    return `${sign}${val} tr ₫`;
  }
  return formatVND(amount);
}

/**
 * Formats integer with Vietnamese dots without currency symbol (for input fields).
 * Example: 2500000000 -> "2.500.000.000"
 */
export function formatNumberWithDots(val: number): string {
  if (isNaN(val) || val === null || val === undefined || val === 0) return '0';
  return new Intl.NumberFormat('vi-VN').format(Math.round(val));
}

/**
 * Parses user-typed string into clean integer VND, stripping dots, commas, spaces, currency symbols.
 * Example: "2.500.000.000 ₫" -> 2500000000
 */
export function parseVND(input: string | number): number {
  if (typeof input === 'number') {
    return isNaN(input) ? 0 : Math.round(input);
  }
  if (!input) return 0;
  const isNegative = input.trim().startsWith('-');
  const cleaned = input.replace(/[^\d]/g, '');
  const parsed = parseInt(cleaned, 10);
  if (isNaN(parsed)) return 0;
  return isNegative ? -parsed : parsed;
}

/**
 * Formats percentage with one decimal place.
 * Example: 7.5 -> "7.5%" (or with Vietnamese comma: "7,5%")
 */
export function formatPercent(rate: number, decimals: number = 1, useComma: boolean = false): string {
  if (isNaN(rate) || rate === null || rate === undefined) return '0%';
  const formatted = rate.toFixed(decimals).replace(/\.0$/, '');
  return useComma ? `${formatted.replace('.', ',')}%` : `${formatted}%`;
}

/**
 * Converts loan term months into human-readable years and months.
 * Example: 240 -> "20 năm", 246 -> "20 năm 6 tháng", 6 -> "6 tháng"
 */
export function formatMonthsToYears(months: number): string {
  if (isNaN(months) || months <= 0) return '0 tháng';
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) return `${years} năm`;
  if (years === 0) return `${remainingMonths} tháng`;
  return `${years} năm ${remainingMonths} tháng`;
}

/**
 * Formats a calendar month relative to simulation start.
 * Example: (1, 2026) -> "T1/2026", (13, 2026) -> "T1/2027"
 */
export function formatMonthCalendar(monthIndex: number, startYear: number = new Date().getFullYear()): string {
  const zeroIndexed = Math.max(0, monthIndex - 1);
  const currentMonth = ((zeroIndexed % 12) + 1);
  const currentYear = startYear + Math.floor(zeroIndexed / 12);
  return `T${currentMonth}/${currentYear}`;
}
