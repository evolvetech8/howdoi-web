import type { Metadata } from 'next';
import ToolCard from '@/components/ToolCard';
import { TOOLS } from '@/content/tools';

export const metadata: Metadata = {
  title: 'Công cụ tính tài chính cá nhân miễn phí',
  description:
    'Các công cụ tính miễn phí của HowDoI: lương Gross sang Net 2026, lãi kép, lãi vay mua nhà mua xe, chia ngân sách 50/30/20. Chạy trên trình duyệt, không lưu dữ liệu.',
  alternates: { canonical: '/cong-cu' },
};

export default function ToolsIndexPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <header className="max-w-3xl space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Công cụ tính miễn phí</h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Mỗi công cụ trả lời một câu hỏi tiền bạc cụ thể, kèm giải thích cách tính và nguồn số liệu. Không cần đăng ký,
          không lưu số liệu bạn nhập.
        </p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {TOOLS.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}
