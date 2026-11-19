'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { useSimulation } from '@/lib/depositguard/context';
import { formatVND, formatCompactVND } from '@/lib/depositguard/formatters';

export default function HeroLivePreview() {
  const router = useRouter();
  const { updateLoan, updateHousehold, resetStressScenario } = useSimulation();

  const [loanAmount, setLoanAmount] = useState<number>(2_000_000_000);
  const [netIncome, setNetIncome] = useState<number>(55_000_000);
  const [floatingRate, setFloatingRate] = useState<number>(12.0);

  const termMonths = 240;
  const promoRate = 7.0;
  const essentialExpenses = 30_000_000;

  const monthlyPrincipal = Math.round(loanAmount / termMonths);
  const month1Interest = Math.round(loanAmount * (promoRate / 100 / 12));
  const month1Payment = monthlyPrincipal + month1Interest;
  const month1Surplus = netIncome - essentialExpenses - month1Payment;

  const balanceStartMonth13 = Math.max(0, loanAmount - monthlyPrincipal * 12);
  const month13Interest = Math.round(balanceStartMonth13 * (floatingRate / 100 / 12));
  const month13Payment = monthlyPrincipal + month13Interest;
  const paymentJump = month13Payment - month1Payment;
  const month13Surplus = netIncome - essentialExpenses - month13Payment;
  const month13Dti = netIncome > 0 ? Math.round((month13Payment / netIncome) * 1000) / 10 : 0;

  const shock13Interest = Math.round(balanceStartMonth13 * ((floatingRate + 2) / 100 / 12));
  const shock13Payment = monthlyPrincipal + shock13Interest;
  const shock13Surplus = netIncome - essentialExpenses - shock13Payment;

  const isDeficitMonth13 = month13Surplus < 0;
  const isVulnerableMonth13 = !isDeficitMonth13 && (shock13Surplus < 0 || month13Dti > 42);

  const handleOpenInDashboard = () => {
    const propertyPrice = Math.round(loanAmount / 0.8);
    const downPayment = propertyPrice - loanAmount;
    updateLoan({
      propertyPrice,
      purchasePrice: propertyPrice,
      downPayment,
      loanAmount,
      loanTermMonths: termMonths,
      repaymentMethod: 'EQUAL_PRINCIPAL',
      promoInterestRate: promoRate,
      promoPeriodMonths: 12,
      postPromoRate: floatingRate,
      gracePeriodMonths: 0,
    });
    updateHousehold({
      monthlyNetIncome: netIncome,
      essentialLivingExpenses: essentialExpenses,
      existingDebtPayments: 0,
      liquidSavings: downPayment + 200_000_000,
      plannedEmergencyReserveFloor: 90_000_000,
    });
    resetStressScenario();
    router.push('/ket-qua');
  };

  return (
    <div className="bg-[#0B1D30] text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
      {/* Terminal Top Bar */}
      <div className="px-5 py-3.5 bg-[#060F1A] border-b border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="ml-1.5 text-[11px] font-mono font-semibold text-slate-300 uppercase tracking-wider">
            DepositGuard Live Stress-Test Terminal v1.1
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
          Mô phỏng trực tiếp
        </span>
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        {/* Status Banner (Strictly Semantic Traffic-Light Colors) */}
        <div
          className={`p-3.5 rounded-2xl border flex items-start justify-between gap-3 ${
            isDeficitMonth13
              ? 'bg-rose-950/70 border-rose-500/40 text-rose-100'
              : isVulnerableMonth13
              ? 'bg-amber-950/70 border-amber-500/40 text-amber-100'
              : 'bg-emerald-950/70 border-emerald-500/40 text-emerald-100'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {isDeficitMonth13 ? (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            ) : isVulnerableMonth13 ? (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-0.5">
              <div className="text-xs font-extrabold uppercase tracking-wide">
                {isDeficitMonth13
                  ? 'Cảnh báo: Thiếu hụt dòng tiền ngay Tháng thứ 13'
                  : isVulnerableMonth13
                  ? 'Lưu ý: Nhạy cảm với cú sốc lãi suất thả nổi'
                  : 'Dư địa dự phòng an toàn sau khi hết ưu đãi'}
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {isDeficitMonth13
                  ? `Tháng 13 trả ngân hàng tăng thêm +${formatVND(paymentJump)}/tháng, khiến gia đình âm ${formatVND(Math.abs(month13Surplus))}/tháng (sau sinh hoạt phí 30 tr).`
                  : `Tháng 13 trả ngân hàng ${formatVND(month13Payment)}/tháng (DTI ${month13Dti}%). Khi lãi tăng thêm +2%, dòng tiền còn ${formatVND(shock13Surplus)}/tháng.`}
              </p>
            </div>
          </div>
        </div>

        {/* 3 Interactive Sliders (Royal Banking Blue Controls) */}
        <div className="space-y-3.5 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
            <span className="inline-flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-400" />
              <span>Kéo thanh trượt để kiểm tra nhanh (Kỳ hạn 20 năm, Sinh hoạt 30 tr/tháng)</span>
            </span>
          </div>

          {/* Slider 1: Loan Amount */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <label htmlFor="hero-slider-loan" className="text-slate-300 font-medium">
                1. Số tiền vay ngân hàng:
              </label>
              <span className="font-mono font-bold text-blue-300">
                {formatVND(loanAmount)} ({formatCompactVND(loanAmount)})
              </span>
            </div>
            <input
              id="hero-slider-loan"
              type="range"
              min={800_000_000}
              max={4_500_000_000}
              step={100_000_000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
            />
          </div>

          {/* Slider 2: Monthly Net Income */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <label htmlFor="hero-slider-income" className="text-slate-300 font-medium">
                2. Thu nhập thực nhận (Net) 2 vợ chồng:
              </label>
              <span className="font-mono font-bold text-white">
                {formatVND(netIncome)}/tháng
              </span>
            </div>
            <input
              id="hero-slider-income"
              type="range"
              min={35_000_000}
              max={100_000_000}
              step={5_000_000}
              value={netIncome}
              onChange={(e) => setNetIncome(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
            />
          </div>

          {/* Slider 3: Post-Promo Floating Rate */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <label htmlFor="hero-slider-rate" className="text-slate-300 font-medium">
                3. Lãi suất thả nổi từ Tháng 13 (Sau ưu đãi 7%):
              </label>
              <span className="font-mono font-bold text-amber-300">
                {floatingRate.toFixed(1).replace('.', ',')}% / năm
              </span>
            </div>
            <input
              id="hero-slider-rate"
              type="range"
              min={9.5}
              max={15.5}
              step={0.5}
              value={floatingRate}
              onChange={(e) => setFloatingRate(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
            />
          </div>
        </div>

        {/* 3-Column Comparison Metrics (Semantic Output Colors) */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
            <span className="block text-[10px] font-bold uppercase text-blue-300">
              Tháng 1 (Ưu đãi 7%)
            </span>
            <p className="font-mono text-sm sm:text-base font-extrabold text-white">
              {formatCompactVND(month1Payment)}
            </p>
            <p
              className={`font-mono text-[11px] font-semibold ${
                month1Surplus >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {month1Surplus >= 0 ? `Dư +${formatCompactVND(month1Surplus)}` : `Âm ${formatCompactVND(month1Surplus)}`}
            </p>
          </div>

          <div
            className={`p-3 rounded-2xl border space-y-1 ${
              isDeficitMonth13
                ? 'bg-rose-950/70 border-rose-500/50'
                : 'bg-amber-950/60 border-amber-500/40'
            }`}
          >
            <span className="block text-[10px] font-bold uppercase text-amber-300">
              Tháng 13 ({floatingRate}%)
            </span>
            <p className="font-mono text-sm sm:text-base font-extrabold text-white">
              {formatCompactVND(month13Payment)}
            </p>
            <p
              className={`font-mono text-[11px] font-bold ${
                month13Surplus >= 0 ? 'text-emerald-300' : 'text-rose-400'
              }`}
            >
              {month13Surplus >= 0
                ? `Dư +${formatCompactVND(month13Surplus)}`
                : `Thiếu ${formatCompactVND(month13Surplus)}`}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
            <span className="block text-[10px] font-bold uppercase text-rose-400">
              Sốc lãi +2% ({floatingRate + 2}%)
            </span>
            <p className="font-mono text-sm sm:text-base font-extrabold text-white">
              {formatCompactVND(shock13Payment)}
            </p>
            <p
              className={`font-mono text-[11px] font-bold ${
                shock13Surplus >= 0 ? 'text-emerald-300' : 'text-rose-400'
              }`}
            >
              {shock13Surplus >= 0
                ? `Dư +${formatCompactVND(shock13Surplus)}`
                : `Thiếu ${formatCompactVND(shock13Surplus)}`}
            </p>
          </div>
        </div>

        {/* Action Button to Open Full Simulation Results */}
        <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>Chạy ngầm 240 tháng • Không gửi dữ liệu về máy chủ</span>
          </div>
          <button
            type="button"
            onClick={handleOpenInDashboard}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Phân tích sâu kịch bản này (240 tháng)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
