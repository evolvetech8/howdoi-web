'use client';

import React from 'react';
import {
  Wallet,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  Shield,
  PieChart,
  CheckCircle,
} from 'lucide-react';
import { useSimulation } from '@/lib/depositguard/context';
import { formatVND, formatCompactVND, formatPercent } from '@/lib/depositguard/formatters';

export default function MetricCards() {
  const { simulationResult, household, loan } = useSimulation();

  const m1OperatingCashFlow = simulationResult.schedule[0]?.operatingCashFlow ?? 0;
  const firstDeficitItem = simulationResult.firstNegativeCashFlowMonth
    ? simulationResult.schedule[simulationResult.firstNegativeCashFlowMonth - 1]
    : null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          6 Chỉ Số Rủi Ro Tài Chính Trọng Yếu
        </h2>
        <span className="text-xs text-slate-500 hidden sm:inline">
          Dựa trên thu nhập {formatCompactVND(household.monthlyNetIncome)} & gói vay {formatCompactVND(loan.loanAmount)}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Upfront Cash & Liquid Buffer */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Vốn Tự Có & Tiền Mặt Ban Đầu
              </span>
              <Wallet className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatVND(simulationResult.upfrontCashRequired)}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Tiền tiết kiệm còn lại sau mua:</span>
              <span
                className={`font-bold ${
                  simulationResult.initialReserveBalance >= (household.plannedEmergencyReserveFloor || 0)
                    ? 'text-emerald-700'
                    : simulationResult.initialReserveBalance >= 0
                    ? 'text-amber-700'
                    : 'text-rose-600'
                }`}
              >
                {formatVND(simulationResult.initialReserveBalance)}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Vốn tự có cần thanh toán cho chủ nhà hoặc chủ đầu tư tại thời điểm ký hợp đồng.
            </p>
          </div>
        </div>

        {/* Card 2: Month 1 Debt Service & Free Cash Flow */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Tiền Trả Nợ Tháng 1
              </span>
              <CreditCard className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatVND(simulationResult.month1Payment)}
              <span className="text-xs font-normal text-slate-400 ml-1">/tháng</span>
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Dòng tiền dư sau sinh hoạt:</span>
              <span
                className={`font-bold ${
                  m1OperatingCashFlow > 0 ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {m1OperatingCashFlow >= 0 ? '+' : ''}
                {formatVND(m1OperatingCashFlow)}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Áp dụng mức lãi suất ưu đãi ban đầu {loan.promoInterestRate}%/năm.
            </p>
          </div>
        </div>

        {/* Card 3: Post-promo Payment Jump */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Bật Tăng Lãi Suất Thả Nổi
              </span>
              <TrendingUp className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 tracking-tight">
              {formatVND(simulationResult.postPromoPayment)}
              <span className="text-xs font-normal text-slate-400 ml-1">/tháng</span>
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Mức chênh lệch sau ưu đãi:</span>
              <span className="font-bold text-rose-600">
                +{formatCompactVND(simulationResult.paymentJumpAmount)} ({formatPercent(simulationResult.paymentJumpPercentage, 1)})
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Bắt đầu từ Tháng {simulationResult.postPromoMonth} khi áp dụng lãi thả nổi {loan.postPromoRate}%/năm.
            </p>
          </div>
        </div>

        {/* Card 4: First Cash-Flow Deficit Month */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Điểm Rơi Thâm Hụt Dòng Tiền
              </span>
              {simulationResult.firstNegativeCashFlowMonth ? (
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              ) : (
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              )}
            </div>
            <p
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                simulationResult.firstNegativeCashFlowMonth
                  ? 'text-rose-600'
                  : 'text-emerald-700'
              }`}
            >
              {simulationResult.firstNegativeCashFlowMonth
                ? `Tháng ${simulationResult.firstNegativeCashFlowMonth}`
                : 'Không có tháng âm'}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Mức thâm hụt tháng đầu tiên:</span>
              <span className="font-bold text-rose-600">
                {firstDeficitItem ? formatVND(firstDeficitItem.operatingCashFlow) : '0 ₫'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {simulationResult.firstNegativeCashFlowMonth
                ? 'Tháng đầu tiên thu nhập không đủ bù đắp chi phí sinh hoạt và nợ vay.'
                : 'Dòng tiền gia đình thặng dư xuyên suốt toàn bộ thời hạn vay.'}
            </p>
          </div>
        </div>

        {/* Card 5: Lowest Reserve Balance */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Đáy Quỹ Dự Phòng Khẩn Cấp
              </span>
              <Shield className="w-4 h-4 text-emerald-600" />
            </div>
            <p
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                simulationResult.lowestReserveBalance >= (household.plannedEmergencyReserveFloor || 0)
                  ? 'text-emerald-700'
                  : simulationResult.lowestReserveBalance >= 0
                  ? 'text-amber-700'
                  : 'text-rose-600'
              }`}
            >
              {formatCompactVND(simulationResult.lowestReserveBalance)}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Chạm đáy tại thời điểm:</span>
              <span className="font-bold text-slate-700">
                Tháng {simulationResult.lowestReserveMonth} (Năm {Math.ceil(simulationResult.lowestReserveMonth / 12)})
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Ngưỡng tối thiểu cần bảo vệ: {formatCompactVND(household.plannedEmergencyReserveFloor || 0)}.
            </p>
          </div>
        </div>

        {/* Card 6: DTI (Debt-Service-to-Income) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Tỷ Lệ Trả Nợ / Thu Nhập (DTI)
              </span>
              <PieChart className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {simulationResult.month1DtiRatio !== null
                  ? `${formatPercent(simulationResult.month1DtiRatio * 100, 1)}`
                  : 'N/A'}
              </p>
              {simulationResult.postPromoDtiRatio !== null && (
                <span className="text-xs font-bold text-amber-700">
                  → {formatPercent(simulationResult.postPromoDtiRatio * 100, 1)} (Thả nổi)
                </span>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Khuyến nghị chuyên gia tài chính:</span>
              <span
                className={`font-bold ${
                  (simulationResult.postPromoDtiRatio ?? 0) <= 0.4
                    ? 'text-emerald-700'
                    : (simulationResult.postPromoDtiRatio ?? 0) <= 0.5
                    ? 'text-amber-700'
                    : 'text-rose-600'
                }`}
              >
                {(simulationResult.postPromoDtiRatio ?? 0) <= 0.4
                  ? 'An toàn (≤ 40%)'
                  : (simulationResult.postPromoDtiRatio ?? 0) <= 0.5
                  ? 'Cần chú ý (40-50%)'
                  : 'Rủi ro cao (> 50%)'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Đo lường áp lực chi trả thực tế của dòng tiền gia đình, không phải điều kiện duyệt vay ngân hàng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
