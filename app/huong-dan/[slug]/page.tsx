import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GUIDES } from '@/content/guides-data';
import { ArrowLeft, Clock, Calendar, User, Lightbulb, Calculator, ArrowRight, Share2 } from 'lucide-react';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return GUIDES.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = GUIDES.find((g) => g.slug === slug);
  if (!guide) return { title: 'Bài viết không tìm thấy — EvolveTech' };

  return {
    title: `${guide.title} — EvolveTech.biz.vn`,
    description: guide.excerpt,
    openGraph: {
      title: guide.title,
      description: guide.excerpt,
      type: 'article',
      publishedTime: guide.date,
      authors: [guide.author],
    },
  };
}

export default async function GuideDetailPage({ params }: Props) {
  const { slug } = await params;
  const guide = GUIDES.find((g) => g.slug === slug);

  if (!guide) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Back Link */}
      <div>
        <Link
          href="/huong-dan"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại tất cả bài viết</span>
        </Link>
      </div>

      {/* Article Header */}
      <header className="space-y-4 border-b border-slate-200 pb-8">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
            {guide.category}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {guide.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2">
          <span className="flex items-center gap-1 font-medium text-slate-700">
            <User className="w-3.5 h-3.5 text-emerald-600" />
            {guide.author}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {guide.date}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {guide.readTime}
          </span>
        </div>
      </header>

      {/* Key Takeaways Box */}
      <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-6 space-y-3">
        <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-emerald-700" /> Điểm cốt lõi cần nhớ
        </h3>
        <ul className="space-y-2 text-xs sm:text-sm text-emerald-950">
          {guide.content.keyTakeaways.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Introduction */}
      <div className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
        <p>{guide.content.introduction}</p>
      </div>

      {/* Main Sections */}
      <div className="space-y-8 pt-4">
        {guide.content.sections.map((section, idx) => (
          <section key={idx} className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {section.heading}
            </h2>
            <div className="space-y-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              {section.body.map((paragraph, pIdx) => (
                <p key={pIdx}>{paragraph}</p>
              ))}
            </div>
            {section.tip && (
              <div className="mt-3 p-4 bg-amber-50/80 rounded-xl border border-amber-200 text-xs sm:text-sm text-amber-900 flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Mẹo thực tế:</strong> {section.tip}
                </div>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Conclusion */}
      <div className="pt-6 border-t border-slate-200 space-y-3">
        <h3 className="text-lg font-bold text-slate-900">Lời kết</h3>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {guide.content.conclusion}
        </p>
      </div>

      {/* Related Tool Banner if applicable */}
      {guide.relatedTool && (
        <div className="p-6 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div>
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold block">
              Thực hành ngay
            </span>
            <h4 className="text-base sm:text-lg font-bold mt-0.5">
              Tự tính toán các con số trên máy của bạn
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Dùng công cụ tính toán tự động của EvolveTech để lập kế hoạch tài chính cá nhân.
            </p>
          </div>
          <Link
            href="/#calculators"
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0 transition-transform hover:scale-105"
          >
            <Calculator className="w-4 h-4" />
            <span>Mở công cụ tính</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Author Bio */}
      <div className="p-6 bg-slate-100/80 rounded-2xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-lg shrink-0">
          F
        </div>
        <div>
          <span className="font-bold text-slate-900 block text-sm">Viết bởi Archonic</span>
          <p className="text-xs text-slate-600 mt-0.5">
            Kỹ sư công nghệ & người sáng lập EvolveTech.biz.vn. Với mong muốn người Việt không còn nỗi sợ về tiền bạc và sống tự do, bình an hơn mỗi ngày.
          </p>
        </div>
      </div>
    </article>
  );
}
