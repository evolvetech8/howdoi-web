import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Calculator, FileCheck2, Lock, Sparkles, Wallet } from 'lucide-react';
import ToolCard from '@/components/ToolCard';
import { TOOLS, getTopic, toolPath } from '@/content/tools';
import { GUIDES } from '@/content/guides-data';
import { SALARY_RULES } from '@/lib/finance-math';
import { SITE, formatDateVN } from '@/lib/site';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

const POPULAR_QUESTIONS = [
  { q: 'Lương 20 triệu thực nhận bao nhiêu năm 2026?', href: `${toolPath('luong-gross-net')}#vi-du` },
  { q: 'Mỗi tháng để dành bao nhiêu để có 1 tỷ?', href: `${toolPath('lai-kep')}#1-ty` },
  { q: 'Vay 1 tỷ mua nhà mỗi tháng trả bao nhiêu?', href: `${toolPath('tinh-lai-vay')}#vay-1-ty` },
  { q: 'Trả nợ thẻ tín dụng hay khoản vay trước?', href: `${toolPath('ke-hoach-tra-no')}#nen-chon` },
  { q: 'Lương 10 triệu chi tiêu thế nào cho đủ?', href: `${toolPath('ngan-sach-50-30-20')}#bang-chia` },
  { q: 'Biểu thuế TNCN 2026 có mấy bậc?', href: `${toolPath('luong-gross-net')}#bieu-thue` },
];

const million = (amount: number) => (amount / 1_000_000).toLocaleString('vi-VN');

export default function HomePage() {
  const latestGuides = [...GUIDES].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 3);

  return (
    <div className="space-y-20 pb-10">
      {/* Hero */}
      <section className="relative pt-14 sm:pt-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-gradient-to-b from-emerald-100/60 via-teal-50/30 to-transparent pointer-events-none -z-10 blur-3xl" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Giải đáp câu hỏi tiền bạc của{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
              người đi làm Việt Nam
            </span>
          </h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Mỗi câu hỏi “Làm sao để…?” có một bài hướng dẫn dễ hiểu và một công cụ tính miễn phí, cập nhật theo luật
            năm 2026.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={toolPath('luong-gross-net')}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-sm shadow-md transition-colors flex items-center gap-2"
            >
              <Wallet className="w-4 h-4" />
              Tính lương Net 2026
            </Link>
            <Link
              href="/cong-cu"
              className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-200 shadow-sm transition-colors flex items-center gap-2"
            >
              <Calculator className="w-4 h-4 text-emerald-600" />
              Xem tất cả công cụ
            </Link>
          </div>

          {/* Popular questions */}
          <div className="pt-6 text-left max-w-2xl mx-auto">
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 text-center">
              Câu hỏi nhiều người tìm
            </span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {POPULAR_QUESTIONS.map(({ q, href }) => (
                <li key={q}>
                  <Link
                    href={href}
                    className="group flex items-center justify-between gap-2 px-4 py-3 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 text-sm font-medium text-slate-700 hover:text-emerald-800 transition-colors"
                  >
                    <span>{q}</span>
                    <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 2026 tax update notice */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={toolPath('luong-gross-net')}
          className="flex flex-col sm:flex-row sm:items-center gap-3 p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 hover:border-amber-400 transition-colors"
        >
          <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
          <span className="text-sm leading-relaxed flex-1">
            <strong>Thuế TNCN 2026 đã đổi:</strong> giảm trừ bản thân {million(SALARY_RULES.personalDeduction)} triệu,
            người phụ thuộc {million(SALARY_RULES.dependentDeduction)} triệu, biểu thuế còn 5 bậc. Từ 01/07/2026, trần
            đóng BHXH tăng lên {million(SALARY_RULES.baseSalary * SALARY_RULES.insuranceCapMultiplier)} triệu. Công cụ
            Gross ↔ Net đã cập nhật đủ các thay đổi này.
          </span>
          <ArrowRight className="w-4 h-4 text-amber-700 shrink-0 hidden sm:block" />
        </Link>
      </section>

      {/* Tools */}
      <section id="tools" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 scroll-mt-24">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Công cụ tính miễn phí</h2>
          <Link href="/cong-cu" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 shrink-0">
            Tất cả →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {/* Latest guides */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Bài hướng dẫn mới</h2>
          <Link href="/huong-dan" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 shrink-0">
            Tất cả bài viết →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {latestGuides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/huong-dan/${guide.slug}`}
              className="group p-6 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all flex flex-col gap-3"
            >
              <span className="text-xs font-semibold text-emerald-700">{getTopic(guide.topic).name}</span>
              <h3 className="font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                {guide.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed flex-1">{guide.excerpt}</p>
              <span className="text-xs text-slate-400">{formatDateVN(guide.publishedAt)}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: FileCheck2,
              title: 'Có nguồn, có ngày cập nhật',
              body: 'Mỗi con số pháp lý ghi rõ văn bản luật gốc. Luật đổi, công cụ được cập nhật theo.',
            },
            {
              icon: Lock,
              title: 'Không lưu dữ liệu của bạn',
              body: 'Công cụ chạy ngay trên trình duyệt. Lương và khoản vay bạn nhập không rời khỏi máy.',
            },
            {
              icon: BookOpen,
              title: 'Miễn phí, không cần đăng ký',
              body: 'Không tài khoản, không bắt để lại email. Mở ra là tính được ngay.',
            },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
              <Icon className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-slate-500 mt-6">
          HowDoI do {SITE.author} viết và phát triển.{' '}
          <Link href="/gioi-thieu" className="underline hover:text-emerald-700">
            Tìm hiểu thêm
          </Link>
        </p>
      </section>
    </div>
  );
}
