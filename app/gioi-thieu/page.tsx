import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { H2, P, UL } from '@/components/Prose';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Giới thiệu HowDoI',
  description:
    'HowDoI là gì, ai đứng sau, số liệu lấy từ đâu và HowDoI kiếm tiền thế nào. HowDoI không cho vay và không quảng cáo khoản vay.',
  alternates: { canonical: '/gioi-thieu' },
};

export default function AboutPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Về HowDoI</h1>
      <P>
        “How do I…?” nghĩa là “Làm sao để…?”. HowDoI giúp người đang gánh nợ trả lời câu hỏi khó nhất:{' '}
        <strong>làm sao để hết nợ?</strong> Bạn lập một{' '}
        <Link href="/so-tra-no" className="underline hover:text-emerald-700">
          sổ trả nợ
        </Link>
        , biết ngày hết nợ và tháng này nên trả khoản nào bao nhiêu, rồi mỗi tháng ghi sổ một lần. Bên cạnh đó là các bài hướng
        dẫn và công cụ tính miễn phí về lương, vay và tiết kiệm.
      </P>

      <H2 id="nguyen-tac">Nguyên tắc</H2>
      <UL>
        <li>
          <strong>Số nợ của bạn chỉ nằm trên máy bạn.</strong> HowDoI không có tài khoản, không có máy chủ lưu số liệu,
          không hỏi số điện thoại hay CCCD. HowDoI không bao giờ gọi điện hay nhắn tin cho bạn.
        </li>
        <li>
          <strong>Không trách móc.</strong> Tháng nào trả ít hơn kế hoạch, sổ tự điều chỉnh. Ghi sổ thật quan trọng hơn trả đẹp.
        </li>
        <li>
          <strong>Có nguồn, có ngày cập nhật.</strong> Con số pháp lý (thuế, bảo hiểm, lương tối thiểu) ghi rõ văn bản gốc.
          Khi luật đổi, nội dung được sửa theo.
        </li>
        <li>
          <strong>Tham khảo, không phải tư vấn.</strong> HowDoI giúp bạn hiểu và tự tính. Với quyết định lớn, hãy hỏi thêm
          người có chuyên môn về trường hợp cụ thể của bạn.
        </li>
      </UL>

      <H2 id="kiem-tien">HowDoI kiếm tiền thế nào?</H2>
      <P>
        Hiện tại HowDoI chưa có quảng cáo hay link tiếp thị liên kết (affiliate) nào. Nếu sau này có, chúng sẽ tuân theo các
        quy tắc dưới đây, và tiền hoa hồng không bao giờ ảnh hưởng đến kết quả của sổ trả nợ hay công cụ tính.
      </P>
      <p className="text-sm sm:text-base font-semibold text-slate-900">HowDoI không bao giờ giới thiệu hay quảng cáo:</p>
      <UL>
        <li>Khoản vay tiêu dùng, vay tiền mặt, ứng dụng vay, cho vay ngang hàng, cầm đồ online</li>
        <li>Mở thẻ tín dụng, ví trả sau, mua trước trả sau, “trả góp 0%”</li>
        <li>Dịch vụ đáo hạn thẻ, rút tiền mặt từ thẻ</li>
        <li>Dịch vụ “xóa nợ xấu”, “sửa CIC”, đàm phán nợ thu phí trước</li>
        <li>Khoản vay gộp nợ (chỉ viết bài giải thích, không gắn link)</li>
        <li>Tiền ảo, ngoại hối, mở tài khoản giao dịch, cờ bạc, đa cấp, “việc nhẹ lương cao”</li>
      </UL>
      <P>
        Quảng cáo và link tiếp thị, nếu có, sẽ không bao giờ xuất hiện trong sổ trả nợ. Mỗi link tiếp thị sẽ được ghi rõ ngay
        cạnh link. Những thứ có thể được giới thiệu: sách về tài chính cá nhân, và tài khoản tiết kiệm không phí dành cho người
        đã hết nợ và bắt đầu xây quỹ phòng thân.
      </P>

      <H2 id="tac-gia">Ai đứng sau HowDoI?</H2>
      <P>
        HowDoI do <strong>{SITE.author}</strong> viết và phát triển. Frank là lập trình viên độc lập ở Việt Nam, tự làm từ
        thiết kế, code đến nội dung, và là tác giả ứng dụng iOS{' '}
        <Link href="/support/cho-con" className="underline hover:text-emerald-700">
          Cho Con
        </Link>{' '}
        dành cho ba mẹ chuẩn bị đón bé.
      </P>

      <H2 id="lien-he">Liên hệ</H2>
      <P>
        Thấy số liệu sai, muốn gợi ý câu hỏi cho bài viết tiếp theo, hay cần hỗ trợ ứng dụng? Hãy gửi email, Frank đọc tất cả.
        Đừng gửi số nợ hay thông tin cá nhân qua email nếu không cần thiết.
      </P>
      <div className="flex flex-wrap gap-3">
        <a
          href={`mailto:${SITE.contactEmail}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors"
        >
          <Mail className="w-4 h-4" />
          {SITE.contactEmail}
        </a>
        <Link
          href="/support"
          className="inline-flex items-center px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-semibold hover:border-emerald-300 transition-colors"
        >
          Hỗ trợ ứng dụng iOS
        </Link>
      </div>
    </article>
  );
}
