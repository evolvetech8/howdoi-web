'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  ArrowRight,
  AlertTriangle,
  Calculator,
  Lock,
  TrendingUp,
  Home,
  Wallet,
  FileText,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  Scale,
  Sparkles,
  FileCheck2,
  Users,
  Cpu,
} from 'lucide-react';
import { useSimulation } from '@/lib/depositguard/context';
import { formatVND, formatCompactVND } from '@/lib/depositguard/formatters';
import RiskBadge from '@/components/depositguard/common/RiskBadge';
import DisclaimerBanner from '@/components/depositguard/common/DisclaimerBanner';
import HeroLivePreview from '@/components/depositguard/common/HeroLivePreview';
import RedFlagsChecklist from '@/components/depositguard/common/RedFlagsChecklist';
import InfographicGallery from '@/components/depositguard/common/InfographicGallery';

export default function DepositGuardHomePage() {
  const router = useRouter();
  const { loadGoldenFixture, updateLoan, updateHousehold, resetStressScenario } = useSimulation();

  const handleLoadGoldenExample = () => {
    loadGoldenFixture();
    router.push('/ket-qua');
  };

  const handleLoadPersona = (persona: 'hcm' | 'hanoi' | 'danang') => {
    if (persona === 'hcm') {
      loadGoldenFixture();
    } else if (persona === 'hanoi') {
      updateLoan({
        propertyPrice: 4_200_000_000,
        purchasePrice: 4_200_000_000,
        downPayment: 1_400_000_000,
        loanAmount: 2_800_000_000,
        loanTermMonths: 240,
        repaymentMethod: 'EQUAL_PRINCIPAL',
        promoInterestRate: 7.5,
        promoPeriodMonths: 24,
        postPromoRate: 12.5,
        gracePeriodMonths: 24,
      });
      updateHousehold({
        monthlyNetIncome: 75_000_000,
        essentialLivingExpenses: 40_000_000,
        existingDebtPayments: 0,
        liquidSavings: 1_650_000_000,
        plannedEmergencyReserveFloor: 180_000_000,
      });
      resetStressScenario();
    } else {
      updateLoan({
        propertyPrice: 2_400_000_000,
        purchasePrice: 2_400_000_000,
        downPayment: 1_080_000_000,
        loanAmount: 1_320_000_000,
        loanTermMonths: 240,
        repaymentMethod: 'EQUAL_PRINCIPAL',
        promoInterestRate: 7.0,
        promoPeriodMonths: 12,
        postPromoRate: 11.5,
        gracePeriodMonths: 0,
      });
      updateHousehold({
        monthlyNetIncome: 48_000_000,
        essentialLivingExpenses: 22_000_000,
        existingDebtPayments: 0,
        liquidSavings: 1_350_000_000,
        plannedEmergencyReserveFloor: 132_000_000,
      });
      resetStressScenario();
    }
    router.push('/ket-qua');
  };

  return (
    <div className="space-y-20 pb-16">
      {/* 1. TWO-COLUMN INSTITUTIONAL FINTECH HERO SECTION */}
      <section className="relative pt-8 sm:pt-14 pb-8 overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-white via-emerald-50/20 to-slate-50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-gradient-to-b from-blue-100/50 via-slate-100/30 to-transparent pointer-events-none -z-10 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column: High-Urgency Value Proposition & Proof */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-slate-900 border border-blue-200 text-xs font-bold shadow-2xs">
                <Lock className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                <span>Kiểm tra ẩn danh 100% • Không cần SĐT, Email hay Đăng nhập</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.13]">
                Đừng đặt cọc trước khi biết{' '}
                <span className="text-blue-800">mình có đủ sức trả nợ.</span>
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Tại Việt Nam, <strong>100 – 300 triệu tiền đặt cọc</strong> có thể mất trắng hoặc đẩy gia đình vào thâm hụt ngay <strong>tháng thứ 13 / 25</strong> khi lãi suất ưu đãi 6–7% khép lại và nhảy vọt lên 11–14%/năm. Hãy kiểm định sức chịu đựng của dòng tiền và quỹ dự phòng gia đình trước khi đặt bút ký cọc.
              </p>

              {/* Urgency Highlight Box */}
              <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-xs text-amber-950 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-0.5 leading-relaxed">
                  <strong className="text-amber-900 block">
                    Vì sao không thể chỉ dùng bảng tính lãi vay thông thường?
                  </strong>
                  <span>
                    Ngân hàng duyệt vay dựa trên tài sản thế chấp, nhưng <strong>không tính hộ bạn</strong> xem sau khi lãi thả nổi tăng +4–5% và trừ chi phí nuôi con, tài khoản gia đình còn lại bao nhiêu đồng mỗi tháng.
                  </span>
                </div>
              </div>

              {/* Action CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                <Link
                  href="/kiem-tra-mua-nha"
                  className="px-7 py-3.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-sm sm:text-base shadow-sm transition-all flex items-center justify-center gap-2 min-h-[48px]"
                >
                  <span>Kiểm tra miễn phí</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/bao-cao-mau"
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm sm:text-base border border-slate-200 shadow-2xs transition-all flex items-center justify-center gap-2 min-h-[48px]"
                >
                  <FileCheck2 className="w-4 h-4 text-blue-700" />
                  <span>Xem hồ sơ chẩn đoán mẫu</span>
                </Link>
              </div>

              {/* 4-Metric Institutional Trust Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-200/80">
                <div className="space-y-0.5">
                  <span className="font-mono text-lg sm:text-xl font-extrabold text-slate-900 block">
                    311+
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium block">
                    Kịch bản kiểm định tự động
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="font-mono text-lg sm:text-xl font-extrabold text-blue-800 block">
                    0 VND
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium block">
                    Sai số số học (BigInt Oracle)
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="font-mono text-lg sm:text-xl font-extrabold text-slate-900 block">
                    100%
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium block">
                    Chạy trên trình duyệt
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="font-mono text-lg sm:text-xl font-extrabold text-blue-800 block">
                    0%
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium block">
                    Hoa hồng ngân hàng/môi giới
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive Stress-Test Terminal */}
            <div className="lg:col-span-6">
              <HeroLivePreview />
            </div>
          </div>

          <DisclaimerBanner />
        </div>
      </section>

      {/* 2. INTERACTIVE 5 RED FLAGS SELF-DIAGNOSIS CHECKLIST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RedFlagsChecklist />
      </section>

      {/* 3. THREE REAL-WORLD VIETNAMESE FAMILY CASE STUDIES (1-CLICK PRESETS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5 text-blue-700" />
              <span>Hồ sơ thực tế tại Việt Nam (Bấm 1 chạm để nạp kịch bản)</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              3 Tình Huống Điển Hình Khi Gia Đình Việt Mua Nhà Trả Góp
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Mỗi hồ sơ dưới đây được trích xuất từ bộ kiểm thử thực tế (Tier-4 Persona Suite). Bấm vào bất kỳ hồ sơ nào để mở toàn bộ biểu đồ dòng tiền 240 tháng và bảng điều khiển What-If trên máy của bạn.
            </p>
          </div>
          <Link
            href="/bao-cao-mau"
            className="text-xs sm:text-sm font-bold text-blue-800 hover:text-blue-900 inline-flex items-center gap-1.5 shrink-0"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Xem bản Hồ sơ Chẩn đoán Mẫu đầy đủ →</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Case Study 1: HCM Young Couple */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 flex flex-col justify-between space-y-5 shadow-2xs hover:border-blue-300 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-[11px] font-bold">
                  Hồ sơ #1 • TP.HCM
                </span>
                <RiskBadge status="DEFICIT" size="sm" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                Vợ chồng trẻ mua căn hộ 2,5 – 2,8 tỷ (Vay 2,0 tỷ, ưu đãi 7% năm đầu)
              </h3>
              <dl className="divide-y divide-slate-100 text-xs bg-slate-50 rounded-2xl p-3.5 border border-slate-200/60">
                <div className="py-1.5 flex justify-between">
                  <dt className="text-slate-500">Khoản vay / Kỳ hạn:</dt>
                  <dd className="font-mono font-bold text-slate-900">2,00 tỷ ₫ (240 tháng)</dd>
                </div>
                <div className="py-1.5 flex justify-between">
                  <dt className="text-slate-500">Thu nhập ròng / Chi tiêu:</dt>
                  <dd className="font-mono font-bold text-slate-900">55 tr / 30 tr ₫</dd>
                </div>
                <div className="py-1.5 flex justify-between">
                  <dt className="text-slate-500">Trả Tháng 1 → Tháng 13:</dt>
                  <dd className="font-mono font-bold text-rose-700">20,00 tr → 27,33 tr ₫</dd>
                </div>
              </dl>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Phát hiện từ DepositGuard:</strong> Năm đầu gia đình dư +5 triệu/tháng nhưng ngay Tháng 13 khi lãi thả nổi lên 12%, dòng tiền âm <strong>-2,33 triệu/tháng</strong>. Cần giảm nợ vay về 1,64 tỷ để an toàn.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleLoadPersona('hcm')}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-blue-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Nạp Hồ sơ #1 vào Bảng kết quả</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Case Study 2: Hanoi 24m Grace Period Cliff */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 flex flex-col justify-between space-y-5 shadow-2xs hover:border-blue-300 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-[11px] font-bold">
                  Hồ sơ #2 • Hà Nội (Ân hạn gốc 24T)
                </span>
                <RiskBadge status="DEFICIT" size="sm" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                Gia đình nâng cấp căn hộ 4,2 tỷ (Vay 2,8 tỷ, ân hạn gốc 24 tháng)
              </h3>
              <dl className="divide-y divide-slate-100 text-xs bg-slate-50 rounded-2xl p-3.5 border border-slate-200/60">
                <div className="py-1.5 flex justify-between">
                  <dt className="text-slate-500">Khoản vay / Ân hạn gốc:</dt>
                  <dd className="font-mono font-bold text-slate-900">2,80 tỷ ₫ (Ân hạn 24T)</dd>
                </div>
                <div className="py-1.5 flex justify-between">
                  <dt className="text-slate-500">Thu nhập ròng / Chi tiêu:</dt>
                  <dd className="font-mono font-bold text-slate-900">75 tr / 40 tr ₫</dd>
                </div>
                <div className="py-1.5 flex justify-between">
                  <dt className="text-slate-500">Trả Tháng 1 → Tháng 25:</dt>
                  <dd className="font-mono font-bold text-rose-700">17,50 tr → 42,13 tr ₫</dd>
                </div>
              </dl>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Phát hiện từ DepositGuard:</strong> 24 tháng đầu chỉ trả lãi 17,5 tr/tháng. Nhưng tại <strong>Tháng 25</strong>, nợ gốc bị nén vào 216 tháng cộng lãi thả nổi 12,5% đẩy tiền trả lên <strong>42,13 tr/tháng</strong>!
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleLoadPersona('hanoi')}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-blue-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Nạp Hồ sơ #2 vào Bảng kết quả</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Case Study 3: Safe Cushion Profile */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 flex flex-col justify-between space-y-5 shadow-2xs hover:border-blue-300 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-[11px] font-bold">
                  Hồ sơ #3 • Chuẩn An Toàn (45% Vốn)
                </span>
                <RiskBadge status="SAFE" size="sm" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                Mua nhà 2,4 tỷ khi đã tích lũy 45% vốn tự có &amp; quỹ dự phòng 6 tháng
              </h3>
              <dl className="divide-y divide-slate-100 text-xs bg-slate-50 rounded-2xl p-3.5 border border-slate-200/60">
                <div className="py-1.5 flex justify-between">
                  <dt className="text-slate-500">Khoản vay / Kỳ hạn:</dt>
                  <dd className="font-mono font-bold text-slate-900">1,32 tỷ ₫ (240 tháng)</dd>
                </div>
                <div className="py-1.5 flex justify-between">
                  <dt className="text-slate-500">Thu nhập ròng / Chi tiêu:</dt>
                  <dd className="font-mono font-bold text-slate-900">48 tr / 22 tr ₫</dd>
                </div>
                <div className="py-1.5 flex justify-between">
                  <dt className="text-slate-500">Trả Tháng 1 → Tháng 13:</dt>
                  <dd className="font-mono font-bold text-blue-800">13,20 tr → 17,52 tr ₫</dd>
                </div>
              </dl>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Phát hiện từ DepositGuard:</strong> Ngay cả khi hết ưu đãi 7% và lên 11,5% ở Tháng 13, nghĩa vụ trả nợ chỉ chiếm 36,5% thu nhập ròng; gia đình vẫn dư <strong>+8,48 triệu/tháng</strong>.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleLoadPersona('danang')}
              className="w-full py-3 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Nạp Hồ sơ #3 vào Bảng kết quả</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. TWO-MINUTE WORKED EXAMPLE (GOLDEN FIXTURE BREAKDOWN) */}
      <section id="vi-du-mo-phong" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-10 border-b border-slate-100 bg-slate-50/60 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-100/80 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                Ví dụ kiểm định chuẩn trong 2 phút (Golden Fixture Mục 4.6 PRD)
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Vì sao tháng đầu trả nợ rất nhẹ, nhưng tháng 13 lại hụt dòng tiền?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Giả định minh họa: Gia đình mua căn hộ {formatCompactVND(2_500_000_000)}, vốn tự có {formatCompactVND(500_000_000)}, vay ngân hàng {formatVND(2_000_000_000)} trong 240 tháng (20 năm), trả gốc đều hàng tháng.
              </p>
            </div>
            <button
              type="button"
              onClick={handleLoadGoldenExample}
              className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-blue-800 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer min-h-[44px]"
            >
              <span>Mở kịch bản mẫu trên bảng kết quả</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Assumptions Column */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Thông số đầu vào minh bạch
              </h3>
              <dl className="divide-y divide-slate-100 text-xs sm:text-sm bg-slate-50 rounded-2xl p-4 border border-slate-200/70">
                <div className="py-2.5 flex justify-between gap-2">
                  <dt className="text-slate-600">Giá mua căn hộ / Vốn tự có:</dt>
                  <dd className="font-mono font-bold text-slate-900">2,5 tỷ ₫ / 500 tr ₫</dd>
                </div>
                <div className="py-2.5 flex justify-between gap-2">
                  <dt className="text-slate-600">Số tiền vay (240 tháng):</dt>
                  <dd className="font-mono font-bold text-slate-900">{formatVND(2_000_000_000)}</dd>
                </div>
                <div className="py-2.5 flex justify-between gap-2">
                  <dt className="text-slate-600">Lãi ưu đãi 12 tháng đầu:</dt>
                  <dd className="font-mono font-bold text-blue-800">7,0% / năm</dd>
                </div>
                <div className="py-2.5 flex justify-between gap-2">
                  <dt className="text-slate-600">Lãi dự kiến từ tháng 13:</dt>
                  <dd className="font-mono font-bold text-amber-700">12,0% / năm</dd>
                </div>
                <div className="py-2.5 flex justify-between gap-2">
                  <dt className="text-slate-600">Thu nhập ròng gia đình:</dt>
                  <dd className="font-mono font-bold text-slate-900">{formatVND(55_000_000)}/tháng</dd>
                </div>
                <div className="py-2.5 flex justify-between gap-2">
                  <dt className="text-slate-600">Chi phí sinh hoạt thiết yếu:</dt>
                  <dd className="font-mono font-bold text-slate-900">{formatVND(30_000_000)}/tháng</dd>
                </div>
              </dl>
            </div>

            {/* Output Comparison Column */}
            <div className="lg:col-span-7 space-y-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Diễn biến nghĩa vụ trả nợ &amp; dòng tiền
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/50 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase text-blue-900">
                    Tháng 1 (Đang ưu đãi 7%)
                  </span>
                  <p className="font-mono text-xl font-extrabold text-slate-900">
                    {formatVND(20_000_000)}
                  </p>
                  <p className="text-xs text-slate-600">
                    Gốc 8,33 tr + Lãi 11,67 tr. Sau chi tiêu thiết yếu (30 tr), gia đình còn dư <strong>+5,00 tr ₫/tháng</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/60 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase text-amber-900">
                    Tháng 13 (Hết ưu đãi → 12%)
                  </span>
                  <p className="font-mono text-xl font-extrabold text-amber-900">
                    {formatVND(27_333_333)}
                  </p>
                  <p className="text-xs text-slate-700">
                    Tăng vọt <strong>+{formatVND(7_333_333)}/tháng</strong> ngay khi hết ưu đãi. Dòng tiền rơi vào vùng <strong>thiếu hụt (-2,33 tr ₫/tháng)</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50/60 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase text-rose-900">
                    Khi lãi +2% hoặc giảm thu nhập
                  </span>
                  <p className="text-xl font-extrabold text-rose-900">
                    Tháng 13 âm nặng
                  </p>
                  <p className="text-xs text-slate-700">
                    Nếu lãi thả nổi lên 14% hoặc thu nhập giảm 20% trong 6 tháng, quỹ dự phòng bắt đầu bị bào mòn nhanh từ <strong>Tháng 13</strong>.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-bold text-blue-300">
                    Đòn bẩy điều chỉnh khả thi từ bộ giải ngược (Reverse Solver):
                  </p>
                  <p className="text-xs text-slate-300">
                    Giảm khoản vay về khoảng <strong>1,64 tỷ ₫</strong> (tăng vốn tự có hoặc chọn căn nhà giá mềm hơn) giúp dòng tiền tháng 13 không bị âm ở mức lãi 12%/năm.
                  </p>
                </div>
                <Link
                  href="/kiem-tra-mua-nha"
                  className="shrink-0 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors"
                >
                  Thử với số liệu của bạn
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE VISUAL INFOGRAPHIC GALLERY (FROM PLAN/Media/) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InfographicGallery />
      </section>

      {/* 6. THREE CLEAR STEPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
            Quy trình thẩm định 3 bước minh bạch
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Kiểm tra toàn diện trước khi đặt cọc trong 3 bước
          </h2>
          <p className="text-sm text-slate-600">
            Không yêu cầu tài khoản, không hỏi số căn cước hay thông tin liên hệ cá nhân.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 font-extrabold flex items-center justify-center border border-blue-200">
              <Home className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold uppercase text-blue-800">Bước 1</div>
            <h3 className="text-lg font-bold text-slate-900">Mô tả căn nhà &amp; vốn tự có</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Nhập giá mua dự kiến, số tiền đặt cọc/vốn tự có, chi phí sang tên, quỹ bảo trì 2%, nội thất ban đầu và phí quản lý định kỳ hàng tháng.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 font-extrabold flex items-center justify-center border border-blue-200">
              <Wallet className="w-5 h-5" />
            </div>
            <div className="text-xs sm:text-sm font-bold uppercase text-blue-800">Bước 2</div>
            <h3 className="text-lg font-bold text-slate-900">Ngân sách &amp; quỹ dự phòng gia đình</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Khai báo thu nhập thực nhận (Net), chi phí sinh hoạt thiết yếu, các khoản trả góp hiện hữu và ngưỡng quỹ dự phòng khẩn cấp không được phép chạm tới.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 font-extrabold flex items-center justify-center border border-blue-200">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-xs sm:text-sm font-bold uppercase text-blue-800">Bước 3</div>
            <h3 className="text-lg font-bold text-slate-900">Gói vay &amp; kiểm tra kịch bản sốc</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              So sánh trả gốc đều (dư nợ giảm dần) và trả góp đều (niên kim), thời gian ưu đãi, ân hạn nợ gốc và thử nghiệm cú sốc lãi suất +2%, +4% hoặc giảm 20% thu nhập.
            </p>
          </div>
        </div>
      </section>

      {/* 7. WHAT REGULAR CALCULATORS MISS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Điểm khác biệt cốt lõi
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              Những gì các công cụ tính lãi vay thông thường bỏ sót
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Hầu hết bảng tính trực tuyến chỉ nhân một mức lãi suất cố định với số tiền vay. Trong thực tế tại Việt Nam, rủi ro nằm ở giai đoạn chuyển tiếp sau ưu đãi và biến động thu chi gia đình.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-sm text-white">Cú nhảy lãi suất tháng 13 / 25</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Khi hết ưu đãi 6–8%/năm và chuyển sang lãi thả nổi (lãi cơ sở + biên độ 3,5–4,5%), số tiền trả hàng tháng có thể tăng thêm 25–40%.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
              <Wallet className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-sm text-white">Chi phí sinh hoạt &amp; nợ hiện hữu</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tỷ lệ trả nợ trên thu nhập (DTI) chỉ có ý nghĩa khi trừ đi chi phí ăn ở, học phí con cái và các khoản trả góp thẻ tín dụng/vay mua xe đang có.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
              <ShieldCheck className="w-5 h-5 text-blue-300" />
              <h3 className="font-bold text-sm text-white">Độ bền của quỹ dự phòng</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Dồn toàn bộ tiền mặt để trả vốn tự có khiến gia đình mất bộ đệm khẩn cấp khi ốm đau, sửa nhà hoặc gián đoạn công việc 3–6 tháng.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
              <Scale className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-sm text-white">Ảo giác từ ân hạn nợ gốc</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ân hạn gốc giúp chỉ trả lãi trong 12–24 tháng đầu, nhưng toàn bộ nợ gốc sẽ dồn vào số tháng còn lại khiến áp lực tăng kép sau khi hết ân hạn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. NON-ALARMIST RISK TAXONOMY & BANK OFFER GUIDE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 space-y-5">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
              Phân loại rủi ro minh bạch
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Không hù dọa, không hứa hẹn &ldquo;chắc chắn được duyệt&rdquo;
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              DepositGuard không bao giờ gắn nhãn <em>&ldquo;An toàn tuyệt đối&rdquo;</em> hay <em>&ldquo;Ngân hàng đã duyệt&rdquo;</em>. Mọi cảnh báo đều truy xuất được tới từng tháng cụ thể trong bảng dòng tiền:
            </p>
          </div>

          <div className="space-y-4 pt-1">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
              <RiskBadge status="SAFE" showDescription />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
              <RiskBadge status="VULNERABLE" showDescription />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
              <RiskBadge status="DEFICIT" showDescription />
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
              Cách làm việc với báo giá ngân hàng
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Dùng thông số thực từ ngân hàng hoặc kịch bản giả định rõ ràng
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Mỗi ngân hàng thương mại có cách xác định lãi suất cơ sở, biên độ cộng thêm và quy ước tính ngày (actual/365 hoặc actual/360) riêng. DepositGuard giúp bạn:
            </p>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Tự nhập đúng báo giá đang cầm trên tay:</strong> Nhập lãi ưu đãi, số tháng ưu đãi, lãi thả nổi dự kiến và thời gian ân hạn gốc.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Không tự bịa &ldquo;lãi suất thị trường&rdquo;:</strong> Nếu bạn chưa có báo giá ngân hàng, công cụ cung cấp mẫu minh họa được ghi chú rõ là <em>giả định tham khảo</em>.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Chuẩn bị câu hỏi bằng văn bản cho tín dụng viên:</strong> Biết chính xác cần hỏi gì về biên độ sau ưu đãi, phí trả nợ trước hạn và phí bảo hiểm khoản vay.
                </span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3">
            <Link
              href="/cach-tinh"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-800 hover:text-blue-900"
            >
              <BookOpen className="w-4 h-4" />
              <span>Xem chi tiết công thức toán học</span>
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              href="/cau-hoi-thuong-gap"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-blue-800"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Giải thích thuật ngữ vay mua nhà</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 9. PRIVACY, FREE BETA COMMITMENT & ARCHONIC TRUST ARCHITECTURE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-3">
            <Lock className="w-6 h-6 text-blue-700" />
            <h3 className="text-base font-bold text-slate-900">
              Quyền riêng tư &amp; Xử lý trên thiết bị
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Toàn bộ phép tính chạy trực tiếp trên trình duyệt của bạn. Thu nhập, số dư tiết kiệm, giá nhà và số tiền vay không bao giờ bị đính kèm vào URL hay gửi về máy chủ phân tích.
            </p>
            <Link href="/bao-mat" className="inline-block text-xs font-bold text-blue-800 hover:underline">
              Đọc chính sách bảo mật (Luật 91/2025/QH15) →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-3">
            <FileText className="w-6 h-6 text-blue-700" />
            <h3 className="text-base font-bold text-slate-900">
              Không giấu cảnh báo sau tường phí
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bản miễn phí (Phase P0) cung cấp đầy đủ 6 chỉ số rủi ro cốt lõi, kịch bản sốc lãi suất/thu nhập, đòn bẩy điều chỉnh và bảng lịch trả nợ chi tiết từng tháng.
            </p>
            <Link href="/ve-evolvetech" className="inline-block text-xs font-bold text-blue-800 hover:underline">
              Tìm hiểu nguyên tắc vận hành EvolveTech →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-3">
            <Cpu className="w-6 h-6 text-blue-700" />
            <h3 className="text-base font-bold text-slate-900">
              Độc lập &amp; Kiểm định bởi Archonic
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Vận hành độc lập bởi Archonic (EvolveTech), không nhận hoa hồng ẩn để điều hướng kết quả sang bất kỳ ngân hàng hay sàn môi giới nào. Đã vượt qua 311+ bài kiểm thử toán học tự động.
            </p>
            <Link href="/lien-he" className="inline-block text-xs font-bold text-blue-800 hover:underline">
              Góp ý hoặc báo cáo sai lệch phép tính →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
