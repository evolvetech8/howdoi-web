'use client';

import React, { useState, useMemo } from 'react';
import { calculateCompoundInterest, formatVND, formatCompactVND } from '@/lib/finance-math';
import { TrendingUp, Coins, Calendar, Percent, Sparkles, ArrowRight } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function CompoundInterestCalc() {
  const [initialInvestment, setInitialInvestment] = useState<number>(20_000_000); // 20M
  const [monthlyContribution, setMonthlyContribution] = useState<number>(2_500_000); // 2.5M
  const [annualRate, setAnnualRate] = useState<number>(10); // 10%
  const [years, setYears] = useState<number>(15); // 15 years

  const calculation = useMemo(() => {
    return calculateCompoundInterest({
      initialInvestment,
      monthlyContribution,
      annualRate,
      years,
    });
  }, [initialInvestment, monthlyContribution, annualRate, years]);

  const { summary, yearlyBreakdown } = calculation;

  const chartData = useMemo(() => {
    return yearlyBreakdown.map((item) => ({
      name: `Năm ${item.year}`,
      totalContributions: item.totalContributions,
      totalInterest: item.totalInterest,
      futureValue: item.futureValue,
    }));
  }, [yearlyBreakdown]);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 p-6 sm:p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm">
            <TrendingUp className="w-6 h-6 text-emerald-200" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-200">Công cụ tính</span>
            <h2 className="text-xl sm:text-2xl font-bold">Lãi Kép & Đầu Tư Tích Lũy</h2>
          </div>
        </div>
        <p className="text-emerald-100/90 text-sm max-w-2xl mt-1">
          Khám phá sức mạnh của thời gian và sự đều đặn. Xem số tiền tích cóp hàng tháng của bạn tăng trưởng vượt bậc như thế nào.
        </p>
      </div>

      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-5 space-y-6">
          {/* Initial Investment */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-emerald-600" /> Số tiền ban đầu
              </label>
              <span className="text-sm font-bold text-emerald-700">{formatVND(initialInvestment)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={200_000_000}
              step={5_000_000}
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>0 đ</span>
              <span>100 triệu</span>
              <span>200 triệu</span>
            </div>
          </div>

          {/* Monthly Contribution */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" /> Góp thêm mỗi tháng
              </label>
              <span className="text-sm font-bold text-emerald-700">{formatVND(monthlyContribution)}</span>
            </div>
            <input
              type="range"
              min={500_000}
              max={30_000_000}
              step={500_000}
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>500k</span>
              <span>15 triệu</span>
              <span>30 triệu</span>
            </div>
          </div>

          {/* Expected Annual Rate */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-emerald-600" /> Lãi suất kỳ vọng (% / năm)
              </label>
              <span className="text-sm font-bold text-emerald-700">{annualRate}% / năm</span>
            </div>
            <input
              type="range"
              min={4}
              max={20}
              step={0.5}
              value={annualRate}
              onChange={(e) => setAnnualRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>4% (Gửi bank)</span>
              <span>10% (Chứng chỉ quỹ)</span>
              <span>15% (Cổ phiếu)</span>
            </div>
          </div>

          {/* Years */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" /> Thời gian tích lũy
              </label>
              <span className="text-sm font-bold text-emerald-700">{years} năm</span>
            </div>
            <input
              type="range"
              min={1}
              max={35}
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>1 năm</span>
              <span>15 năm</span>
              <span>35 năm</span>
            </div>
          </div>

          {/* Quick presets */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-medium block mb-2">Gợi ý lộ trình phổ biến:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setInitialInvestment(10_000_000);
                  setMonthlyContribution(1_500_000);
                  setAnnualRate(10);
                  setYears(10);
                }}
                className="text-xs py-2 px-3 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200 rounded-lg transition-colors text-slate-700 font-medium text-left"
              >
                🌱 Người mới đi làm
                <span className="block text-[10px] text-slate-400">1.5tr/tháng - 10 năm</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setInitialInvestment(50_000_000);
                  setMonthlyContribution(5_000_000);
                  setAnnualRate(11);
                  setYears(20);
                }}
                className="text-xs py-2 px-3 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200 rounded-lg transition-colors text-slate-700 font-medium text-left"
              >
                🚀 Hưu trí an nhàn (FIRE)
                <span className="block text-[10px] text-slate-400">5tr/tháng - 20 năm</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results & Interactive Chart */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-100">
              <span className="text-xs text-emerald-800 font-medium block">Tổng tài sản dự kiến</span>
              <span className="text-xl sm:text-2xl font-bold text-emerald-700 mt-1 block">
                {formatCompactVND(summary.futureValue)}
              </span>
              <span className="text-[11px] text-emerald-600 font-mono mt-0.5 block">{formatVND(summary.futureValue)}</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-600 font-medium block">Tiền vốn tự bỏ ra</span>
              <span className="text-xl sm:text-2xl font-bold text-slate-800 mt-1 block">
                {formatCompactVND(summary.totalContributions)}
              </span>
              <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">{formatVND(summary.totalContributions)}</span>
            </div>

            <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-100">
              <span className="text-xs text-amber-800 font-medium block">Tiền lãi sinh ra (Lãi kép)</span>
              <span className="text-xl sm:text-2xl font-bold text-amber-700 mt-1 block">
                {formatCompactVND(summary.totalInterest)}
              </span>
              <span className="text-[11px] text-amber-600 font-mono mt-0.5 block">
                Gấp {(summary.futureValue / Math.max(1, summary.totalContributions)).toFixed(1)}x vốn gốc
              </span>
            </div>
          </div>

          {/* Visual Chart */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold text-slate-700">Biểu đồ tích lũy qua các năm</span>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Tiền vốn
                </span>
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Tổng tài sản
                </span>
              </div>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorFuture" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorCapital" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickFormatter={(val) => formatCompactVND(val)}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    formatter={(value: any) => [formatVND(Number(value)), '']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="futureValue"
                    name="Tổng tài sản"
                    stroke="#059669"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorFuture)"
                  />
                  <Area
                    type="monotone"
                    dataKey="totalContributions"
                    name="Vốn bỏ ra"
                    stroke="#64748b"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCapital)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Insight Note */}
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3.5 rounded-r-lg">
            <p className="text-xs text-emerald-900 leading-relaxed">
              💡 <strong>Góc nhìn:</strong> Tiền lãi sinh ra ({formatCompactVND(summary.totalInterest)}) chiếm đến{' '}
              <strong>{((summary.totalInterest / Math.max(1, summary.futureValue)) * 100).toFixed(0)}%</strong> tổng tài sản của bạn! Đó chính là lý do vì sao người giàu không làm việc vì tiền, mà để tiền làm việc cho mình.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
