'use client';

import React from 'react';
import { Sliders, Zap, RotateCcw, AlertTriangle } from 'lucide-react';
import { useSimulation, ScenarioPresetKey } from '@/lib/depositguard/context';
import { trackEvent } from '@/lib/depositguard/telemetry';

export default function WhatIfControls() {
  const {
    stress,
    activePreset,
    applyPreset,
    updateStress,
    resetStressScenario,
    loan,
  } = useSimulation();

  const handleRateShock = (shockPp: number) => {
    updateStress({ rateShockPp: shockPp });
    trackEvent('whatif_rate_shock_toggled', { shock_pp: shockPp });
  };

  const handleIncomeShock = (shockPercent: number, durationMonths: number) => {
    updateStress({
      incomeShockPercent: shockPercent,
      incomeShockDurationMonths: durationMonths,
      incomeShockStartMonth: loan.promoPeriodMonths + 1,
    });
    trackEvent('whatif_income_shock_toggled', {
      shock_percent: shockPercent,
      duration_months: durationMonths,
    });
  };

  const handleExpenseShock = (shockPercent: number) => {
    updateStress({ expenseShockPercent: shockPercent });
  };

  const presets: { id: ScenarioPresetKey; label: string; desc: string }[] = [
    { id: 'BASE', label: 'Cơ sở', desc: 'Lãi suất thả nổi dự kiến ban đầu' },
    { id: 'RATE_SHOCK_2PP', label: '+2% Lãi suất', desc: 'Thị trường biến động tăng lãi suất' },
    { id: 'RATE_SHOCK_4PP', label: '+4% Lãi suất', desc: 'Kỳ chu kỳ thắt chặt tiền tệ mạnh' },
    { id: 'INCOME_SHOCK_3M', label: '-20% Thu nhập (3T)', desc: 'Mất việc hoặc giảm lương tạm thời' },
    { id: 'INCOME_SHOCK_6M', label: '-20% Thu nhập (6T)', desc: 'Gián đoạn kinh doanh kéo dài' },
    { id: 'EXTREME_STRESS', label: 'Căng thẳng kép', desc: '+2% lãi + giảm thu nhập + tăng chi phí' },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 text-blue-800 font-semibold text-xs tracking-wider uppercase mb-0.5">
            <Sliders className="w-4 h-4" /> Bảng Điều Khiển Căng Thẳng (What-If Controls)
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Kiểm tra sức bền dòng tiền trước các cú sốc bất ngờ
          </h2>
        </div>

        <button
          type="button"
          onClick={resetStressScenario}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Khôi phục kịch bản cơ sở
        </button>
      </div>

      {/* Preset Chips */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-700 block">
          Chọn nhanh kịch bản thị trường mô phỏng:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {presets.map((p) => {
            const isSelected = activePreset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-blue-700 bg-blue-50 text-slate-900 ring-1 ring-blue-700/30 shadow-2xs font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs">{p.label}</span>
                  {isSelected && <Zap className="w-3 h-3 text-blue-700 shrink-0" />}
                </div>
                <p className="text-[10px] font-normal text-slate-500 leading-tight line-clamp-2">
                  {p.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Individual Stress Levers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {/* Lever 1: Interest Rate Shock */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-800">Cú sốc lãi suất thả nổi</span>
            <span className="text-xs font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">
              +{stress.rateShockPp}% (Tổng: {(loan.postPromoRate + stress.rateShockPp).toFixed(1)}%)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Mô phỏng chu kỳ ngân hàng nhà nước tăng trần lãi suất huy động khiến lãi suất thả nổi tăng vọt.
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {[0, 2, 4].map((shock) => (
              <button
                key={shock}
                type="button"
                onClick={() => handleRateShock(shock)}
                className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                  stress.rateShockPp === shock
                    ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                +{shock}%
              </button>
            ))}
          </div>
        </div>

        {/* Lever 2: Income Shock */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-800">Cú sốc thu nhập</span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                stress.incomeShockPercent < 0
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {stress.incomeShockPercent === 0
                ? 'Không giảm'
                : `${stress.incomeShockPercent}% (${stress.incomeShockDurationMonths}T)`}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Mô phỏng trường hợp một thành viên mất việc hoặc giảm thưởng kinh doanh ngay khi hết ưu đãi lãi suất.
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleIncomeShock(0, 0)}
              className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                stress.incomeShockPercent === 0
                  ? 'bg-blue-700 text-white border-blue-700 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              0%
            </button>
            <button
              type="button"
              onClick={() => handleIncomeShock(-20, 3)}
              className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                stress.incomeShockPercent === -20 && stress.incomeShockDurationMonths === 3
                  ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              -20% (3T)
            </button>
            <button
              type="button"
              onClick={() => handleIncomeShock(-20, 6)}
              className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                stress.incomeShockPercent === -20 && stress.incomeShockDurationMonths === 6
                  ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              -20% (6T)
            </button>
          </div>
        </div>

        {/* Lever 3: Expense Shock */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-800">Cú sốc chi phí sinh hoạt</span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                stress.expenseShockPercent > 0
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              +{stress.expenseShockPercent}%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Mô phỏng tác động lạm phát hoặc sinh thêm con nhỏ, chi phí y tế phát sinh ngoài dự kiến.
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => handleExpenseShock(0)}
              className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                stress.expenseShockPercent === 0
                  ? 'bg-blue-700 text-white border-blue-700 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Bình thường (0%)
            </button>
            <button
              type="button"
              onClick={() => handleExpenseShock(10)}
              className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                stress.expenseShockPercent === 10
                  ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Lạm phát (+10%)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
