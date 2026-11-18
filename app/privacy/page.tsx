'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft, Lock, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function UniversalPrivacyPage() {
  const { lang } = useLanguage();

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Back to Support */}
      <div>
        <Link
          href="/support"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'vi' ? 'Quay lại Trung tâm Hỗ trợ (Support Portal)' : 'Back to Support Portal'}</span>
        </Link>
      </div>

      {/* Header */}
      <header className="space-y-4 border-b border-slate-200 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>Apple App Store Privacy Compliance (Guideline 5.1.1)</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {lang === 'vi' ? (
            <>
              Chính Sách Quyền Riêng Tư Toàn Diện <br className="hidden sm:inline" />
              (Universal Privacy Policy)
            </>
          ) : (
            <>
              Universal Privacy Policy <br className="hidden sm:inline" />
              (Apple App Store Compliant)
            </>
          )}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <span>
            {lang === 'vi' ? 'Áp dụng cho:' : 'Applies to:'}{' '}
            <strong>All iOS & Web Apps by Archonic / EvolveTech</strong>
          </span>
          <span>•</span>
          <span>
            {lang === 'vi' ? 'Cập nhật lần cuối:' : 'Last updated:'} <strong>08/09/2026</strong>
          </span>
        </div>
      </header>

      {/* Quick Summary Box */}
      <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-6 space-y-3">
        <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-700" />{' '}
          {lang === 'vi' ? 'Cam kết bảo mật cốt lõi' : 'Core Privacy Commitments'}
        </h3>
        <ul className="space-y-2 text-xs sm:text-sm text-emerald-900">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>{lang === 'vi' ? 'Không bán dữ liệu:' : 'Zero Data Selling:'}</strong>{' '}
              {lang === 'vi'
                ? 'Chúng tôi cam kết không bán, không cho thuê, không chia sẻ thông tin cá nhân của bạn cho bất kỳ nhà quảng cáo hay bên thứ ba nào.'
                : 'We never sell, rent, or monetize your personal information to third parties, data brokers, or advertising networks.'}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>{lang === 'vi' ? 'Lưu trữ trên thiết bị (On-Device):' : 'On-Device Storage:'}</strong>{' '}
              {lang === 'vi'
                ? 'Mọi dữ liệu ghi chép (danh sách sắm đồ, ngân sách, lịch trình cá nhân) được lưu trực tiếp trên thiết bị của bạn.'
                : 'Your personal notes, checklists, and financial calculations remain stored locally in your device sandbox.'}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>{lang === 'vi' ? 'Không theo dõi:' : 'No Tracking:'}</strong>{' '}
              {lang === 'vi'
                ? 'Ứng dụng không theo dõi bạn qua các trang web khác (No cross-app or cross-site tracking).'
                : 'Our apps never track your activity across other companies’ apps and websites.'}
            </span>
          </li>
        </ul>
      </div>

      {/* Detailed Policy Sections */}
      <div className="space-y-8 text-sm sm:text-base text-slate-700 leading-relaxed">
        {lang === 'vi' ? (
          <>
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">1. Giới thiệu và Phạm vi áp dụng</h2>
              <p>
                Chính sách quyền riêng tư này áp dụng cho toàn bộ các ứng dụng di động được phân phối trên Apple App Store bởi nhà phát triển <strong>Archonic (EvolveTech Ecosystem)</strong>, bao gồm nhưng không giới hạn ở:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm">
                <li><strong>Cho Con - Chuẩn Bị Đón Bé</strong> (Ứng dụng chuẩn bị đồ sơ sinh & ngân sách đón bé)</li>
                <li><strong>EvolveTech Personal Finance</strong> (Ứng dụng quản lý tài chính cá nhân & tích lũy tài sản)</li>
                <li>Các ứng dụng tiện ích khác được phát hành trong tương lai dưới cùng tài khoản nhà phát triển.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">2. Dữ liệu thu thập và Mục đích sử dụng</h2>
              <p>Chúng tôi tuân thủ nghiêm ngặt nguyên tắc <em>Data Minimization</em>:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-600 text-sm">
                <li>
                  <strong>Dữ liệu do người dùng nhập (User Content):</strong> Các ghi chú, danh sách kiểm tra (checklists), con số thu chi. Những dữ liệu này được lưu trữ cục bộ trong bộ nhớ an toàn của hệ điều hành iOS trên máy bạn. Chúng tôi không thể truy cập nội dung này.
                </li>
                <li>
                  <strong>Dữ liệu kỹ thuật & Báo cáo lỗi (Crash Logs):</strong> Do Apple tự động thu thập và ẩn danh nếu bạn cho phép trong cài đặt iOS, nhằm giúp nhà phát triển xác định nguyên nhân sự cố ứng dụng.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">3. Quyền của người dùng & Xóa dữ liệu</h2>
              <p>Bạn có toàn quyền kiểm soát dữ liệu của mình bất kỳ lúc nào bằng cách:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm">
                <li>Sử dụng tính năng xóa hoặc đặt lại trong phần Cài đặt của từng ứng dụng.</li>
                <li>Gỡ cài đặt (Delete App) khỏi thiết bị iPhone/iPad. Hệ điều hành iOS sẽ tự động xóa sạch dữ liệu cục bộ.</li>
              </ul>
            </section>

            <section className="space-y-3 pt-4 border-t border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">4. Liên hệ với nhà phát triển</h2>
              <p>Mọi thắc mắc hoặc yêu cầu liên quan đến chính sách bảo mật này, xin vui lòng gửi thư cho chúng tôi:</p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm space-y-1">
                <p><strong>Nhà phát triển:</strong> Archonic (EvolveTech)</p>
                <p><strong>Email:</strong> archonic88@gmail.com</p>
                <p><strong>Trang web:</strong> https://www.evolvetech.biz.vn</p>
              </div>
            </section>
          </>
        ) : (
          <>
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">1. Overview & Scope</h2>
              <p>
                This Privacy Policy applies to all applications distributed on the Apple App Store and web platforms developed by <strong>Archonic (EvolveTech Studio)</strong>, including:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm">
                <li><strong>Cho Con - Baby Prep & Checklist</strong> (Newborn checklist & budget planner)</li>
                <li><strong>EvolveTech Personal Finance Suite</strong> (Personal wealth planning & calculation tools)</li>
                <li>All upcoming utility and productivity applications published under the developer account.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">2. Data Collection & Usage</h2>
              <p>We strictly adhere to the principle of <em>Data Minimization</em>:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-600 text-sm">
                <li>
                  <strong>User Content & Calculations:</strong> Checklists, financial inputs, and personal notes are stored locally in the secure sandbox of your iOS device. We have zero access to this content.
                </li>
                <li>
                  <strong>Anonymous Crash Analytics:</strong> Collected anonymously through Apple’s opt-in crash diagnostic reporting to help us fix bugs and improve performance.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">3. User Rights & Data Deletion</h2>
              <p>You have full sovereignty over your data:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm">
                <li>You can edit or delete items within each application at any time.</li>
                <li>Deleting the app from your iOS device immediately and permanently purges all local storage.</li>
              </ul>
            </section>

            <section className="space-y-3 pt-4 border-t border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">4. Developer Contact</h2>
              <p>For questions or privacy requests, please contact us directly:</p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm space-y-1">
                <p><strong>Developer:</strong> Archonic (EvolveTech)</p>
                <p><strong>Email:</strong> archonic88@gmail.com</p>
                <p><strong>Website:</strong> https://www.evolvetech.biz.vn</p>
              </div>
            </section>
          </>
        )}
      </div>
    </article>
  );
}
