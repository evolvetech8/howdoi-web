'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Filter } from 'lucide-react';
import type { Guide } from '@/content/guides-data';
import { TOPICS, type TopicId } from '@/content/tools';
import { formatDateVN } from '@/lib/site';

export default function GuideList({ guides }: { guides: Guide[] }) {
  const [topic, setTopic] = useState<TopicId | 'all'>('all');
  const topicsWithGuides = TOPICS.filter((t) => guides.some((g) => g.topic === t.id));
  const visible = topic === 'all' ? guides : guides.filter((g) => g.topic === topic);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
        <span className="text-xs font-semibold text-slate-500 mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Chủ đề:
        </span>
        {[{ id: 'all' as const, name: 'Tất cả' }, ...topicsWithGuides].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTopic(t.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              topic === t.id ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.map((guide) => (
          <article
            key={guide.slug}
            className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between hover:border-emerald-300 hover:shadow-lg transition-all group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  {TOPICS.find((t) => t.id === guide.topic)?.name}
                </span>
                <span className="text-slate-400">{guide.readTime}</span>
              </div>
              <h2 className="font-bold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors leading-snug">
                <Link href={`/huong-dan/${guide.slug}`}>{guide.title}</Link>
              </h2>
              <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{guide.excerpt}</p>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Cập nhật {formatDateVN(guide.updatedAt)}</span>
              <Link
                href={`/huong-dan/${guide.slug}`}
                className="font-semibold text-emerald-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
              >
                <span>Đọc bài</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
