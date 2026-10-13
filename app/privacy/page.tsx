import React from 'react';
import Link from 'next/link';
import { SITE } from '@/lib/site';
import { Shield, ArrowLeft, Lock, Smartphone, CheckCircle, Mail } from 'lucide-react';

export const metadata = {
  title: 'Chính Sách Quyền Riêng Tư Chung (Privacy Policy) — Ứng dụng của Frank',
  description: 'Chính sách bảo mật và quyền riêng tư chính thức áp dụng cho tất cả ứng dụng di động iOS do Frank phát triển.',
};

export default function UniversalPrivacyPage() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Back to Support */}
      <div>
        <Link
          href="/support"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Trung tâm Hỗ trợ (Support Portal)</span>
        </Link>
      </div>

      {/* Header */}
      <header className="space-y-4 border-b border-slate-200 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>Apple App Store Privacy Compliance (Guideline 5.1.1)</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Chính Sách Quyền Riêng Tư Toàn Diện <br className="hidden sm:inline" />
          (Universal Privacy Policy)
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <span>Áp dụng cho: <strong>Tất cả ứng dụng di động iOS của Frank</strong></span>
          <span>•</span>
          <span>Bao gồm: <em>Cho Con - Chuẩn Bị Đón Bé</em>, <em>HowDoI Finance</em> & các ứng dụng sắp tới</span>
          <span>•</span>
          <span>Cập nhật lần cuối: <strong>13/10/2026</strong></span>
        </div>
      </header>

      {/* Quick Summary Box */}
      <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-6 space-y-3">
        <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-700" /> Cam kết bảo mật cốt lõi
        </h3>
        <ul className="space-y-2 text-xs sm:text-sm text-emerald-900">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Không bán dữ liệu:</strong> Chúng tôi cam kết không bán, không cho thuê, không chia sẻ thông tin cá nhân của bạn cho bất kỳ nhà quảng cáo hay bên thứ ba nào.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Lưu trữ trên thiết bị (On-Device):</strong> Mọi dữ liệu ghi chép (danh sách sắm đồ, ngân sách, lịch trình cá nhân) được lưu trực tiếp trên thiết bị của bạn.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Tôn trọng quyền riêng tư tuyệt đối:</strong> Ứng dụng không theo dõi bạn qua các trang web khác (No tracking across other apps/websites).</span>
          </li>
        </ul>
      </div>

      {/* Detailed Policy Sections */}
      <div className="space-y-8 text-sm sm:text-base text-slate-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">1. Giới thiệu và Phạm vi áp dụng</h2>
          <p>
            Chính sách quyền riêng tư này áp dụng cho toàn bộ các ứng dụng di động được phân phối trên Apple App Store bởi nhà phát triển <strong>Frank</strong>, bao gồm nhưng không giới hạn ở:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm">
            <li><strong>Cho Con - Chuẩn Bị Đón Bé</strong> (Ứng dụng chuẩn bị đồ sơ sinh & ngân sách đón bé)</li>
            <li><strong>HowDoI Personal Finance</strong> (Ứng dụng quản lý tài chính cá nhân & tích lũy tài sản)</li>
            <li>Các ứng dụng tiện ích khác được phát hành trong tương lai dưới cùng tài khoản nhà phát triển.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">2. Dữ liệu thu thập và Mục đích sử dụng</h2>
          <p>
            Chúng tôi tuân thủ nghiêm ngặt nguyên tắc <em>Data Minimization</em>:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-600 text-sm">
            <li>
              <strong>Dữ liệu do người dùng nhập (User Content):</strong> Các ghi chú, danh sách kiểm tra (checklists), con số thu chi. Những dữ liệu này được lưu trữ cục bộ trong bộ nhớ an toàn (Sandbox) của hệ điều hành iOS trên máy bạn. Chúng tôi không thể truy cập nội dung này.
            </li>
            <li>
              <strong>Dữ liệu kỹ thuật & Báo cáo lỗi (Crash Logs):</strong> Do Apple tự động thu thập và ẩn danh nếu bạn cho phép trong cài đặt iOS, nhằm giúp nhà phát triển xác định nguyên nhân sự cố ứng dụng.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">3. Quyền của người dùng & Xóa dữ liệu</h2>
          <p>
            Bạn có quyền xóa toàn bộ dữ liệu ứng dụng bất kỳ lúc nào bằng cách:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm">
            <li>Sử dụng tính năng xóa hoặc đặt lại trong phần Cài đặt của từng ứng dụng.</li>
            <li>Gỡ cài đặt (Delete App) khỏi thiết bị iPhone/iPad. Hệ điều hành iOS sẽ tự động xóa sạch dữ liệu cục bộ.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">4. Bảo vệ quyền riêng tư của trẻ em</h2>
          <p>
            Các ứng dụng của chúng tôi tuân thủ các quy chuẩn bảo vệ quyền riêng tư trẻ em (COPPA và các quy định tương đương). Chúng tôi không chủ ý thu thập dữ liệu định danh từ bất kỳ trẻ em nào.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">5. Liên hệ với nhà phát triển</h2>
          <p>
            Mọi thắc mắc hoặc yêu cầu liên quan đến chính sách bảo mật này, xin vui lòng gửi thư cho chúng tôi:
          </p>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm space-y-1">
            <p><strong>Nhà phát triển:</strong> Frank</p>
            <p><strong>Email:</strong> {SITE.contactEmail}</p>
            <p><strong>Trang hỗ trợ:</strong> https://howdoi.id.vn/support</p>
          </div>
        </section>
      </div>
    </article>
  );
}
