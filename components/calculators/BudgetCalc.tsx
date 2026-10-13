'use client';

import React, { useState } from 'react';
import { calculate503020, calculate6Jars, formatVND, formatCompactVND } from '@/lib/finance-math';
import { PieChart, Home, Heart, PiggyBank, BookOpen, Smile, Gift, CheckCircle2 } from 'lucide-react';

export default function BudgetCalc() {
  const [income, setIncome] = useState<number>(15_000_000); // 15M VND
  const [model, setModel] = useState<'503020' | '6jars'>('503020');

  const budget503020 = calculate503020(income);
  const budget6Jars = calculate6Jars(income);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-cyan-800 p-6 sm:p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm">
            <PieChart className="w-6 h-6 text-teal-200" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-200">Công cụ tính</span>
            <h2 className="text-xl sm:text-2xl font-bold">Quản Lý Ngân Sách: 50/30/20 & 6 Chiếc Lọ</h2>
          </div>
        </div>
        <p className="text-teal-100/90 text-sm max-w-2xl mt-1">
          Chấm dứt cảm giác 'vừa nhận lương đã hết sạch'. Phân bổ thu nhập thông minh để luôn an tâm về tương lai.
        </p>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Income Input & Model Switcher */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700">Thu nhập thực nhận hàng tháng (Net)</label>
              <span className="text-base font-bold text-teal-700">{formatVND(income)}</span>
            </div>
            <input
              type="range"
              min={5_000_000}
              max={60_000_000}
              step={1_000_000}
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>5 triệu</span>
              <span>30 triệu</span>
              <span>60 triệu</span>
            </div>
          </div>

          <div className="md:col-span-5 flex justify-end">
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setModel('503020')}
                className={`flex-1 md:flex-initial px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                  model === '503020'
                    ? 'bg-white text-teal-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Quy tắc 50/30/20 (Đơn giản)
              </button>
              <button
                type="button"
                onClick={() => setModel('6jars')}
                className={`flex-1 md:flex-initial px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                  model === '6jars'
                    ? 'bg-white text-teal-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                6 Chiếc Lọ (Chi tiết)
              </button>
            </div>
          </div>
        </div>

        {/* Model 50/30/20 Display */}
        {model === '503020' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            {/* Needs */}
            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                    <Home className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full">50%</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">Nhu Cầu Thiết Yếu</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Tiền trọ, ăn uống cơ bản, điện nước, xăng xe, thuốc men sinh hoạt.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-blue-200/60">
                <span className="text-xl font-bold text-blue-700 block">{formatVND(budget503020.needs)}</span>
                <span className="text-[11px] text-slate-400">Tối đa cho phép mỗi tháng</span>
              </div>
            </div>

            {/* Wants */}
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                    <Heart className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full">30%</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">Sở Thích & Giao Tiếp</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Cà phê bạn bè, mua sắm đồ yêu thích, du lịch giải trí, xem phim.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-amber-200/60">
                <span className="text-xl font-bold text-amber-700 block">{formatVND(budget503020.wants)}</span>
                <span className="text-[11px] text-slate-400">Tận hưởng mà không thấy tội lỗi</span>
              </div>
            </div>

            {/* Savings */}
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <PiggyBank className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full">20%</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">Tích Lũy & Tương Lai</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Quỹ khẩn cấp 3-6 tháng, đầu tư chứng chỉ quỹ, trả nợ gốc.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-emerald-200/60">
                <span className="text-xl font-bold text-emerald-700 block">{formatVND(budget503020.savings)}</span>
                <span className="text-[11px] text-slate-400">Gửi tự động ngay ngày lương về</span>
              </div>
            </div>
          </div>
        ) : (
          /* 6 Jars Model */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-xs font-bold text-blue-700">55% — NEC (Nhu cầu thiết yếu)</span>
              <span className="text-lg font-bold text-slate-900 block mt-1">{formatVND(budget6Jars.nec)}</span>
              <span className="text-[11px] text-slate-500">Ăn uống, thuê nhà, sinh hoạt</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-xs font-bold text-emerald-700">10% — FFA (Tự do tài chính)</span>
              <span className="text-lg font-bold text-slate-900 block mt-1">{formatVND(budget6Jars.ffa)}</span>
              <span className="text-[11px] text-slate-500">Đầu tư sinh lời không bao giờ rút tiêu</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-xs font-bold text-teal-700">10% — LTSS (Tiết kiệm dài hạn)</span>
              <span className="text-lg font-bold text-slate-900 block mt-1">{formatVND(budget6Jars.ltss)}</span>
              <span className="text-[11px] text-slate-500">Quỹ khẩn cấp, mua nhà/xe</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-xs font-bold text-indigo-700">10% — EDU (Giáo dục bản thân)</span>
              <span className="text-lg font-bold text-slate-900 block mt-1">{formatVND(budget6Jars.edu)}</span>
              <span className="text-[11px] text-slate-500">Mua sách, học khóa học tăng thu nhập</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-xs font-bold text-amber-700">10% — PLAY (Hưởng thụ)</span>
              <span className="text-lg font-bold text-slate-900 block mt-1">{formatVND(budget6Jars.play)}</span>
              <span className="text-[11px] text-slate-500">Ăn ngon, massage, vui chơi giải trí</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-xs font-bold text-rose-700">5% — GIVE (Cho đi)</span>
              <span className="text-lg font-bold text-slate-900 block mt-1">{formatVND(budget6Jars.give)}</span>
              <span className="text-[11px] text-slate-500">Biếu bố mẹ, từ thiện, quà sinh nhật</span>
            </div>
          </div>
        )}

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Mẹo:</strong> Đừng tự ép bản thân phải hoàn hảo ngay tháng đầu tiên. Nếu hiện tại chi phí thiết yếu của bạn đang chiếm 70%, hãy đặt mục tiêu giảm dần về 60%, rồi 50%. Sự kiên định quan trọng hơn sự cực đoan!
          </p>
        </div>
      </div>
    </div>
  );
}
