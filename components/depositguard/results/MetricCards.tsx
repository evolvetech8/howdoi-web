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

  // Safe micro-progress bar calculations (strictly finite 0..100, guarding zero division)
  const reserveFloor = household.plannedEmergencyReserveFloor || 0;
  const totalSavings = Math.max(1, household.liquidSavings || 0);
  const upfrontSharePercent =
    household.liquidSavings > 0
      ? Math.min(100, Math.max(0, (simulationResult.upfrontCashRequired / totalSavings) * 100))
      : 100;

  const m1DebtSharePercent =
    household.monthlyNetIncome > 0
      ? Math.min(100, Math.max(0, (simulationResult.month1Payment / household.monthlyNetIncome) * 100))
      : 0;

  const postPromoRatioPercent =
    simulationResult.postPromoPayment > 0
      ? Math.min(
          100,
          Math.max(
            0,
            (simulationResult.month1Payment / Math.max(1, simulationResult.postPromoPayment)) * 100
          )
        )
      : 0;

  const loanTermMonths = Math.max(1, loan.loanTermMonths || 240);
  const survivalTimelinePercent = simulationResult.firstNegativeCashFlowMonth
    ? Math.min(
        100,
        Math.max(4, ((simulationResult.firstNegativeCashFlowMonth - 1) / loanTermMonths) * 100)
      )
    : 100;

  const reserveRetentionPercent =
    household.liquidSavings > 0
      ? Math.min(
          100,
          Math.max(0, (Math.max(0, simulationResult.lowestReserveBalance) / totalSavings) * 100)
        )
      : 0;

  const reserveFloorMarkerPercent =
    household.liquidSavings > 0
      ? Math.min(100, Math.max(0, (reserveFloor / totalSavings) * 100))
      : 0;

  const month1DtiBarPercent =
    simulationResult.month1DtiRatio !== null
      ? Math.min(100, Math.max(0, simulationResult.month1DtiRatio * 100))
      : 0;

  const postPromoDtiBarPercent =
    simulationResult.postPromoDtiRatio !== null
      ? Math.min(100, Math.max(0, simulationResult.postPromoDtiRatio * 100))
      : 0;

  return (
    <div className="space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 pb-3">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-blue-800 block mb-0.5">
            01 / MA TRẬN ĐỊNH LƯỢNG RỦI RO DÒNG TIỀN
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            6 Chỉ Số Rủi Ro Tài Chính Trọng Yếu
          </h2>
        </div>
        <span className="font-mono tabular-nums text-xs text-slate-500 hidden sm:inline">
          Dựa trên thu nhập {formatCompactVND(household.monthlyNetIncome)} & gói vay {formatCompactVND(loan.loanAmount)}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Upfront Cash & Liquid Buffer */}
        <div className="relative overflow-hidden bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300/90 transition-all duration-300 space-y-3.5 flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-700 transition-all duration-300" />
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-slate-400">01</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Vốn Tự Có & Tiền Mặt Ban Đầu
                </span>
              </div>
              <Wallet className="w-4 h-4 text-blue-700" />
            </div>
            <p className="font-mono tabular-nums text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight transition-all duration-300">
              {formatVND(simulationResult.upfrontCashRequired)}
            </p>

            {/* Micro-progress Bar: Upfront Cash vs Total Liquid Savings */}
            <div className="pt-1 space-y-1">
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex">
                <div
                  className="bg-[#0B1D30] h-full transition-all duration-300"
                  style={{ width: `${upfrontSharePercent}%` }}
                />
                <div
                  className={`h-full transition-all duration-300 ${
                    simulationResult.initialReserveBalance >= reserveFloor
                      ? 'bg-blue-600'
                      : simulationResult.initialReserveBalance >= 0
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.max(0, 100 - upfrontSharePercent)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-100 text-xs space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Tiền tiết kiệm còn lại sau mua:</span>
              <span
                className={`font-mono tabular-nums font-bold transition-colors duration-300 ${
                  simulationResult.initialReserveBalance >= reserveFloor
                    ? 'text-blue-800'
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
        <div className="relative overflow-hidden bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300/90 transition-all duration-300 space-y-3.5 flex flex-col justify-between">
          <div
            className={`absolute top-0 left-0 right-0 h-1 transition-all duration-300 ${
              m1OperatingCashFlow > 0 ? 'bg-blue-700' : 'bg-rose-600'
            }`}
          />
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-slate-400">02</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Tiền Trả Nợ Tháng 1
                </span>
              </div>
              <CreditCard className="w-4 h-4 text-blue-700" />
            </div>
            <p className="font-mono tabular-nums text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight transition-all duration-300">
              {formatVND(simulationResult.month1Payment)}
              <span className="font-sans text-xs font-normal text-slate-400 ml-1">/tháng</span>
            </p>

            {/* Micro-progress Bar: Month 1 Debt Allocation */}
            <div className="pt-1 space-y-1">
              <div className="relative w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    m1OperatingCashFlow > 0 ? 'bg-blue-700' : 'bg-rose-600'
                  }`}
                  style={{ width: `${m1DebtSharePercent}%` }}
                />
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-slate-400/70"
                  style={{ left: '40%' }}
                />
              </div>
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-100 text-xs space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Dòng tiền dư sau sinh hoạt:</span>
              <span
                className={`font-mono tabular-nums font-bold transition-colors duration-300 ${
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
        <div className="relative overflow-hidden bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300/90 transition-all duration-300 space-y-3.5 flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500 transition-all duration-300" />
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-slate-400">03</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Bật Tăng Lãi Suất Thả Nổi
                </span>
              </div>
              <TrendingUp className="w-4 h-4 text-amber-600" />
            </div>
            <p className="font-mono tabular-nums text-2xl sm:text-3xl font-extrabold text-amber-600 tracking-tight transition-all duration-300">
              {formatVND(simulationResult.postPromoPayment)}
              <span className="font-sans text-xs font-normal text-slate-400 ml-1">/tháng</span>
            </p>

            {/* Micro-progress Bar: Base Payment vs Floating Jump */}
            <div className="pt-1 space-y-1">
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex">
                <div
                  className="bg-blue-700 h-full transition-all duration-300"
                  style={{ width: `${postPromoRatioPercent}%` }}
                />
                <div
                  className="bg-amber-500 h-full transition-all duration-300"
                  style={{ width: `${Math.max(0, 100 - postPromoRatioPercent)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-100 text-xs space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Mức chênh lệch sau ưu đãi:</span>
              <span className="font-mono tabular-nums font-bold text-rose-600 transition-all duration-300">
                +{formatCompactVND(simulationResult.paymentJumpAmount)} ({formatPercent(simulationResult.paymentJumpPercentage, 1)})
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Bắt đầu từ Tháng {simulationResult.postPromoMonth} khi áp dụng lãi thả nổi {loan.postPromoRate}%/năm.
            </p>
          </div>
        </div>

        {/* Card 4: First Cash-Flow Deficit Month */}
        <div className="relative overflow-hidden bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300/90 transition-all duration-300 space-y-3.5 flex flex-col justify-between">
          <div
            className={`absolute top-0 left-0 right-0 h-1 transition-all duration-300 ${
              simulationResult.firstNegativeCashFlowMonth ? 'bg-rose-600' : 'bg-emerald-600'
            }`}
          />
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-slate-400">04</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Điểm Rơi Thâm Hụt Dòng Tiền
                </span>
              </div>
              {simulationResult.firstNegativeCashFlowMonth ? (
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              ) : (
                <CheckCircle className="w-4 h-4 text-blue-700" />
              )}
            </div>
            <p
              className={`font-mono tabular-nums text-2xl sm:text-3xl font-extrabold tracking-tight transition-colors duration-300 ${
                simulationResult.firstNegativeCashFlowMonth
                  ? 'text-rose-600'
                  : 'text-emerald-700'
              }`}
            >
              {simulationResult.firstNegativeCashFlowMonth
                ? `Tháng ${simulationResult.firstNegativeCashFlowMonth}`
                : 'Không có tháng âm'}
            </p>

            {/* Micro-progress Bar: Cash-Flow Survival Horizon */}
            <div className="pt-1 space-y-1">
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    simulationResult.firstNegativeCashFlowMonth
                      ? 'bg-rose-500'
                      : 'bg-emerald-600'
                  }`}
                  style={{ width: `${survivalTimelinePercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-100 text-xs space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Mức thâm hụt tháng đầu tiên:</span>
              <span className="font-mono tabular-nums font-bold text-rose-600 transition-all duration-300">
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
        <div className="relative overflow-hidden bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300/90 transition-all duration-300 space-y-3.5 flex flex-col justify-between">
          <div
            className={`absolute top-0 left-0 right-0 h-1 transition-all duration-300 ${
              simulationResult.lowestReserveBalance >= reserveFloor
                ? 'bg-blue-700'
                : simulationResult.lowestReserveBalance >= 0
                ? 'bg-amber-500'
                : 'bg-rose-600'
            }`}
          />
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-slate-400">05</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Đáy Quỹ Dự Phòng Khẩn Cấp
                </span>
              </div>
              <Shield className="w-4 h-4 text-blue-700" />
            </div>
            <p
              className={`font-mono tabular-nums text-2xl sm:text-3xl font-extrabold tracking-tight transition-colors duration-300 ${
                simulationResult.lowestReserveBalance >= reserveFloor
                  ? 'text-blue-800'
                  : simulationResult.lowestReserveBalance >= 0
                  ? 'text-amber-700'
                  : 'text-rose-600'
              }`}
            >
              {formatCompactVND(simulationResult.lowestReserveBalance)}
            </p>

            {/* Micro-progress Bar: Lowest Reserve vs Emergency Floor */}
            <div className="pt-1 space-y-1">
              <div className="relative w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    simulationResult.lowestReserveBalance >= reserveFloor
                      ? 'bg-blue-700'
                      : simulationResult.lowestReserveBalance >= 0
                      ? 'bg-amber-500'
                      : 'bg-rose-600'
                  }`}
                  style={{ width: `${reserveRetentionPercent}%` }}
                />
                {reserveFloorMarkerPercent > 0 && (
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-slate-500"
                    style={{ left: `${reserveFloorMarkerPercent}%` }}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-100 text-xs space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Chạm đáy tại thời điểm:</span>
              <span className="font-mono tabular-nums font-bold text-slate-700 transition-all duration-300">
                Tháng {simulationResult.lowestReserveMonth} (Năm {Math.ceil(simulationResult.lowestReserveMonth / 12)})
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Ngưỡng tối thiểu cần bảo vệ: {formatCompactVND(household.plannedEmergencyReserveFloor || 0)}.
            </p>
          </div>
        </div>

        {/* Card 6: DTI (Debt-Service-to-Income) */}
        <div className="relative overflow-hidden bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300/90 transition-all duration-300 space-y-3.5 flex flex-col justify-between">
          <div
            className={`absolute top-0 left-0 right-0 h-1 transition-all duration-300 ${
              (simulationResult.postPromoDtiRatio ?? 0) <= 0.4
                ? 'bg-blue-700'
                : (simulationResult.postPromoDtiRatio ?? 0) <= 0.5
                ? 'bg-amber-500'
                : 'bg-rose-600'
            }`}
          />
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-slate-400">06</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Tỷ Lệ Trả Nợ / Thu Nhập (DTI)
                </span>
              </div>
              <PieChart className="w-4 h-4 text-blue-700" />
            </div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <p className="font-mono tabular-nums text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight transition-all duration-300">
                {simulationResult.month1DtiRatio !== null
                  ? `${formatPercent(simulationResult.month1DtiRatio * 100, 1)}`
                  : 'N/A'}
              </p>
              {simulationResult.postPromoDtiRatio !== null && (
                <span className="font-mono tabular-nums text-xs font-bold text-amber-700 transition-all duration-300">
                  → {formatPercent(simulationResult.postPromoDtiRatio * 100, 1)} (Thả nổi)
                </span>
              )}
            </div>

            {/* Micro-progress Bar: DTI Threshold Indicator (40% Safe / 50% High Risk) */}
            <div className="pt-1 space-y-1">
              <div className="relative w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    (simulationResult.postPromoDtiRatio ?? 0) <= 0.4
                      ? 'bg-blue-700'
                      : (simulationResult.postPromoDtiRatio ?? 0) <= 0.5
                      ? 'bg-amber-500'
                      : 'bg-rose-600'
                  }`}
                  style={{ width: `${postPromoDtiBarPercent}%` }}
                />
                <div
                  className="absolute top-0 bottom-0 left-0 bg-[#0B1D30]/75 rounded-l-full transition-all duration-300"
                  style={{ width: `${Math.min(month1DtiBarPercent, postPromoDtiBarPercent)}%` }}
                />
                {/* 40% Safe Threshold Hairline */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-slate-400"
                  style={{ left: '40%' }}
                />
                {/* 50% High Risk Threshold Hairline */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-rose-400"
                  style={{ left: '50%' }}
                />
              </div>
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-100 text-xs space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Khuyến nghị chuyên gia tài chính:</span>
              <span
                className={`font-bold transition-colors duration-300 ${
                  (simulationResult.postPromoDtiRatio ?? 0) <= 0.4
                    ? 'text-blue-800'
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
