import type { Metadata } from 'next';
import GuideList from '@/components/GuideList';
import { GUIDES } from '@/content/guides-data';

export const metadata: Metadata = {
  title: 'Hướng dẫn tài chính cá nhân',
  description:
    'Bài hướng dẫn “Làm sao để…?” về lương, thuế, tiết kiệm, vay nợ và ngân sách cho người đi làm Việt Nam. Viết dễ hiểu, có nguồn và ngày cập nhật.',
  alternates: { canonical: '/huong-dan' },
};

export default function GuidesPage() {
  const guides = [...GUIDES].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <header className="max-w-3xl space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Hướng dẫn tài chính cá nhân</h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Mỗi bài trả lời một câu hỏi “Làm sao để…?” về tiền bạc, viết bằng ngôn ngữ đời thường, kèm công cụ để bạn tự
          tính với con số của mình.
        </p>
      </header>
      <GuideList guides={guides} />
    </div>
  );
}
