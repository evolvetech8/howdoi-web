import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, HelpCircle, ArrowUpRight, Shield } from 'lucide-react';
import ContactForm from '@/components/depositguard/common/ContactForm';

export const metadata: Metadata = {
  title: 'Liên Hệ, Góp Ý & Báo Lỗi Công Thức | EvolveTech DepositGuard',
  description:
    'Kênh tiếp nhận báo cáo sai lệch phép tính, góp ý trải nghiệm và liên hệ trực tiếp với người vận hành EvolveTech DepositGuard.',
  alternates: {
    canonical: 'https://www.evolvetech.biz.vn/lien-he',
  },
};

export default function LienHePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold">
          <Mail className="w-3.5 h-3.5 text-blue-700" />
          <span>Phản hồi &amp; Hiệu chỉnh mô hình</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Liên hệ &amp; Báo lỗi phép tính
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Nếu bạn phát hiện bất kỳ điểm chưa hợp lý nào trong lịch trả nợ, quy ước làm tròn hay giao diện trên điện thoại, hãy gửi thông tin bên dưới để chúng tôi kiểm tra và cập nhật công khai trong nhật ký phiên bản mô hình.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <ContactForm />
        </div>

        <aside className="lg:col-span-4 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 space-y-3">
            <h2 className="text-sm font-bold text-slate-900">
              Email liên hệ trực tiếp
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Đơn vị vận hành: <strong>Archonic (EvolveTech)</strong>
            </p>
            <a
              href="mailto:archonic88@gmail.com"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-800 hover:underline"
            >
              <span>archonic88@gmail.com</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <HelpCircle className="w-4 h-4 text-blue-700" />
              <h2>Hỗ trợ ứng dụng iOS (App Store)</h2>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Nếu bạn đang tìm trang hỗ trợ kỹ thuật cho ứng dụng di động trên App Store (như ứng dụng <em>Cho Con</em>), vui lòng truy cập cổng hỗ trợ chuyên biệt:
            </p>
            <Link
              href="/support"
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-800 hover:underline"
            >
              <span>Chuyển tới App Store Support (/support)</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200/80 space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Shield className="w-4 h-4 text-blue-700" />
              <span>Không tư vấn môi giới / Không bán thông tin</span>
            </div>
            <p className="leading-relaxed">
              EvolveTech không chuyển tiếp email của bạn cho nhân viên tín dụng ngân hàng hay sàn môi giới bất động sản dưới bất kỳ hình thức nào.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
