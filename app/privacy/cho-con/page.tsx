import React from 'react';
import Link from 'next/link';
import { SITE } from '@/lib/site';
import { Shield, ArrowLeft, Lock, Smartphone, CheckCircle, Mail } from 'lucide-react';

export const metadata = {
  title: 'Chính Sách Quyền Riêng Tư (Privacy Policy) — Ứng Dụng Cho Con',
  description: 'Chính sách bảo mật và quyền riêng tư chính thức của ứng dụng di động Cho Con - Chuẩn Bị Đón Bé.',
};

export default function ChoConPrivacyPage() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Back to Support */}
      <div>
        <Link
          href="/support/cho-con"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại trang Hỗ trợ ứng dụng Cho Con</span>
        </Link>
      </div>

      {/* Header */}
      <header className="space-y-4 border-b border-slate-200 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>Apple App Store Privacy Compliance (Guideline 5.1.1)</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Chính Sách Quyền Riêng Tư <br className="hidden sm:inline" />
          (Privacy Policy)
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <span>Ứng dụng: <strong>Cho Con - Chuẩn Bị Đón Bé</strong> (iOS)</span>
          <span>•</span>
          <span>Nhà phát triển: <strong>Frank</strong></span>
          <span>•</span>
          <span>Cập nhật lần cuối: <strong>13/10/2026</strong></span>
        </div>
      </header>

      {/* Quick Summary Box */}
      <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-6 space-y-3">
        <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-700" /> Tóm tắt cam kết bảo vệ dữ liệu
        </h3>
        <ul className="space-y-2 text-xs sm:text-sm text-emerald-900">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Không bán dữ liệu:</strong> Chúng tôi không bao giờ bán, cho thuê hoặc chia sẻ dữ liệu cá nhân của gia đình bạn cho bất kỳ bên thứ ba hay mạng quảng cáo nào.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Lưu trữ trên máy (On-Device Storage):</strong> Toàn bộ danh sách đồ sơ sinh, thông tin ngân sách và ghi chú chuẩn bị sinh con được lưu trữ cục bộ ngay trên thiết bị iPhone của bạn.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Không yêu cầu tài khoản nhạy cảm:</strong> Bạn có thể sử dụng trọn vẹn ứng dụng ngay sau khi tải về mà không bắt buộc phải khai báo danh tính cá nhân.</span>
          </li>
        </ul>
      </div>

      {/* Content Sections */}
      <div className="space-y-8 text-sm sm:text-base text-slate-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">1. Giới thiệu</h2>
          <p>
            Chào mừng bạn đến với ứng dụng <strong>&quot;Cho Con - Chuẩn Bị Đón Bé&quot;</strong> do Frank phát triển. Chúng tôi hiểu rằng hành trình làm cha mẹ là một trải nghiệm thiêng liêng và riêng tư. Chúng tôi cam kết tuyệt đối bảo vệ quyền riêng tư của bạn và con bạn.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">2. Dữ liệu chúng tôi thu thập</h2>
          <p>
            Ứng dụng hoạt động với nguyên tắc <em>Data Minimization</em> (Tối thiểu hóa dữ liệu thu thập):
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-600 text-sm">
            <li>
              <strong>Dữ liệu danh sách chuẩn bị & ngân sách:</strong> Danh mục đồ dùng sơ sinh, giỏ đồ đi sinh mẹ và bé, chi phí dự tính. Dữ liệu này chỉ lưu trong bộ nhớ cục bộ trên thiết bị của bạn.
            </li>
            <li>
              <strong>Dữ liệu phân tích kỹ thuật (Diagnostics / Crash Reports):</strong> Apple có thể cung cấp các báo cáo ẩn danh về lỗi sập ứng dụng (crash logs) để giúp chúng tôi sửa lỗi và tối ưu hóa hiệu năng trải nghiệm người dùng. Dữ liệu này không thể dùng để định danh bạn.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">3. Quyền của người dùng & Xóa dữ liệu</h2>
          <p>
            Vì toàn bộ dữ liệu nằm trên máy bạn, bạn có toàn quyền kiểm soát tuyệt đối:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-600 text-sm">
            <li>Bạn có thể chỉnh sửa, thêm mới hoặc xóa bỏ bất kỳ mục nào bất cứ lúc nào trong ứng dụng.</li>
            <li>Khi bạn gỡ cài đặt ứng dụng khỏi iPhone, toàn bộ dữ liệu cục bộ liên quan sẽ được hệ điều hành iOS tự động xóa sạch hoàn toàn khỏi thiết bị.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">4. Bảo vệ quyền riêng tư của trẻ em</h2>
          <p>
            Ứng dụng được thiết kế dành cho các bậc cha mẹ và người chăm sóc trẻ sơ sinh. Chúng tôi không cố ý thu thập bất kỳ thông tin nhận dạng cá nhân nào từ trẻ em dưới 13 tuổi.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">5. Thay đổi đối với chính sách này</h2>
          <p>
            Chúng tôi có thể cập nhật Chính sách quyền riêng tư này tùy theo từng phiên bản ứng dụng để tuân thủ các quy định mới của Apple và pháp luật. Mọi cập nhật sẽ được thông báo rõ ràng trên trang này.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">6. Thông tin liên hệ</h2>
          <p>
            Nếu bạn có bất kỳ câu hỏi hoặc khiếu nại nào về Chính sách quyền riêng tư này, vui lòng liên hệ với nhà phát triển:
          </p>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm space-y-1">
            <p><strong>Người đại diện:</strong> Frank</p>
            <p><strong>Email:</strong> {SITE.contactEmail}</p>
            <p><strong>Trang web:</strong> https://howdoi.id.vn</p>
          </div>
        </section>
      </div>
    </article>
  );
}
