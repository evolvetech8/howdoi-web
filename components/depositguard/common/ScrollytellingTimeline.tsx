'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  AlertTriangle,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Cpu,
  Layers,
} from 'lucide-react';
import { formatVND, formatCompactVND } from '@/lib/depositguard/formatters';

export interface ScrollyChapter {
  index: number;
  code: string;
  periodLabel: string;
  title: string;
  subtitle: string;
  rateLabel: string;
  loanAmount: number;
  monthlyPayment: number;
  paymentDeltaLabel: string;
  netCashFlow: number;
  reserveBalance: number;
  dtiPercent: number;
  disposableCap: number;
  status: 'SAFE' | 'DEFICIT' | 'CRITICAL' | 'SOLVED';
  statusBadgeText: string;
  narrative: string;
  keyFormulaNote: string;
  svgPathCashFlow: string;
  svgAreaCashFlow: string;
  svgHighlightX: number;
  svgHighlightY: number;
  svgHighlightLabel: string;
}

const SCROLLY_CHAPTERS: ScrollyChapter[] = [
  {
    index: 0,
    code: '01',
    periodLabel: 'Giai đoạn 01 • Tháng 1 – Tháng 12',
    title: 'Kỳ trăng mật lãi suất ưu đãi 7,0%/năm',
    subtitle: 'Cảm giác an toàn giả tạo trong năm đầu tiên nhận nhà',
    rateLabel: '7,0% / năm (Cố định 12T đầu)',
    loanAmount: 2_000_000_000,
    monthlyPayment: 20_000_000,
    paymentDeltaLabel: 'Gốc 8,33 tr + Lãi 11,67 tr',
    netCashFlow: 5_000_000,
    reserveBalance: 260_000_000,
    dtiPercent: 36.4,
    disposableCap: 25_000_000,
    status: 'SAFE',
    statusBadgeText: 'DÒNG TIỀN DƯƠNG (+5,0 TR/THÁNG)',
    narrative:
      'Với khoản vay 2.000.000.000 ₫ trong 240 tháng và thu nhập ròng 55.000.000 ₫/tháng (chi phí sinh hoạt thiết yếu 30.000.000 ₫), nghĩa vụ trả ngân hàng Tháng 1 chỉ ở mức 20.000.000 ₫/tháng. Mỗi tháng gia đình vẫn tích lũy thêm +5.000.000 ₫ vào quỹ dự phòng.',
    keyFormulaNote:
      '90% người mua nhà chỉ nhìn con số 20.000.000 ₫/tháng này trên tờ rơi môi giới để quyết định xuống tiền đặt cọc.',
    svgPathCashFlow: 'M 30 72 C 95 70, 130 68, 165 68 L 260 66 L 370 62 L 490 55',
    svgAreaCashFlow: 'M 30 72 C 95 70, 130 68, 165 68 L 260 66 L 370 62 L 490 55 L 490 120 L 30 120 Z',
    svgHighlightX: 95,
    svgHighlightY: 70,
    svgHighlightLabel: 'Tháng 1–12: Dư +5,00 tr/tháng',
  },
  {
    index: 1,
    code: '02',
    periodLabel: 'Giai đoạn 02 • Tháng 13 (Hết ưu đãi)',
    title: 'Vách đá lãi suất thả nổi 12,0%/năm',
    subtitle: 'Tiền trả ngân hàng nhảy vọt lên 27.333.333 ₫/tháng ngay ngày đầu năm thứ 2',
    rateLabel: '12,0% / năm (Lãi cơ sở + Biên độ 4,0%)',
    loanAmount: 2_000_000_000,
    monthlyPayment: 27_333_333,
    paymentDeltaLabel: 'Tăng vọt +7.333.333 ₫/tháng (+40,4%)',
    netCashFlow: -2_333_333,
    reserveBalance: 172_000_000,
    dtiPercent: 49.7,
    disposableCap: 25_000_000,
    status: 'DEFICIT',
    statusBadgeText: 'ĐẢO CHI DÒNG TIỀN (-2,33 TR/THÁNG)',
    narrative:
      'Ngay tại Tháng 13, khi lãi ưu đãi 7,0% hết hiệu lực và chuyển sang lãi thả nổi 12,0%/năm trên dư nợ gốc còn lại (1,90 tỷ ₫), số tiền trả ngân hàng tăng thêm +7.333.333 ₫/tháng lên mức 27.333.333 ₫/tháng. Dòng tiền gia đình lập tức chuyển sang âm -2.333.333 ₫/tháng.',
    keyFormulaNote:
      'Tỷ lệ trả nợ/thu nhập (DTI) vọt từ 36,4% lên 49,7% — vượt ngưỡng an toàn 40% của chuẩn quản trị rủi ro tín dụng.',
    svgPathCashFlow: 'M 30 72 L 155 70 L 170 142 C 235 138, 330 118, 490 78',
    svgAreaCashFlow: 'M 30 72 L 155 70 L 170 142 C 235 138, 330 118, 490 78 L 490 120 L 30 120 Z',
    svgHighlightX: 170,
    svgHighlightY: 142,
    svgHighlightLabel: 'Tháng 13: Âm -2,33 tr/tháng',
  },
  {
    index: 2,
    code: '03',
    periodLabel: 'Giai đoạn 03 • Tháng 25 (Cú sốc kép)',
    title: 'Hết 24 tháng ân hạn nợ gốc hoặc giảm 20% thu nhập',
    subtitle: 'Khi áp lực trả gốc nén vào 216 tháng trùng lúc biến động thu nhập gia đình',
    rateLabel: '12,5% – 14,0% / năm + Biến động thu nhập',
    loanAmount: 2_000_000_000,
    monthlyPayment: 30_500_000,
    paymentDeltaLabel: 'Cú sốc kép lãi suất +2% & giảm 20% thu nhập',
    netCashFlow: -16_500_000,
    reserveBalance: 45_000_000,
    dtiPercent: 69.3,
    disposableCap: 14_000_000,
    status: 'CRITICAL',
    statusBadgeText: 'BÀO MÒN QUỸ DỰ PHÒNG KHẨN CẤP',
    narrative:
      'Nếu hợp đồng có 24 tháng ân hạn nợ gốc hoặc gia đình gặp cú sốc giảm 20% thu nhập trong 6 tháng đúng lúc lãi suất thả nổi tăng thêm +2%, thâm hụt vọt lên -16.500.000 ₫/tháng. Quỹ dự phòng khẩn cấp bị rút cạn xuyên thủng ngưỡng an toàn tối thiểu chỉ sau vài quý.',
    keyFormulaNote:
      'Ân hạn nợ gốc không hề miễn nợ gốc — toàn bộ 100% nợ gốc bị nén vào số tháng còn lại khiến nghĩa vụ trả nợ tăng kép tại Tháng 25.',
    svgPathCashFlow: 'M 30 72 L 155 70 L 170 138 L 245 182 C 295 176, 360 135, 490 92',
    svgAreaCashFlow: 'M 30 72 L 155 70 L 170 138 L 245 182 C 295 176, 360 135, 490 92 L 490 120 L 30 120 Z',
    svgHighlightX: 245,
    svgHighlightY: 182,
    svgHighlightLabel: 'Tháng 25: Thâm hụt kép -16,5 tr/tháng',
  },
  {
    index: 3,
    code: '04',
    periodLabel: 'Giai đoạn 04 • Điểm Cân Bằng DepositGuard',
    title: 'Bộ giải ngược xác lập trần vay an toàn 1.639.344.311 ₫',
    subtitle: 'Bảo toàn dòng tiền dương suốt 240 tháng ngay cả khi lãi suất thả nổi 12%/năm',
    rateLabel: '12,0% / năm (Đã khóa trần vay an toàn)',
    loanAmount: 1_639_344_311,
    monthlyPayment: 22_397_705,
    paymentDeltaLabel: 'Giảm nợ vay về ~1,64 tỷ ₫ (Tăng vốn tự có +360,6 tr)',
    netCashFlow: 2_602_295,
    reserveBalance: 231_227_540,
    dtiPercent: 40.7,
    disposableCap: 25_000_000,
    status: 'SOLVED',
    statusBadgeText: 'ĐÃ CÂN BẰNG: DÒNG TIỀN DƯƠNG 240 THÁNG',
    narrative:
      'Thay vì vay 2,0 tỷ ₫ theo lời khuyên cảm tính, thuật toán tìm kiếm nhị phân (Binary Search Reverse Solver) của DepositGuard xác định trần vay an toàn cho gia đình là 1.639.344.311 ₫ (~1,64 tỷ ₫). Ngay cả tại đỉnh lãi thả nổi Tháng 13 (12%/năm), dòng tiền vẫn dương +2.602.295 ₫/tháng.',
    keyFormulaNote:
      'Biết con số 1,64 tỷ ₫ trước khi đặt cọc giúp bạn chủ động đàm phán giá nhà, chuẩn bị thêm vốn tự có hoặc chọn căn hộ vừa sức.',
    svgPathCashFlow: 'M 30 62 L 155 60 L 170 94 C 245 88, 350 72, 490 48',
    svgAreaCashFlow: 'M 30 62 L 155 60 L 170 94 C 245 88, 350 72, 490 48 L 490 120 L 30 120 Z',
    svgHighlightX: 170,
    svgHighlightY: 94,
    svgHighlightLabel: 'Tháng 13 (Vay 1,64 tỷ): Vẫn dư +2,60 tr/tháng',
  },
];

export default function ScrollytellingTimeline() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const chapterRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idxAttr = entry.target.getAttribute('data-chapter-index');
            if (idxAttr !== null) {
              const parsed = Number(idxAttr);
              if (!Number.isNaN(parsed)) {
                setActiveIndex(parsed);
              }
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '-25% 0px -45% 0px',
        threshold: 0.25,
      }
    );

    chapterRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const current = SCROLLY_CHAPTERS[activeIndex] || SCROLLY_CHAPTERS[0];
  const paymentBarWidth = Math.min(100, Math.round((current.monthlyPayment / 35_000_000) * 100));
  const capBarWidth = Math.min(100, Math.round((current.disposableCap / 35_000_000) * 100));

  return (
    <div className="space-y-10">
      {/* Editorial Section Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end pb-6 border-b border-slate-200">
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-extrabold uppercase tracking-widest text-blue-800 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-md">
              01 / DIỄN BIẾN DÒNG TIỀN 240 THÁNG
            </span>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              CHRONOLOGICAL STRESS THEATER
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Giải phẫu 4 giai đoạn định đoạt số phận khoản tiền đặt cọc.
          </h2>
        </div>
        <div className="lg:col-span-5">
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Cuộn dọc hoặc chọn từng giai đoạn bên dưới để quan sát cách một khoản vay mua nhà{' '}
            <strong className="font-mono text-slate-900">2.000.000.000 ₫</strong> chuyển từ trạng thái
            dư giả trong năm đầu sang thâm hụt dòng tiền ở Tháng 13 &amp; Tháng 25.
          </p>
        </div>
      </div>

      {/* Two-Column Apple / Wise Scrollytelling Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: 4 Chronological Editorial Chapters */}
        <div className="lg:col-span-6 divide-y divide-slate-200 border-t border-b border-slate-200">
          {SCROLLY_CHAPTERS.map((chapter, idx) => {
            const isActive = activeIndex === idx;
            const isNegative = chapter.netCashFlow < 0;

            return (
              <div
                key={chapter.code}
                ref={(el) => {
                  chapterRefs.current[idx] = el;
                }}
                data-chapter-index={idx}
                onClick={() => setActiveIndex(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveIndex(idx);
                  }
                }}
                className={`py-8 sm:py-10 px-4 sm:px-6 transition-all duration-300 cursor-pointer relative ${
                  isActive
                    ? 'bg-white shadow-sm border-l-4 border-l-blue-700'
                    : 'bg-transparent hover:bg-slate-50/80 opacity-75 hover:opacity-100'
                }`}
              >
                <div className="space-y-4">
                  {/* Chapter Number & Period Meta */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-mono text-2xl sm:text-3xl font-extrabold tabular-nums ${
                          isActive ? 'text-blue-800' : 'text-slate-400'
                        }`}
                      >
                        {chapter.code}
                      </span>
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                        {chapter.periodLabel}
                      </span>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-md font-mono text-[11px] font-bold uppercase tracking-wider border ${
                        chapter.status === 'SAFE' || chapter.status === 'SOLVED'
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                          : chapter.status === 'DEFICIT'
                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                          : 'bg-rose-50 text-rose-900 border-rose-300'
                      }`}
                    >
                      {chapter.statusBadgeText}
                    </span>
                  </div>

                  {/* Chapter Headline */}
                  <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
                      {chapter.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-slate-500">
                      {chapter.subtitle}
                    </p>
                  </div>

                  {/* Key Ledger Strip */}
                  <div className="grid grid-cols-3 gap-3 pt-2 pb-2 border-y border-slate-200/80 bg-slate-50/70 px-3 rounded-lg">
                    <div>
                      <span className="block text-[10px] font-mono uppercase text-slate-500">
                        Trả ngân hàng
                      </span>
                      <span className="font-mono text-xs sm:text-sm font-extrabold text-slate-900 tabular-nums">
                        {formatVND(chapter.monthlyPayment)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-mono uppercase text-slate-500">
                        Dòng tiền ròng
                      </span>
                      <span
                        className={`font-mono text-xs sm:text-sm font-extrabold tabular-nums ${
                          isNegative ? 'text-rose-700' : 'text-emerald-700'
                        }`}
                      >
                        {chapter.netCashFlow >= 0
                          ? `+${formatVND(chapter.netCashFlow)}`
                          : formatVND(chapter.netCashFlow)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-mono uppercase text-slate-500">
                        Tỷ lệ DTI
                      </span>
                      <span
                        className={`font-mono text-xs sm:text-sm font-extrabold tabular-nums ${
                          chapter.dtiPercent > 45 ? 'text-rose-700' : 'text-blue-800'
                        }`}
                      >
                        {chapter.dtiPercent.toFixed(1).replace('.', ',')}%
                      </span>
                    </div>
                  </div>

                  {/* Narrative Body */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {chapter.narrative}
                  </p>

                  {/* Editorial Footnote */}
                  <div className="text-xs text-slate-700 bg-slate-100/80 border-l-2 border-slate-400 pl-3 py-1.5">
                    {chapter.keyFormulaNote}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Sticky Institutional Dark Stage */}
        <div className="lg:col-span-6 lg:sticky lg:top-28">
          <div className="bg-[#0B1D30] text-white rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
            {/* Stage Top Header */}
            <div className="px-5 py-4 bg-[#060F1A] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-blue-600 text-white">
                  {current.code} / 04
                </span>
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  {current.periodLabel}
                </span>
              </div>

              <span
                className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase tracking-wider border ${
                  current.netCashFlow >= 0
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                    : 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                }`}
              >
                {current.netCashFlow >= 0 ? 'CASHFLOW SURPLUS' : 'CASHFLOW DEFICIT'}
              </span>
            </div>

            {/* Stage Body */}
            <div className="p-5 sm:p-6 space-y-6">
              {/* Primary Telemetry Readout */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-5 border-b border-slate-800">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                    Dư nợ gốc khoản vay
                  </span>
                  <p className="font-mono text-sm sm:text-base font-extrabold text-white tabular-nums">
                    {formatVND(current.loanAmount)}
                  </p>
                  <span className="text-[11px] text-blue-300 font-mono block">
                    {current.rateLabel}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                    Trả ngân hàng / tháng
                  </span>
                  <p className="font-mono text-base sm:text-lg font-extrabold text-white tabular-nums">
                    {formatVND(current.monthlyPayment)}
                  </p>
                  <span className="text-[11px] text-amber-300 font-mono block">
                    {current.paymentDeltaLabel}
                  </span>
                </div>

                <div className="col-span-2 sm:col-span-1 space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                    Dòng tiền ròng gia đình
                  </span>
                  <p
                    className={`font-mono text-base sm:text-lg font-extrabold tabular-nums ${
                      current.netCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {current.netCashFlow >= 0
                      ? `+${formatVND(current.netCashFlow)}`
                      : formatVND(current.netCashFlow)}
                  </p>
                  <span className="text-[11px] text-slate-400 font-mono block">
                    Dự phòng: {formatCompactVND(current.reserveBalance)}
                  </span>
                </div>
              </div>

              {/* Animated SVG Cash-Flow & Reserve Trajectory Theater */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>QUỸ ĐẠO DÒNG TIỀN RÒNG 240 THÁNG (THÁNG 1 → THÁNG 240)</span>
                  <span className="text-blue-300">DTI: {current.dtiPercent}%</span>
                </div>

                <div className="bg-[#060F1A] rounded-xl border border-slate-800/90 p-3 sm:p-4">
                  <svg
                    viewBox="0 0 520 210"
                    className="w-full h-44 sm:h-48 overflow-visible"
                    role="img"
                    aria-label={`Biểu đồ quỹ đạo dòng tiền 240 tháng cho ${current.title}`}
                  >
                    <defs>
                      <linearGradient id="scrollySafeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="scrollyDeficitGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.05" />
                        <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.4" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Reference Grid Lines */}
                    <line
                      x1="30"
                      y1="45"
                      x2="490"
                      y2="45"
                      stroke="#1E293B"
                      strokeDasharray="3 3"
                      strokeWidth="1"
                    />
                    <text x="32" y="40" fill="#64748B" fontSize="9" fontFamily="monospace">
                      +10 tr ₫/tháng (Vùng tích lũy an toàn)
                    </text>

                    {/* Zero Cash-Flow Baseline (y = 120) */}
                    <line
                      x1="30"
                      y1="120"
                      x2="490"
                      y2="120"
                      stroke="#475569"
                      strokeWidth="1.5"
                    />
                    <text x="32" y="114" fill="#94A3B8" fontSize="9.5" fontFamily="monospace">
                      0 ₫ (Ngưỡng cân bằng thu - chi)
                    </text>

                    {/* Deficit Danger Zone Reference (y = 175) */}
                    <line
                      x1="30"
                      y1="175"
                      x2="490"
                      y2="175"
                      stroke="#881337"
                      strokeDasharray="3 3"
                      strokeWidth="1"
                    />
                    <text x="32" y="192" fill="#FDA4AF" fontSize="9" fontFamily="monospace">
                      Vùng thâm hụt (Ăn mòn quỹ dự phòng khẩn cấp)
                    </text>

                    {/* Vertical Milestone Markers: Month 13 & Month 25 */}
                    <line
                      x1="170"
                      y1="25"
                      x2="170"
                      y2="185"
                      stroke="#334155"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                    <text x="150" y="20" fill="#93C5FD" fontSize="9" fontFamily="monospace">
                      T13 (Hết ưu đãi)
                    </text>

                    <line
                      x1="245"
                      y1="25"
                      x2="245"
                      y2="185"
                      stroke="#334155"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                    <text x="232" y="20" fill="#FCD34D" fontSize="9" fontFamily="monospace">
                      T25 (Hết ân hạn)
                    </text>

                    {/* Dynamic Morphing Area Fill */}
                    <path
                      d={current.svgAreaCashFlow}
                      fill={
                        current.netCashFlow >= 0
                          ? 'url(#scrollySafeGrad)'
                          : 'url(#scrollyDeficitGrad)'
                      }
                      className="transition-all duration-700 ease-out"
                    />

                    {/* Dynamic Morphing Cash-Flow Trajectory Line */}
                    <path
                      d={current.svgPathCashFlow}
                      fill="none"
                      stroke={current.netCashFlow >= 0 ? '#34D399' : '#FB7185'}
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="transition-all duration-700 ease-out"
                    />

                    {/* Active Stage Highlight Node */}
                    <circle
                      cx={current.svgHighlightX}
                      cy={current.svgHighlightY}
                      r="7"
                      fill={current.netCashFlow >= 0 ? '#10B981' : '#F43F5E'}
                      stroke="#0B1D30"
                      strokeWidth="2.5"
                      className="transition-all duration-500 ease-out"
                    />
                    <rect
                      x={Math.min(285, Math.max(30, current.svgHighlightX - 70))}
                      y={current.svgHighlightY > 130 ? current.svgHighlightY - 32 : current.svgHighlightY + 12}
                      width="205"
                      height="20"
                      rx="4"
                      fill="#0F172A"
                      stroke={current.netCashFlow >= 0 ? '#10B981' : '#F43F5E'}
                      strokeWidth="1"
                    />
                    <text
                      x={Math.min(285, Math.max(30, current.svgHighlightX - 70)) + 8}
                      y={
                        (current.svgHighlightY > 130
                          ? current.svgHighlightY - 32
                          : current.svgHighlightY + 12) + 13
                      }
                      fill="#F8FAFC"
                      fontSize="9.5"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {current.svgHighlightLabel}
                    </text>
                  </svg>
                </div>
              </div>

              {/* Dynamic Payment vs Disposable Income Comparison Bars */}
              <div className="space-y-3 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">Khả năng trả nợ tối đa sau sinh hoạt phí:</span>
                    <span className="font-bold text-blue-300 tabular-nums">
                      {formatVND(current.disposableCap)}/tháng
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${capBarWidth}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">Nghĩa vụ trả ngân hàng tại giai đoạn này:</span>
                    <span
                      className={`font-bold tabular-nums ${
                        current.monthlyPayment > current.disposableCap
                          ? 'text-rose-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {formatVND(current.monthlyPayment)}/tháng
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ease-out ${
                        current.monthlyPayment > current.disposableCap
                          ? 'bg-rose-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${paymentBarWidth}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Chapter Selector Controls & Direct Action */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  {SCROLLY_CHAPTERS.map((ch, idx) => (
                    <button
                      key={ch.code}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                        activeIndex === idx
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {ch.code}
                    </button>
                  ))}
                </div>

                <Link
                  href="/kiem-tra-mua-nha"
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Tìm trần vay an toàn của bạn</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
