/**
 * Sổ trả nợ: kế hoạch trả nợ lưu trên máy người dùng (localStorage), không gửi lên máy chủ.
 * File này chỉ chứa logic thuần (không có giao diện) để dễ kiểm tra.
 */
import { simulateDebtPayoff, type DebtInput, type DebtPayoffResult } from "./finance-math";

export type DebtType =
  | "the-tin-dung"
  | "vay-tieu-dung"
  | "tra-gop"
  | "vi-tra-sau"
  | "vay-app"
  | "vay-nguoi-than"
  | "khac";

export const DEBT_TYPES: { id: DebtType; label: string }[] = [
  { id: "the-tin-dung", label: "Thẻ tín dụng" },
  { id: "vay-tieu-dung", label: "Vay tiêu dùng" },
  { id: "tra-gop", label: "Trả góp" },
  { id: "vi-tra-sau", label: "Ví trả sau" },
  { id: "vay-app", label: "Vay qua app" },
  { id: "vay-nguoi-than", label: "Vay người thân" },
  { id: "khac", label: "Khác" },
];

export type PlanStrategy = "snowball" | "avalanche";

export interface PlanDebt {
  id: string;
  name: string;
  type: DebtType;
  balance: number;              // Dư nợ hiện tại. Với trả góp: tổng số tiền còn phải trả
  annualRate: number;           // %/năm trên dư nợ còn lại (trả góp luôn là 0)
  rateUnit: "year" | "month";   // Đơn vị người dùng chọn khi nhập (chỉ để hiển thị)
  minPayment: number;           // Trả tối thiểu mỗi tháng (trả góp: tiền mỗi kỳ)
  startBalance: number;         // Dư nợ lúc đưa vào sổ, dùng để tính tiến độ
  addedAt: string;              // YYYY-MM
  paidOffAt?: string;           // YYYY-MM, tháng xóa sổ
}

export interface CheckIn {
  month: string;                // YYYY-MM, tháng được ghi sổ
  at: string;                   // ISO, thời điểm ghi
  paid: Record<string, number>; // id khoản nợ → số tiền đã trả
  totalPaid: number;
  plannedTotal: number;
  newDebt: boolean;
  cleared: string[];            // id các khoản trả xong trong lần này
  debtFreeBefore: string | null;
  debtFreeAfter: string | null;
  prevDebts: PlanDebt[];        // Để hoàn tác; chỉ lần ghi sổ gần nhất giữ bản này
  editedAfter?: boolean;        // Người dùng đã sửa sổ sau lần ghi sổ này
}

export interface DebtPlan {
  version: 1;
  createdAt: string;
  updatedAt: string;
  budget: number;               // Tổng tiền dành trả nợ mỗi tháng
  strategy: PlanStrategy;
  reminderDay: number | null;   // Ngày nhận lương (1–28), hoặc -1 là ngày cuối tháng
  startMonth?: string;          // Tháng trả đầu tiên theo sổ (YYYY-MM); tháng sau nếu lúc lập sổ đã trả tháng này
  debts: PlanDebt[];
  checkIns: CheckIn[];
}

export const STORAGE_KEY = "howdoi:so-tra-no:v1";
export const DRAFT_KEY = "howdoi:so-tra-no:draft";
export const MAX_PLAN_DEBTS = 12;
const MAX_AMOUNT = 100_000_000_000;
const MAX_RATE = 1000;

// ---------- Ngày tháng ----------

export function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function addMonths(key: string, n: number): string {
  const [y, m] = key.split("-").map(Number);
  const total = y * 12 + (m - 1) + n;
  return `${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, "0")}`;
}

export function monthsBetween(from: string, to: string): number {
  const [y1, m1] = from.split("-").map(Number);
  const [y2, m2] = to.split("-").map(Number);
  return y2 * 12 + m2 - (y1 * 12 + m1);
}

export function monthLabel(key: string): string {
  const [y, m] = key.split("-").map(Number);
  return `Tháng ${m}/${y}`;
}

// ---------- Tính trạng thái kế hoạch ----------

export interface PlanStatus {
  active: PlanDebt[];
  totalBalance: number;
  totalMinimum: number;
  startTotal: number;
  progress: number;               // 0..1, phần nợ đã trả so với lúc đưa vào sổ
  gap: number;                    // > 0 khi tiền dành ra chưa đủ trả tối thiểu
  nextMonth: string;              // Tháng cần ghi sổ tiếp theo (YYYY-MM)
  canCheckIn: boolean;            // false khi tháng cần ghi sổ còn ở phía trước
  checkedInThisMonth: boolean;
  monthsSinceLastCheckIn: number | null;
  sim: DebtPayoffResult | null;   // null khi thiếu tiền hoặc đã hết nợ
  debtFreeMonth: string | null;   // null khi thiếu tiền hoặc quá 50 năm
  monthsLeft: number | null;
  planned: Record<string, number>; // Số tiền nên trả cho từng khoản trong tháng tới
  done: boolean;
}

export function toDebtInputs(debts: PlanDebt[]): DebtInput[] {
  return debts
    .filter((d) => d.balance > 0)
    // Mức tối thiểu không vượt quá dư nợ, để tổng tiền trả mỗi tháng đúng bằng ngân sách người dùng đặt.
    .map((d) => ({
      id: d.id,
      name: d.name,
      balance: d.balance,
      annualRate: d.annualRate,
      minPayment: Math.min(d.minPayment, d.balance),
    }));
}

export function computeStatus(plan: DebtPlan, today: Date): PlanStatus {
  const current = monthKey(today);
  const last = plan.checkIns[plan.checkIns.length - 1];
  const checkedInThisMonth = !!last && last.month >= current;
  const startMonth = plan.startMonth ?? plan.createdAt.slice(0, 7);
  const nextMonth = last
    ? last.month >= current
      ? addMonths(last.month, 1)
      : current
    : startMonth > current
      ? startMonth
      : current;

  const active = plan.debts.filter((d) => d.balance > 0);
  const totalBalance = active.reduce((s, d) => s + d.balance, 0);
  const totalMinimum = active.reduce((s, d) => s + Math.min(d.minPayment, d.balance), 0);
  const startTotal = plan.debts.reduce((s, d) => s + d.startBalance, 0);
  const progress = startTotal > 0 ? Math.min(1, Math.max(0, (startTotal - totalBalance) / startTotal)) : 0;
  const gap = Math.max(0, totalMinimum - plan.budget);
  const done = plan.debts.length > 0 && active.length === 0;

  let sim: DebtPayoffResult | null = null;
  let debtFreeMonth: string | null = null;
  let monthsLeft: number | null = null;
  const planned: Record<string, number> = {};

  if (!done && gap === 0) {
    sim = simulateDebtPayoff(toDebtInputs(plan.debts), plan.budget - totalMinimum, plan.strategy);
    sim.items.forEach((it) => (planned[it.id] = it.firstMonthPayment));
    if (sim.feasible) {
      monthsLeft = sim.months;
      debtFreeMonth = addMonths(nextMonth, sim.months - 1);
    }
  } else {
    active.forEach((d) => (planned[d.id] = Math.min(d.minPayment, d.balance)));
  }

  return {
    active,
    totalBalance,
    totalMinimum,
    startTotal,
    progress,
    gap,
    nextMonth,
    canCheckIn: nextMonth <= current,
    checkedInThisMonth,
    // Chưa ghi sổ lần nào: tính cả tháng bắt đầu của sổ, để nhắc nhập dư nợ theo sao kê nếu đã bỏ lỡ.
    monthsSinceLastCheckIn: last
      ? monthsBetween(last.month, current)
      : isMonth(startMonth) && startMonth <= current
        ? monthsBetween(startMonth, current) + 1
        : null,
    sim,
    debtFreeMonth,
    monthsLeft,
    planned,
    done,
  };
}

// ---------- Ghi sổ hằng tháng ----------

export interface CheckInInput {
  paid: Record<string, number>;
  statement: Record<string, number | null>; // Dư nợ theo sao kê sau khi trả (nếu có)
  newDebt: boolean;
}

export function applyCheckIn(plan: DebtPlan, input: CheckInInput, now: Date): { plan: DebtPlan; checkIn: CheckIn } {
  const before = computeStatus(plan, now);
  const month = before.nextMonth;
  const debts = plan.debts.map((d) => {
    if (d.balance <= 0) return d;
    const statement = input.statement[d.id];
    const paid = Math.max(0, input.paid[d.id] ?? 0);
    let balance =
      statement !== null && statement !== undefined
        ? Math.max(0, Math.round(statement))
        : Math.max(0, Math.round(d.balance + (d.balance * d.annualRate) / 1200 - paid));
    if (balance < 1) balance = 0;
    const startBalance = Math.max(d.startBalance, balance);
    return { ...d, balance, startBalance, paidOffAt: balance === 0 ? month : undefined };
  });
  const cleared = plan.debts.filter((d, i) => d.balance > 0 && debts[i].balance === 0).map((d) => d.id);
  const paid = Object.fromEntries(
    plan.debts.filter((d) => d.balance > 0).map((d) => [d.id, Math.max(0, input.paid[d.id] ?? 0)]),
  );
  const checkIn: CheckIn = {
    month,
    at: now.toISOString(),
    paid,
    totalPaid: Object.values(paid).reduce((s, v) => s + v, 0),
    plannedTotal: Object.values(before.planned).reduce((s, v) => s + v, 0),
    newDebt: input.newDebt,
    cleared,
    debtFreeBefore: before.debtFreeMonth,
    debtFreeAfter: null,
    prevDebts: plan.debts,
  };
  // Chỉ giữ bản chụp để hoàn tác ở lần ghi sổ mới nhất, để tệp sao lưu và link khôi phục gọn.
  const older = plan.checkIns.map((c) => (c.prevDebts.length ? { ...c, prevDebts: [] } : c));
  const next: DebtPlan = { ...plan, debts, checkIns: [...older, checkIn], updatedAt: now.toISOString() };
  checkIn.debtFreeAfter = computeStatus(next, now).debtFreeMonth;
  return { plan: next, checkIn };
}

export function canUndoLastCheckIn(plan: DebtPlan, today: Date): boolean {
  const last = plan.checkIns[plan.checkIns.length - 1];
  return !!last && last.prevDebts.length > 0 && last.month >= monthKey(today);
}

// Hoàn tác chỉ đưa dư nợ về như trước lần ghi sổ. Khoản nợ thêm sau đó và các thay đổi khác
// (tên, lãi suất, mức tối thiểu) được giữ nguyên.
export function undoLastCheckIn(plan: DebtPlan, now: Date): DebtPlan {
  const last = plan.checkIns[plan.checkIns.length - 1];
  if (!last || last.prevDebts.length === 0) return plan;
  const prev = new Map(last.prevDebts.map((d) => [d.id, d]));
  const debts = plan.debts.map((d) => {
    const p = prev.get(d.id);
    return p ? { ...d, balance: p.balance, startBalance: p.startBalance, paidOffAt: p.paidOffAt } : d;
  });
  return { ...plan, debts, checkIns: plan.checkIns.slice(0, -1), updatedAt: now.toISOString() };
}

// ---------- Kiểm tra dữ liệu (khi đọc từ máy, tệp sao lưu hoặc link khôi phục) ----------

const num = (v: unknown, max = MAX_AMOUNT) =>
  typeof v === "number" && Number.isFinite(v) ? Math.min(Math.max(v, 0), max) : 0;
const str = (v: unknown, maxLen: number) => (typeof v === "string" ? v.slice(0, maxLen) : "");
const isMonth = (v: unknown): v is string => typeof v === "string" && /^\d{4}-\d{2}$/.test(v);

function sanitizeDebt(raw: unknown, fallbackMonth: string): PlanDebt | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;
  const id = str(d.id, 40);
  if (!id || id in Object.prototype) return null;
  const type = DEBT_TYPES.some((t) => t.id === d.type) ? (d.type as DebtType) : "khac";
  const balance = num(d.balance);
  return {
    id,
    name: str(d.name, 40),
    type,
    balance,
    annualRate: type === "tra-gop" ? 0 : num(d.annualRate, MAX_RATE),
    rateUnit: d.rateUnit === "month" ? "month" : "year",
    minPayment: num(d.minPayment),
    startBalance: Math.max(num(d.startBalance), balance),
    addedAt: isMonth(d.addedAt) ? d.addedAt : fallbackMonth,
    paidOffAt: isMonth(d.paidOffAt) ? d.paidOffAt : undefined,
  };
}

export function sanitizePlan(raw: unknown): DebtPlan | null {
  if (!raw || typeof raw !== "object") return null;
  const p = raw as Record<string, unknown>;
  if (p.version !== 1 || !Array.isArray(p.debts)) return null;
  const createdAt = typeof p.createdAt === "string" ? p.createdAt : new Date(0).toISOString();
  const fallbackMonth = createdAt.slice(0, 7);
  const seen = new Set<string>();
  const debts = p.debts
    .map((d) => sanitizeDebt(d, isMonth(fallbackMonth) ? fallbackMonth : "2026-01"))
    .filter((d): d is PlanDebt => d !== null && !seen.has(d.id) && !!seen.add(d.id))
    .slice(0, MAX_PLAN_DEBTS);
  if (debts.length === 0) return null;
  const checkIns: CheckIn[] = Array.isArray(p.checkIns)
    ? (p.checkIns as unknown[])
        .filter((c): c is Record<string, unknown> => !!c && typeof c === "object" && isMonth((c as Record<string, unknown>).month))
        .slice(-600)
        .map((ci) => {
          const month = ci.month as string;
          const paidRaw = ci.paid && typeof ci.paid === "object" ? (ci.paid as Record<string, unknown>) : {};
          return {
            month,
            at: str(ci.at, 40),
            paid: Object.fromEntries(
              Object.entries(paidRaw)
                .filter(([k, v]) => seen.has(k) && typeof v === "number" && Number.isFinite(v))
                .map(([k, v]) => [k, num(v)]),
            ),
            totalPaid: num(ci.totalPaid),
            plannedTotal: num(ci.plannedTotal),
            newDebt: ci.newDebt === true,
            cleared: Array.isArray(ci.cleared) ? ci.cleared.filter((x): x is string => typeof x === "string").slice(0, MAX_PLAN_DEBTS) : [],
            debtFreeBefore: isMonth(ci.debtFreeBefore) ? ci.debtFreeBefore : null,
            debtFreeAfter: isMonth(ci.debtFreeAfter) ? ci.debtFreeAfter : null,
            prevDebts: Array.isArray(ci.prevDebts)
              ? ci.prevDebts.map((d) => sanitizeDebt(d, month)).filter((d): d is PlanDebt => d !== null).slice(0, MAX_PLAN_DEBTS)
              : [],
            editedAfter: ci.editedAfter === true,
          };
        })
    : [];
  const reminderDay =
    p.reminderDay === -1
      ? -1
      : typeof p.reminderDay === "number" && p.reminderDay >= 1 && p.reminderDay <= 28
        ? Math.round(p.reminderDay)
        : null;
  return {
    version: 1,
    createdAt,
    updatedAt: typeof p.updatedAt === "string" ? p.updatedAt : createdAt,
    budget: num(p.budget),
    strategy: p.strategy === "avalanche" ? "avalanche" : "snowball",
    reminderDay,
    startMonth: isMonth(p.startMonth) ? p.startMonth : undefined,
    debts,
    checkIns,
  };
}

// ---------- Lưu trên máy ----------

export function loadPlan(): { plan: DebtPlan | null; storageOk: boolean } {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return { plan: raw ? sanitizePlan(JSON.parse(raw)) : null, storageOk: true };
  } catch {
    return { plan: null, storageOk: false };
  }
}

export function savePlan(plan: DebtPlan): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    // Xin trình duyệt giữ dữ liệu lâu dài (không có hộp thoại; trình duyệt có thể từ chối).
    navigator.storage?.persist?.().catch(() => undefined);
    return true;
  } catch {
    return false;
  }
}

export function clearPlan(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* bỏ qua */
  }
}

// ---------- Sao lưu & khôi phục ----------

export function encodeBackup(plan: DebtPlan): string {
  const bytes = new TextEncoder().encode(JSON.stringify(plan));
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeBackup(encoded: string): DebtPlan | null {
  try {
    const b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return sanitizePlan(JSON.parse(new TextDecoder().decode(bytes)));
  } catch {
    return null;
  }
}

// ---------- Nhắc lịch (.ics), không cần máy chủ ----------

const icsDate = (d: Date) =>
  `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;

// Lần nhắc đầu tiên: ngày `day` (hoặc ngày cuối tháng nếu day = -1) đầu tiên kể từ hôm nay,
// và không sớm hơn tháng cần ghi sổ tiếp theo (`fromMonth`).
export function firstReminderDate(day: number, today: Date, fromMonth?: string): Date {
  let earliest = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (fromMonth && isMonth(fromMonth)) {
    const [y, m] = fromMonth.split("-").map(Number);
    const firstOfMonth = new Date(y, m - 1, 1);
    if (firstOfMonth > earliest) earliest = firstOfMonth;
  }
  const dayIn = (y: number, m: number) => (day === -1 ? new Date(y, m + 1, 0) : new Date(y, m, day));
  let month = earliest.getMonth();
  let candidate = dayIn(earliest.getFullYear(), month);
  while (candidate < earliest) candidate = dayIn(earliest.getFullYear(), ++month);
  return candidate;
}

// Gấp dòng dài hơn 75 byte theo RFC 5545, không cắt giữa ký tự UTF-8.
function foldLine(line: string): string {
  const encoder = new TextEncoder();
  const parts: string[] = [];
  let current = "";
  let bytes = 0;
  for (const ch of line) {
    const size = encoder.encode(ch).length;
    const limit = parts.length === 0 ? 75 : 74;
    if (bytes + size > limit) {
      parts.push(current);
      current = "";
      bytes = 0;
    }
    current += ch;
    bytes += size;
  }
  parts.push(current);
  return parts.join("\r\n ");
}

const icsText = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

// Tiêu đề trung tính, không có chữ "nợ" để không lộ trên màn hình khóa.
export function buildReminderIcs(day: number, today: Date, url: string, uid: string, fromMonth?: string): string {
  const start = firstReminderDate(day, today, fromMonth);
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1);
  const stamp = new Date(today.getTime()).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const title = "HowDoI: ghi sổ tháng này";
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//HowDoI//Ghi so hang thang//VI",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${icsDate(start)}`,
    `DTEND;VALUE=DATE:${icsDate(end)}`,
    `RRULE:FREQ=MONTHLY;BYMONTHDAY=${day}`,
    `SUMMARY:${icsText(title)}`,
    `DESCRIPTION:${icsText(`Mở ${url} để ghi sổ (khoảng 1 phút).`)}`,
    `URL:${url}`,
    "TRANSP:TRANSPARENT",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${icsText(title)}`,
    "TRIGGER:PT9H",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(foldLine).join("\r\n") + "\r\n";
}
