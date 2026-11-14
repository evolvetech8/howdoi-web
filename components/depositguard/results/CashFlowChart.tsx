'use client';

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { useSimulation } from '@/lib/depositguard/context';
import { formatCompactVND, formatVND } from '@/lib/depositguard/formatters';

export default function CashFlowChart() {
  const { simulationResult, household } = useSimulation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const data = simulationResult.schedule.map((item) => ({
    month: item.month,
    name: `T${item.month}`,
    reserveBalance: item.reserveBalance,
    operatingCashFlow: item.operatingCashFlow,
    isDeficit: item.isDeficit,
  }));

  const reserveFloor = household.plannedEmergencyReserveFloor || 0;

  if (!mounted) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex items-center justify-center h-[360px] text-xs text-slate-400">
        Đang khởi tạo biểu đồ quỹ dự phòng...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4 w-full min-w-0">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            Quỹ Dự Phòng Khẩn Cấp & Vùng An Toàn
          </h3>
          <p className="text-xs text-slate-500">
            Theo dõi sự tích lũy hoặc hao mòn quỹ tiền mặt khẩn cấp so với ngưỡng tối thiểu
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            Số dư quỹ đệm
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-amber-500 inline-block" />
            Ngưỡng an toàn ({formatCompactVND(reserveFloor)})
          </span>
        </div>
      </div>

      <div
        className="w-full h-[280px] sm:h-[340px] pt-2"
        role="img"
        aria-label="Biểu đồ quỹ dự phòng khẩn cấp theo thời gian"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            syncId="depositguard-results"
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <defs>
              <linearGradient id="reserveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
              </linearGradient>
            </defs>
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
                      </p>
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Số dư quỹ dự phòng:</span>
                        <span
                          className={`font-bold ${
                            d.reserveBalance >= reserveFloor
                              ? 'text-emerald-400'
                              : d.reserveBalance >= 0
                              ? 'text-amber-300'
                              : 'text-rose-400'
                          }`}
                        >
                          {formatVND(d.reserveBalance)}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4 border-t border-slate-700 pt-1">
                        <span className="text-slate-400">Dòng tiền dư trong tháng:</span>
                        <span
                          className={`font-semibold ${
                            d.operatingCashFlow >= 0 ? 'text-emerald-300' : 'text-rose-400'
                          }`}
                        >
                          {d.operatingCashFlow >= 0 ? '+' : ''}
                          {formatVND(d.operatingCashFlow)}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {reserveFloor > 0 && (
              <ReferenceLine
                y={reserveFloor}
                stroke="#f59e0b"
                strokeDasharray="4 4"
                label={{
                  value: 'Ngưỡng an toàn',
                  position: 'insideBottomRight',
                  fill: '#d97706',
                  fontSize: 10,
                  fontWeight: 'bold',
                }}
              />
            )}
            <ReferenceLine y={0} stroke="#e11d48" strokeWidth={1} />
            <Area
              type="monotone"
              dataKey="reserveBalance"
              stroke="#059669"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#reserveGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
