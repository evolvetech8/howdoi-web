'use client';

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend,
} from 'recharts';
import { useSimulation } from '@/lib/depositguard/context';
import { formatCompactVND, formatVND } from '@/lib/depositguard/formatters';

export default function AmortizationChart() {
  const { simulationResult, loan } = useSimulation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const data = simulationResult.schedule.map((item) => ({
    month: item.month,
    name: `T${item.month}`,
    principalPayment: item.principalPayment,
    interestPayment: item.interestPayment,
    totalDebtService: item.totalDebtService,
    endingBalance: item.endingBalance,
    isPromo: item.isPromo,
  }));

  const promoExpiryMonth = loan.promoPeriodMonths;

  if (!mounted) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex items-center justify-center h-[360px] text-xs text-slate-400">
        Đang khởi tạo biểu đồ trả nợ...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4 w-full min-w-0">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            Cơ Cấu Tiền Trả Nợ Hàng Tháng (Gốc & Lãi)
          </h3>
          <p className="text-xs text-slate-500">
            Minh họa trực quan cú sốc tăng vọt tiền trả nợ tại mốc hết ưu đãi (Tháng {loan.promoPeriodMonths + 1})
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600 inline-block" />
            Tiền gốc
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" />
            Tiền lãi
          </span>
        </div>
      </div>

      <div
        className="w-full h-[280px] sm:h-[340px] pt-2"
        role="img"
        aria-label="Biểu đồ phân bổ tiền trả gốc và lãi qua 240 tháng"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            syncId="depositguard-results"
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fontSize: 10, fill: '#64748b' }}
              interval={23}
              tickFormatter={(m) => `Năm ${Math.ceil(m / 12)}`}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: '#64748b' }}
              tickFormatter={(v) => formatCompactVND(v).replace(' ₫', '')}
              width={55}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-700 pointer-events-none">
                      <p className="font-bold border-b border-slate-700 pb-1 text-emerald-400">
                        Tháng {d.month} (Năm {Math.ceil(d.month / 12)})
                        {d.isPromo && <span className="ml-2 text-amber-300 font-normal">Giai đoạn ưu đãi</span>}
                      </p>
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Tiền gốc:</span>
                        <span className="font-semibold">{formatVND(d.principalPayment)}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Tiền lãi:</span>
                        <span className="font-semibold text-amber-300">{formatVND(d.interestPayment)}</span>
                      </div>
                      <div className="flex justify-between gap-4 border-t border-slate-700 pt-1 font-bold">
                        <span>Tổng trả nợ:</span>
                        <span className="text-white">{formatVND(d.totalDebtService)}</span>
                      </div>
                      <div className="flex justify-between gap-4 text-[10px] text-slate-400 pt-0.5">
                        <span>Dư nợ còn lại:</span>
                        <span>{formatCompactVND(d.endingBalance)}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {promoExpiryMonth > 0 && promoExpiryMonth < loan.loanTermMonths && (
              <ReferenceLine
                x={promoExpiryMonth}
                stroke="#e11d48"
                strokeDasharray="4 4"
                label={{
                  value: `Hết ưu đãi (Tháng ${promoExpiryMonth})`,
                  position: 'top',
                  fill: '#e11d48',
                  fontSize: 10,
                  fontWeight: 'bold',
                }}
              />
            )}
            <Bar dataKey="principalPayment" stackId="a" fill="#059669" radius={[0, 0, 0, 0]} />
            <Bar dataKey="interestPayment" stackId="a" fill="#f59e0b" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
