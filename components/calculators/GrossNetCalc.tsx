'use client';

import React, { useState, useMemo } from 'react';
import { calculateGrossToNet, formatVND, formatCompactVND } from '@/lib/finance-math';
import { Wallet, ShieldCheck, Users, HelpCircle, ArrowDown } from 'lucide-react';

export default function GrossNetCalc() {
  const [grossSalary, setGrossSalary] = useState<number>(20_000_000); // 20M Gross
  const [dependents, setDependents] = useState<number>(0);
  const [region, setRegion] = useState<1 | 2 | 3 | 4>(1);

  const result = useMemo(() => {
    return calculateGrossToNet({
      grossSalary,
      dependents,
      region,
    });
  }, [grossSalary, dependents, region]);

  const insurancePercent = ((result.totalInsurance / result.grossSalary) * 100).toFixed(1);
  const taxPercent = ((result.personalIncomeTax / result.grossSalary) * 100).toFixed(1);
  const netPercent = ((result.netSalary / result.grossSalary) * 100).toFixed(1);

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
            <h2 className="text-xl sm:text-2xl font-bold">Lương Gross sang Net & Thuế TNCN</h2>
          </div>
        </div>
        <p className="text-blue-100/90 text-sm max-w-2xl mt-1">
          Quy chuẩn chính xác theo luật bảo hiểm và biểu thuế thu nhập cá nhân 2026 tại Việt Nam.
        </p>
      </div>

      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-5 space-y-6">
          {/* Gross Salary */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700">Mức lương Gross (Hàng tháng)</label>
              <span className="text-sm font-bold text-blue-700">{formatVND(grossSalary)}</span>
            </div>
            <input
              type="range"
              min={5_000_000}
              max={100_000_000}
              step={1_000_000}
              value={grossSalary}
              onChange={(e) => setGrossSalary(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>5 triệu</span>
              <span>50 triệu</span>
              <span>100 triệu</span>
            </div>
          </div>

          {/* Dependents */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-600" /> Số người phụ thuộc
              </label>
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
                  {num === 4 ? '4+' : num}
                </button>
              ))}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Mỗi người phụ thuộc giảm trừ 4.400.000 ₫/tháng vào thu nhập tính thuế.
            </span>
          </div>

          {/* Region */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">Khu vực làm việc</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRegion(1)}
                className={`py-2 px-3 text-xs rounded-lg border text-left transition-all ${
                  region === 1
                    ? 'bg-blue-50 border-blue-500 text-blue-800 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Vùng 1 (Hà Nội, TP.HCM,...)
              </button>
              <button
                type="button"
                onClick={() => setRegion(2)}
                className={`py-2 px-3 text-xs rounded-lg border text-left transition-all ${
                  region === 2
                    ? 'bg-blue-50 border-blue-500 text-blue-800 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Vùng 2, 3, 4 (Các tỉnh khác)
              </button>
            </div>
          </div>

          {/* Quick presets */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-medium block mb-2">Mức lương phổ biến:</span>
            <div className="flex flex-wrap gap-2">
              {[12_000_000, 15_000_000, 25_000_000, 35_000_000, 50_000_000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setGrossSalary(amt)}
                  className="text-xs py-1.5 px-3 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-md font-medium transition-colors"
                >
                  {amt / 1_000_000} triệu
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          {/* Main Net Result Card */}
          <div className="p-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl text-white shadow-lg flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-emerald-100 font-semibold block">
                Lương Net thực nhận mỗi tháng
              </span>
              <span className="text-3xl sm:text-4xl font-extrabold mt-1 block">
                {formatVND(result.netSalary)}
              </span>
              <span className="text-xs text-emerald-100 mt-1 block">
                Tương đương {netPercent}% so với mức Gross ban đầu
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
          </div>

          {/* Visual Bar Breakdown */}
          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-2 font-medium">
              <span>Cơ cấu phân bổ lương Gross:</span>
              <span>100%</span>
            </div>
            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${netPercent}%` }}
                className="bg-blue-600 h-full transition-all"
                title={`Net: ${netPercent}%`}
              />
              <div
                style={{ width: `${insurancePercent}%` }}
                className="bg-blue-500 h-full transition-all"
                title={`Bảo hiểm: ${insurancePercent}%`}
              />
              <div
                style={{ width: `${taxPercent}%` }}
                className="bg-amber-500 h-full transition-all"
                title={`Thuế: ${taxPercent}%`}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 mt-2">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Net ({netPercent}%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Bảo hiểm 10.5% ({insurancePercent}%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Thuế TNCN ({taxPercent}%)
              </span>
            </div>
          </div>

          {/* Detailed Deductions Table */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2.5">
            <div className="flex justify-between text-slate-700 py-1 border-b border-slate-200 font-semibold">
              <span>Khoản mục</span>
              <span>Tỷ lệ / Quy định</span>
              <span>Số tiền</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>1. BH Xã hội (BHXH)</span>
              <span>8.0%</span>
              <span className="font-mono">{formatVND(result.socialInsurance)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>2. BH Y tế (BHYT)</span>
              <span>1.5%</span>
              <span className="font-mono">{formatVND(result.healthInsurance)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>3. BH Thất nghiệp (BHTN)</span>
              <span>1.0%</span>
              <span className="font-mono">{formatVND(result.unemploymentInsurance)}</span>
            </div>
            <div className="flex justify-between text-slate-800 font-medium pt-1 border-t border-slate-200">
              <span>Tổng bảo hiểm đóng</span>
              <span>10.5%</span>
              <span className="font-mono text-blue-700 font-bold">-{formatVND(result.totalInsurance)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Giảm trừ gia cảnh bản thân</span>
              <span>Cố định</span>
              <span className="font-mono">11.000.000 ₫</span>
            </div>
            {result.dependentDeduction > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Giảm trừ người phụ thuộc ({dependents} người)</span>
                <span>4.4tr/người</span>
                <span className="font-mono">{formatVND(result.dependentDeduction)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-800 font-medium pt-1 border-t border-slate-200">
              <span>Thuế thu nhập cá nhân (TNCN)</span>
              <span>Lũy tiến</span>
              <span className="font-mono text-amber-700 font-bold">-{formatVND(result.personalIncomeTax)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
