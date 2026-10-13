import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { H2, P, UL } from '@/components/Prose';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Giới thiệu HowDoI',
  description:
    'HowDoI là gì, ai đứng sau, số liệu lấy từ đâu và HowDoI kiếm tiền thế nào. Cùng danh sách các dự án khác của Frank.',
  alternates: { canonical: '/gioi-thieu' },
};

type Status = 'Đang hoạt động' | 'Trên App Store' | 'Đã gộp' | 'Dùng nội bộ' | 'Đã dừng' | 'Lưu trữ';

interface Project {
  name: string;
  date: string;
  platform: string;
  status: Status;
  description: string;
  href?: string;
}

const PROJECTS: Project[] = [
  {
    name: 'HowDoI',
    date: '2026',
    platform: 'Web',
    status: 'Đang hoạt động',
    description: 'Chính trang bạn đang đọc: hướng dẫn và công cụ tính cho các câu hỏi tiền bạc.',
    href: '/',
  },
  {
    name: 'Cho Con – Chuẩn Bị Đón Bé',
    date: '11/2025',
    platform: 'iOS',
    status: 'Trên App Store',
    description: 'Danh sách đồ sơ sinh, giỏ đồ đi sinh và ngân sách đón bé cho ba mẹ mới. Dữ liệu lưu trên máy.',
    href: '/support/cho-con',
  },
  {
    name: 'Trang portfolio & micro-lab v1',
    date: '06/2025',
    platform: 'Web',
    status: 'Đã gộp',
    description: 'Phiên bản đầu của trang cá nhân, nơi thử các sản phẩm nhỏ. Đã gộp vào HowDoI.',
  },
  {
    name: 'Bot Telegram tóm tắt tin công nghệ & AI',
    date: '03/2025',
    platform: 'Telegram',
    status: 'Dùng nội bộ',
    description: 'Gom tin từ Hacker News, Product Hunt, RSS và gửi bản tóm tắt mỗi sáng.',
  },
  {
    name: 'Cảnh báo giao dịch lớn on-chain',
    date: '09/2024',
    platform: 'Backend',
    status: 'Đã dừng',
    description: 'Theo dõi giao dịch lớn trên Ethereum, BSC. Dừng vì chi phí API cao và tín hiệu nhiễu.',
  },
  {
    name: 'Tổng hợp việc làm remote cho người Việt',
    date: '04/2024',
    platform: 'Backend',
    status: 'Đã dừng',
    description: 'Gom tin tuyển dụng remote. Dừng vì các trang chặn thu thập dữ liệu và chi phí proxy.',
  },
  {
    name: 'Digital garden (Hugo)',
    date: '08/2023',
    platform: 'Web tĩnh',
    status: 'Lưu trữ',
    description: 'Ghi chú lập trình viết bằng Markdown, chạy trên GitHub Pages.',
  },
];

const STATUS_TONE: Record<Status, string> = {
  'Đang hoạt động': 'bg-emerald-50 text-emerald-800 border-emerald-200',
  'Trên App Store': 'bg-blue-50 text-blue-800 border-blue-200',
  'Đã gộp': 'bg-slate-100 text-slate-600 border-slate-200',
  'Dùng nội bộ': 'bg-slate-100 text-slate-600 border-slate-200',
  'Đã dừng': 'bg-rose-50 text-rose-700 border-rose-200',
  'Lưu trữ': 'bg-slate-100 text-slate-600 border-slate-200',
};

export default function AboutPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Về HowDoI</h1>
      <P>
        “How do I…?” nghĩa là “Làm sao để…?”. Đó cũng là cách phần lớn chúng ta gõ Google khi gặp chuyện tiền bạc: làm
        sao tính lương Net, làm sao trả nợ nhanh hơn, làm sao để dành đủ tiền mua nhà. HowDoI trả lời từng câu hỏi như
        vậy bằng một bài hướng dẫn dễ hiểu và một công cụ tính để bạn tự kiểm tra với con số của mình.
      </P>

      <H2 id="nguyen-tac">Nguyên tắc làm nội dung</H2>
      <UL>
        <li>
          <strong>Có nguồn, có ngày cập nhật.</strong> Mọi con số pháp lý (thuế, bảo hiểm, lương tối thiểu) đều ghi rõ văn
          bản gốc. Mỗi bài viết và công cụ có ngày cập nhật lần cuối. Khi luật đổi, nội dung được sửa theo.
        </li>
        <li>
          <strong>Không lưu dữ liệu của bạn.</strong> Công cụ tính chạy trên trình duyệt. Số liệu bạn nhập không được gửi
          đi hay lưu lại.
        </li>
        <li>
          <strong>Tham khảo, không phải tư vấn.</strong> HowDoI giúp bạn hiểu và tự tính. Với quyết định lớn như vay mua
          nhà hay đầu tư, hãy hỏi thêm người có chuyên môn về trường hợp cụ thể của bạn.
        </li>
      </UL>

      <H2 id="minh-bach">HowDoI kiếm tiền thế nào?</H2>
      <P>
        Hiện tại HowDoI không có quảng cáo hay link tiếp thị liên kết (affiliate). Nếu sau này có, mỗi link affiliate sẽ
        được ghi rõ ngay cạnh link, và tiền hoa hồng không bao giờ ảnh hưởng đến kết quả của công cụ tính hay nội dung
        đánh giá.
      </P>

      <H2 id="tac-gia">Ai đứng sau HowDoI?</H2>
      <P>
        HowDoI do <strong>{SITE.author}</strong> viết và phát triển. Frank là lập trình viên độc lập, tự làm từ thiết
        kế, code đến nội dung cho các sản phẩm web và ứng dụng iOS của mình. HowDoI bắt đầu từ những công cụ Frank tự
        viết để tính lương, thuế và kế hoạch tiết kiệm cho bản thân và bạn bè.
      </P>

      <H2 id="du-an">Các dự án của Frank</H2>
      <P>Có dự án đang chạy, có dự án đã dừng. Tất cả đều được ghi lại ở đây.</P>
      <ul className="space-y-3">
        {PROJECTS.map((p) => {
          const body = (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-slate-900">{p.name}</h3>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${STATUS_TONE[p.status]}`}>
                  {p.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {p.platform} · {p.date}
              </p>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">{p.description}</p>
            </>
          );
          return (
            <li key={p.name}>
              {p.href ? (
                <Link
                  href={p.href}
                  className="block p-5 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 transition-colors"
                >
                  {body}
                </Link>
              ) : (
                <div className="p-5 bg-white rounded-2xl border border-slate-200">{body}</div>
              )}
            </li>
          );
        })}
      </ul>

      <H2 id="lien-he">Liên hệ</H2>
      <P>
        Thấy số liệu sai, muốn gợi ý câu hỏi cho bài viết tiếp theo, hay cần hỗ trợ ứng dụng? Hãy gửi email, Frank đọc
        tất cả.
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
