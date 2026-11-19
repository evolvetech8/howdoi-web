'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Lock } from 'lucide-react';
import { trackEvent } from '@/lib/depositguard/telemetry';

type FeedbackCategory = 'calculation' | 'bug' | 'ux' | 'feature' | 'other';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<FeedbackCategory>('calculation');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<{ email?: string; message?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const nextErrors: { email?: string; message?: string } = {};
    const emailTrimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailTrimmed || !emailRegex.test(emailTrimmed)) {
      nextErrors.email = 'Vui lòng nhập địa chỉ email hợp lệ để chúng tôi phản hồi.';
    }
    if (!message.trim() || message.trim().length < 10) {
      nextErrors.message = 'Vui lòng nhập nội dung chi tiết (tối thiểu 10 ký tự).';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) {
      return; // Bot honeypot triggered silently
    }
    if (!validate()) {
      return;
    }

    // Track anonymized feedback event (strictly zero PII / zero raw message text)
    trackEvent('feedback_submitted', {
      category,
      helpful: true,
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 sm:p-8 space-y-4 text-slate-900">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-blue-700 shrink-0" />
          <h2 className="text-lg font-extrabold">
            Đã ghi nhận phản hồi của bạn!
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-blue-950 leading-relaxed">
          Cảm ơn bạn đã đóng góp ý kiến để cải thiện độ chính xác của mô hình DepositGuard. Nếu cần trao đổi trực tiếp kèm bảng tính đối chiếu, bạn cũng có thể gửi email tới{' '}
          <a href="mailto:archonic88@gmail.com" className="font-bold underline">
            archonic88@gmail.com
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setMessage('');
          }}
          className="px-4 py-2 rounded-xl bg-white border border-blue-300 text-blue-900 text-xs font-bold hover:bg-blue-100 transition-colors"
        >
          Gửi phản hồi khác
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-5 shadow-2xs">
      {/* Honeypot field for bot protection */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website_hp">Website</label>
        <input
          id="website_hp"
          name="website_hp"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="contact-name" className="block text-xs font-bold text-slate-700">
            Tên hoặc biệt danh (Không bắt buộc)
          </label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ví dụ: Minh Anh"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="contact-email" className="block text-xs font-bold text-slate-700">
            Email nhận phản hồi <span className="text-rose-600">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            placeholder="ban@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 ${
              errors.email
                ? 'border-rose-300 bg-rose-50/40 focus:ring-rose-500/20'
                : 'border-slate-200 focus:ring-blue-600/20 focus:border-blue-600'
            }`}
          />
          {errors.email && (
            <p id="contact-email-error" className="text-xs text-rose-700 flex items-center gap-1 pt-0.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.email}</span>
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="contact-category" className="block text-xs font-bold text-slate-700">
          Chủ đề phản hồi
        </label>
        <select
          id="contact-category"
          value={category}
          onChange={(e) => setCategory(e.target.value as FeedbackCategory)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
        >
          <option value="calculation">Đối chiếu / Báo cáo sai lệch công thức tính</option>
          <option value="bug">Báo lỗi hiển thị hoặc giao diện di động</option>
          <option value="ux">Góp ý trải nghiệm 3 bước mô phỏng</option>
          <option value="feature">Đề xuất thêm kịch bản hoặc tính năng mới</option>
          <option value="other">Câu hỏi chung / Hợp tác độc lập</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="contact-message" className="block text-xs font-bold text-slate-700">
          Nội dung chi tiết <span className="text-rose-600">*</span>
        </label>
        <textarea
          id="contact-message"
          rows={4}
          required
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
          }}
          placeholder="Mô tả giả định khoản vay, kỳ hạn hoặc điểm bạn muốn đối chiếu (Lưu ý: không gửi số CCCD, sao kê tài khoản ngân hàng hay địa chỉ nhà riêng)..."
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 ${
            errors.message
              ? 'border-rose-300 bg-rose-50/40 focus:ring-rose-500/20'
              : 'border-slate-200 focus:ring-blue-600/20 focus:border-blue-600'
          }`}
        />
        {errors.message && (
          <p id="contact-message-error" className="text-xs text-rose-700 flex items-center gap-1 pt-0.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errors.message}</span>
          </p>
        )}
      </div>

      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-start gap-2.5">
        <Lock className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
        <span>
          <strong>Lưu ý bảo mật dữ liệu:</strong> Vui lòng chỉ chia sẻ các con số giả định để đối chiếu toán học. Không đính kèm số căn cước công dân, hợp đồng tín dụng có thông tin định danh hoặc địa chỉ nhà cụ thể.
        </span>
      </div>

      <button
        type="submit"
        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold shadow-xs transition-colors inline-flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
      >
        <Send className="w-4 h-4" />
        <span>Gửi phản hồi</span>
      </button>
    </form>
  );
}
