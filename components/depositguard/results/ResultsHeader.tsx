'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, RotateCcw, Printer, Share2 } from 'lucide-react';
import { useSimulation } from '@/lib/depositguard/context';
import { formatCompactVND, formatMonthsToYears } from '@/lib/depositguard/formatters';
import RiskBadge from '../common/RiskBadge';

export default function ResultsHeader() {
  const { loan, simulationResult, resetStressScenario } = useSimulation();

  const isAnnuity = loan.repaymentMethod === 'ANNUITY';

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
      {/* Top action row */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <Link
          href="/kiem-tra-mua-nha"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-800 hover:text-blue-900 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại chỉnh sửa thông số
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetStressScenario}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Khôi phục kịch bản cơ sở
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition print:hidden"
          >
            <Printer className="w-3.5 h-3.5" /> In kết quả
          </button>
        </div>
      </div>

      {/* Main summary header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Báo cáo mô phỏng rủi ro tài chính mua nhà
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Khoản vay {formatCompactVND(loan.loanAmount)} cho bất động sản {formatCompactVND(loan.propertyPrice)}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
            <span>
              Thời hạn: <strong className="text-slate-700">{formatMonthsToYears(loan.loanTermMonths)}</strong>
            </span>
            <span>•</span>
            <span>
              Phương thức: <strong className="text-slate-700">{isAnnuity ? 'Trả góp đều (Niên kim)' : 'Dư nợ giảm dần'}</strong>
            </span>
            <span>•</span>
            <span>
              Ưu đãi: <strong className="text-slate-700">{loan.promoInterestRate}% ({loan.promoPeriodMonths} tháng)</strong>
            </span>
            <span>•</span>
            <span>
              Thả nổi: <strong className="text-slate-700">{loan.postPromoRate}%/năm</strong>
            </span>
          </div>
        </div>

        {/* Big Overall Risk Badge */}
        <div className="shrink-0 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Đánh giá sức khỏe dòng tiền
          </span>
          <RiskBadge
            status={simulationResult.affordabilityStatus}
            size="lg"
            showDescription={true}
          />
        </div>
      </div>
    </div>
  );
}
