'use client';

import React, { useMemo, useState } from 'react';
import { Plus, Trash2, AlertTriangle, Lightbulb } from 'lucide-react';
import MoneyInput from '@/components/MoneyInput';
import { formatMonths, formatVND, simulateDebtPayoff } from '@/lib/finance-math';
import {
  DEBT_TYPES,
  MAX_PLAN_DEBTS,
  addMonths,
  monthKey,
  monthLabel,
  toDebtInputs,
  type DebtPlan,
  type DebtType,
  type PlanDebt,
  type PlanStrategy,
} from '@/lib/debt-plan';

export interface DraftDebt {
  name: string;
  type?: DebtType;
  balance: number;
  annualRate: number;
  minPayment: number;
}

interface Row {
  id: string;
  name: string;
  type: DebtType;
  balance: number;
  rate: string;
  rateUnit: 'year' | 'month';
  minPayment: number;
  periods: number; // chỉ dùng cho trả góp
  existing?: PlanDebt;
}

const inputClass =
  'w-full py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:border-emerald-600';
const labelClass = 'text-[11px] font-semibold text-slate-500 block mb-1';

const parseRate = (value: string) => {
  const n = parseFloat(value.replace(',', '.'));
  return Number.isFinite(n) ? Math.max(n, 0) : 0;
};
const annualRateOf = (row: Row) =>
  row.type === 'tra-gop' ? 0 : Math.min(parseRate(row.rate) * (row.rateUnit === 'month' ? 12 : 1), 1000);
const periodsOf = (balance: number, perPeriod: number) => (perPeriod > 0 ? Math.ceil(balance / perPeriod) : 0);
// Trả góp: dư nợ = tiền mỗi kỳ × số kỳ. Nếu người dùng không đổi hai ô này thì giữ nguyên dư nợ đã lưu,
// tránh làm tròn lên thành số kỳ chẵn mỗi lần mở “Sửa sổ”.
const balanceOf = (row: Row) => {
  if (row.type !== 'tra-gop') return row.balance;
  const e = row.existing;
  if (e && e.type === 'tra-gop' && row.minPayment === e.minPayment && row.periods === periodsOf(e.balance, e.minPayment)) return e.balance;
  return row.minPayment * row.periods;
};
const rateText = (n: number) => String(Math.round(n * 1000) / 1000).replace('.', ',');

let rowCounter = 0;
const newId = () => `n${Date.now().toString(36)}${(rowCounter++).toString(36)}`;

function rowFromDebt(d: PlanDebt): Row {
  const monthly = d.rateUnit === 'month';
  return {
    id: d.id,
    name: d.name,
    type: d.type,
    balance: d.balance,
    rate: rateText(monthly ? d.annualRate / 12 : d.annualRate),
    rateUnit: d.rateUnit,
    minPayment: d.minPayment,
    periods: d.type === 'tra-gop' ? periodsOf(d.balance, d.minPayment) : 0,
    existing: d,
  };
}

function MoneyField({ id, label, value, onChange }: { id: string; label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="relative">
        <MoneyInput id={id} value={value} onChange={onChange} className={`${inputClass} pl-2.5 pr-6 font-semibold text-right`} />
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">₫</span>
      </div>
    </div>
  );
}

export default function PlanEditor({
  plan,
  draft,
  today,
  onSave,
  onCancel,
}: {
  plan: DebtPlan | null;
  draft?: { debts: DraftDebt[]; budget?: number; strategy?: PlanStrategy } | null;
  today: Date;
  onSave: (plan: DebtPlan) => void;
  onCancel?: () => void;
}) {
  const [rows, setRows] = useState<Row[]>(() => {
    if (plan) return plan.debts.filter((d) => d.balance > 0).map(rowFromDebt);
    if (draft?.debts.length)
      return draft.debts.map((d) => ({
        id: newId(),
        name: d.name,
        type: d.type ?? 'khac',
        balance: d.balance,
        rate: rateText(d.annualRate),
        rateUnit: 'year' as const,
        minPayment: d.minPayment,
        periods: d.type === 'tra-gop' ? periodsOf(d.balance, d.minPayment) : 0,
      }));
    return [{ id: newId(), name: '', type: 'the-tin-dung', balance: 0, rate: '', rateUnit: 'year', minPayment: 0, periods: 0 }];
  });
  const [budget, setBudget] = useState<number>(plan?.budget ?? draft?.budget ?? 0);
  const [budgetTouched, setBudgetTouched] = useState<boolean>(!!plan || !!draft?.budget);
  const [strategy, setStrategy] = useState<PlanStrategy | null>(plan?.strategy ?? draft?.strategy ?? null);
  const [showErrors, setShowErrors] = useState(false);
  // Chỉ hỏi khi lập sổ mới: dư nợ vừa nhập là trước hay sau kỳ trả tháng này?
  const [paidThisMonth, setPaidThisMonth] = useState<boolean>(false);

  const current = monthKey(today);
  // Tháng trả đầu tiên của kế hoạch: tháng sau nếu tháng này đã ghi sổ.
  const lastCheckIn = plan?.checkIns[plan.checkIns.length - 1];
  const firstMonth = plan
    ? lastCheckIn && lastCheckIn.month >= current
      ? addMonths(lastCheckIn.month, 1)
      : plan.startMonth && plan.startMonth > current && !lastCheckIn
        ? plan.startMonth
        : current
    : paidThisMonth
      ? addMonths(current, 1)
      : current;
  const debts: PlanDebt[] = rows.map((r) => {
    const balance = balanceOf(r);
    const startBalance = r.existing && plan?.checkIns.length ? Math.max(r.existing.startBalance, balance) : balance;
    return {
      id: r.id,
      name: r.name.trim() || DEBT_TYPES.find((t) => t.id === r.type)!.label,
      type: r.type,
      balance,
      annualRate: annualRateOf(r),
      rateUnit: r.rateUnit,
      minPayment: r.minPayment,
      startBalance,
      addedAt: r.existing?.addedAt ?? current,
    };
  });
  const active = debts.filter((d) => d.balance > 0);
  const totalMinimum = active.reduce((s, d) => s + Math.min(d.minPayment, d.balance), 0);
  const effectiveBudget = budgetTouched ? budget : totalMinimum;
  const gap = Math.max(0, totalMinimum - effectiveBudget);

  const activeKey = JSON.stringify(active.map((d) => [d.id, d.balance, d.annualRate, d.minPayment]));
  const preview = useMemo(() => {
    if (active.length === 0 || gap > 0) return null;
    const inputs = toDebtInputs(active);
    const extra = effectiveBudget - totalMinimum;
    return {
      avalanche: simulateDebtPayoff(inputs, extra, 'avalanche'),
      snowball: simulateDebtPayoff(inputs, extra, 'snowball'),
    };
    // activeKey đại diện cho `active` (mảng mới mỗi lần render)
  }, [activeKey, effectiveBudget, totalMinimum, gap]); // eslint-disable-line

  // Gợi ý: tuyết lở nếu tiết kiệm đáng kể, ngược lại quả cầu tuyết để sớm thấy kết quả.
  const suggested: PlanStrategy = (() => {
    if (!preview || !preview.avalanche.feasible) return preview?.snowball.feasible ? 'snowball' : 'avalanche';
    if (!preview.snowball.feasible) return 'avalanche';
    const saving = preview.snowball.totalInterest - preview.avalanche.totalInterest;
    const monthsSaved = preview.snowball.months - preview.avalanche.months;
    return saving >= 0.03 * preview.snowball.totalInterest || monthsSaved >= 1 ? 'avalanche' : 'snowball';
  })();
  const chosen = strategy ?? suggested;

  const update = (id: string, patch: Partial<Row>) => setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const addRow = () => {
    const id = newId();
    setRows((prev) => [...prev, { id, name: '', type: 'khac', balance: 0, rate: '', rateUnit: 'year', minPayment: 0, periods: 0 }]);
    requestAnimationFrame(() => document.getElementById(`${id}-type`)?.focus());
  };
  const removeRow = (id: string) => {
    const idx = rows.findIndex((r) => r.id === id);
    const neighbour = rows[idx + 1] ?? rows[idx - 1];
    setRows((prev) => prev.filter((r) => r.id !== id));
    if (neighbour) requestAnimationFrame(() => document.getElementById(`${neighbour.id}-type`)?.focus());
  };

  const rowErrors = (r: Row) => {
    const errs: string[] = [];
    if (balanceOf(r) <= 0) errs.push(r.type === 'tra-gop' ? 'Nhập tiền mỗi kỳ và số kỳ còn lại' : 'Nhập dư nợ còn lại');
    if (r.type !== 'tra-gop' && r.minPayment <= 0 && r.type !== 'vay-nguoi-than') errs.push('Nhập mức trả tối thiểu mỗi tháng');
    return errs;
  };
  const budgetMissing = effectiveBudget <= 0;
  const canSave = active.length > 0 && !budgetMissing && rows.every((r) => rowErrors(r).length === 0);

  const save = () => {
    if (!canSave) {
      setShowErrors(true);
      // Đưa người dùng tới ô đầu tiên còn thiếu (trên điện thoại, nút Lưu ở xa các ô nhập).
      const bad = rows.find((r) => rowErrors(r).length > 0);
      const field = bad
        ? bad.type === 'tra-gop'
          ? bad.minPayment <= 0
            ? `${bad.id}-min`
            : `${bad.id}-periods`
          : balanceOf(bad) <= 0
            ? `${bad.id}-balance`
            : `${bad.id}-min`
        : 'plan-budget';
      requestAnimationFrame(() => {
        const el = document.getElementById(field);
        el?.scrollIntoView({ block: 'center' });
        el?.focus();
      });
      return;
    }
    const nowIso = today.toISOString();
    // Giữ lại các khoản đã xóa sổ để lịch sử và tiến độ không bị mất.
    const paidOff = plan ? plan.debts.filter((d) => d.balance <= 0) : [];
    onSave({
      version: 1,
      createdAt: plan?.createdAt ?? nowIso,
      updatedAt: nowIso,
      budget: effectiveBudget,
      strategy: chosen,
      reminderDay: plan?.reminderDay ?? null,
      startMonth: plan ? plan.startMonth : firstMonth,
      debts: [...paidOff, ...active],
      // Đánh dấu đã sửa sổ sau lần ghi sổ gần nhất, để khi hoàn tác thì hỏi lại.
      checkIns: plan
        ? plan.checkIns.map((c, i) => (i === plan.checkIns.length - 1 ? { ...c, editedAfter: true } : c))
        : [],
    });
  };

  return (
    <div className="space-y-6">
      {/* Debts */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">1. Bạn đang nợ những khoản nào?</h2>
        <ul className="space-y-3">
          {rows.map((r, idx) => {
            const errs = showErrors ? rowErrors(r) : [];
            const isInstallment = r.type === 'tra-gop';
            const isFamily = r.type === 'vay-nguoi-than';
            const rate = annualRateOf(r);
            const tooLow = !isInstallment && r.balance > 0 && rate > 0 && r.minPayment > 0 && r.minPayment <= (r.balance * rate) / 1200;
            return (
              <li key={r.id}>
                <fieldset className="p-3 sm:p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2.5">
                  <legend className="sr-only">Khoản nợ {idx + 1}</legend>
                  <div className="grid grid-cols-[minmax(0,9rem)_1fr_auto] gap-2.5 items-end">
                    <div>
                      <label htmlFor={`${r.id}-type`} className={labelClass}>
                        Loại
                      </label>
                      <select
                        id={`${r.id}-type`}
                        value={r.type}
                        onChange={(e) => {
                          const type = e.target.value as DebtType;
                          update(r.id, type === 'vay-nguoi-than' && !r.rate ? { type, rate: '0' } : { type });
                        }}
                        className={`${inputClass} px-2`}
                      >
                        {DEBT_TYPES.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor={`${r.id}-name`} className={labelClass}>
                        Tên (để bạn nhận ra)
                      </label>
                      <input
                        id={`${r.id}-name`}
                        type="text"
                        maxLength={40}
                        value={r.name}
                        placeholder={DEBT_TYPES.find((t) => t.id === r.type)!.label}
                        onChange={(e) => update(r.id, { name: e.target.value })}
                        className={`${inputClass} px-2.5`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeRow(r.id)}
                      disabled={rows.length <= 1}
                      aria-label={`Xóa khoản nợ ${idx + 1}`}
                      className="h-[38px] w-9 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-rose-600 hover:border-rose-300 disabled:opacity-40 flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {isInstallment ? (
                    <div className="grid grid-cols-2 gap-2.5">
                      <MoneyField
                        id={`${r.id}-min`}
                        label="Mỗi kỳ trả"
                        value={r.minPayment}
                        onChange={(minPayment) => update(r.id, { minPayment })}
                      />
                      <div>
                        <label htmlFor={`${r.id}-periods`} className={labelClass}>
                          Còn mấy kỳ (tháng)
                        </label>
                        <input
                          id={`${r.id}-periods`}
                          type="text"
                          inputMode="numeric"
                          autoComplete="off"
                          value={r.periods || ''}
                          onChange={(e) => update(r.id, { periods: Math.min(Number(e.target.value.replace(/\D/g, '') || 0), 600) })}
                          className={`${inputClass} px-2.5 font-semibold text-right tabular-nums`}
                        />
                      </div>
                      <p className="col-span-2 text-[11px] text-slate-500">
                        Sổ tính theo tổng số tiền còn phải trả ({formatVND(balanceOf(r))}). Trả trước hạn có thể được giảm
                        lãi hoặc bị tính phí, hãy hỏi bên cho vay.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-[1fr_9rem_1fr] gap-2.5 items-end">
                      <MoneyField
                        id={`${r.id}-balance`}
                        label="Dư nợ còn lại"
                        value={r.balance}
                        onChange={(balance) => update(r.id, { balance })}
                      />
                      <MoneyField
                        id={`${r.id}-min`}
                        label={isFamily ? 'Trả mỗi tháng (đã hẹn)' : 'Trả tối thiểu/tháng'}
                        value={r.minPayment}
                        onChange={(minPayment) => update(r.id, { minPayment })}
                      />
                      <div className="col-span-2 md:col-span-1 md:order-2">
                        <span id={`${r.id}-rate-label`} className={labelClass}>
                          Lãi suất
                        </span>
                        <div className="flex gap-1.5">
                          <input
                            id={`${r.id}-rate`}
                            aria-labelledby={`${r.id}-rate-label`}
                            type="text"
                            inputMode="decimal"
                            autoComplete="off"
                            placeholder="0"
                            value={r.rate}
                            onChange={(e) => update(r.id, { rate: e.target.value.replace(/[^\d.,]/g, '').slice(0, 6) })}
                            className={`${inputClass} px-2.5 font-semibold text-right tabular-nums min-w-0`}
                          />
                          <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 shrink-0" role="group" aria-label="Đơn vị lãi suất">
                            {(['year', 'month'] as const).map((unit) => (
                              <button
                                key={unit}
                                type="button"
                                aria-pressed={r.rateUnit === unit}
                                onClick={() => update(r.id, { rateUnit: unit })}
                                className={`px-2 text-[11px] font-semibold rounded-md ${
                                  r.rateUnit === unit ? 'bg-emerald-600 text-white' : 'text-slate-600'
                                }`}
                              >
                                %/{unit === 'year' ? 'năm' : 'tháng'}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {tooLow && (
                    <p className="flex items-start gap-1.5 text-[11px] text-amber-800">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-px" />
                      Mức trả này chưa đủ trả tiền lãi mỗi tháng (khoảng {formatVND(Math.ceil((r.balance * rate) / 1200))}),
                      nên nếu chỉ trả mức này, khoản nợ sẽ tăng lên.
                    </p>
                  )}
                  {errs.length > 0 && (
                    <p role="alert" className="text-[11px] font-semibold text-rose-700">
                      {errs.join('. ')}.
                    </p>
                  )}
                </fieldset>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          onClick={addRow}
          disabled={rows.length >= MAX_PLAN_DEBTS}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-dashed border-slate-300 text-xs font-semibold text-slate-600 hover:border-emerald-500 hover:text-emerald-700 disabled:opacity-40"
        >
          <Plus className="w-4 h-4" /> Thêm khoản nợ
        </button>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Xem dư nợ, lãi suất và mức trả tối thiểu trong sao kê hoặc ứng dụng của bên cho vay. Nếu bên cho vay báo lãi theo
          tháng, chọn %/tháng. Nếu là lãi phẳng (tính trên số tiền vay ban đầu), hãy dùng lãi suất thực tế ghi trong hợp đồng,
          hoặc nhập khoản đó dạng Trả góp.
        </p>
      </section>

      {/* Budget */}
      <section className="space-y-2">
        <h2 className="text-base font-bold text-slate-900">2. Mỗi tháng bạn dành được bao nhiêu để trả nợ?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
          <MoneyField
            id="plan-budget"
            label="Tổng tiền trả nợ mỗi tháng"
            value={effectiveBudget}
            onChange={(v) => {
              setBudgetTouched(true);
              setBudget(v);
            }}
          />
          <p className="text-xs text-slate-600">
            Tổng mức tối thiểu của các khoản: <strong className="tabular-nums">{formatVND(totalMinimum)}</strong>. Phần dư ra sẽ
            được dồn vào một khoản để trả nhanh hơn.
          </p>
        </div>
        {showErrors && budgetMissing && (
          <p role="alert" className="text-[11px] font-semibold text-rose-700">
            Nhập số tiền bạn dành trả nợ mỗi tháng.
          </p>
        )}
        {!plan && (
          <fieldset className="pt-1">
            <legend className="text-xs font-semibold text-slate-700 mb-1.5">
              {monthLabel(current)} bạn đã trả các khoản này chưa?
            </legend>
            <div className="flex flex-wrap gap-2">
              {[
                { v: false, label: 'Chưa, sẽ trả sau ngày lương' },
                { v: true, label: 'Đã trả rồi (dư nợ ở trên là sau khi trả)' },
              ].map(({ v, label }) => (
                <button
                  key={label}
                  type="button"
                  aria-pressed={paidThisMonth === v}
                  onClick={() => setPaidThisMonth(v)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                    paidThisMonth === v ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {paidThisMonth
                ? `Sổ bắt đầu từ ${monthLabel(addMonths(current, 1)).toLowerCase()}, lần ghi sổ đầu tiên là sau ngày lương tháng đó.`
                : `Sổ bắt đầu từ ${monthLabel(current).toLowerCase()}: trả xong thì ghi sổ tháng này.`}
            </p>
          </fieldset>
        )}
        {gap > 0 && (
          <p className="text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-lg p-3">
            Số tiền này còn thiếu <strong>{formatVND(gap)}</strong> mỗi tháng so với mức tối thiểu. Bạn vẫn lưu sổ được, và mục
            tiêu đầu tiên của sổ sẽ là lấp khoảng thiếu này.
          </p>
        )}
      </section>

      {/* Strategy */}
      <section className="space-y-2">
        <h2 className="text-base font-bold text-slate-900">3. Dồn tiền dư vào khoản nào trước?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Cách dồn tiền">
          {(['avalanche', 'snowball'] as const).map((key) => {
            const r = preview?.[key];
            const isChosen = chosen === key;
            return (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={isChosen}
                onClick={() => setStrategy(key)}
                className={`text-left p-4 rounded-xl border transition-colors ${
                  isChosen ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-slate-900">
                    {key === 'avalanche' ? 'Trả khoản lãi cao trước' : 'Trả khoản nhỏ trước'}
                  </span>
                  {suggested === key && preview && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800">
                      <Lightbulb className="w-3.5 h-3.5" /> Gợi ý
                    </span>
                  )}
                </span>
                <span className="block text-[11px] text-slate-500 mt-0.5">
                  {key === 'avalanche' ? 'Tuyết lở: ít tiền lãi nhất' : 'Quả cầu tuyết: sớm trả xong khoản đầu, dễ giữ động lực'}
                </span>
                {r && (
                  <span className="block text-xs text-slate-700 mt-2">
                    {r.feasible
                      ? `Hết nợ ${monthLabel(addMonths(firstMonth, r.months - 1)).toLowerCase()} (${formatMonths(r.months)}), tiền lãi ${formatVND(r.totalInterest)}`
                      : 'Không trả hết được trong 50 năm với số tiền này'}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="button"
          onClick={save}
          className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-sm"
        >
          {plan ? 'Lưu thay đổi' : 'Lưu sổ trên máy này'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900">
            Hủy
          </button>
        )}
        <span className="text-[11px] text-slate-500">Số liệu chỉ lưu trong trình duyệt trên máy này, HowDoI không nhận được.</span>
      </div>
    </div>
  );
}
