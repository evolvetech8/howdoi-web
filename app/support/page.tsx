'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SITE } from '@/lib/site';
import SupportEmailCard from '@/components/SupportEmailCard';
import {
  Mail,
  Smartphone,
  Clock,
  ChevronDown,
  Baby,
  Wallet,
  AppWindow,
} from 'lucide-react';

export default function UniversalSupportPage() {
  const [selectedApp, setSelectedApp] = useState('Cho Con - Chuẩn Bị Đón Bé');
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
      id: 'howdoi-so-tra-no',
      name: 'HowDoI — Sổ trả nợ (web)',
      tagline: 'Lập kế hoạch trả nợ và ghi sổ mỗi tháng trên howdoi.id.vn',
      version: 'Web',
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
      a: `Hãy gửi email tới ${SITE.contactEmail} (nút “Soạn email hỗ trợ” bên dưới), kèm mô tả vấn đề và dòng iPhone bạn đang dùng. Chúng tôi cam kết phản hồi tất cả yêu cầu hỗ trợ trong vòng 24 giờ làm việc.`,
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
            Trang hỗ trợ chính thức cho các ứng dụng của Frank (bao gồm ứng dụng iOS <strong>Cho Con - Chuẩn Bị Đón Bé</strong>, Sổ trả nợ HowDoI trên web và các dự án sắp tới). Chúng tôi luôn ở đây để giúp bạn có trải nghiệm mượt mà nhất.
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
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Ứng dụng</span>
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

      {/* Contact */}
      <SupportEmailCard appName={selectedApp} id="contact" />

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
