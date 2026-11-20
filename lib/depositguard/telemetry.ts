/**
 * DepositGuard Privacy-Preserving Client-Side Telemetry
 * Location: lib/depositguard/telemetry.ts
 *
 * Enforces zero-PII transmission: Strictly forbids user names, contact details,
 * citizen ID, property prices, loan amounts, salaries, or any monetary amounts.
 * Under Vietnamese Law 91/2025/QH15 on Personal Data Protection.
 */

// 1. Permitted Safe Event Identifiers (Exactly 10)
export type TelemetryEventName =
  | "wizard_step_viewed"
  | "wizard_step_completed"
  | "simulation_calculated"
  | "whatif_rate_shock_toggled"
  | "whatif_income_shock_toggled"
  | "corrective_lever_viewed"
  | "methodology_viewed"
  | "faq_accordion_opened"
  | "schedule_table_expanded"
  | "feedback_submitted";

export type WizardStepNumber = 1 | 2 | 3;
export type WizardStepName = "property" | "household" | "loan";
export type CorrectiveLeverType =
  | "loan_reduction"
  | "extra_down_payment"
  | "price_adjustment"
  | "term_extension";
export type AffordabilityStatus = "SAFE" | "VULNERABLE" | "DEFICIT";

// 2. Strongly Typed Safe Payloads (Zero Monetary Values)
export interface TelemetryPayloadMap {
  wizard_step_viewed: {
    step: WizardStepNumber;
    step_name: WizardStepName;
  };
  wizard_step_completed: {
    step: WizardStepNumber;
    step_name: WizardStepName;
    repayment_method?: "EQUAL_PRINCIPAL" | "ANNUITY";
    time_spent_ms?: number;
  };
  simulation_calculated: {
    status: AffordabilityStatus;
    has_deficit: boolean;
    calculation_time_ms?: number;
  };
  whatif_rate_shock_toggled: {
    shock_pp: number; // e.g. 0, 2, 4 percentage points
  };
  whatif_income_shock_toggled: {
    shock_percent: number; // e.g. 0, -20 percent
    duration_months: number; // e.g. 3, 6 months
  };
  corrective_lever_viewed: {
    lever_type: CorrectiveLeverType;
  };
  methodology_viewed: {
    section_id?: string;
  };
  faq_accordion_opened: {
    question_id: string;
  };
  schedule_table_expanded: {
    view_mode?: "summary" | "full";
  };
  feedback_submitted: {
    category: "ux" | "calculation" | "bug" | "feature" | "other";
    helpful?: boolean;
  };
}

export interface TelemetryRecord<
  E extends TelemetryEventName = TelemetryEventName,
> {
  event: E;
  payload: TelemetryPayloadMap[E];
  timestamp: string; // ISO 8601
}

// 3. Forbidden Sensitive Keys (PII & Raw Monetary Fields)
export const FORBIDDEN_SENSITIVE_KEYS = new Set([
  "name",
  "fullname",
  "email",
  "phone",
  "phonenumber",
  "cccd",
  "cmnd",
  "idcard",
  "address",
  "employer",
  "company",
  "salary",
  "income",
  "monthlynetincome",
  "netincome",
  "expenses",
  "essentialexpenses",
  "livingexpenses",
  "propertyprice",
  "price",
  "purchaseprice",
  "downpayment",
  "loanamount",
  "liquidsavings",
  "savings",
  "emergencyreserve",
  "reservebalance",
  "debt",
  "existingdebt",
  "totaldebtservice",
  "payment",
  "month1payment",
  "postpromopayment",
  "paymentjumpamount",
  "cashflow",
  "surplus",
  "shortfall",
  "vnd",
]);

/**
 * Validates that an object contains zero forbidden keys and zero raw currency numbers.
 * Throws in development/test if any violation is detected.
 */
export function sanitizeTelemetryPayload<T extends Record<string, any>>(
  payload: T,
): T {
  if (!payload || typeof payload !== "object") {
    return payload;
  }

  for (const [key, value] of Object.entries(payload)) {
    const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");

    // Check 1: Forbidden key blacklist
    if (FORBIDDEN_SENSITIVE_KEYS.has(normalizedKey)) {
      throw new Error(
        `[DepositGuard Privacy Violation] Forbidden sensitive key detected in telemetry payload: "${key}"`,
      );
    }

    // Check 2: Raw monetary value guard
    // Legitimate numbers in telemetry: step (1..3), shock_pp (0..10), shock_percent (-50..0),
    // duration_months (1..12), time_spent_ms / calculation_time_ms (< 100,000,000)
    if (typeof value === "number") {
      const isAllowedDurationOrTime =
        normalizedKey === "timespentms" ||
        normalizedKey === "calculationtimems" ||
        normalizedKey === "durationmonths" ||
        normalizedKey === "step" ||
        normalizedKey === "shockpp" ||
        normalizedKey === "shockpercent";

      if (!isAllowedDurationOrTime && Math.abs(value) > 1000) {
        throw new Error(
          `[DepositGuard Privacy Violation] Suspected raw currency number detected in field "${key}": ${value}. Monetary values are strictly forbidden.`,
        );
      }
    }

    // Check 3: Recursive scan for nested objects
    if (typeof value === "object" && value !== null) {
      sanitizeTelemetryPayload(value);
    }
  }

  return payload;
}

// 4. In-Memory Telemetry Buffer (for Testing & Client Telemetry Dispatch)
const telemetryBuffer: TelemetryRecord[] = [];

/**
 * Returns read-only copy of captured telemetry events. Useful in automated tests.
 */
export function getTelemetryLog(): readonly TelemetryRecord[] {
  return [...telemetryBuffer];
}

/**
 * Clears in-memory telemetry buffer.
 */
export function clearTelemetryLog(): void {
  telemetryBuffer.length = 0;
}

/**
 * Dispatches an anonymized, privacy-checked telemetry event.
 */
export function trackEvent<E extends TelemetryEventName>(
  event: E,
  payload: TelemetryPayloadMap[E],
): void {
  try {
    const sanitized = sanitizeTelemetryPayload(payload);
    const record: TelemetryRecord<E> = {
      event,
      payload: sanitized,
      timestamp: new Date().toISOString(),
    };

    telemetryBuffer.push(record);

    // Detailed diagnostic events stay in memory only. Public funnel uses a separate strict schema.
    if (telemetryBuffer.length > 200) telemetryBuffer.shift();
  } catch (error) {
    if (process.env.NODE_ENV === "test") {
      throw error; // Fail fast during automated test runs
    }
    if (process.env.NODE_ENV === "development") {
      console.warn("[DepositGuard Telemetry Error]", error);
    }
  }
}
