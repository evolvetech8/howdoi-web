import React from 'react';
import { Mail } from 'lucide-react';
import { SITE } from '@/lib/site';

// Liên hệ hỗ trợ qua email (trang chạy trên Vercel không có nơi lưu biểu mẫu, nên gửi email trực tiếp là chắc chắn nhất).
export default function SupportEmailCard({ appName, id }: { appName: string; id?: string }) {
  const subject = `[${appName}] Yêu cầu hỗ trợ`;
  const body = [
    'Chào Frank,',
    '',
    'Mô tả vấn đề hoặc góp ý của tôi:',
    '',
    '',
    '---',
    'Thiết bị và phiên bản iOS (ví dụ iPhone 13, iOS 18):',
    'Phiên bản ứng dụng (nếu biết):',
  ].join('\n');
  const href = `mailto:${SITE.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <section id={id} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg space-y-5 scroll-mt-24">
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Liên hệ hỗ trợ</span>
        <h2 className="text-2xl font-bold text-slate-900">Gửi email cho nhà phát triển</h2>
        <p className="text-slate-600 text-sm leading-relaxed">
          Gặp lỗi, cần hướng dẫn hay muốn góp ý cho <strong>{appName}</strong>? Hãy gửi email, Frank đọc và trả lời tất cả,
          thường trong vòng 24 giờ.
        </p>
      </div>
      <a
        href={href}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-sm font-bold shadow-sm transition-colors"
      >
        <Mail className="w-4 h-4" />
        Soạn email hỗ trợ
      </a>
      <p className="text-xs text-slate-500">
        Nếu nút trên không mở được ứng dụng email, hãy gửi tới: <strong className="text-slate-800 select-all">{SITE.contactEmail}</strong>
      </p>
    </section>
  );
}
