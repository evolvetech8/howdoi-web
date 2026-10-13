'use client';

// Tạm ẩn khỏi trang chủ: bật lại khi ứng dụng HowDoI iOS gần ra mắt.

import React, { useState } from 'react';
import { Smartphone, Mail, CheckCircle, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export default function NewsletterWaitlist() {
  const [email, setEmail] = useState('');
  const [target, setTarget] = useState<'both' | 'ios' | 'newsletter'>('both');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Vui lòng nhập địa chỉ email hợp lệ');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, target }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Có lỗi xảy ra, vui lòng thử lại.');
      }

      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Không thể gửi đăng ký, vui lòng thử lại.');
    }
  };

  return (
    <div id="ios-app" className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 p-8 sm:p-12 text-white overflow-hidden shadow-2xl border border-slate-800">
      {/* Background Decorative Glow */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <Smartphone className="w-4 h-4" />
          <span>Dự án ứng dụng di động tiếp theo của Frank</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Ứng Dụng HowDoI iOS: <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
            Trợ Lý Tài Chính Cá Nhân Thuần Việt
          </span>
        </h2>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          Được thiết kế để loại bỏ sự phức tạp. Ghi chép chi tiêu tự động, theo dõi danh mục tích lũy tài sản, nhắc nhở quỹ khẩn cấp và không bao giờ để bạn phải hoang mang về tiền bạc.
        </p>

        {status === 'success' ? (
          <div className="p-6 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl max-w-md mx-auto animate-in fade-in">
            <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <h4 className="text-lg font-bold text-white">Đăng ký thành công!</h4>
            <p className="text-xs text-emerald-200 mt-1">
              Cảm ơn bạn! Frank sẽ gửi lời mời trải nghiệm bản TestFlight iOS và bản tin tài chính sớm nhất qua email của bạn.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  placeholder="Nhập email của bạn..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 shrink-0 disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Nhận vé sớm</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {errorMessage && (
              <p className="text-xs text-rose-400 text-left">{errorMessage}</p>
            )}

            <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Miễn phí 100%
              </span>
              <span>•</span>
              <span>Không spam</span>
              <span>•</span>
              <span>Hủy đăng ký bất kỳ lúc nào</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
