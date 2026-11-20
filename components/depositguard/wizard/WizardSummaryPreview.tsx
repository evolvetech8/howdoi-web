'use client';

import React from 'react';
import { TrendingUp, AlertTriangle, CheckCircle2, PieChart, Landmark } from 'lucide-react';
import { useSimulation } from '@/lib/depositguard/context';
import { formatVND, formatPercent } from '@/lib/depositguard/formatters';
import RiskBadge from '../common/RiskBadge';

export default function WizardSummaryPreview() {
  const { simulationResult, loan } = useSimulation();

  const isAnnuity = loan.repaymentMethod === 'ANNUITY';

  // Live Loan-to-Value (LTV) & Debt-to-Income (DTI) percentages for animated progress meters
  const ltvPercent =
    loan.propertyPrice > 0
      ? Math.min(100, Math.max(0, (loan.loanAmount / loan.propertyPrice) * 100))
      : 0;

  const month1DtiPercent =
    simulationResult.month1DtiRatio !== null
      ? Math.min(100, Math.max(0, simulationResult.month1DtiRatio * 100))
      : 0;

  const postPromoDtiPercent =
    simulationResult.postPromoDtiRatio !== null
      ? Math.min(100, Math.max(0, simulationResult.postPromoDtiRatio * 100))
      : 0;

  const ltvBarColor =
    ltvPercent <= 70
      ? 'bg-blue-500'
      : ltvPercent <= 80
      ? 'bg-amber-400'
      : 'bg-rose-500';

  const postPromoDtiBarColor =
    postPromoDtiPercent <= 40
      ? 'bg-emerald-500'
      : postPromoDtiPercent <= 50
      ? 'bg-amber-400'
      : 'bg-rose-500';

  return (
    <div className="bg-[#0B1D30] text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-lg space-y-5 transition-all duration-300">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-800/90 pb-3.5">
        <div>
          <span className="font-mono text-[11px] font-bold text-blue-400 uppercase tracking-widest block">
            Xem trước nghĩa vụ trả nợ
          </span>
          <p className="text-sm text-slate-300 mt-0.5">
            Dựa trên gói vay {isAnnuity ? 'Trả góp đều' : 'Dư nợ giảm dần'} {loan.loanTermMonths / 12} năm
          </p>
        </div>
        <RiskBadge status={simulationResult.affordabilityStatus} size="sm" />
      </div>

      {/* Primary Month 1 vs Post-Promo Payment Comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Month 1 Payment */}
        <div className="bg-slate-900/75 p-4 rounded-xl border border-slate-800 transition-all duration-300">
          <span className="text-[11px] text-slate-400 block font-medium">
            Tiền trả nợ Tháng 1 (Giai đoạn ưu đãi):
          </span>
          <span className="font-mono tabular-nums text-xl sm:text-2xl font-black text-white block mt-1 tracking-tight">
            {formatVND(simulationResult.month1Payment)}
            <span className="font-sans text-xs font-normal text-slate-400 ml-1">/tháng</span>
          </span>
          <span className="font-mono tabular-nums text-[11px] text-blue-400 mt-1.5 block">
            Lãi suất ưu đãi: {loan.promoInterestRate}%/năm
          </span>
        </div>

        {/* Post-promo Payment Jump */}
        <div className="bg-slate-900/75 p-4 rounded-xl border border-slate-800 transition-all duration-300">
          <span className="text-[11px] text-slate-400 block font-medium">
            Tiền trả nợ từ Tháng {simulationResult.postPromoMonth} (Hết ưu đãi):
          </span>
          <span className="font-mono tabular-nums text-xl sm:text-2xl font-black text-amber-400 block mt-1 tracking-tight">
            {formatVND(simulationResult.postPromoPayment)}
            <span className="font-sans text-xs font-normal text-slate-400 ml-1">/tháng</span>
          </span>
          <span className="font-mono tabular-nums text-[11px] text-rose-400 font-semibold mt-1.5 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 inline shrink-0" />
            Tăng +{formatVND(simulationResult.paymentJumpAmount)} ({formatPercent(simulationResult.paymentJumpPercentage, 1)})
          </span>
        </div>
      </div>

      {/* Live Visual Loan-to-Value (LTV) & Debt-to-Income (DTI) Progress Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800/90">
        {/* LTV Progress Meter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5 text-blue-400" />
              Tỷ lệ Vay / Giá BĐS (LTV)
            </span>
            <span className="font-mono tabular-nums font-bold text-blue-300">
              {formatPercent(ltvPercent, 1)}
            </span>
          </div>
          <div className="relative w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`${ltvBarColor} h-full rounded-full transition-all duration-500 ease-out`}
              style={{ width: `${ltvPercent}%` }}
            />
            {/* 70% Safe LTV Threshold Marker */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white/50"
              style={{ left: '70%' }}
              title="Ngưỡng vay an toàn khuyến nghị 70%"
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>Vốn tự có: {formatPercent(Math.max(0, 100 - ltvPercent), 1)}</span>
            <span>Chuẩn an toàn ≤ 70%</span>
          </div>
        </div>

        {/* DTI Progress Meter (Month 1 vs Floating) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <PieChart className="w-3.5 h-3.5 text-blue-400" />
              Áp lực Trả nợ / Thu nhập (DTI)
            </span>
            <span className="font-mono tabular-nums font-bold text-amber-300">
              {simulationResult.month1DtiRatio !== null
                ? `${formatPercent(month1DtiPercent, 1)} → ${formatPercent(postPromoDtiPercent, 1)}`
                : 'N/A'}
            </span>
          </div>
          <div className="relative w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            {/* Post-Promo Floating DTI Bar */}
            <div
              className={`${postPromoDtiBarColor} h-full rounded-full transition-all duration-500 ease-out`}
              style={{ width: `${postPromoDtiPercent}%` }}
            />
            {/* Month 1 Promo DTI Overlay Marker */}
            <div
              className="absolute top-0 bottom-0 left-0 bg-blue-500/80 rounded-l-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(month1DtiPercent, postPromoDtiPercent)}%` }}
            />
            {/* 40% Safe DTI Threshold Marker */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white/60"
              style={{ left: '40%' }}
              title="Ngưỡng DTI an toàn 40%"
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>Ưu đãi vs Thả nổi</span>
            <span>Ngưỡng an toàn ≤ 40%</span>
          </div>
        </div>
      </div>

      {/* Cash Flow Deficit Warning or Confirmation */}
      <div className="pt-0.5 text-xs">
        {simulationResult.firstNegativeCashFlowMonth ? (
          <div className="flex items-start gap-2.5 text-rose-300 bg-rose-950/60 p-3 rounded-xl border border-rose-800/80 transition-all duration-300">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="font-bold text-rose-200">Cảnh báo điểm rơi âm:</strong> Dòng tiền hàng tháng sẽ bị thâm hụt bắt đầu từ{' '}
              <span className="underline font-bold font-mono tabular-nums">Tháng {simulationResult.firstNegativeCashFlowMonth}</span> khi lãi suất ưu đãi chuyển sang lãi suất thả nổi {loan.postPromoRate}%.
            </p>
          </div>
        ) : (
          <div className="flex items-start gap-2.5 text-emerald-200 bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/80 transition-all duration-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Dòng tiền hàng tháng duy trì thặng dư dương trong toàn bộ chu kỳ 240 tháng ở kịch bản cơ sở.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
