import type { Metadata } from 'next';
import Link from 'next/link';
import DebtPlanApp from '@/components/plan/DebtPlanApp';
import { H2, P, UL } from '@/components/Prose';

const title = 'Sổ trả nợ: lập kế hoạch và theo dõi trả nợ mỗi tháng';
const description =
  'Ứng dụng quản lý nợ cá nhân miễn phí trên web: nhập các khoản nợ, biết ngày hết nợ và tháng này trả khoản nào bao nhiêu, ghi sổ mỗi tháng. Không cần tài khoản, số liệu chỉ lưu trên máy bạn.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/so-tra-no' },
  openGraph: { title, description, url: '/so-tra-no', type: 'website' },
};

export default function DebtPlanPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Sổ trả nợ</h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Biết ngày hết nợ. Mỗi tháng ghi sổ một lần để thấy ngày đó đến gần hơn. Không cần tài khoản, không ai thấy con số
          của bạn.
        </p>
      </header>

      <DebtPlanApp />

      <section className="space-y-4">
        <H2 id="cach-hoat-dong">Sổ trả nợ hoạt động thế nào?</H2>
        <UL>
          <li>
            <strong>Lập sổ một lần:</strong> nhập từng khoản nợ (thẻ tín dụng, vay tiêu dùng, trả góp, ví trả sau, vay qua
            app, vay người thân) và số tiền bạn dành được để trả nợ mỗi tháng.
          </li>
          <li>
            <strong>Biết phải làm gì:</strong> sổ tính ngày hết nợ và số tiền nên trả cho từng khoản trong tháng, theo cách
            trả khoản lãi cao trước (tuyết lở) hoặc khoản nhỏ trước (quả cầu tuyết).
          </li>
          <li>
            <strong>Ghi sổ mỗi tháng:</strong> sau ngày lương, bấm “Đã trả đúng kế hoạch” hoặc sửa số đã trả. Sổ tự tính lại
            ngày hết nợ. Tháng nào trả ít hơn, sổ tự điều chỉnh chứ không trách bạn.
          </li>
          <li>
            <strong>Nếu tiền chưa đủ trả tối thiểu:</strong> sổ cho biết còn thiếu bao nhiêu mỗi tháng và gợi ý những việc nên
            làm trước, không bao giờ gợi ý vay thêm.
          </li>
        </UL>

        <H2 id="rieng-tu">Số liệu của bạn ở đâu?</H2>
        <P>
          Chỉ ở trong trình duyệt trên máy bạn đang dùng. HowDoI không có máy chủ lưu số nợ, không có tài khoản, không hỏi số
          điện thoại. Vì vậy nếu đổi máy hoặc xóa dữ liệu trình duyệt, sổ sẽ mất: hãy dùng “Tải tệp sao lưu” hoặc “Sao chép link
          khôi phục” sau khi lập sổ. Trên iPhone, nên thêm trang vào Màn hình chính.
        </P>
        <P>
          HowDoI không cho vay và không quảng cáo khoản vay, thẻ tín dụng hay ví trả sau.{' '}
          <Link href="/gioi-thieu#kiem-tien" className="underline hover:text-emerald-700">
            Xem HowDoI kiếm tiền thế nào
          </Link>
          .
        </P>
      </section>
    </div>
  );
}
