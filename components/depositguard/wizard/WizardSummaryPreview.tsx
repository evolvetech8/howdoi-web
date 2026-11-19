'use client';

import React from 'react';
import { TrendingUp, AlertTriangle, CheckCircle2, Calendar } from 'lucide-react';
import { useSimulation } from '@/lib/depositguard/context';
import { formatVND, formatPercent } from '@/lib/depositguard/formatters';
import RiskBadge from '../common/RiskBadge';

export default function WizardSummaryPreview() {
  const { simulationResult, loan } = useSimulation();

  const isAnnuity = loan.repaymentMethod === 'ANNUITY';

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-lg space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-800 pb-3">
        <div>
          <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block">
            Xem trước nghĩa vụ trả nợ
          </span>
          <p className="text-sm text-slate-300">
            Dựa trên gói vay {isAnnuity ? 'Trả góp đều' : 'Dư nợ giảm dần'} {loan.loanTermMonths / 12} năm
          </p>
        </div>
        <RiskBadge status={simulationResult.affordabilityStatus} size="sm" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Month 1 Payment */}
        <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80">
          <span className="text-[11px] text-slate-400 block font-medium">
            Tiền trả nợ Tháng 1 (Giai đoạn ưu đãi):
          </span>
          <span className="text-xl sm:text-2xl font-black text-white block mt-0.5 tracking-tight">
            {formatVND(simulationResult.month1Payment)}
            <span className="text-xs font-normal text-slate-400 ml-1">/tháng</span>
          </span>
          <span className="text-[11px] text-blue-400 mt-1 block">
            Lãi suất ưu đãi: {loan.promoInterestRate}%/năm
          </span>
        </div>

        {/* Post-promo Payment Jump */}
        <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80">
          <span className="text-[11px] text-slate-400 block font-medium">
            Tiền trả nợ từ Tháng {simulationResult.postPromoMonth} (Hết ưu đãi):
          </span>
          <span className="text-xl sm:text-2xl font-black text-amber-400 block mt-0.5 tracking-tight">
            {formatVND(simulationResult.postPromoPayment)}
            <span className="text-xs font-normal text-slate-400 ml-1">/tháng</span>
          </span>
          <span className="text-[11px] text-rose-400 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 inline" />
            Tăng +{formatVND(simulationResult.paymentJumpAmount)} ({formatPercent(simulationResult.paymentJumpPercentage, 1)})
          </span>
        </div>
      </div>

      {/* Cash Flow Deficit Warning or Confirmation */}
      <div className="pt-1 text-xs">
        {simulationResult.firstNegativeCashFlowMonth ? (
          <div className="flex items-start gap-2 text-rose-300 bg-rose-950/60 p-2.5 rounded-xl border border-rose-800/80">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="font-bold text-rose-200">Cảnh báo điểm rơi âm:</strong> Dòng tiền hàng tháng sẽ bị thâm hụt bắt đầu từ{' '}
              <span className="underline font-bold">Tháng {simulationResult.firstNegativeCashFlowMonth}</span> khi lãi suất ưu đãi chuyển sang lãi suất thả nổi {loan.postPromoRate}%.
            </p>
          </div>
        ) : (
          <div className="flex items-start gap-2 text-blue-300 bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-800/80">
            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Dòng tiền hàng tháng duy trì thặng dư dương trong toàn bộ chu kỳ 240 tháng ở kịch bản cơ sở.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
