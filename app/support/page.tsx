'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Clock,
  ChevronDown,
  Baby,
  Wallet,
  AppWindow,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function UniversalSupportPage() {
  const { lang, t } = useLanguage();
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
      name: lang === 'vi' ? 'Cho Con - Chuẩn Bị Đón Bé' : 'Cho Con - Baby Prep & Checklist',
      tagline: lang === 'vi' ? 'Sắm đồ sơ sinh, giỏ đồ đi sinh & ngân sách đón bé' : 'Newborn shopping checklist, hospital bag & budget planner',
      version: 'iOS Version 1.0+',
      icon: Baby,
      color: 'from-rose-500 to-pink-600',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      id: 'evolvetech-finance',
      name: lang === 'vi' ? 'EvolveTech — Tài Chính Cá Nhân' : 'EvolveTech — Personal Finance Suite',
      tagline: lang === 'vi' ? 'Quản lý thu chi, tích lũy lãi kép & thoát khỏi âu lo tiền bạc' : 'Compound interest calculator, salary converter & budget planner',
      version: 'iOS / Web Ecosystem',
      icon: Wallet,
      color: 'from-emerald-600 to-teal-600',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    {
      id: 'general-apps',
      name: lang === 'vi' ? 'Hệ Sinh Thái Ứng Dụng EvolveTech' : 'EvolveTech Apps Ecosystem',
      tagline: lang === 'vi' ? 'Các công cụ tiện ích & ứng dụng di động sắp ra mắt' : 'Upcoming utility & productivity applications',
      version: 'All iOS Products',
      icon: AppWindow,
      color: 'from-blue-600 to-indigo-600',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
  ];

  const faqs = lang === 'vi' ? [
    {
      q: 'Làm thế nào để nhận được hỗ trợ nhanh nhất?',
      a: 'Bạn có thể điền thông tin vào biểu mẫu trực tuyến bên dưới hoặc gửi email trực tiếp tới archonic88@gmail.com. Chúng tôi cam kết phản hồi tất cả yêu cầu hỗ trợ trong vòng 24 giờ làm việc.',
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
  ] : [
    {
      q: 'How can I get the fastest customer support?',
      a: 'You can submit the online ticket form below or email us directly at archonic88@gmail.com. We guarantee a personal response within 24 business hours.',
    },
    {
      q: 'How is my personal data stored and secured in your apps?',
      a: 'Our core design philosophy is "On-Device First". All your checklists, financial plans, and personal notes are saved locally on your iPhone sandbox storage. We never sell or share your data with advertisers or third parties.',
    },
    {
      q: 'Do the apps work offline?',
      a: 'Yes. All our utility applications (such as "Cho Con" and tracking tools) are fully functional offline without requiring an active Wi-Fi or cellular connection.',
    },
    {
      q: 'How do I restore my previous in-app purchases?',
      a: 'If you switch devices or reinstall the app, open the Settings screen inside the app and tap "Restore Purchases". Apple App Store will automatically restore your purchase for free.',
    },
    {
      q: 'Can I suggest new features or report an issue?',
      a: 'Absolutely! We love hearing directly from users. Send us your feedback below and we will factor it into our upcoming release roadmap.',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) {
      setFeedbackMsg(lang === 'vi' ? 'Vui lòng điền đầy đủ email và nội dung tin nhắn.' : 'Please provide a valid email and your message.');
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
      if (!res.ok) throw new Error(data.message || 'Error submitting request.');

      setStatus('success');
      setFeedbackMsg(
        lang === 'vi'
          ? `Yêu cầu hỗ trợ cho ứng dụng "${selectedApp}" đã được tiếp nhận. Đội ngũ phát triển sẽ phản hồi qua email ${email} trong vòng 24 giờ.`
          : `Support request for "${selectedApp}" received! Archonic will reply to ${email} within 24 hours.`
      );
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setStatus('error');
      setFeedbackMsg(err.message || 'Error occurred. Please email directly to archonic88@gmail.com.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Universal Support Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute -right-16 -bottom-16 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -top-16 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-300 border border-white/10">
            <Smartphone className="w-4 h-4" />
            <span>{t.support.badge}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {t.support.title} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
              Apps By Archonic & EvolveTech
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            {t.support.subtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-blue-400" />
              <span>{t.support.emailLabel}: <strong>archonic88@gmail.com</strong></span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>{t.support.responseLabel}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Supported Apps Directory */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-800">App Store</span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">{t.support.sectionTitle}</h2>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">
            {lang === 'vi' ? 'Bấm vào app để chọn yêu cầu hỗ trợ' : 'Click an app to target your support request'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {appsList.map((app) => {
            const Icon = app.icon;
            const isSelected = selectedApp.includes(app.id) || selectedApp === app.name;
            return (
              <div
                key={app.id}
                onClick={() => setSelectedApp(app.name)}
                className={`p-5 rounded-2xl bg-white border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-600 shadow-md ring-2 ring-blue-600/20'
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
                  <span className={`font-semibold ${isSelected ? 'text-blue-700' : 'text-slate-400'}`}>
                    {isSelected ? (lang === 'vi' ? '✓ Đang chọn hỗ trợ' : '✓ Selected') : (lang === 'vi' ? 'Chọn ứng dụng này' : 'Select this app')}
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
          <span className="text-xs font-bold uppercase tracking-wider text-blue-800">Ticket System</span>
          <h2 className="text-2xl font-bold text-slate-900">{t.support.formTitle}</h2>
          <p className="text-slate-500 text-xs sm:text-sm">{t.support.formSubtitle}</p>
        </div>

        {status === 'success' ? (
          <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950 flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-blue-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-sm">{lang === 'vi' ? 'Gửi yêu cầu thành công!' : 'Request Sent Successfully!'}</h4>
              <p className="text-xs text-blue-900 leading-relaxed">{feedbackMsg}</p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="mt-3 text-xs font-bold text-blue-800 underline"
              >
                {lang === 'vi' ? 'Gửi thêm yêu cầu hỗ trợ khác' : 'Submit another request'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                {t.support.selectApp} <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedApp}
                onChange={(e) => setSelectedApp(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 transition-colors bg-white font-medium text-slate-800"
              >
                {appsList.map((app) => (
                  <option key={app.id} value={app.name}>
                    {app.name} ({app.version})
                  </option>
                ))}
                <option value="Khác">{lang === 'vi' ? 'Ứng dụng khác / Yêu cầu chung' : 'Other / General inquiry'}</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  {t.support.nameLabel}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'vi' ? 'Ví dụ: Archonic, Minh Anh...' : 'e.g. Archonic, Alex...'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  {t.support.emailInputLabel} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                {t.support.subjectLabel}
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 transition-colors bg-white"
              >
                {lang === 'vi' ? (
                  <>
                    <option value="Hỗ trợ kỹ thuật / Báo lỗi">Báo cáo lỗi kỹ thuật (Bug report / Crash)</option>
                    <option value="Góp ý tính năng mới">Đóng góp ý kiến / Đề xuất tính năng mới</option>
                    <option value="Thanh toán / Mua gói">Hỏi về thanh toán / Gói dịch vụ</option>
                    <option value="Bảo mật & Quyền riêng tư">Câu hỏi về bảo mật & dữ liệu</option>
                    <option value="Khác">Vấn đề khác</option>
                  </>
                ) : (
                  <>
                    <option value="Bug Report / Crash">Bug Report / App Crash</option>
                    <option value="Feature Suggestion">Feature Suggestion / Enhancement</option>
                    <option value="Purchase / In-App Billing">Purchase / In-App Billing</option>
                    <option value="Privacy & Security">Privacy & Security Questions</option>
                    <option value="Other">Other Inquiry</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                {t.support.detailLabel} <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder={lang === 'vi' ? 'Vui lòng mô tả chi tiết vấn đề hoặc tính năng bạn muốn gửi gắm...' : 'Please describe the issue or feature in detail...'}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 transition-colors"
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
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {status === 'loading' ? (
                <span>{t.support.submitting}</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t.support.submitBtn}</span>
                </>
              )}
            </button>
          </form>
        )}
      </section>

      {/* General FAQ Section */}
      <section className="space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-800">{t.support.faqBadge}</span>
          <h2 className="text-2xl font-bold text-slate-900">{t.support.faqTitle}</h2>
        </div>

        <div className="space-y-3 pt-2">
          {faqs.map((faq, index) => {
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
                      isOpen ? 'rotate-180 text-blue-700' : ''
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
        <span>Developer: <strong>Archonic • EvolveTech Apps Ecosystem</strong></span>
        <div className="flex gap-4">
          <Link href="/privacy" className="text-slate-600 hover:text-blue-800 font-semibold underline">
            {t.support.privacyLink}
          </Link>
          <span>•</span>
          <Link href="/" className="text-slate-600 hover:text-blue-800 underline">
            {lang === 'vi' ? 'Trang chủ EvolveTech.biz.vn' : 'EvolveTech.biz.vn Home'}
          </Link>
        </div>
      </div>
    </div>
  );
}
