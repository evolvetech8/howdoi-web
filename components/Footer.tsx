"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowUpRight, Lock, CheckCircle2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand & Non-Advisory Notice */}
          <div className="md:col-span-5 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0B1D30] text-white flex items-center justify-center font-bold text-xs border border-blue-900/30">
                <ShieldCheck className="w-4 h-4 text-blue-300" />
              </div>
              <div>
                <span className="font-extrabold text-[#0B1D30] text-sm">
                  EvolveTech • DepositGuard
                </span>
                <span className="block text-[11px] text-slate-500">
                  evolvetech.biz.vn — Hệ thống chẩn đoán rủi ro tài chính trước
                  đặt cọc
                </span>
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed max-w-md">
              Đừng đặt cọc trước khi biết mình có đủ sức trả nợ. DepositGuard
              được phát triển bởi <strong>Archonic</strong> nhằm giúp gia đình
              Việt tự kiểm tra lịch trả nợ sau ưu đãi, sức chịu đựng trước biến
              động lãi suất và ngưỡng an toàn của quỹ dự phòng.
            </p>
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 border border-blue-200/80 text-[11px] font-semibold">
                <Lock className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                <span>Thông số mô phỏng được xử lý trên trình duyệt</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                <span>Có phương pháp tính và ví dụ đối chiếu</span>
              </div>
            </div>
          </div>

          {/* Simulator & Methodology Links */}
          <div className="md:col-span-3 space-y-2.5">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Công cụ &amp; Hồ sơ chẩn đoán
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/cap-nhat" className="hover:text-blue-800">
                  Cập nhật sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/ra-soat-ho-so-vay" className="hover:text-blue-800">
                  Rà soát hồ sơ vay
                </Link>
              </li>
              <li>
                <Link
                  href="/kiem-tra-mua-nha"
                  className="hover:text-blue-800 transition-colors font-semibold text-slate-800"
                >
                  Kiểm tra mua nhà (3 bước ẩn danh)
                </Link>
              </li>
              <li>
                <Link
                  href="/ket-qua"
                  className="hover:text-blue-800 transition-colors"
                >
                  Bảng điều khiển kết quả &amp; Stress-Test
                </Link>
              </li>
              <li>
                <Link
                  href="/bao-cao-mau"
                  className="hover:text-blue-800 transition-colors font-medium text-blue-700"
                >
                  Xem Hồ sơ Chẩn đoán Mẫu (DG-2026)
                </Link>
              </li>
              <li>
                <Link
                  href="/cach-tinh"
                  className="hover:text-blue-800 transition-colors"
                >
                  Phương pháp tính &amp; Công thức (v1.1)
                </Link>
              </li>
              <li>
                <Link
                  href="/huong-dan"
                  className="hover:text-blue-800 transition-colors"
                >
                  5 Cẩm nang tài chính trước đặt cọc
                </Link>
              </li>
              <li>
                <Link
                  href="/cau-hoi-thuong-gap"
                  className="hover:text-blue-800 transition-colors"
                >
                  Câu hỏi thường gặp (FAQ)
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust, Legal & App Store Obligations */}
          <div className="md:col-span-4 space-y-2.5">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Đơn vị vận hành, Pháp lý &amp; Hỗ trợ
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/ve-evolvetech"
                  className="hover:text-blue-800 transition-colors"
                >
                  Về EvolveTech (Archonic) &amp; Cam kết độc lập
                </Link>
              </li>
              <li>
                <Link
                  href="/bao-mat"
                  className="hover:text-blue-800 transition-colors"
                >
                  Chính sách bảo mật dữ liệu (Luật 91/2025/QH15)
                </Link>
              </li>
              <li>
                <Link
                  href="/dieu-khoan"
                  className="hover:text-blue-800 transition-colors"
                >
                  Điều khoản sử dụng &amp; Giới hạn trách nhiệm
                </Link>
              </li>
              <li>
                <Link
                  href="/lien-he"
                  className="hover:text-blue-800 transition-colors"
                >
                  Liên hệ &amp; Báo lỗi phép tính
                </Link>
              </li>
              <li className="pt-1 border-t border-slate-100 flex flex-wrap gap-x-4 gap-y-1">
                <Link
                  href="/support"
                  className="hover:text-blue-800 transition-colors inline-flex items-center gap-0.5 text-slate-500"
                >
                  <span>App Store Support</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
                <Link
                  href="/privacy"
                  className="hover:text-blue-800 transition-colors inline-flex items-center gap-0.5 text-slate-500"
                >
                  <span>App Privacy</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
                <Link
                  href="/projects"
                  className="hover:text-blue-800 transition-colors inline-flex items-center gap-0.5 text-slate-500"
                >
                  <span>EvolveTech Studio</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Non-Advisory Scope Disclosure */}
        <div className="mt-8 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 leading-relaxed">
          <strong className="text-slate-700">Tuyên bố giới hạn phạm vi:</strong>{" "}
          Kết quả từ EvolveTech DepositGuard là mô phỏng dòng tiền toán học dựa
          trên giả định do người dùng tự nhập. Công cụ{" "}
          <strong>không phải</strong> là cam kết phê duyệt tín dụng của ngân
          hàng, không thẩm định pháp lý sổ đỏ/hợp đồng đặt cọc, không định giá
          bất động sản và không thay thế tư vấn tài chính hoặc pháp lý chuyên
          nghiệp. Lịch trả nợ thực tế tại ngân hàng có thể chênh lệch nhỏ do quy
          ước tính ngày thực tế (actual/365 hoặc actual/360).
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-400">
          <p>
            © {new Date().getFullYear()} EvolveTech (evolvetech.biz.vn) • Vận
            hành bởi Archonic.
          </p>
          <div className="flex items-center gap-3">
            <span>Mô hình tính toán v1.1 (Deterministic VND)</span>
            <span className="text-slate-300">•</span>
            <a
              href="mailto:archonic88@gmail.com"
              className="hover:text-blue-800 transition-colors"
            >
              archonic88@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
