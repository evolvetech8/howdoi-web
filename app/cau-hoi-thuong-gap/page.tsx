import type { Metadata } from 'next';
import Link from 'next/link';
import { HelpCircle, Calculator, BookOpen, ArrowRight } from 'lucide-react';
import FaqAccordion from '@/components/depositguard/common/FaqAccordion';
import DisclaimerBanner from '@/components/depositguard/common/DisclaimerBanner';

export const metadata: Metadata = {
  title: 'Câu Hỏi Thường Gặp Về Vay Mua Nhà & Lãi Suất Thả Nổi | EvolveTech DepositGuard',
  description:
    'Giải đáp chi tiết về lãi suất ưu đãi, biên độ lãi suất thả nổi tháng 13/25, ân hạn nợ gốc, tỷ lệ DTI hộ gia đình và quyền riêng tư khi mô phỏng trên DepositGuard.',
  alternates: {
    canonical: 'https://www.evolvetech.biz.vn/cau-hoi-thuong-gap',
  },
};

export default function CauHoiThuongGapPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold">
          <HelpCircle className="w-3.5 h-3.5 text-blue-700" />
          <span>Kiến thức &amp; Thuật ngữ Vay mua nhà</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Câu hỏi thường gặp (FAQ)
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Hiểu rõ cơ chế lãi suất thả nổi, ân hạn nợ gốc, quỹ dự phòng khẩn cấp và phạm vi hoạt động của công cụ mô phỏng DepositGuard trước khi bạn xuống tiền đặt cọc.
        </p>
      </header>

      <FaqAccordion />

      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-bold">
            Bạn đã sẵn sàng kiểm tra với thông số căn nhà thực tế?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Hoàn toàn miễn phí, không cần tạo tài khoản hay nhập số điện thoại.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/kiem-tra-mua-nha"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold transition-colors"
          >
            <Calculator className="w-4 h-4" />
            <span>Kiểm tra miễn phí</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/cach-tinh"
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>Xem công thức</span>
          </Link>
        </div>
      </div>

      <DisclaimerBanner />
    </div>
  );
}
