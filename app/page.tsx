import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CalendarCheck, Lock, NotebookPen, ShieldOff, Target, ListChecks } from 'lucide-react';
import ToolCard from '@/components/ToolCard';
import { TOOLS, getTopic, toolPath } from '@/content/tools';
import { GUIDES } from '@/content/guides-data';
import { SITE, formatDateVN } from '@/lib/site';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

const QUESTIONS = [
  { q: 'Có nhiều khoản nợ, nên trả khoản nào trước?', href: `${toolPath('ke-hoach-tra-no')}#nen-chon` },
  { q: 'Quả cầu tuyết và tuyết lở khác nhau thế nào?', href: `${toolPath('ke-hoach-tra-no')}#hai-phuong-phap` },
  { q: 'Vay 1 tỷ mua nhà mỗi tháng trả bao nhiêu?', href: `${toolPath('tinh-lai-vay')}#vay-1-ty` },
  { q: 'Lương 20 triệu thực nhận bao nhiêu năm 2026?', href: `${toolPath('luong-gross-net')}#vi-du` },
];

const STEPS = [
  {
    icon: ListChecks,
    title: 'Nhập các khoản nợ',
    body: 'Thẻ tín dụng, vay tiêu dùng, trả góp, ví trả sau, vay người thân. Khoảng 3 phút.',
  },
  {
    icon: Target,
    title: 'Biết ngày hết nợ',
    body: 'Và tháng này nên trả khoản nào bao nhiêu. Thiếu tiền trả tối thiểu thì sổ chỉ ra việc cần làm trước.',
  },
  {
    icon: CalendarCheck,
    title: 'Ghi sổ mỗi tháng',
    body: 'Sau ngày lương, bấm “Đã trả đúng kế hoạch”. Khoảng 1 phút, và bạn thấy ngày hết nợ đến gần hơn.',
  },
];

export default function HomePage() {
  const latestGuides = [...GUIDES].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 3);
  const otherTools = TOOLS.filter((t) => t.slug !== 'ke-hoach-tra-no');

  return (
    <div className="space-y-20 pb-10">
      {/* Hero */}
      <section className="relative pt-14 sm:pt-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-gradient-to-b from-emerald-100/60 via-teal-50/30 to-transparent pointer-events-none -z-10 blur-3xl" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Làm sao để hết nợ?{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
              Từng tháng một.
            </span>
          </h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Lập sổ trả nợ miễn phí: biết chính xác ngày hết nợ, tháng này trả khoản nào bao nhiêu, và mỗi tháng ghi sổ một lần
            để thấy mình đang tiến lên.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/so-tra-no"
              className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-md transition-colors flex items-center gap-2"
            >
              <NotebookPen className="w-5 h-5" />
              Lập sổ trả nợ
            </Link>
            <Link
              href={toolPath('ke-hoach-tra-no')}
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm sm:text-base border border-slate-200 shadow-sm transition-colors"
            >
              So sánh cách trả nợ
            </Link>
          </div>
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-slate-600">
            <li className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600" /> Số liệu chỉ lưu trên máy bạn
            </li>
            <li className="flex items-center gap-1.5">
              <ShieldOff className="w-3.5 h-3.5 text-emerald-600" /> Không cho vay, không quảng cáo khoản vay
            </li>
            <li className="flex items-center gap-1.5">
              <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" /> Miễn phí, không cần tài khoản
            </li>
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 text-center">Sổ trả nợ hoạt động thế nào?</h2>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <li key={title} className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
              <span className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">{i + 1}</span>
                <Icon className="w-5 h-5 text-emerald-600" />
              </span>
              <h3 className="font-bold text-slate-900">{title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{body}</p>
            </li>
          ))}
        </ol>
        <div className="text-center">
          <Link href="/so-tra-no" className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800">
            Bắt đầu lập sổ <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Questions */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Câu hỏi nhiều người tìm</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {QUESTIONS.map(({ q, href }) => (
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
      </section>

      {/* Guides */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Bài hướng dẫn</h2>
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
              <h3 className="font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">{guide.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed flex-1">{guide.excerpt}</p>
              <span className="text-xs text-slate-400">{formatDateVN(guide.publishedAt)}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Other tools */}
      <section id="tools" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 scroll-mt-24">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Công cụ tính khác</h2>
          <Link href="/cong-cu" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 shrink-0">
            Tất cả →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {otherTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      <p className="text-center text-xs text-slate-500 px-4">
        {SITE.pledge}{' '}
        <Link href="/gioi-thieu#kiem-tien" className="underline hover:text-emerald-700">
          Xem HowDoI kiếm tiền thế nào
        </Link>
      </p>
    </div>
  );
}
