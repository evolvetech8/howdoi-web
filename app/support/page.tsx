'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SITE } from '@/lib/site';
import {
  HelpCircle,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Shield,
  Smartphone,
  Clock,
  ChevronDown,
  Layers,
  Sparkles,
  Baby,
  Wallet,
  AppWindow,
} from 'lucide-react';

export default function UniversalSupportPage() {
  const [selectedApp, setSelectedApp] = useState('Cho Con - Chuẩn Bị Đón Bé');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Hỗ trợ kỹ thuật / Báo lỗi');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const appsList = [
    {
      id: 'cho-con',
      name: 'Cho Con - Chuẩn Bị Đón Bé',
      tagline: 'Sắm đồ sơ sinh, giỏ đồ đi sinh & ngân sách đón bé',
      version: 'iOS Version 1.0+',
      icon: Baby,
      color: 'from-rose-500 to-pink-600',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      id: 'howdoi-finance',
      name: 'HowDoI — Tài Chính Cá Nhân',
      tagline: 'Quản lý thu chi, tích lũy lãi kép & thoát khỏi âu lo tiền bạc',
      version: 'iOS / Web Ecosystem',
      icon: Wallet,
      color: 'from-emerald-600 to-teal-600',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'general-apps',
      name: 'Ứng dụng khác / Yêu cầu chung',
      tagline: 'Câu hỏi chung hoặc ứng dụng sắp ra mắt',
      version: 'All iOS Products',
      icon: AppWindow,
      color: 'from-blue-600 to-indigo-600',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
  ];

  const generalFaqs = [
    {
      q: 'Làm thế nào để nhận được hỗ trợ nhanh nhất?',
      a: `Bạn có thể điền thông tin vào biểu mẫu trực tuyến bên dưới hoặc gửi email trực tiếp tới ${SITE.contactEmail}. Chúng tôi cam kết phản hồi tất cả yêu cầu hỗ trợ trong vòng 24 giờ làm việc.`,
    },
    {
      q: 'Dữ liệu cá nhân của tôi trong các ứng dụng được lưu trữ và bảo mật như thế nào?',
      a: 'Triết lý cốt lõi trong mọi ứng dụng của chúng tôi là "On-Device First" (Ưu tiên lưu trữ trên thiết bị). Toàn bộ danh sách ghi chép, kế hoạch chi tiêu, thông tin gia đình đều được lưu cục bộ trên iPhone của bạn. Chúng tôi tuyệt đối không bán, không chia sẻ dữ liệu cho bên thứ ba.',
    },
    {
      q: 'Ứng dụng có hoạt động ngoại tuyến (offline) không?',
      a: 'Có. Tất cả các ứng dụng thiết yếu (như "Cho Con" hay các công cụ ghi chép) đều được tối ưu hóa để bạn có thể sử dụng bình thường ngay cả khi không có kết nối Wi-Fi hay 4G/5G.',
    },
    {
      q: 'Làm sao để khôi phục giao dịch mua trong ứng dụng (Restore Purchases)?',
      a: 'Nếu bạn đổi thiết bị hoặc cài đặt lại ứng dụng, hãy vào mục Cài đặt (Settings) trong ứng dụng và chọn "Khôi phục giao dịch mua" (Restore Purchases). Hệ thống Apple App Store sẽ tự động kích hoạt lại gói dịch vụ của bạn miễn phí.',
    },
    {
      q: 'Tôi có thể đóng góp ý kiến hoặc yêu cầu thêm tính năng mới không?',
      a: 'Chắc chắn có! Chúng tôi luôn lắng nghe mọi đóng góp từ người dùng để liên tục cập nhật và hoàn thiện sản phẩm ở các phiên bản tiếp theo.',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) {
      setFeedbackMsg('Vui lòng điền đầy đủ email và nội dung tin nhắn.');
      return;
    }

    setStatus('loading');
    setFeedbackMsg('');

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appName: selectedApp,
          name,
          email,
          subject,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi gửi yêu cầu.');

      setStatus('success');
      setFeedbackMsg(`Yêu cầu hỗ trợ cho ứng dụng "${selectedApp}" đã được tiếp nhận. Đội ngũ phát triển sẽ phản hồi qua email ${email} trong vòng 24 giờ.`);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setStatus('error');
      setFeedbackMsg(err.message || `Có lỗi xảy ra, vui lòng gửi email trực tiếp tới ${SITE.contactEmail}.`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Universal Support Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute -right-16 -bottom-16 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -top-16 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-emerald-300 border border-white/10">
            <Smartphone className="w-4 h-4" />
            <span>Apple App Store Official Support Portal</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Trung Tâm Hỗ Trợ Ứng Dụng Di Động <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
              Ứng dụng của Frank
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            Trang hỗ trợ chính thức cho tất cả các ứng dụng trên hệ sinh thái iOS của chúng tôi (bao gồm <strong>Cho Con - Chuẩn Bị Đón Bé</strong>, <strong>HowDoI Personal Finance</strong> và các dự án tiện ích sắp tới). Chúng tôi luôn ở đây để giúp bạn có trải nghiệm mượt mà nhất.
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>Email: <strong>{SITE.contactEmail}</strong></span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Thời gian phản hồi: <strong>Trong 24 giờ</strong></span>
            </span>
          </div>
        </div>
      </div>

      {/* Supported Apps Directory */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Hệ sinh thái</span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">Các Ứng Dụng Được Hỗ Trợ</h2>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">Bấm vào app để chọn yêu cầu hỗ trợ</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {appsList.map((app) => {
            const Icon = app.icon;
            const isSelected = selectedApp === app.name;
            return (
              <div
                key={app.id}
                onClick={() => setSelectedApp(app.name)}
                className={`p-5 rounded-2xl bg-white border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center text-white shadow-sm`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${app.badgeColor}`}>
                    {app.version}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm leading-snug">{app.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{app.tagline}</p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className={`font-semibold ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {isSelected ? '✓ Đang chọn hỗ trợ' : 'Chọn ứng dụng này'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Universal Contact & Ticket Form */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Gửi Phản Hồi Trực Tiếp</span>
          <h2 className="text-2xl font-bold text-slate-900">Tiếp Nhận Yêu Cầu Hỗ Trợ Kỹ Thuật</h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            Bạn gặp sự cố, lỗi hiển thị hoặc muốn đề xuất cải tiến cho ứng dụng? Hãy điền thông tin bên dưới:
          </p>
        </div>

        {status === 'success' ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-sm">Gửi yêu cầu thành công!</h4>
              <p className="text-xs text-emerald-800 leading-relaxed">{feedbackMsg}</p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="mt-3 text-xs font-bold text-emerald-700 underline"
              >
                Gửi thêm yêu cầu hỗ trợ khác
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* App Selector Field */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Ứng dụng bạn cần hỗ trợ <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedApp}
                onChange={(e) => setSelectedApp(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-emerald-500 transition-colors bg-white font-medium text-slate-800"
              >
                {appsList.map((app) => (
                  <option key={app.id} value={app.name}>
                    {app.name} ({app.version})
                  </option>
                ))}
                <option value="Khác">Ứng dụng khác / Yêu cầu chung</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Tên của bạn (Tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Frank, Minh Anh..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Địa chỉ Email nhận phản hồi <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="email.cua.ban@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Vấn đề cần hỗ trợ
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-emerald-500 transition-colors bg-white"
              >
                <option value="Hỗ trợ kỹ thuật / Báo lỗi">Báo cáo lỗi kỹ thuật (Bug report / Crash)</option>
                <option value="Góp ý tính năng mới">Đóng góp ý kiến / Đề xuất tính năng mới</option>
                <option value="Thanh toán / Mua gói">Hỏi về thanh toán / Gói dịch vụ</option>
                <option value="Bảo mật & Quyền riêng tư">Câu hỏi về bảo mật & dữ liệu</option>
                <option value="Khác">Vấn đề khác</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Nội dung chi tiết <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="Vui lòng mô tả chi tiết vấn đề hoặc tính năng bạn muốn gửi gắm..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {feedbackMsg && status === 'error' && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{feedbackMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {status === 'loading' ? (
                <span>Đang gửi yêu cầu...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Gửi yêu cầu hỗ trợ</span>
                </>
              )}
            </button>
          </form>
        )}
      </section>

      {/* General FAQ Section */}
      <section className="space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Giải Đáp Nhanh</span>
          <h2 className="text-2xl font-bold text-slate-900">Câu Hỏi Thường Gặp Chung Cho Các Ứng Dụng</h2>
        </div>

        <div className="space-y-3 pt-2">
          {generalFaqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-5 text-left flex justify-between items-center gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span className="font-semibold text-sm sm:text-base text-slate-900">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Compliance & Policy Bar */}
      <div className="pt-6 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
        <span>Nhà phát triển: <strong>Frank</strong></span>
        <div className="flex gap-4">
          <Link href="/privacy" className="text-slate-600 hover:text-emerald-700 font-semibold underline">
            Chính Sách Quyền Riêng Tư Chung (Universal Privacy Policy)
          </Link>
          <span>•</span>
          <Link href="/" className="text-slate-600 hover:text-emerald-700 underline">
            Trang chủ HowDoI
          </Link>
        </div>
      </div>
    </div>
  );
}
