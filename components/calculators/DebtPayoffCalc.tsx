'use client';

import React, { useMemo, useRef, useState } from 'react';
import {
  simulateDebtPayoff,
  formatMonths,
  formatVND,
  formatCompactVND,
  type DebtInput,
  type DebtPayoffResult,
} from '@/lib/finance-math';
import MoneyInput from '@/components/MoneyInput';
import { EXAMPLE_DEBTS, EXAMPLE_EXTRA_PAYMENT } from '@/content/debt-example';
import { Snowflake, Plus, Trash2, AlertTriangle, Award } from 'lucide-react';

interface DebtRow {
  id: string;
  name: string;
  balance: number;
  rate: string; // giữ dạng chuỗi để gõ được "1,5"
  minPayment: number;
}

type Strategy = 'snowball' | 'avalanche';

const MAX_DEBTS = 10;
// Vay qua app, vay nóng có thể trên 100%/năm; giới hạn 1000% để phép tính không tràn số.
const MAX_RATE = 1000;

const DEFAULT_DEBTS: DebtRow[] = EXAMPLE_DEBTS.map((d) => ({
  id: d.id,
  name: d.name,
  balance: d.balance,
  rate: String(d.annualRate),
  minPayment: d.minPayment,
}));

const STRATEGY_LABEL = {
  snowball: 'Quả cầu tuyết',
  avalanche: 'Tuyết lở',
  minimum: 'Chỉ trả tối thiểu',
} as const;

const OTHER: Record<Strategy, Strategy> = { snowball: 'avalanche', avalanche: 'snowball' };

const parseRate = (value: string) => {
  const n = parseFloat(value.replace(',', '.'));
  return Number.isFinite(n) ? Math.min(Math.max(n, 0), MAX_RATE) : 0;
};

const firstPayoff = (r: DebtPayoffResult) => Math.min(...r.items.map((i) => i.paidOffMonth ?? Infinity));

const inputClass =
  'w-full py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:border-rose-500';
const labelClass = 'text-[11px] font-semibold text-slate-500 block mb-1';

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

export default function DebtPayoffCalc() {
  const [debts, setDebts] = useState<DebtRow[]>(DEFAULT_DEBTS);
  const [extra, setExtra] = useState<number>(EXAMPLE_EXTRA_PAYMENT);
  const [view, setView] = useState<Strategy>('snowball');
  const nextId = useRef(DEFAULT_DEBTS.length + 1);

  const inputs: DebtInput[] = useMemo(
    () =>
      debts.map((d, i) => ({
        id: d.id,
        name: d.name.trim() || `Khoản nợ ${i + 1}`,
        balance: d.balance,
        annualRate: parseRate(d.rate),
        minPayment: d.minPayment,
      })),
    [debts],
  );
  const activeDebts = inputs.filter((d) => d.balance > 0);

  const results = useMemo(
    () => ({
      snowball: simulateDebtPayoff(inputs, extra, 'snowball'),
      avalanche: simulateDebtPayoff(inputs, extra, 'avalanche'),
      minimum: simulateDebtPayoff(inputs, 0, 'minimum'),
    }),
    [inputs, extra],
  );

  const totalBalance = activeDebts.reduce((s, d) => s + d.balance, 0);
  const totalMinimum = activeDebts.reduce((s, d) => s + d.minPayment, 0);
  const monthlyInterestNow = activeDebts.reduce((s, d) => s + (d.balance * d.annualRate) / 1200, 0);
  const anyInterest = activeDebts.some((d) => d.annualRate > 0);

  const updateDebt = (id: string, patch: Partial<DebtRow>) =>
    setDebts((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  const addDebt = () => {
    const id = `d${nextId.current++}`;
    setDebts((prev) => [...prev, { id, name: '', balance: 0, rate: '0', minPayment: 0 }]);
    requestAnimationFrame(() => document.getElementById(`${id}-name`)?.focus());
  };
  const removeDebt = (id: string) => {
    const idx = debts.findIndex((d) => d.id === id);
    const neighbour = debts[idx + 1] ?? debts[idx - 1];
    setDebts((prev) => prev.filter((d) => d.id !== id));
    if (neighbour) requestAnimationFrame(() => document.getElementById(`${neighbour.id}-name`)?.focus());
  };

  const { snowball, avalanche, minimum } = results;
  const anyFeasible = snowball.feasible || avalanche.feasible;
  const onlyFeasible: Strategy | null =
    snowball.feasible !== avalanche.feasible ? (snowball.feasible ? 'snowball' : 'avalanche') : null;
  const interestGap = snowball.totalInterest - avalanche.totalInterest;
  const samePlan = interestGap === 0 && snowball.months === avalanche.months;
  // Phương án nên chọn: phương án duy nhất trả hết được, hoặc phương án ít lãi hơn rõ rệt.
  const recommended: Strategy | null =
    onlyFeasible ?? (!anyFeasible || Math.abs(interestGap) < 1_000 ? null : interestGap > 0 ? 'avalanche' : 'snowball');
  // > 0: phương án ít lãi hơn cũng hết nợ sớm hơn
  const monthsGap =
    recommended && !onlyFeasible ? results[OTHER[recommended]].months - results[recommended].months : 0;
  const shownView: Strategy = results[view].feasible ? view : (onlyFeasible ?? view);
  const selected = results[shownView];
  const plan = results[recommended ?? shownView];
  const outOfOrder = selected.items.some(
    (it, i) => i > 0 && (it.paidOffMonth ?? Infinity) < (selected.items[i - 1].paidOffMonth ?? Infinity),
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-700 via-red-700 to-slate-900 p-6 sm:p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm">
            <Snowflake className="w-6 h-6 text-rose-200" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-200">Công cụ tính</span>
            <h2 className="text-xl sm:text-2xl font-bold">Kế hoạch trả nợ: Quả cầu tuyết & Tuyết lở</h2>
          </div>
        </div>
        <p className="text-rose-100/90 text-sm max-w-2xl mt-1">
          Nhập các khoản nợ và số tiền bạn trả thêm được mỗi tháng. Công cụ cho biết nên trả khoản nào trước, bao giờ hết
          nợ và tốn bao nhiêu tiền lãi.
        </p>
      </div>

      <div className="p-4 sm:p-8 space-y-8">
        {/* Debts */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-slate-900">Các khoản nợ của bạn</h3>
            <span className="text-xs text-slate-500">Tổng dư nợ: {formatVND(totalBalance)}</span>
          </div>
          <ul className="space-y-3">
            {debts.map((d, idx) => {
              const rate = parseRate(d.rate);
              const monthlyInterest = (d.balance * rate) / 1200;
              const tooLow = d.balance > 0 && rate > 0 && d.minPayment <= monthlyInterest;
              const label = d.name.trim() || `Khoản nợ ${idx + 1}`;
              return (
                <li key={d.id}>
                  <fieldset className="p-3 sm:p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                    <legend className="sr-only">{label}</legend>
                    <div className="grid grid-cols-[1fr_5rem_auto] md:grid-cols-[1.4fr_5.5rem_2.4fr_auto] gap-2.5 items-end">
                      <div>
                        <label htmlFor={`${d.id}-name`} className={labelClass}>
                          Tên khoản nợ
                        </label>
                        <input
                          id={`${d.id}-name`}
                          type="text"
                          maxLength={40}
                          value={d.name}
                          placeholder={`Khoản nợ ${idx + 1}`}
                          onChange={(e) => updateDebt(d.id, { name: e.target.value })}
                          className={`${inputClass} px-2.5`}
                        />
                      </div>
                      <div>
                        <label htmlFor={`${d.id}-rate`} className={labelClass}>
                          Lãi %/năm
                        </label>
                        <input
                          id={`${d.id}-rate`}
                          type="text"
                          inputMode="decimal"
                          autoComplete="off"
                          value={d.rate}
                          onChange={(e) => updateDebt(d.id, { rate: e.target.value.replace(/[^\d.,]/g, '').slice(0, 6) })}
                          className={`${inputClass} px-2.5 font-semibold text-right tabular-nums`}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDebt(d.id)}
                        disabled={debts.length <= 1}
                        aria-label={`Xóa ${label}`}
                        className="md:order-last h-[38px] w-9 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-rose-600 hover:border-rose-300 disabled:opacity-40 disabled:hover:text-slate-400 flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="col-span-3 md:col-span-1 grid grid-cols-2 gap-2.5">
                        <MoneyField
                          id={`${d.id}-balance`}
                          label="Dư nợ còn lại"
                          value={d.balance}
                          onChange={(balance) => updateDebt(d.id, { balance })}
                        />
                        <MoneyField
                          id={`${d.id}-min`}
                          label="Trả tối thiểu/tháng"
                          value={d.minPayment}
                          onChange={(minPayment) => updateDebt(d.id, { minPayment })}
                        />
                      </div>
                    </div>
                    {tooLow && (
                      <p className="flex items-start gap-1.5 text-[11px] text-amber-800">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-px" />
                        Mức trả tối thiểu chưa đủ trả tiền lãi mỗi tháng (khoảng {formatVND(Math.ceil(monthlyInterest))}).
                        Nếu chỉ trả mức này, khoản nợ sẽ tăng lên.
                      </p>
                    )}
                  </fieldset>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            onClick={addDebt}
            disabled={debts.length >= MAX_DEBTS}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-dashed border-slate-300 text-xs font-semibold text-slate-600 hover:border-rose-400 hover:text-rose-700 disabled:opacity-40"
          >
            <Plus className="w-4 h-4" /> Thêm khoản nợ
          </button>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Số liệu có sẵn chỉ là ví dụ, hãy thay bằng các khoản nợ thật của bạn (xem dư nợ và lãi suất trong sao kê hoặc
            hợp đồng vay). Lãi suất nhập theo năm, tính trên dư nợ còn lại: nếu bên cho vay báo lãi theo tháng thì nhân 12;
            nếu là lãi phẳng (tính trên số tiền vay ban đầu) thì lãi thực tế cao hơn nhiều, hãy dùng lãi suất thực tế ghi
            trong hợp đồng.
          </p>
        </section>

        {/* Extra payment */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end p-4 rounded-xl bg-rose-50/60 border border-rose-100">
          <div>
            <MoneyField id="extra-payment" label="Mỗi tháng trả thêm ngoài mức tối thiểu" value={extra} onChange={setExtra} />
            <div className="flex flex-wrap gap-2 mt-2">
              {[0, 500_000, 1_000_000, 2_000_000, 5_000_000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setExtra(amt)}
                  aria-pressed={extra === amt}
                  className={`text-xs py-1 px-2.5 rounded-md font-medium transition-colors ${
                    extra === amt ? 'bg-rose-600 text-white' : 'bg-white text-slate-700 hover:bg-rose-100'
                  }`}
                >
                  {amt === 0 ? '0' : formatCompactVND(amt)}
                </button>
              ))}
            </div>
          </div>
          <div className="text-sm text-slate-700 md:text-right">
            Tổng tiền trả mỗi tháng:
            <span className="block text-2xl font-extrabold text-slate-900 tabular-nums">{formatVND(totalMinimum + extra)}</span>
            <span className="text-xs text-slate-500">
              = {formatVND(totalMinimum)} tối thiểu + {formatVND(extra)} trả thêm
            </span>
          </div>
        </section>

        {/* Results */}
        {activeDebts.length === 0 ? (
          <p className="text-sm text-slate-500">Nhập ít nhất một khoản nợ có dư nợ lớn hơn 0 để xem kế hoạch.</p>
        ) : (
          <section className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['snowball', 'avalanche', 'minimum'] as const).map((key) => {
                const r = results[key];
                const isBest = key === recommended;
                return (
                  <div
                    key={key}
                    className={`p-4 rounded-xl border ${isBest ? 'border-emerald-400 bg-emerald-50/50' : 'border-slate-200 bg-white'}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-700">{STRATEGY_LABEL[key]}</span>
                      {isBest && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800">
                          <Award className="w-3.5 h-3.5" /> {onlyFeasible ? 'Trả hết được' : 'Ít lãi nhất'}
                        </span>
                      )}
                    </div>
                    {r.feasible ? (
                      <>
                        <span className="block text-[11px] text-slate-500 mt-2">Hết nợ sau</span>
                        <span className="block text-xl font-extrabold text-slate-900">{formatMonths(r.months)}</span>
                        <span className="block text-[11px] text-slate-500 mt-2">Tổng tiền lãi</span>
                        <span className="block text-base font-bold text-slate-800 tabular-nums">{formatVND(r.totalInterest)}</span>
                      </>
                    ) : (
                      <p className="text-sm font-semibold text-rose-700 mt-2 flex items-start gap-1.5">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        Không trả hết được trong 50 năm.
                      </p>
                    )}
                    {key === 'minimum' && (
                      <span className="block text-[10px] text-slate-500 mt-2 leading-snug">
                        Mỗi khoản chỉ trả đúng mức tối thiểu của nó, trả xong không dồn tiền sang khoản khác.
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Verdict */}
            <div
              aria-live="polite"
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 leading-relaxed space-y-2"
            >
              {!anyFeasible ? (
                <p>
                  {totalMinimum + extra <= monthlyInterestNow
                    ? `Tổng tiền trả mỗi tháng (${formatVND(totalMinimum + extra)}) chưa đủ trả tiền lãi (khoảng ${formatVND(Math.ceil(monthlyInterestNow))}/tháng), nên nợ sẽ tăng lên.`
                    : 'Với tổng tiền trả mỗi tháng hiện tại, các khoản nợ không trả hết được trong 50 năm.'}{' '}
                  Hãy tăng số tiền trả thêm{anyInterest ? ', hoặc liên hệ bên cho vay để hỏi về việc giãn nợ, giảm lãi' : ''}.
                </p>
              ) : (
                <>
                  {onlyFeasible ? (
                    <p>
                      Với số tiền này, chỉ cách <strong>{STRATEGY_LABEL[onlyFeasible]}</strong> trả hết được nợ (sau{' '}
                      {formatMonths(results[onlyFeasible].months)}). Cách còn lại không trả hết được trong 50 năm
                      {onlyFeasible === 'avalanche' && ', vì khoản lãi cao nhất bị để quá lâu và tiền lãi của nó tăng nhanh hơn số tiền trả'}
                      .
                    </p>
                  ) : recommended === null ? (
                    <p>
                      {samePlan
                        ? 'Với các khoản nợ này, hai cách cho cùng một kết quả.'
                        : 'Với các khoản nợ này, hai cách tốn tiền lãi gần như bằng nhau. Hãy chọn cách giúp bạn giữ được kỷ luật lâu nhất.'}
                    </p>
                  ) : (
                    <p>
                      <strong>{STRATEGY_LABEL[recommended]}</strong> giúp bạn bớt{' '}
                      <strong>{formatVND(Math.abs(interestGap))}</strong> tiền lãi so với{' '}
                      {STRATEGY_LABEL[OTHER[recommended]].toLowerCase()}
                      {monthsGap > 0 && ` và hết nợ sớm hơn ${formatMonths(monthsGap)}`}
                      {monthsGap < 0 && `, dù hết nợ muộn hơn ${formatMonths(-monthsGap)}`}.
                      {recommended === 'avalanche' &&
                        firstPayoff(snowball) < firstPayoff(avalanche) &&
                        ` Đổi lại, quả cầu tuyết giúp bạn trả xong khoản đầu tiên sau ${formatMonths(firstPayoff(snowball))}, sớm hơn tuyết lở (${formatMonths(firstPayoff(avalanche))}).`}
                    </p>
                  )}
                  {minimum.feasible ? (
                    minimum.totalInterest > plan.totalInterest && (
                      <p>
                        So với chỉ trả tối thiểu, kế hoạch này (dồn tiền của khoản đã trả xong sang khoản tiếp theo
                        {extra > 0 && `, cộng ${formatVND(extra)} trả thêm mỗi tháng`}) giúp bạn{' '}
                        {minimum.months > plan.months && `hết nợ sớm hơn ${formatMonths(minimum.months - plan.months)} và `}
                        bớt {formatVND(minimum.totalInterest - plan.totalInterest)} tiền lãi.
                      </p>
                    )
                  ) : (
                    <p>Nếu chỉ trả đúng mức tối thiểu của từng khoản, bạn sẽ không trả hết các khoản nợ này trong 50 năm.</p>
                  )}
                </>
              )}
            </div>

            {/* Payoff order */}
            {anyFeasible && (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900">Thứ tự ưu tiên dồn tiền</h3>
                  <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg" role="group" aria-label="Chọn phương pháp">
                    {(['snowball', 'avalanche'] as const).map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setView(key)}
                        disabled={!results[key].feasible}
                        aria-pressed={shownView === key}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all disabled:opacity-40 ${
                          shownView === key ? 'bg-white text-rose-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {STRATEGY_LABEL[key]}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  {shownView === 'snowball'
                    ? 'Dồn tiền trả thêm vào khoản có dư nợ nhỏ nhất. Trả xong khoản nào, tiền của khoản đó dồn sang khoản tiếp theo.'
                    : 'Dồn tiền trả thêm vào khoản có lãi suất cao nhất. Trả xong khoản nào, tiền của khoản đó dồn sang khoản tiếp theo.'}
                  {outOfOrder && ' Khoản có mức trả tối thiểu lớn có thể xong trước khoản được ưu tiên.'}
                </p>
                <ol className="space-y-3">
                  {selected.items.map((item, idx) => (
                    <li key={item.id} className="p-3.5 rounded-xl border border-slate-200 bg-white">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
                        <span className="font-semibold text-slate-900">
                          Ưu tiên {idx + 1}: {item.name}
                        </span>
                        <span className="text-slate-700">
                          Trả xong sau <strong>{formatMonths(item.paidOffMonth ?? selected.months)}</strong>
                        </span>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-rose-500"
                          style={{ width: `${((item.paidOffMonth ?? selected.months) / selected.months) * 100}%` }}
                        />
                      </div>
                      <span className="block text-[11px] text-slate-500 mt-1.5">
                        Tiền lãi của khoản này: {formatVND(item.interestPaid)}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </section>
        )}

        <p className="text-[11px] text-slate-500 leading-relaxed">
          Công cụ tính lãi hàng tháng trên dư nợ còn lại và giữ nguyên mức trả tối thiểu. Thẻ tín dụng thường tính lãi
          theo ngày và mức tối thiểu giảm dần theo dư nợ, nên kết quả thực tế có thể chênh lệch. Chưa tính phí phạt, phí
          trả nợ trước hạn hay thay đổi lãi suất.
        </p>
      </div>
    </div>
  );
}
