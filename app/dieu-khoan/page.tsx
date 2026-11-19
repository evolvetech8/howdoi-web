import type { Metadata } from 'next';
import Link from 'next/link';
import { Scale, AlertTriangle, FileCheck2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Điều Khoản Sử Dụng & Giới Hạn Trách Nhiệm | EvolveTech DepositGuard',
  description:
    'Điều khoản sử dụng, tuyên bố miễn trừ trách nhiệm tư vấn tài chính/pháp lý và giới hạn phạm vi hoạt động của công cụ mô phỏng EvolveTech DepositGuard.',
  alternates: {
    canonical: 'https://www.evolvetech.biz.vn/dieu-khoan',
  },
};

export default function DieuKhoanPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold">
          <Scale className="w-3.5 h-3.5 text-blue-700" />
          <span>Điều khoản sử dụng &amp; Tuyên bố pháp lý</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Điều khoản sử dụng &amp; Giới hạn trách nhiệm
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Có hiệu lực từ: 14/11/2026 • Áp dụng cho toàn bộ người truy cập evolvetech.biz.vn
        </p>
      </header>

      <section className="bg-amber-50 border border-amber-200 rounded-3xl p-6 sm:p-8 space-y-3 text-amber-950">
        <h2 className="text-base sm:text-lg font-extrabold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
          <span>Tuyên bố quan trọng: Công cụ mô phỏng toán học, không phải tư vấn hay phê duyệt vay</span>
        </h2>
        <p className="text-xs sm:text-sm leading-relaxed text-amber-900">
          EvolveTech DepositGuard là phần mềm mô phỏng dòng tiền cá nhân/hộ gia đình dựa trên các thông số giả định do chính người dùng nhập vào. Kết quả hiển thị trên website <strong>không phải</strong> là lời khuyên đầu tư, không phải quyết định thẩm định hay cam kết cấp tín dụng của bất kỳ ngân hàng nào, và <strong>không chứng nhận</strong> tính pháp lý của bất động sản hay hợp đồng đặt cọc.
        </p>
      </section>

      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <div className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            1. Bản chất của dịch vụ (Scope of Service)
          </h2>
          <p>
            EvolveTech cung cấp bộ công cụ tính toán lịch trả nợ vay mua nhà (dư nợ giảm dần và niên kim), mô phỏng biến động lãi suất sau thời gian ưu đãi và theo dõi quỹ dự phòng khẩn cấp của hộ gia đình. Người dùng tự chịu trách nhiệm về tính chính xác của các số liệu đầu vào (giá nhà, vốn tự có, thu nhập ròng, chi phí sinh hoạt, lãi suất dự kiến).
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            2. Những nội dung nằm ngoài phạm vi của DepositGuard
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Không thẩm định pháp lý nhà đất:</strong> Công cụ không kiểm tra sổ đỏ/sổ hồng, quy hoạch sử dụng đất, giấy phép xây dựng, tranh chấp đồng sở hữu, tiến độ của chủ đầu tư hay tính hợp pháp của văn bản thỏa thuận đặt cọc.
            </li>
            <li>
              <strong>Không đại diện cho ngân hàng thương mại:</strong> Mỗi ngân hàng có quy trình chấm điểm tín dụng (CIC), cách tính thu nhập được ghi nhận, biên độ lãi suất thả nổi và quy ước tính ngày (actual/365 hoặc actual/360) riêng biệt.
            </li>
            <li>
              <strong>Không dự báo vĩ mô:</strong> Các kịch bản sốc lãi suất (+2 điểm %, +4 điểm %) hoặc giảm thu nhập (-20%) là bài kiểm tra sức chịu đựng giả định (stress test), không phải dự báo kinh tế hay xác suất vỡ nợ thống kê.
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            3. Giới hạn trách nhiệm (Limitation of Liability)
          </h2>
          <p>
            Trong phạm vi tối đa được pháp luật Việt Nam cho phép, người vận hành EvolveTech (Archonic) không chịu trách nhiệm đối với bất kỳ thiệt hại trực tiếp hoặc gián tiếp nào phát sinh từ quyết định đặt cọc, mua bán bất động sản, ký kết hợp đồng tín dụng hoặc mất tiền cọc của người dùng. Trước khi ký hợp đồng đặt cọc hoặc hợp đồng vay vốn, người dùng cần làm việc trực tiếp bằng văn bản với ngân hàng cho vay và tham vấn luật sư/công chứng viên độc lập.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-blue-700" />
            <span>4. Luật áp dụng &amp; Giải quyết khiếu nại</span>
          </h2>
          <p>
            Các điều khoản này được điều chỉnh và giải thích theo pháp luật nước Cộng hòa Xã hội Chủ nghĩa Việt Nam. Mọi thắc mắc, báo cáo sai số hoặc góp ý xin gửi về địa chỉ <a href="mailto:archonic88@gmail.com" className="text-blue-800 font-bold hover:underline">archonic88@gmail.com</a> hoặc qua trang <Link href="/lien-he" className="text-blue-800 font-semibold hover:underline">/lien-he</Link>.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-4">
          <Link
            href="/cach-tinh"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-800 hover:underline"
          >
            <span>Xem phương pháp tính toán (v1.1)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/bao-mat"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-800"
          >
            <span>Xem chính sách bảo mật dữ liệu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
