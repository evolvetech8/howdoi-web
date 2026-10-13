'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SITE } from '@/lib/site';
import SupportEmailCard from '@/components/SupportEmailCard';
import {
  HelpCircle,
  Mail,
  MessageSquare,
  Shield,
  Smartphone,
  Clock,
  ChevronDown,
} from 'lucide-react';

export default function ChoConSupportPage() {

  // Accordion FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Ứng dụng "Cho Con" có cần kết nối Internet để hoạt động không?',
      a: 'Không. Ứng dụng được thiết kế tối ưu để hoạt động ngoại tuyến 100% (offline). Mẹ và bố có thể dễ dàng kiểm tra danh sách đồ sơ sinh, chuẩn bị giỏ đồ đi sinh và ghi chép chi phí mọi lúc mọi nơi, ngay cả trong phòng chờ sinh hoặc bệnh viện khi không có Wi-Fi/4G.',
    },
    {
      q: 'Dữ liệu danh sách sắm đồ và ngân sách của tôi có được bảo mật không?',
      a: 'Hoàn toàn bảo mật. Tất cả thông tin bạn tạo trong ứng dụng (danh sách sắm đồ, ngân sách, ghi chú ngày dự sinh) được lưu trữ an toàn ngay trên thiết bị iPhone của bạn. Chúng tôi không thu thập thông tin tài chính hay dữ liệu đời tư nhạy cảm của gia đình bạn.',
    },
    {
      q: 'Làm thế nào để chia sẻ danh sách đồ đi sinh với chồng hoặc người thân?',
      a: 'Trong phiên bản 1.0, bạn có thể chọn tính năng "Chia sẻ" hoặc "Xuất danh sách" để gửi bản tóm tắt danh sách đồ sơ sinh qua iMessage, Zalo, ứng dụng Ghi chú hoặc in ra giấy.',
    },
    {
      q: 'Tôi muốn đóng góp thêm các món đồ sơ sinh cần thiết hoặc báo lỗi thì làm thế nào?',
      a: `Chúng tôi rất trân trọng mọi ý kiến đóng góp từ các ba mẹ! Bạn có thể gửi email trực tiếp tới ${SITE.contactEmail} (nút “Soạn email hỗ trợ” bên dưới). Mọi phản hồi sẽ được ghi nhận để cải tiến trong các bản cập nhật sắp tới.`,
    },
    {
      q: 'Ứng dụng có thu phí định kỳ (subscription) không?',
      a: 'Phiên bản cơ sở của ứng dụng hoàn toàn miễn phí, hỗ trợ tối đa cho các cặp vợ chồng trẻ trong hành trình chuẩn bị đón thiên thần nhỏ.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* App Header Banner */}
      <div className="bg-gradient-to-br from-rose-500 via-pink-600 to-amber-600 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white">
            <Smartphone className="w-4 h-4" />
            <span>Apple App Store Support Portal • Phiên bản 1.0</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Trung Tâm Hỗ Trợ: <br className="hidden sm:inline" />
            Ứng Dụng &quot;Cho Con - Chuẩn Bị Đón Bé&quot;
          </h1>

          <p className="text-rose-100 text-sm sm:text-base max-w-2xl leading-relaxed">
            Chào mừng các ba mẹ đến với trang hỗ trợ chính thức của ứng dụng <strong>Cho Con</strong>. Chúng tôi luôn sẵn sàng lắng nghe và đồng hành cùng bạn trong giai đoạn chuẩn bị thiêng liêng nhất của cuộc đời.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-rose-100">
            <span className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-white" />
              <span>Email: {SITE.contactEmail}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-white" />
              <span>Phản hồi: Trong vòng 24 giờ</span>
            </span>
          </div>
        </div>
      </div>

      {/* Quick Links Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 mb-3">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Câu Hỏi Thường Gặp</h3>
            <p className="text-xs text-slate-500 mt-1">Giải đáp tức thì các thắc mắc phổ biến về tính năng & cách dùng.</p>
          </div>
          <a href="#faq" className="text-xs font-semibold text-rose-600 mt-4 flex items-center gap-1">
            Xem phần FAQ bên dưới ↓
          </a>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-3">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Gửi Yêu Cầu Hỗ Trợ</h3>
            <p className="text-xs text-slate-500 mt-1">Báo lỗi kỹ thuật hoặc đề xuất tính năng mới cho nhà phát triển.</p>
          </div>
          <a href="#contact-form" className="text-xs font-semibold text-blue-600 mt-4 flex items-center gap-1">
            Gửi email cho nhà phát triển ↓
          </a>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-3">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Chính Sách Quyền Riêng Tư</h3>
            <p className="text-xs text-slate-500 mt-1">Tìm hiểu cách dữ liệu gia đình bạn được bảo vệ an toàn 100%.</p>
          </div>
          <Link href="/privacy/cho-con" className="text-xs font-semibold text-emerald-600 mt-4 flex items-center gap-1">
            Đọc chính sách quyền riêng tư →
          </Link>
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ) */}
      <section id="faq" className="space-y-4 pt-4 scroll-mt-24">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Trợ Giúp Nhanh</span>
          <h2 className="text-2xl font-bold text-slate-900">Câu Hỏi Thường Gặp (FAQ)</h2>
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
                      isOpen ? 'rotate-180 text-rose-600' : ''
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

      {/* Contact */}
      <SupportEmailCard appName="Cho Con - Chuẩn Bị Đón Bé" id="contact-form" />

      {/* Footer Info for App Reviewers & Users */}
      <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
        <span>Nhà phát triển: <strong>Frank</strong></span>
        <div className="flex gap-4">
          <Link href="/privacy/cho-con" className="text-slate-600 hover:text-rose-600 underline">
            Chính Sách Quyền Riêng Tư (Privacy Policy)
          </Link>
          <span>•</span>
          <Link href="/" className="text-slate-600 hover:text-rose-600 underline">
            Trang chủ HowDoI
          </Link>
        </div>
      </div>
    </div>
  );
}
