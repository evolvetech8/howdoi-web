'use client';

import React, { useState, useMemo } from 'react';
import { calculateLoan, formatVND, formatCompactVND } from '@/lib/finance-math';
import { Building2, Percent, Calendar, AlertCircle } from 'lucide-react';

export default function LoanCalc() {
  const [loanAmount, setLoanAmount] = useState<number>(1_000_000_000); // 1 tỷ VND
  const [years, setYears] = useState<number>(15); // 15 năm
  const [annualRate, setAnnualRate] = useState<number>(8.5); // 8.5%
  const [method, setMethod] = useState<'reducing' | 'flat'>('reducing');

  const result = useMemo(() => {
    return calculateLoan({
      loanAmount,
      loanTermMonths: years * 12,
      annualInterestRate: annualRate,
      method,
    });
  }, [loanAmount, years, annualRate, method]);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-700 to-slate-900 p-6 sm:p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm">
            <Building2 className="w-6 h-6 text-amber-200" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-200">Công cụ tính</span>
            <h2 className="text-xl sm:text-2xl font-bold">Vay Mua Nhà / Xe & Trả Góp Ngân Hàng</h2>
          </div>
        </div>
        <p className="text-amber-100/90 text-sm max-w-2xl mt-1">
          So sánh chính xác phương án trả nợ theo Dư nợ giảm dần vs. Cố định ban đầu để tránh bị bẫy lãi suất.
        </p>
      </div>

      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-5 space-y-6">
          {/* Loan Amount */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700">Số tiền vay</label>
              <span className="text-sm font-bold text-amber-700">{formatCompactVND(loanAmount)}</span>
            </div>
            <input
              type="range"
              min={100_000_000}
              max={5_000_000_000}
              step={100_000_000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>100 triệu</span>
              <span>2.5 tỷ</span>
              <span>5 tỷ</span>
            </div>
          </div>

          {/* Loan Term */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-600" /> Thời hạn vay
              </label>
              <span className="text-sm font-bold text-slate-800">{years} năm ({years * 12} tháng)</span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>1 năm</span>
              <span>15 năm</span>
              <span>30 năm</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-amber-600" /> Lãi suất vay (%/năm)
              </label>
              <span className="text-sm font-bold text-amber-700">{annualRate}% / năm</span>
            </div>
            <input
              type="range"
              min={5}
              max={18}
              step={0.25}
              value={annualRate}
              onChange={(e) => setAnnualRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>5% (Ưu đãi)</span>
              <span>10% (Thả nổi)</span>
              <span>18% (Vay tín chấp)</span>
            </div>
          </div>

          {/* Repayment Method */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">Phương thức tính lãi</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMethod('reducing')}
                className={`py-2 px-3 text-xs rounded-lg border text-left transition-all ${
                  method === 'reducing'
                    ? 'bg-amber-50 border-amber-500 text-amber-900 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Dư nợ giảm dần (Phổ biến)
              </button>
              <button
                type="button"
                onClick={() => setMethod('flat')}
                className={`py-2 px-3 text-xs rounded-lg border text-left transition-all ${
                  method === 'flat'
                    ? 'bg-amber-50 border-amber-500 text-amber-900 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Cố định gốc ban đầu
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-amber-50/80 rounded-xl border border-amber-200">
              <span className="text-xs text-amber-800 font-medium block">Tháng trả nhiều nhất (Tháng đầu)</span>
              <span className="text-2xl font-bold text-amber-900 mt-1 block">
                {formatVND(result.firstMonthPayment)}
              </span>
              <span className="text-[11px] text-amber-700 mt-1 block">
                Gồm gốc ({formatCompactVND(loanAmount / (years * 12))}) + lãi tháng đầu
              </span>
            </div>

            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-600 font-medium block">Tổng tiền lãi cả kỳ vay</span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">
                {formatCompactVND(result.totalInterest)}
              </span>
              <span className="text-[11px] text-slate-500 font-mono mt-1 block">{formatVND(result.totalInterest)}</span>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl shadow">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
                  Tổng số tiền phải trả (Gốc + Lãi)
                </span>
                <span className="text-3xl font-extrabold mt-1 block text-amber-400">
                  {formatCompactVND(result.totalPayment)}
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Lãi = {((result.totalInterest / result.loanAmount) * 100).toFixed(0)}% tiền gốc
              </span>
            </div>
          </div>

          <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900 leading-relaxed">
              <strong>Lưu ý quan trọng:</strong> Các ngân hàng Việt Nam thường chỉ cố định lãi suất ưu đãi trong 6-12 tháng đầu (khoảng 6-8%). Sau thời gian ưu đãi, lãi suất sẽ thả nổi = Lãi suất huy động + biên độ (thường vọt lên 10-12%). Hãy luôn trừ hao khả năng trả nợ nếu lãi suất tăng thêm 2-3%!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
