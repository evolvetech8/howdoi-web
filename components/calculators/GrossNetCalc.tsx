'use client';

import React, { useState, useMemo } from 'react';
import {
  calculateGrossToNet,
  calculateNetToGross,
  formatVND,
  REGION_LABELS,
  SALARY_RULES,
  type Region,
} from '@/lib/finance-math';
import { Wallet, ShieldCheck, Users, ArrowLeftRight } from 'lucide-react';

type Mode = 'gross-to-net' | 'net-to-gross';

const formatPercent = (rate: number) => `${(rate * 100).toLocaleString('vi-VN')}%`;
const formatMillions = (amount: number) => `${(amount / 1_000_000).toLocaleString('vi-VN')} tr`;

export default function GrossNetCalc() {
  const [mode, setMode] = useState<Mode>('gross-to-net');
  const [salary, setSalary] = useState<number>(20_000_000);
  const [dependents, setDependents] = useState<number>(0);
  const [region, setRegion] = useState<Region>(1);

  const result = useMemo(() => {
    return mode === 'gross-to-net'
      ? calculateGrossToNet({ grossSalary: salary, dependents, region })
      : calculateNetToGross({ netSalary: salary, dependents, region });
  }, [mode, salary, dependents, region]);

  const share = (amount: number) =>
    result.grossSalary > 0 ? ((amount / result.grossSalary) * 100).toFixed(1) : '0.0';
  const insurancePercent = share(result.totalInsurance);
  const taxPercent = share(result.personalIncomeTax);
  const netPercent = share(result.netSalary);

  const inputLabel = mode === 'gross-to-net' ? 'Lương Gross mỗi tháng' : 'Lương Net mong muốn mỗi tháng';

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-800 p-6 sm:p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm">
            <Wallet className="w-6 h-6 text-blue-200" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">Công cụ tính</span>
            <h2 className="text-xl sm:text-2xl font-bold">Lương Gross ↔ Net & Thuế TNCN 2026</h2>
          </div>
        </div>
        <p className="text-blue-100/90 text-sm max-w-2xl mt-1">
          Giảm trừ gia cảnh {formatMillions(SALARY_RULES.personalDeduction)} / người phụ thuộc{' '}
          {formatMillions(SALARY_RULES.dependentDeduction)}, biểu thuế lũy tiến 5 bậc, trần đóng BHXH theo lương cơ sở{' '}
          {formatVND(SALARY_RULES.baseSalary)}.
        </p>
      </div>

      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-5 space-y-6">
          {/* Mode */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl">
            {([
              ['gross-to-net', 'Gross → Net'],
              ['net-to-gross', 'Net → Gross'],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  mode === value ? 'bg-white text-blue-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* Salary */}
          <div>
            <label htmlFor="salary-input" className="text-xs font-semibold text-slate-700 block mb-1.5">
              {inputLabel}
            </label>
            <div className="relative">
              <input
                id="salary-input"
                type="text"
                inputMode="numeric"
                value={salary.toLocaleString('vi-VN')}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '');
                  setSalary(Math.min(Number(digits || 0), 10_000_000_000));
                }}
                className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-blue-700 focus:outline-none focus:border-blue-500"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">₫</span>
            </div>
            <input
              type="range"
              min={5_000_000}
              max={150_000_000}
              step={500_000}
              value={Math.min(Math.max(salary, 5_000_000), 150_000_000)}
              onChange={(e) => setSalary(Number(e.target.value))}
              aria-label={inputLabel}
              className="w-full h-2 mt-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>5 triệu</span>
              <span>75 triệu</span>
              <span>150 triệu</span>
            </div>
          </div>

          {/* Dependents */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-600" /> Số người phụ thuộc
              </span>
              <span className="text-sm font-bold text-slate-800">{dependents} người</span>
            </div>
            <div className="flex items-center gap-2">
              {[0, 1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setDependents(num)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${
                    dependents === num
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Mỗi người phụ thuộc được giảm trừ {formatVND(SALARY_RULES.dependentDeduction)}/tháng.
            </span>
          </div>

          {/* Region */}
          <div>
            <span className="text-xs font-semibold text-slate-700 block mb-1.5">Vùng lương tối thiểu</span>
            <div className="grid grid-cols-4 gap-2">
              {([1, 2, 3, 4] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRegion(r)}
                  className={`py-2 text-xs rounded-lg border transition-all ${
                    region === r
                      ? 'bg-blue-50 border-blue-500 text-blue-800 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {REGION_LABELS[r]}
                </button>
              ))}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Vùng chỉ ảnh hưởng mức trần đóng BHTN (khi lương trên{' '}
              {formatMillions(SALARY_RULES.regionalMinimumWage[region] * SALARY_RULES.insuranceCapMultiplier)}).
            </span>
          </div>

          {/* Quick presets */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-medium block mb-2">Mức lương phổ biến:</span>
            <div className="flex flex-wrap gap-2">
              {[10_000_000, 15_000_000, 20_000_000, 25_000_000, 30_000_000, 50_000_000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setSalary(amt)}
                  className="text-xs py-1.5 px-3 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-md font-medium transition-colors"
                >
                  {amt / 1_000_000} triệu
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          {/* Main Result Card */}
          <div className="p-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl text-white shadow-lg flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-emerald-100 font-semibold block">
                {mode === 'gross-to-net' ? 'Lương Net thực nhận mỗi tháng' : 'Cần thỏa thuận lương Gross tối thiểu'}
              </span>
              <span className="text-3xl sm:text-4xl font-extrabold mt-1 block">
                {formatVND(mode === 'gross-to-net' ? result.netSalary : result.grossSalary)}
              </span>
              <span className="text-xs text-emerald-100 mt-1 block">
                {mode === 'gross-to-net'
                  ? `Tương đương ${netPercent}% lương Gross`
                  : `Để thực nhận ${formatVND(result.netSalary)} mỗi tháng`}
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
          </div>

          {/* Visual Bar Breakdown */}
          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-2 font-medium">
              <span>Lương Gross {formatVND(result.grossSalary)} được chia thành:</span>
            </div>
            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div style={{ width: `${netPercent}%` }} className="bg-emerald-500 h-full transition-all" />
              <div style={{ width: `${insurancePercent}%` }} className="bg-blue-500 h-full transition-all" />
              <div style={{ width: `${taxPercent}%` }} className="bg-amber-500 h-full transition-all" />
            </div>
            <div className="flex flex-wrap justify-between gap-2 text-[11px] text-slate-500 mt-2">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Net ({netPercent}%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Bảo hiểm ({insurancePercent}%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Thuế TNCN ({taxPercent}%)
              </span>
            </div>
          </div>

          {/* Detailed Deductions Table */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2.5">
            <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 text-slate-700 py-1 border-b border-slate-200 font-semibold">
              <span>Khoản mục</span>
              <span>Quy định</span>
              <span className="text-right min-w-[110px]">Số tiền</span>
            </div>
            <Row label="Lương Gross" rule="" amount={formatVND(result.grossSalary)} />
            <Row label="BH xã hội (BHXH)" rule="8%" amount={`-${formatVND(result.socialInsurance)}`} />
            <Row label="BH y tế (BHYT)" rule="1,5%" amount={`-${formatVND(result.healthInsurance)}`} />
            <Row label="BH thất nghiệp (BHTN)" rule="1%" amount={`-${formatVND(result.unemploymentInsurance)}`} />
            <Row label="Thu nhập trước thuế" rule="" amount={formatVND(result.incomeBeforeTax)} strong />
            <Row
              label="Giảm trừ bản thân"
              rule={formatMillions(result.personalDeduction)}
              amount={formatVND(result.personalDeduction)}
            />
            {result.dependentDeduction > 0 && (
              <Row
                label={`Giảm trừ người phụ thuộc (${dependents} người)`}
                rule={`${formatMillions(SALARY_RULES.dependentDeduction)}/người`}
                amount={formatVND(result.dependentDeduction)}
              />
            )}
            <Row label="Thu nhập tính thuế" rule="" amount={formatVND(result.taxableIncome)} strong />
            {result.taxBreakdown.map((b, idx) => (
              <Row
                key={b.rate}
                label={`Bậc ${idx + 1}: ${
                  b.to === Infinity
                    ? `trên ${formatMillions(b.from)}`
                    : `${formatMillions(b.from)} – ${formatMillions(b.to)}`
                }`}
                rule={formatPercent(b.rate)}
                amount={formatVND(b.tax)}
                muted
              />
            ))}
            <Row
              label="Thuế thu nhập cá nhân"
              rule="Lũy tiến"
              amount={`-${formatVND(result.personalIncomeTax)}`}
              strong
            />
            <Row label="Lương Net thực nhận" rule="" amount={formatVND(result.netSalary)} strong />
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Kết quả mang tính tham khảo cho người lao động cư trú, ký hợp đồng từ 3 tháng trở lên, toàn bộ lương đóng
            bảo hiểm. Thực tế có thể khác nếu công ty đóng bảo hiểm trên mức lương thấp hơn, hoặc bạn có phụ cấp được
            miễn thuế (ăn trưa, điện thoại...).
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  rule,
  amount,
  strong,
  muted,
}: {
  label: string;
  rule: string;
  amount: string;
  strong?: boolean;
  muted?: boolean;
}) {
  const tone = strong
    ? 'text-slate-900 font-semibold pt-1 border-t border-slate-200'
    : muted
      ? 'text-slate-400 pl-3'
      : 'text-slate-600';
  return (
    <div className={`grid grid-cols-[1fr_auto_auto] gap-x-4 ${tone}`}>
      <span>{label}</span>
      <span>{rule}</span>
      <span className="font-mono text-right min-w-[110px]">{amount}</span>
    </div>
  );
}
