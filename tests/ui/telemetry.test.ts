import { describe, it, expect, beforeEach } from 'vitest';
import {
  trackEvent,
  getTelemetryLog,
  clearTelemetryLog,
  sanitizeTelemetryPayload,
  FORBIDDEN_SENSITIVE_KEYS,
  TelemetryEventName,
} from '@/lib/depositguard/telemetry';

describe('DepositGuard Privacy & Telemetry Test Suite', () => {
  beforeEach(() => {
    clearTelemetryLog();
  });

  it('tracks all 10 permitted safe event identifiers accurately', () => {
    const events: { event: TelemetryEventName; payload: any }[] = [
      { event: 'wizard_step_viewed', payload: { step: 1, step_name: 'property' } },
      { event: 'wizard_step_completed', payload: { step: 1, step_name: 'property', time_spent_ms: 12000 } },
      { event: 'simulation_calculated', payload: { status: 'DEFICIT', has_deficit: true, calculation_time_ms: 0.15 } },
      { event: 'whatif_rate_shock_toggled', payload: { shock_pp: 2 } },
      { event: 'whatif_income_shock_toggled', payload: { shock_percent: -20, duration_months: 3 } },
      { event: 'corrective_lever_viewed', payload: { lever_type: 'loan_reduction' } },
      { event: 'methodology_viewed', payload: { section_id: 'interest_rate_reset' } },
      { event: 'faq_accordion_opened', payload: { question_id: 'teaser_rate_risk' } },
      { event: 'schedule_table_expanded', payload: { view_mode: 'full' } },
      { event: 'feedback_submitted', payload: { category: 'ux', helpful: true } },
    ];

    for (const { event, payload } of events) {
      trackEvent(event, payload);
    }

    const log = getTelemetryLog();
    expect(log.length).toBe(10);
    expect(log.map((r) => r.event)).toEqual(events.map((e) => e.event));
  });

  it('strictly throws on forbidden PII and raw financial keys in development/testing', () => {
    const forbiddenPayloads = [
      { step: 1, salary: 50_000_000 },
      { step: 1, propertyPrice: 2_500_000_000 },
      { step: 2, income: 55_000_000 },
      { step: 2, livingExpenses: 30_000_000 },
      { step: 3, loanAmount: 2_000_000_000 },
      { step: 3, downPayment: 500_000_000 },
      { step: 1, email: 'test@example.com' },
      { step: 1, phone: '0901234567' },
      { step: 1, name: 'Nguyen Van A' },
      { step: 1, cccd: '079123456789' },
    ];

    for (const badPayload of forbiddenPayloads) {
      expect(() => sanitizeTelemetryPayload(badPayload)).toThrow(
        /Forbidden sensitive key detected/
      );
    }
  });

  it('rejects raw currency numbers exceeding 1000 in unwhitelisted fields', () => {
    // Unwhitelisted field with currency-magnitude number (e.g. 20,000,000 VND)
    const payloadWithRawMoney = {
      step: 1,
      untrackedAmount: 20_000_000,
    };

    expect(() => sanitizeTelemetryPayload(payloadWithRawMoney)).toThrow(
      /Suspected raw currency number detected/
    );
  });

  it('permits legitimate metadata durations and small numbers', () => {
    const legitimatePayload = {
      step: 3,
      step_name: 'loan',
      shock_pp: 4,
      shock_percent: -20,
      duration_months: 6,
      time_spent_ms: 45000,
      calculation_time_ms: 120,
    };

    const sanitized = sanitizeTelemetryPayload(legitimatePayload);
    expect(sanitized).toEqual(legitimatePayload);
  });

  it('maintains an append-only in-memory log buffer that can be cleared', () => {
    trackEvent('wizard_step_viewed', { step: 1, step_name: 'property' });
    expect(getTelemetryLog().length).toBe(1);

    clearTelemetryLog();
    expect(getTelemetryLog().length).toBe(0);
  });
});
