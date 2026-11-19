import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, UserCheck, Scale, Lock, ArrowRight, Calculator, BookOpen } from 'lucide-react';
import DisclaimerBanner from '@/components/depositguard/common/DisclaimerBanner';

export const metadata: Metadata = {
  title: 'Về EvolveTech & Cam Kết Độc Lập Tài Chính | EvolveTech DepositGuard',
  description:
    'Thông tin đơn vị vận hành EvolveTech (Archonic), nguyên tắc độc lập tài chính, không nhận hoa hồng ẩn từ ngân hàng hay sàn môi giới bất động sản.',
  alternates: {
    canonical: 'https://www.evolvetech.biz.vn/ve-evolvetech',
  },
};

export default function VeEvolveTechPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold">
          <UserCheck className="w-3.5 h-3.5 text-blue-700" />
          <span>Minh bạch đơn vị vận hành &amp; Mô hình hoạt động</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Về EvolveTech &amp; Nguyên tắc độc lập của DepositGuard
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          EvolveTech.biz.vn (với mô-đun cốt lõi <strong>DepositGuard</strong>) được xây dựng nhằm giúp người mua nhà để ở tại Việt Nam nhìn rõ áp lực trả nợ dài hạn và rủi ro lãi suất thả nổi trước khi đặt bút ký hợp đồng đặt cọc.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center border border-blue-200">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            1. Đơn vị vận hành là ai?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Nền tảng được phát triển và vận hành độc lập bởi <strong>Archonic</strong> (công ty công nghệ đứng sau hệ sinh thái sản phẩm <strong>EvolveTech</strong> tại <strong>evolvetech.biz.vn</strong>). Các ứng dụng di động iOS và dự án phần mềm khác được lưu trữ tại danh mục kỹ thuật <Link href="/projects" className="text-blue-800 font-semibold hover:underline">/projects</Link>, kết hợp cùng mô-đun chuyên sâu <strong>DepositGuard</strong> phục vụ bài toán an toàn tài chính khi mua nhà.
          </p>
        </section>

        <section className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center border border-blue-200">
            <Scale className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            2. Nguồn thu &amp; Cam kết không xung đột lợi ích
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Bộ mô phỏng cốt lõi (Phase P0) hoàn toàn miễn phí và không bao giờ ẩn các cảnh báo thiếu hụt dòng tiền đằng sau tường phí. EvolveTech <strong>không nhận hoa hồng môi giới ẩn</strong> để điều chỉnh công thức theo hướng khuyến khích người dùng vay vượt quá khả năng chi trả, và <strong>không bán thông tin cá nhân</strong> cho sàn bất động sản hay nhân viên tín dụng.
          </p>
        </section>
      </div>

      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
          <Lock className="w-5 h-5 text-blue-700" />
          <span>3. Bốn nguyên tắc bất khả xâm phạm của DepositGuard</span>
        </h2>
        <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
          <li>
            <strong className="text-slate-900">• Không giả danh quyết định phê duyệt của ngân hàng:</strong> Công cụ chỉ đo lường sức chịu đựng dòng tiền của chính gia đình bạn dựa trên thu nhập ròng và chi phí bạn nhập vào.
          </li>
          <li>
            <strong className="text-slate-900">• Không thay thế thẩm định pháp lý bất động sản:</strong> Một phương án vay khả thi về mặt tài chính không đồng nghĩa với việc căn nhà có pháp lý sạch hay hợp đồng đặt cọc an toàn.
          </li>
          <li>
            <strong className="text-slate-900">• Toán học tất định 100% (Deterministic Math):</strong> Toàn bộ lịch trả nợ, dòng tiền và bộ giải ngược được tính bằng thuật toán cố định, kiểm thử tự động, không dùng AI tạo sinh để đoán số liệu tài chính.
          </li>
          <li>
            <strong className="text-slate-900">• Tối thiểu hóa dữ liệu (Data Minimization):</strong> Người dùng có thể hoàn thành toàn bộ mô phỏng mà không cần cung cấp tên, số điện thoại, CCCD hay email.
          </li>
        </ul>

        <div className="pt-4 flex flex-wrap gap-3">
          <Link
            href="/kiem-tra-mua-nha"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-bold transition-colors"
          >
            <Calculator className="w-4 h-4" />
            <span>Trải nghiệm bộ mô phỏng</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/cach-tinh"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>Xem phương pháp tính</span>
          </Link>
        </div>
      </section>

      <DisclaimerBanner />
    </div>
  );
}
