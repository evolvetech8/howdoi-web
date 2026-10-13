import React from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { TOOLS, toolPath } from '@/content/tools';
import { SITE } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-24 text-slate-500 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 space-y-3">
            <Logo />
            <p className="text-slate-500 leading-relaxed max-w-sm">{SITE.tagline}</p>
            <p className="text-slate-600 font-semibold leading-relaxed max-w-sm">{SITE.pledge}</p>
            <p className="text-slate-400 text-[11px] leading-relaxed max-w-sm">
              Nội dung và công cụ trên HowDoI chỉ nhằm mục đích tham khảo, không phải tư vấn tài chính, thuế hay pháp lý
              cho trường hợp cụ thể của bạn.
            </p>
          </div>

          <div className="md:col-span-3 space-y-2.5">
            <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider">Trả nợ</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/so-tra-no" className="hover:text-emerald-700 transition-colors font-semibold">
                  Sổ trả nợ của tôi
                </Link>
              </li>
              {TOOLS.map((tool) => (
                <li key={tool.slug}>
                  <Link href={toolPath(tool.slug)} className="hover:text-emerald-700 transition-colors">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 space-y-2.5">
            <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider">HowDoI</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/huong-dan" className="hover:text-emerald-700 transition-colors">Hướng dẫn</Link>
              </li>
              <li>
                <Link href="/gioi-thieu" className="hover:text-emerald-700 transition-colors">Giới thiệu</Link>
              </li>
              <li>
                <Link href="/gioi-thieu#kiem-tien" className="hover:text-emerald-700 transition-colors">HowDoI kiếm tiền thế nào</Link>
              </li>
              <li>
                <a href={`mailto:${SITE.contactEmail}`} className="hover:text-emerald-700 transition-colors">Liên hệ</a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-2.5">
            <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider">Ứng dụng iOS</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/support" className="hover:text-emerald-700 transition-colors">Hỗ trợ (Support)</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-emerald-700 transition-colors">Quyền riêng tư (Privacy)</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} HowDoI (howdoi.id.vn)</p>
        </div>
      </div>
    </footer>
  );
}
