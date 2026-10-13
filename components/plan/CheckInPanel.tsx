'use client';

import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import MoneyInput from '@/components/MoneyInput';
import { formatVND } from '@/lib/finance-math';
import { monthLabel, type CheckInInput, type PlanStatus } from '@/lib/debt-plan';

const inputClass =
  'w-full py-2 pl-2.5 pr-6 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-right text-slate-800 focus:outline-none focus:border-emerald-600';

export default function CheckInPanel({
  status,
  onSubmit,
  onCancel,
}: {
  status: PlanStatus;
  onSubmit: (input: CheckInInput) => void;
  onCancel: () => void;
}) {
  const [paid, setPaid] = useState<Record<string, number>>(() => ({ ...status.planned }));
  const [useStatement, setUseStatement] = useState(false);
  const [statement, setStatement] = useState<Record<string, number | null>>({});
  const [newDebt, setNewDebt] = useState<boolean | null>(null);
  const plannedTotal = Object.values(status.planned).reduce((s, v) => s + v, 0);
  const paidTotal = status.active.reduce((s, d) => s + (paid[d.id] ?? 0), 0);
  const missedMonths = (status.monthsSinceLastCheckIn ?? 0) > 1;

  const submit = (asPlanned: boolean) =>
    onSubmit({
      paid: asPlanned ? { ...status.planned } : paid,
      statement: useStatement ? statement : {},
      newDebt: newDebt === true,
    });

  return (
    <div className="p-4 sm:p-5 rounded-2xl border-2 border-emerald-500 bg-white space-y-4">
      <div>
        <h3 className="text-base font-bold text-slate-900">Ghi sổ {monthLabel(status.nextMonth).toLowerCase()}</h3>
        <p className="text-xs text-slate-500 mt-0.5">Số tiền đã điền sẵn theo kế hoạch. Trả khác thì sửa lại cho đúng.</p>
      </div>

      {missedMonths && (
        <p className="text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg p-2.5">
          Đã lâu bạn chưa ghi sổ. Để sổ chính xác, hãy bật “Cập nhật dư nợ theo sao kê” và nhập dư nợ hiện tại của từng khoản.
        </p>
      )}

      <button
        type="button"
        onClick={() => submit(true)}
        className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm"
      >
        <CheckCircle2 className="w-5 h-5" />
        Đã trả đúng kế hoạch ({formatVND(plannedTotal)})
      </button>

      <details className="group">
        <summary className="cursor-pointer text-sm font-semibold text-emerald-800 hover:text-emerald-900">
          Tháng này trả khác kế hoạch
        </summary>
        <div className="mt-3 space-y-3">
          <ul className="space-y-2.5">
            {status.active.map((d) => (
              <li key={d.id} className="grid grid-cols-1 sm:grid-cols-[1fr_11rem_11rem] gap-2 items-end">
                <span className="text-sm font-semibold text-slate-800 sm:pb-2">{d.name}</span>
                <div>
                  <label htmlFor={`ci-${d.id}-paid`} className="text-[11px] font-semibold text-slate-500 block mb-1">
                    Đã trả tháng này
                  </label>
                  <div className="relative">
                    <MoneyInput
                      id={`ci-${d.id}-paid`}
                      value={paid[d.id] ?? 0}
                      onChange={(v) => setPaid((p) => ({ ...p, [d.id]: v }))}
                      className={inputClass}
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">₫</span>
                  </div>
                </div>
                {useStatement && (
                  <div>
                    <label htmlFor={`ci-${d.id}-statement`} className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Dư nợ sau khi trả (sao kê)
                    </label>
                    <div className="relative">
                      <MoneyInput
                        nullable
                        id={`ci-${d.id}-statement`}
                        value={statement[d.id] ?? null}
                        onChange={(v) => setStatement((s) => ({ ...s, [d.id]: v }))}
                        placeholder="Để trống nếu không biết"
                        className={inputClass}
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">₫</span>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <label className="flex items-start gap-2 text-xs text-slate-700">
            <input
              type="checkbox"
              checked={useStatement}
              onChange={(e) => {
                setUseStatement(e.target.checked);
                if (e.target.checked) setStatement(Object.fromEntries(status.active.map((d) => [d.id, null])));
              }}
              className="mt-0.5 accent-emerald-600"
            />
            <span>
              Cập nhật dư nợ theo sao kê. Lãi và phí thực tế thường lệch một chút so với sổ; nhập dư nợ thật giúp ngày hết nợ
              chính xác hơn. Ô nào để trống thì sổ tự tính; nhập 0 nếu bạn đã trả hết khoản đó.
            </span>
          </label>
          <p className="text-xs text-slate-600">
            Tổng đã trả: <strong className="tabular-nums">{formatVND(paidTotal)}</strong> (kế hoạch {formatVND(plannedTotal)}).
            Có khoản thưởng hay thu nhập thêm? Cứ cộng vào khoản bạn muốn trả nhanh.
          </p>
        </div>
      </details>

      <fieldset className="space-y-1.5">
        <legend className="text-xs font-semibold text-slate-700">Tháng này có phát sinh khoản nợ mới không?</legend>
        <div className="flex gap-2">
          {[
            { v: false, label: 'Không' },
            { v: true, label: 'Có' },
          ].map(({ v, label }) => (
            <button
              key={label}
              type="button"
              aria-pressed={newDebt === v}
              onClick={() => setNewDebt(v)}
              className={`px-4 py-1.5 rounded-lg border text-xs font-semibold ${
                newDebt === v ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {newDebt && (
          <p className="text-[11px] text-slate-600">
            Không sao, ghi thật mới giúp được bạn. Sau khi lưu, bấm “Sửa sổ” để thêm khoản mới vào kế hoạch.
          </p>
        )}
      </fieldset>

      <div className="flex flex-wrap gap-3 pt-1">
        <button
          type="button"
          onClick={() => submit(false)}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold"
        >
          Lưu ghi sổ
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900">
          Để sau
        </button>
      </div>
    </div>
  );
}
