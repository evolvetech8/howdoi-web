import type { Metadata } from 'next';
import Link from 'next/link';
import { Lock, ShieldCheck, EyeOff, Trash2, ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Chính Sách Bảo Mật Dữ Liệu (Luật 91/2025/QH15) | EvolveTech DepositGuard',
  description:
    'Chính sách bảo mật và bảo vệ dữ liệu cá nhân của EvolveTech DepositGuard theo Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15. Cam kết tính toán 100% trên thiết bị.',
  alternates: {
    canonical: 'https://www.evolvetech.biz.vn/bao-mat',
  },
};

export default function BaoMatPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Tuân thủ Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Chính sách bảo mật &amp; Quyền riêng tư
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Cập nhật lần cuối: 14/11/2026 • Áp dụng cho nền tảng web EvolveTech DepositGuard (evolvetech.biz.vn)
        </p>
      </header>

      <section className="bg-emerald-50/80 border border-emerald-200 rounded-3xl p-6 sm:p-8 space-y-3">
        <h2 className="text-base sm:text-lg font-extrabold text-emerald-950 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Tóm tắt cốt lõi: Số liệu tài chính của bạn không rời khỏi trình duyệt</span>
        </h2>
        <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
          Khi bạn sử dụng công cụ mô phỏng mua nhà tại <code>/kiem-tra-mua-nha</code> và xem kết quả tại <code>/ket-qua</code>, toàn bộ phép tính toán học được thực thi <strong>100% trên trình duyệt thiết bị của bạn (Client-side execution)</strong>. Chúng tôi không yêu cầu đăng nhập, không thu thập họ tên, số điện thoại, số CCCD, địa chỉ căn hộ và tuyệt đối không gửi mức lương, giá nhà, số dư tiết kiệm hay khoản nợ của bạn về máy chủ hay bất kỳ công cụ phân tích bên thứ ba nào.
        </p>
      </section>

      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <div className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            1. Nguyên tắc tối thiểu hóa dữ liệu (Data Minimization)
          </h2>
          <p>
            Theo tinh thần của <strong>Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15</strong> (có hiệu lực từ ngày 01/01/2026 tại Việt Nam), EvolveTech thiết kế kiến trúc kỹ thuật để không thu thập dữ liệu nhạy cảm ngay từ gốc:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Không lưu số liệu trên URL:</strong> Đường dẫn kết quả luôn cố định tại <code>/ket-qua</code>, không bao giờ đính kèm tham số truy vấn (query string) chứa lương, giá nhà hay số tiền vay.
            </li>
            <li>
              <strong>Bộ nhớ phiên tạm thời trên thiết bị (sessionStorage):</strong> Để giúp bạn không bị mất dữ liệu khi chuyển qua lại giữa 3 bước nhập liệu, thông số kịch bản chỉ được giữ tạm trong <code>sessionStorage</code> của trình duyệt trên máy bạn và có thể xóa sạch bất cứ lúc nào bằng nút <strong>&ldquo;Làm mới / Đặt lại mặc định&rdquo;</strong> hoặc khi đóng thẻ trình duyệt.
            </li>
            <li>
              <strong>Chặn lập chỉ mục công cụ tìm kiếm:</strong> Trang kết quả <code>/ket-qua</code> được gắn chỉ thị <code>noindex, nofollow</code> nghiêm ngặt.
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-emerald-600" />
            <span>2. Dữ liệu đo lường ẩn danh (Zero-PII Telemetry)</span>
          </h2>
          <p>
            Để biết công cụ có hoạt động ổn định trên điện thoại hay không, hệ thống telemetry nội bộ chỉ ghi nhận mã bước và loại thao tác kỹ thuật (ví dụ: <code>wizard_step_viewed</code>, <code>wizard_step_completed</code>, <code>simulation_calculated</code>, <code>whatif_rate_shock_toggled</code>). Bộ lọc bảo mật tự động (<code>sanitizeTelemetryPayload</code>) chủ động chặn và loại bỏ mọi trường chứa từ khóa tài chính hoặc số tiền lớn hơn 1.000 trước khi ghi nhận sự kiện.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            3. Thông tin khi bạn chủ động gửi biểu mẫu Liên hệ / Báo lỗi
          </h2>
          <p>
            Khi và chỉ khi bạn chủ động điền biểu mẫu tại trang <Link href="/lien-he" className="text-emerald-700 font-semibold hover:underline">/lien-he</Link> hoặc gửi thư điện tử tới <code>archonic88@gmail.com</code>, chúng tôi mới tiếp nhận địa chỉ email và nội dung phản hồi của bạn với mục đích duy nhất là giải đáp thắc mắc hoặc sửa lỗi công thức. Chúng tôi không bao giờ bán, cho thuê hoặc chia sẻ email của bạn cho ngân hàng, công ty tài chính hay môi giới bất động sản.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-emerald-600" />
            <span>4. Quyền của chủ thể dữ liệu &amp; Kênh liên hệ</span>
          </h2>
          <p>
            Bạn có toàn quyền yêu cầu kiểm tra, đính chính hoặc xóa bỏ mọi thông tin liên hệ mà bạn đã từng gửi qua kênh hỗ trợ bằng cách gửi email tới <a href="mailto:archonic88@gmail.com" className="text-emerald-700 font-bold hover:underline">archonic88@gmail.com</a>.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-slate-500">
          <span>
            Bạn đang tìm chính sách quyền riêng tư cho các ứng dụng iOS trên App Store (như <em>Cho Con</em>)?
          </span>
          <Link
            href="/privacy"
            className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:underline"
          >
            <span>Xem App Store Privacy Policy (/privacy)</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
