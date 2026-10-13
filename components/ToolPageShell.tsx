import React from 'react';
import Link from 'next/link';
import { Calendar, ChevronRight, BookOpen, Calculator, ArrowRight, ShieldCheck } from 'lucide-react';
import { TOOLS, getTopic, toolPath, type Tool } from '@/content/tools';
import { GUIDES, type Source } from '@/content/guides-data';
import { formatDateVN } from '@/lib/site';

export interface Faq {
  q: string;
  a: React.ReactNode;
}

interface Props {
  tool: Tool;
  intro: React.ReactNode;
  calculator: React.ReactNode;
  faqs: Faq[];
  sources?: readonly Source[];
  children: React.ReactNode; // Phần giải thích cách tính
}

export default function ToolPageShell({ tool, intro, calculator, faqs, sources, children }: Props) {
  const topic = getTopic(tool.topic);
  // Bài gắn trực tiếp với công cụ lên trước, sau đó bài mới nhất cùng cụm.
  const relatedGuides = GUIDES.filter((g) => g.relatedTool === tool.slug || g.topic === tool.topic)
    .sort(
      (a, b) =>
        Number(b.relatedTool === tool.slug) - Number(a.relatedTool === tool.slug) ||
        b.publishedAt.localeCompare(a.publishedAt),
    )
    .slice(0, 3);
  const otherTools = TOOLS.filter((t) => t.slug !== tool.slug);

  return (
    <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-slate-500">
        <Link href="/" className="hover:text-emerald-700">Trang chủ</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/cong-cu" className="hover:text-emerald-700">Công cụ tính</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-700 font-medium">{tool.name}</span>
      </nav>

      {/* Header */}
      <header className="space-y-4 max-w-3xl">
        <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
          {topic.name}
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {tool.title}
        </h1>
        <div className="text-sm sm:text-base text-slate-600 leading-relaxed">{intro}</div>
        <p className="flex items-center gap-1.5 text-xs text-slate-500">
          <Calendar className="w-3.5 h-3.5" />
          Cập nhật lần cuối: <time dateTime={tool.updatedAt}>{formatDateVN(tool.updatedAt)}</time>
        </p>
      </header>

      {calculator}

      {/* Explanation */}
      <div className="max-w-3xl space-y-4">{children}</div>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="max-w-3xl space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Câu hỏi thường gặp</h2>
          <div className="space-y-2">
            {faqs.map((faq) => (
              <details key={faq.q} className="group bg-white rounded-xl border border-slate-200 open:border-emerald-300">
                <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-sm sm:text-base text-slate-900 flex justify-between gap-3">
                  <span>{faq.q}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-1 transition-transform group-open:rotate-90" />
                </summary>
                <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Sources & disclaimer */}
      <section className="max-w-3xl p-5 rounded-2xl bg-slate-100/80 border border-slate-200 space-y-3 text-xs sm:text-sm text-slate-600">
        {sources && sources.length > 0 && (
          <div>
            <h2 className="font-bold text-slate-900 mb-1.5">Căn cứ pháp lý & nguồn số liệu</h2>
            <ul className="list-disc pl-5 space-y-1">
              {sources.map((s) => (
                <li key={s.label}>
                  {s.url ? (
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-700">
                      {s.label}
                    </a>
                  ) : (
                    s.label
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            Công cụ chạy hoàn toàn trên trình duyệt của bạn, không gửi hay lưu số liệu bạn nhập. Kết quả chỉ để tham
            khảo, không thay thế tư vấn tài chính, thuế hay pháp lý. Thấy số liệu sai?{' '}
            <Link href="/gioi-thieu#lien-he" className="underline hover:text-emerald-700">Báo cho HowDoI</Link>.
          </span>
        </p>
      </section>

      {/* Related guides */}
      {relatedGuides.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" /> Bài hướng dẫn liên quan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedGuides.map((g) => (
              <Link
                key={g.slug}
                href={`/huong-dan/${g.slug}`}
                className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-sm text-slate-900 leading-snug">{g.title}</h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">{g.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Other tools */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-emerald-600" /> Công cụ khác
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {otherTools.map((t) => (
            <Link
              key={t.slug}
              href={toolPath(t.slug)}
              className="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 transition-all flex items-center justify-between gap-2 text-sm font-semibold text-slate-800"
            >
              <span>{t.name}</span>
              <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0" />
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
