import { describe, it, expect } from 'vitest';
import {
  formatVND,
  formatCompactVND,
  formatNumberWithDots,
  parseVND,
  formatPercent,
  formatMonthsToYears,
  formatMonthCalendar,
} from '@/lib/depositguard/formatters';

describe('DepositGuard Formatters Test Suite', () => {
  describe('formatVND', () => {
    it('formats numbers to Vietnamese Dong with symbol', () => {
      const formatted = formatVND(2_000_000_000);
      expect(formatted).toContain('₫');
      // Should contain dot thousand separators in vi-VN locale
      expect(formatted.replace(/\s/g, '')).toMatch(/2\.000\.000\.000/);
    });

    it('handles zero and invalid inputs safely', () => {
      expect(formatVND(0)).toContain('0');
      expect(formatVND(0)).toContain('₫');
      expect(formatVND(NaN)).toBe('0 ₫');
      expect(formatVND(null as any)).toBe('0 ₫');
      expect(formatVND(undefined as any)).toBe('0 ₫');
    });

    it('rounds fractional amounts to nearest integer VND', () => {
      const formatted = formatVND(20_000_000.45);
      expect(formatted).toContain('20.000.000');
    });
  });

  describe('formatCompactVND (Strict Contract Compliance)', () => {
    it('satisfies f13 invariant: formatCompactVND(2_500_000_000) === "2.50 tỷ ₫"', () => {
      expect(formatCompactVND(2_500_000_000)).toBe('2.50 tỷ ₫');
    });

    it('satisfies f13 invariant: formatCompactVND(45_000_000) === "45 tr ₫"', () => {
      expect(formatCompactVND(45_000_000)).toBe('45 tr ₫');
    });

    it('formats whole billions cleanly without trailing .00', () => {
      expect(formatCompactVND(2_000_000_000)).toBe('2 tỷ ₫');
      expect(formatCompactVND(5_000_000_000)).toBe('5 tỷ ₫');
    });

    it('formats fractional millions cleanly', () => {
      expect(formatCompactVND(27_333_333)).toBe('27.3 tr ₫');
      expect(formatCompactVND(19_500_000)).toBe('19.5 tr ₫');
    });

    it('handles negative amounts with leading minus sign', () => {
      expect(formatCompactVND(-2_500_000_000)).toBe('-2.50 tỷ ₫');
      expect(formatCompactVND(-13_333_333)).toBe('-13.3 tr ₫');
    });

    it('handles boundary zero and NaN', () => {
      expect(formatCompactVND(0)).toBe('0 ₫');
      expect(formatCompactVND(NaN)).toBe('0 ₫');
    });
  });

  describe('formatNumberWithDots and parseVND', () => {
    it('formats numbers with dot separators without currency symbol', () => {
      expect(formatNumberWithDots(2_500_000_000)).toBe('2.500.000.000');
      expect(formatNumberWithDots(55_000_000)).toBe('55.000.000');
      expect(formatNumberWithDots(0)).toBe('0');
      expect(formatNumberWithDots(NaN)).toBe('0');
    });

    it('parses formatted strings back to pure integers', () => {
      expect(parseVND('2.500.000.000 ₫')).toBe(2_500_000_000);
      expect(parseVND('55.000.000')).toBe(55_000_000);
      expect(parseVND('2,500,000,000')).toBe(2_500_000_000);
      expect(parseVND('   10000000  ')).toBe(10_000_000);
      expect(parseVND('-5.000.000 ₫')).toBe(-5_000_000);
      expect(parseVND('')).toBe(0);
      expect(parseVND('abc')).toBe(0);
      expect(parseVND(5000000)).toBe(5000000);
    });
  });

  describe('formatPercent', () => {
    it('formats percentages accurately', () => {
      expect(formatPercent(7.0)).toBe('7%');
      expect(formatPercent(7.5)).toBe('7.5%');
      expect(formatPercent(12.0)).toBe('12%');
      expect(formatPercent(12.25, 2)).toBe('12.25%');
      expect(formatPercent(7.5, 1, true)).toBe('7,5%');
      expect(formatPercent(NaN)).toBe('0%');
    });
  });

  describe('formatMonthsToYears', () => {
    it('converts months to human readable years and months', () => {
      expect(formatMonthsToYears(240)).toBe('20 năm');
      expect(formatMonthsToYears(360)).toBe('30 năm');
      expect(formatMonthsToYears(246)).toBe('20 năm 6 tháng');
      expect(formatMonthsToYears(6)).toBe('6 tháng');
      expect(formatMonthsToYears(0)).toBe('0 tháng');
    });
  });

  describe('formatMonthCalendar', () => {
    it('formats calendar month relative to start year', () => {
      expect(formatMonthCalendar(1, 2026)).toBe('T1/2026');
      expect(formatMonthCalendar(12, 2026)).toBe('T12/2026');
      expect(formatMonthCalendar(13, 2026)).toBe('T1/2027');
      expect(formatMonthCalendar(24, 2026)).toBe('T12/2027');
    });
  });
});
