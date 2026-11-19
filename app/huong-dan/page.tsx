'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ArrowRight,
  Filter,
  ShieldCheck,
  Calculator,
  FileCheck2,
  Sparkles,
} from 'lucide-react';
import { GUIDES } from '@/content/guides-data';

export default function GuidesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');

  const categories = [
    'Tất cả',
    'Vay mua nhà & Lãi suất',
    'Thẩm định trước đặt cọc',
    'Dòng tiền gia đình',
    'Tiết kiệm',
    'Quản lý nợ',
    'Đầu tư',
  ];

  const featuredGuides = GUIDES.filter((g) => g.isHomebuyerFeatured);
  const filteredGuides =
    selectedCategory === 'Tất cả'
      ? GUIDES
      : GUIDES.filter((g) => g.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
            <BookOpen className="w-4 h-4" />
            <span>Cẩm Nang Thẩm Định Tài Chính Mua Nhà • Archonic FinLab</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            5 Cẩm Nang Sống Còn Trước Khi Xuống Tiền Đặt Cọc Mua Nhà
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Toàn bộ bài phân tích được đúc kết từ mô hình toán học DepositGuard v1.1, đi kèm đồ họa trực quan (Infographic) và bảng số liệu thực tế tại Việt Nam để bạn tự kiểm chứng trước khi ký hợp đồng đặt cọc hoặc hợp đồng tín dụng.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <Link
            href="/kiem-tra-mua-nha"
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-extrabold inline-flex items-center gap-2 transition-colors"
          >
            <Calculator className="w-4 h-4" />
            <span>Mở bộ mô phỏng 3 bước</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/bao-cao-mau"
            className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition-colors"
          >
            <FileCheck2 className="w-4 h-4 text-blue-400" />
            <span>Xem hồ sơ mẫu</span>
          </Link>
        </div>
      </div>

      {/* Top 5 Featured Homebuyer Guides with Visual Infographic Previews */}
      <section className="space-y-6">
        <div className="flex items-center justify-between gap-2">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-800">
              <Sparkles className="w-3.5 h-3.5" />
              Chuyên đề trọng tâm DepositGuard (Mục 7.1 PRD)
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Bộ 5 Nghiên cứu Tình huống &amp; Đồ họa Rủi ro Mua nhà
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredGuides.map((guide, index) => (
            <article
              key={guide.slug}
              className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <div>
                {guide.infographicUrl && (
                  <Link
                    href={`/huong-dan/${guide.slug}`}
                    className="block relative aspect-[16/10] bg-slate-900 overflow-hidden"
                  >
                    <img
                      src={guide.infographicUrl}
                      alt={guide.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex items-end p-4">
                      <span className="text-[11px] font-mono font-bold text-blue-300 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-700">
                        Chuyên đề #{index + 1} • {guide.scenarioBadge}
                      </span>
                    </div>
                  </Link>
                )}

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/60">
                      {guide.category}
                    </span>
                    <span className="text-slate-400 font-medium">{guide.readTime}</span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg group-hover:text-blue-800 transition-colors leading-snug">
                    <Link href={`/huong-dan/${guide.slug}`}>{guide.title}</Link>
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {guide.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                  {guide.author}
                </span>
                <Link
                  href={`/huong-dan/${guide.slug}`}
                  className="font-bold text-blue-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Đọc phân tích</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Category Filter & Full Archive */}
      <section className="space-y-6 pt-4 border-t border-slate-200">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Lọc theo chủ đề:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <article
              key={guide.slug}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md">
                    {guide.category}
                  </span>
                  <span className="text-slate-400">{guide.readTime}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-blue-800 transition-colors leading-snug">
                  <Link href={`/huong-dan/${guide.slug}`}>{guide.title}</Link>
                </h3>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {guide.excerpt}
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">{guide.date}</span>
                <Link
                  href={`/huong-dan/${guide.slug}`}
                  className="font-bold text-blue-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Đọc bài</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
