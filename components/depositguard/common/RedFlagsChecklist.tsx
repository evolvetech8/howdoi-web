'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  Calculator,
  FileCheck2,
} from 'lucide-react';

interface RedFlagItem {
  id: string;
  code: string;
  category: string;
  title: string;
  detail: string;
  impact: string;
}

const RED_FLAGS: RedFlagItem[] = [
  {
    id: 'flag-floating-margin',
    code: '01',
    category: 'RỦI RO LÃI SUẤT THẢ NỔI',
    title: 'Chưa biết công thức lãi suất thả nổi sau ưu đãi (Lãi cơ sở + Biên độ)',
    detail:
      'Chỉ nghe tư vấn "lãi năm đầu 6,5% – 7,5%" nhưng chưa có văn bản xác nhận biên độ cộng thêm (thường 3,5% – 4,5%/năm) từ tháng 13 hoặc tháng 25.',
    impact: 'Tiền trả ngân hàng nhảy vọt +25% đến +40% ngay ngày đầu năm thứ 2.',
  },
  {
    id: 'flag-zero-reserve',
    code: '02',
    category: 'RỦI RO THANH KHOẢN',
    title: 'Trả xong tiền đặt cọc & vốn tự có 30% là tài khoản tiết kiệm gần về 0 đồng',
    detail:
      'Chưa dự trù thêm 6% – 8% giá trị nhà cho 7 khoản tiền mặt bắt buộc (thuế trước bạ, phí bảo trì 2%, công chứng, bảo hiểm khoản vay, nội thất cơ bản và quỹ dự phòng 6 tháng).',
    impact: 'Nguy cơ phải vay nóng hoặc rút thẻ tín dụng ngay khi nhận bàn giao nhà.',
  },
  {
    id: 'flag-valuation-shortfall',
    code: '03',
    category: 'BẪY ĐỊNH GIÁ TÀI SẢN',
    title: 'Ngân hàng chưa thẩm định giá tài sản bằng văn bản trước khi bạn đặt cọc',
    detail:
      'Môi giới cam kết "vay được 70% giá mua 3 tỷ (2,1 tỷ)", nhưng ngân hàng thường chỉ định giá theo khung nội bộ (ví dụ 2,5 tỷ → chỉ giải ngân 1,75 tỷ).',
    impact: 'Hụt 300 – 400 triệu tiền mặt phút chót; nếu không xoay kịp sẽ mất trắng tiền cọc.',
  },
  {
    id: 'flag-high-dsr',
    code: '04',
    category: 'QUÁ TẢI NGHĨA VỤ TRẢ NỢ',
    title: 'Khoản trả nợ dự kiến khi thả nổi chiếm trên 45% thu nhập thực nhận (Net)',
    detail:
      'Ngân hàng có thể vẫn duyệt vay vì có tài sản thế chấp, nhưng phần tiền còn lại không đủ trang trải chi phí sinh hoạt gia đình và học phí con cái.',
    impact: 'Chỉ cần 1 người giảm thu nhập 20% trong 3–6 tháng là dòng tiền gia đình lập tức âm.',
  },
  {
    id: 'flag-fomo-pressure',
    code: '05',
    category: 'RỦI RO PHÁP LÝ ĐẶT CỌC',
    title: 'Đang chịu áp lực phải chuyển tiền cọc gấp trong 24–48 giờ vì sợ mất căn',
    detail:
      'Hợp đồng đặt cọc mẫu của bên bán chưa có điều khoản "Hoàn trả 100% tiền cọc nếu ngân hàng từ chối giải ngân hoặc định giá thấp hơn mức cam kết".',
    impact: 'Mọi rủi ro tín dụng bị đẩy hoàn toàn sang phía người mua nhà.',
  },
];

export default function RedFlagsChecklist() {
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({
    'flag-floating-margin': true,
    'flag-valuation-shortfall': true,
  });

  const toggleFlag = (id: string) => {
    setCheckedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const activeCount = Object.values(checkedIds).filter(Boolean).length;
  const severityPercent = Math.round((activeCount / RED_FLAGS.length) * 100);

  return (
    <div className="space-y-8">
      {/* Editorial Section Header & Live Severity Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-6 border-b border-slate-200">
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-extrabold uppercase tracking-widest text-blue-800 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-md">
              02 / CHẨN ĐOÁN RỦI RO TRƯỚC ĐẶT CỌC
            </span>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              PRE-DEPOSIT AUDIT LEDGER
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Tự kiểm tra 5 &ldquo;Đèn Đỏ Tài Chính&rdquo; trong 30 giây.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            Đánh dấu vào những tình huống mà gia đình bạn đang gặp phải trước khi chuyển{' '}
            <strong className="text-slate-900">100 – 300 triệu đồng</strong> tiền đặt cọc mua nhà:
          </p>
        </div>

        {/* Right: Institutional Risk Severity Meter */}
        <div className="lg:col-span-5">
          <div className="p-5 rounded-2xl bg-[#0B1D30] text-white border border-slate-800 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShieldAlert
                  className={`w-4 h-4 ${
                    activeCount >= 2
                      ? 'text-rose-400'
                      : activeCount === 1
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                />
                <span className="font-mono text-[11px] uppercase tracking-wider text-slate-300">
                  MỨC ĐỘ RỦI RO ĐẶT CỌC HIỆN TẠI
                </span>
              </div>
              <span
                className={`font-mono text-lg font-extrabold px-2.5 py-0.5 rounded tabular-nums ${
                  activeCount >= 2
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : activeCount === 1
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {activeCount}/5 ĐÈN ĐỎ
              </span>
            </div>

            {/* Animated Risk Severity Progress Bar */}
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  activeCount >= 2
                    ? 'bg-rose-500'
                    : activeCount === 1
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                }`}
                style={{ width: `${Math.max(8, severityPercent)}%` }}
              />
            </div>

            <div className="text-xs font-bold text-slate-200">
              {activeCount >= 2
                ? 'CẢNH BÁO CAO: Cần chạy Stress-Test 240 tháng ngay trước khi ký cọc!'
                : activeCount === 1
                ? 'CẦN LƯU Ý: Kiểm tra kỹ dòng tiền Tháng 13 & điều khoản hoàn cọc'
                : 'CHUẨN BỊ TỐT: Hãy kiểm chứng lại bằng con số thực tế của căn nhà'}
            </div>
          </div>
        </div>
      </div>

      {/* Apple / Wise Editorial Financial Ledger Rows (1px Horizontal Dividers) */}
      <div className="divide-y divide-slate-200 border-t border-b border-slate-200 bg-white">
        {RED_FLAGS.map((item) => {
          const isChecked = !!checkedIds[item.id];
          return (
            <label
              key={item.id}
              htmlFor={item.id}
              className={`group py-6 px-4 sm:px-6 transition-all duration-200 cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start ${
                isChecked
                  ? 'bg-rose-50/40 hover:bg-rose-50/70'
                  : 'bg-white hover:bg-slate-50/90'
              }`}
            >
              {/* Col 1-2: Number + Checkbox + Category */}
              <div className="lg:col-span-2 flex items-center gap-3.5">
                <input
                  id={item.id}
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleFlag(item.id)}
                  className="w-4 h-4 accent-rose-600 rounded cursor-pointer shrink-0"
                />
                <span
                  className={`font-mono text-2xl sm:text-3xl font-extrabold tabular-nums transition-colors ${
                    isChecked ? 'text-rose-600' : 'text-slate-300 group-hover:text-slate-500'
                  }`}
                >
                  {item.code}
                </span>
                <span className="lg:hidden font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {item.category}
                </span>
              </div>

              {/* Col 3-8: Editorial Diagnostic Title & Description */}
              <div className="lg:col-span-6 space-y-1.5">
                <div className="hidden lg:block font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {item.category}
                </div>
                <div className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                  {item.title}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.detail}
                </p>
              </div>

              {/* Col 9-12: Financial Consequence & Live Status Pill */}
              <div className="lg:col-span-4 flex flex-col justify-between lg:items-end gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-[11px] font-bold uppercase tracking-wider border w-fit ${
                    isChecked
                      ? 'bg-rose-100/90 text-rose-900 border-rose-300'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {isChecked ? (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
                      <span>Đèn đỏ đang bật</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Chưa ghi nhận</span>
                    </>
                  )}
                </span>

                <p
                  className={`text-xs lg:text-right leading-relaxed font-medium ${
                    isChecked ? 'text-rose-900 font-semibold' : 'text-slate-500'
                  }`}
                >
                  <span className="font-mono uppercase text-[10px] tracking-wider block text-slate-400">
                    Hệ quả tài chính:
                  </span>
                  {item.impact}
                </p>
              </div>
            </label>
          );
        })}
      </div>

      {/* Editorial Ledger Summary Bar */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-100/90 border border-slate-200/90 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
            {activeCount >= 2 ? (
              <>
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>
                  Bạn đang bật {activeCount}/5 đèn đỏ — Tuyệt đối đừng xuống tiền cọc khi chưa mô phỏng 240 tháng!
                </span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 text-blue-700 shrink-0" />
                <span>
                  Đưa thông số thực tế của căn nhà vào bộ giải để kiểm chứng độ bền quỹ dự phòng gia đình.
                </span>
              </>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Chỉ mất 2 phút để biết chính xác tháng thứ mấy dòng tiền có nguy cơ bị âm và mức vay tối đa an toàn cho gia đình bạn.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/kiem-tra-mua-nha"
            className="px-6 py-3.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-extrabold inline-flex items-center gap-2 shadow-xs transition-colors"
          >
            <Calculator className="w-4 h-4" />
            <span>Chạy Stress-Test miễn phí</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/bao-cao-mau"
            className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-colors"
          >
            <FileCheck2 className="w-4 h-4 text-blue-700" />
            <span>Xem hồ sơ mẫu</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
