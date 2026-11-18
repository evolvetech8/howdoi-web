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
} from 'lucide-react';
import { useSimulation } from '@/lib/depositguard/context';
import { formatVND, formatCompactVND } from '@/lib/depositguard/formatters';
import RiskBadge from '@/components/depositguard/common/RiskBadge';
import DisclaimerBanner from '@/components/depositguard/common/DisclaimerBanner';

export default function DepositGuardHomePage() {
  const router = useRouter();
  const { loadGoldenFixture } = useSimulation();

  const handleLoadGoldenExample = () => {
    loadGoldenFixture();
    router.push('/ket-qua');
  };

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 pb-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-gradient-to-b from-emerald-100/60 via-teal-50/30 to-transparent pointer-events-none -z-10 blur-3xl" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-semibold shadow-2xs">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Kiểm tra ẩn danh 100% • Không cần SĐT, Email hay Đăng nhập</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15] max-w-4xl mx-auto">
            Đừng đặt cọc trước khi biết{' '}
            <span className="text-emerald-700">mình có đủ sức trả nợ.</span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Mô phỏng dòng tiền gia đình, lịch trả nợ sau khi hết lãi suất ưu đãi và sức chịu đựng của quỹ dự phòng trước các kịch bản tăng lãi suất hoặc giảm thu nhập — trước khi bạn ký hợp đồng đặt cọc mua nhà.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2">
            <Link
              href="/kiem-tra-mua-nha"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-sm transition-all flex items-center justify-center gap-2 min-h-[48px]"
            >
              <span>Kiểm tra miễn phí</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#vi-du-mo-phong"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm sm:text-base border border-slate-200 shadow-2xs transition-all flex items-center justify-center gap-2 min-h-[48px]"
            >
              <Calculator className="w-4 h-4 text-emerald-600" />
              <span>Xem ví dụ báo cáo 2 phút</span>
            </a>
          </div>

          <div className="max-w-3xl mx-auto pt-4">
            <DisclaimerBanner />
          </div>
        </div>
      </section>

      {/* 2. TWO-MINUTE WORKED EXAMPLE (GOLDEN FIXTURE) */}
      <section id="vi-du-mo-phong" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-10 border-b border-slate-100 bg-slate-50/60 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                Ví dụ thực tế trong 2 phút (Kịch bản minh họa chuẩn)
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
              className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer min-h-[44px]"
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
                  <dd className="font-bold text-slate-900">2,5 tỷ ₫ / 500 tr ₫</dd>
                </div>
                <div className="py-2.5 flex justify-between gap-2">
                  <dt className="text-slate-600">Số tiền vay (240 tháng):</dt>
                  <dd className="font-bold text-slate-900">{formatVND(2_000_000_000)}</dd>
                </div>
                <div className="py-2.5 flex justify-between gap-2">
                  <dt className="text-slate-600">Lãi ưu đãi 12 tháng đầu:</dt>
                  <dd className="font-bold text-emerald-700">7,0% / năm</dd>
                </div>
                <div className="py-2.5 flex justify-between gap-2">
                  <dt className="text-slate-600">Lãi dự kiến từ tháng 13:</dt>
                  <dd className="font-bold text-amber-700">12,0% / năm</dd>
                </div>
                <div className="py-2.5 flex justify-between gap-2">
                  <dt className="text-slate-600">Thu nhập ròng gia đình:</dt>
                  <dd className="font-bold text-slate-900">{formatVND(55_000_000)}/tháng</dd>
                </div>
                <div className="py-2.5 flex justify-between gap-2">
                  <dt className="text-slate-600">Chi phí sinh hoạt thiết yếu:</dt>
                  <dd className="font-bold text-slate-900">{formatVND(30_000_000)}/tháng</dd>
                </div>
              </dl>
            </div>

            {/* Output Comparison Column */}
            <div className="lg:col-span-7 space-y-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Diễn biến nghĩa vụ trả nợ & dòng tiền
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase text-emerald-800">
                    Tháng 1 (Đang ưu đãi 7%)
                  </span>
                  <p className="text-xl font-extrabold text-slate-900">
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
                  <p className="text-xl font-extrabold text-amber-900">
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
                  <p className="text-xs sm:text-sm font-bold text-emerald-300">
                    Đòn bẩy điều chỉnh khả thi từ bộ giải ngược (Reverse Solver):
                  </p>
                  <p className="text-xs text-slate-300">
                    Giảm khoản vay về khoảng <strong>1,64 tỷ ₫</strong> (tăng vốn tự có hoặc chọn căn nhà giá mềm hơn) giúp dòng tiền tháng 13 không bị âm ở mức lãi 12%/năm.
                  </p>
                </div>
                <Link
                  href="/kiem-tra-mua-nha"
                  className="shrink-0 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  Thử với số liệu của bạn
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THREE CLEAR STEPS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Quy trình 3 bước minh bạch
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
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 font-extrabold flex items-center justify-center border border-emerald-200">
              <Home className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold uppercase text-emerald-700">Bước 1</div>
            <h3 className="text-lg font-bold text-slate-900">Mô tả căn nhà & vốn tự có</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Nhập giá mua dự kiến, số tiền đặt cọc/vốn tự có, chi phí sang tên, nội thất ban đầu và phí quản lý định kỳ hàng tháng.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 font-extrabold flex items-center justify-center border border-emerald-200">
              <Wallet className="w-5 h-5" />
            </div>
            <div className="text-xs sm:text-sm font-bold uppercase text-emerald-700">Bước 2</div>
            <h3 className="text-lg font-bold text-slate-900">Ngân sách & quỹ dự phòng gia đình</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Khai báo thu nhập thực nhận (Net), chi phí sinh hoạt thiết yếu, các khoản trả góp hiện hữu và ngưỡng quỹ dự phòng khẩn cấp không được phép chạm tới.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 font-extrabold flex items-center justify-center border border-emerald-200">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-xs sm:text-sm font-bold uppercase text-emerald-700">Bước 3</div>
            <h3 className="text-lg font-bold text-slate-900">Gói vay & kiểm tra kịch bản sốc</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              So sánh trả gốc đều (dư nợ giảm dần) và trả góp đều (niên kim), thời gian ưu đãi, ân hạn nợ gốc và thử nghiệm cú sốc lãi suất +2%, +4% hoặc giảm 20% thu nhập.
            </p>
          </div>
        </div>
      </section>

      {/* 4. WHAT REGULAR CALCULATORS MISS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
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
              <Wallet className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-sm text-white">Chi phí sinh hoạt & nợ hiện hữu</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tỷ lệ trả nợ trên thu nhập (DTI) chỉ có ý nghĩa khi trừ đi chi phí ăn ở, học phí con cái và các khoản trả góp thẻ tín dụng/vay mua xe đang có.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
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

      {/* 5. NON-ALARMIST RISK TAXONOMY & BANK OFFER GUIDE */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 space-y-5">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
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
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
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
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Tự nhập đúng báo giá đang cầm trên tay:</strong> Nhập lãi ưu đãi, số tháng ưu đãi, lãi thả nổi dự kiến và thời gian ân hạn gốc.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Không tự bịa &ldquo;lãi suất thị trường&rdquo;:</strong> Nếu bạn chưa có báo giá ngân hàng, công cụ cung cấp mẫu minh họa được ghi chú rõ là <em>giả định tham khảo</em>.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Chuẩn bị câu hỏi bằng văn bản cho tín dụng viên:</strong> Biết chính xác cần hỏi gì về biên độ sau ưu đãi, phí trả nợ trước hạn và phí bảo hiểm khoản vay.
                </span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3">
            <Link
              href="/cach-tinh"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800"
            >
              <BookOpen className="w-4 h-4" />
              <span>Xem chi tiết công thức toán học</span>
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              href="/cau-hoi-thuong-gap"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-emerald-700"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Giải thích thuật ngữ vay mua nhà</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. PRIVACY, FREE BETA COMMITMENT & TRUST LINKS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-3">
            <Lock className="w-6 h-6 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              Quyền riêng tư & Xử lý trên thiết bị
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Toàn bộ phép tính chạy trực tiếp trên trình duyệt của bạn. Thu nhập, số dư tiết kiệm, giá nhà và số tiền vay không bao giờ bị đính kèm vào URL hay gửi về máy chủ phân tích.
            </p>
            <Link href="/bao-mat" className="inline-block text-xs font-bold text-emerald-700 hover:underline">
              Đọc chính sách bảo mật (Luật 91/2025/QH15) →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-3">
            <FileText className="w-6 h-6 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              Không giấu cảnh báo sau tường phí
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bản miễn phí (Phase P0) cung cấp đầy đủ 6 chỉ số rủi ro cốt lõi, kịch bản sốc lãi suất/thu nhập, đòn bẩy điều chỉnh và bảng lịch trả nợ chi tiết từng tháng.
            </p>
            <Link href="/ve-evolvetech" className="inline-block text-xs font-bold text-emerald-700 hover:underline">
              Tìm hiểu nguyên tắc vận hành EvolveTech →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-3">
            <Scale className="w-6 h-6 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              Độc lập & Minh bạch phương pháp
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Vận hành độc lập bởi Archonic (EvolveTech), không nhận hoa hồng ẩn để điều hướng kết quả sang bất kỳ ngân hàng hay sàn môi giới nào. Công thức mở hoàn toàn để đối chiếu.
            </p>
            <Link href="/lien-he" className="inline-block text-xs font-bold text-emerald-700 hover:underline">
              Góp ý hoặc báo cáo sai lệch phép tính →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
