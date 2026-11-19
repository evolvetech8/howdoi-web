'use client';

import React from 'react';
import { Lightbulb, ShieldCheck, ArrowDownRight, ArrowUpRight, Clock, Check } from 'lucide-react';
import { useSimulation } from '@/lib/depositguard/context';
import { formatCompactVND, formatVND } from '@/lib/depositguard/formatters';

export default function CorrectiveLevers() {
  const {
    loan,
    household,
    simulationResult,
    solverResult,
    applySafeLoanLever,
    applySafeEquityLever,
    updateLoan,
  } = useSimulation();

  const isDeficit = simulationResult.affordabilityStatus === 'DEFICIT';
  const isVulnerable = simulationResult.affordabilityStatus === 'VULNERABLE';

  const loanReduction = Math.max(0, loan.loanAmount - solverResult.maxSafeLoanAmount);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2 text-blue-800 font-semibold text-xs tracking-wider uppercase mb-1">
          <Lightbulb className="w-4 h-4" /> Giải Pháp Cân Bằng Dòng Tiền (Corrective Levers)
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Các phương án điều chỉnh để đưa dòng tiền về vùng an toàn
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Được giải tự động bằng thuật toán đảo ngược để tìm mức vay và vốn tự có tối ưu cho gia đình bạn.
        </p>
      </div>

      {simulationResult.affordabilityStatus === 'SAFE' ? (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-sm">
              Khoản vay hiện tại đang nằm hoàn toàn trong ngưỡng an toàn
            </h3>
            <p className="text-xs text-blue-900 leading-relaxed">
              Dòng tiền hàng tháng của gia đình đủ sức chi trả nợ gốc, lãi và sinh hoạt phí mà không làm tổn hại đến quỹ dự phòng khẩn cấp. Bạn không cần phải điều chỉnh giảm khoản vay.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Lever 1: Cap Loan Amount */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/90 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <ArrowDownRight className="w-4 h-4 text-blue-700" />
                Phương án 1: Giảm số tiền vay
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Hạn mức vay an toàn tối đa:</span>
                <span className="text-xl sm:text-2xl font-black text-blue-800">
                  {formatCompactVND(solverResult.maxSafeLoanAmount)}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Giảm bớt <strong className="text-slate-800">{formatCompactVND(loanReduction)}</strong> so với mức vay dự kiến hiện tại ({formatCompactVND(loan.loanAmount)}) sẽ triệt tiêu hoàn toàn thâm hụt dòng tiền.
              </p>
            </div>

            <button
              type="button"
              onClick={applySafeLoanLever}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-700 text-white font-bold text-xs hover:bg-blue-800 transition shadow-2xs cursor-pointer active:scale-[0.98]"
            >
              Áp dụng hạn mức vay {formatCompactVND(solverResult.maxSafeLoanAmount)}
            </button>
          </div>

          {/* Lever 2: Increase Down Payment */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/90 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <ArrowUpRight className="w-4 h-4 text-blue-700" />
                Phương án 2: Tăng vốn tự có
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Vốn tự có cần bổ sung thêm:</span>
                <span className="text-xl sm:text-2xl font-black text-amber-700">
                  +{formatCompactVND(solverResult.additionalEquityNeeded)}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tổng vốn tự có cần đạt <strong className="text-slate-800">{formatCompactVND(loan.downPayment + solverResult.additionalEquityNeeded)}</strong>.{' '}
                {solverResult.canAffordWithCurrentLiquidSavings ? (
                  <span className="text-blue-800 font-medium">
                    (Tiền tiết kiệm hiện có của bạn đủ để đáp ứng mà không cần vay mượn thêm).
                  </span>
                ) : (
                  <span className="text-amber-700 font-medium">
                    (Bạn sẽ cần thêm nguồn hỗ trợ tài chính từ người thân hoặc bán tài sản khác).
                  </span>
                )}
              </p>
            </div>

            <button
              type="button"
              onClick={applySafeEquityLever}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition shadow-2xs cursor-pointer active:scale-[0.98]"
            >
              Tăng vốn tự có thêm {formatCompactVND(solverResult.additionalEquityNeeded)}
            </button>
          </div>

          {/* Lever 3: Extend Loan Term */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/90 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-blue-700" />
                Phương án 3: Kéo dài thời hạn vay
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Thời hạn vay hiện tại:</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900">
                  {loan.loanTermMonths / 12} năm ({loan.loanTermMonths} tháng)
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kéo dài thời hạn vay từ {loan.loanTermMonths / 12} năm lên 25 hoặc 30 năm sẽ giúp giảm tiền gốc phải trả hàng tháng, hạ thấp gánh nặng thanh toán ngay tức thì (dù tổng lãi vay tích lũy sẽ tăng).
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => updateLoan({ loanTermMonths: 300 })}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition ${
                  loan.loanTermMonths === 300
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                25 năm (300T)
              </button>
              <button
                type="button"
                onClick={() => updateLoan({ loanTermMonths: 360 })}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition ${
                  loan.loanTermMonths === 360
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                30 năm (360T)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
