/**
 * Financial assertion helpers for DepositGuard E2E tests.
 * Provides precision-aware financial comparisons and invariant checks.
 */

import assert from 'node:assert';
import type { MonthlyCashFlowItem, SimulationResult } from './test-types';

/**
 * Asserts two financial VND amounts are within an acceptable rounding tolerance (default 10 VND).
 * Accounts for integer rounding nuances in monthly compounding (e.g. 27,333,333 vs 27,333,333.33).
 */
export function assertCurrencyClose(
  actual: number,
  expected: number,
  tolerance: number = 10,
  message?: string
): void {
  const diff = Math.abs(actual - expected);
  assert.ok(
    diff <= tolerance,
    `${message ? message + ': ' : ''}Expected ${expected} (±${tolerance}), received ${actual} (diff: ${diff})`
  );
}

/**
 * Asserts two percentages are within a given delta (default 0.05%).
 */
export function assertPercentClose(
  actual: number,
  expected: number,
  tolerance: number = 0.05,
  message?: string
): void {
  const diff = Math.abs(actual - expected);
  assert.ok(
    diff <= tolerance,
    `${message ? message + ': ' : ''}Expected ${expected}% (±${tolerance}%), received ${actual}% (diff: ${diff})`
  );
}

/**
 * Asserts that the amortization schedule terminal balance reconciles to exactly zero,
 * and total principal paid matches the initial loan amount.
 */
export function assertScheduleReconciliation(
  schedule: MonthlyCashFlowItem[],
  expectedLoanAmount: number
): void {
  assert.ok(schedule.length > 0, 'Schedule must not be empty');
  const finalMonth = schedule[schedule.length - 1];
  assert.strictEqual(
    finalMonth.endingBalance,
    0,
    `Terminal balance at month ${finalMonth.month} must be 0, received ${finalMonth.endingBalance}`
  );

  let totalPrincipalPaid = 0;
  for (const item of schedule) {
    totalPrincipalPaid += item.principalPayment;
    assert.ok(
      item.endingBalance >= 0,
      `Ending balance at month ${item.month} cannot be negative (${item.endingBalance})`
    );
    assert.strictEqual(
      item.totalDebtService,
      item.principalPayment + item.interestPayment,
      `Total debt service must equal principal + interest at month ${item.month}`
    );
  }

  assertCurrencyClose(
    totalPrincipalPaid,
    expectedLoanAmount,
    1,
    'Total principal paid across schedule must equal loan amount'
  );
}

/**
 * Asserts that DTI ratio is never negative, division-by-zero returns null,
 * and valid values are bounded reasonably.
 */
export function assertValidDti(
  dti: number | null,
  income: number,
  message?: string
): void {
  if (income <= 0) {
    assert.strictEqual(
      dti,
      null,
      `${message ? message + ': ' : ''}DTI must be null when income is 0`
    );
  } else {
    assert.ok(
      typeof dti === 'number' && dti >= 0,
      `${message ? message + ': ' : ''}DTI must be a non-negative number, received ${dti}`
    );
  }
}
