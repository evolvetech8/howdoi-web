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
  title: string;
  detail: string;
  impact: string;
}

const RED_FLAGS: RedFlagItem[] = [
  {
    id: 'flag-floating-margin',
    title: '1. Chưa biết công thức lãi suất thả nổi sau ưu đãi (Lãi cơ sở + Biên độ)',
    detail:
      'Chỉ nghe tư vấn "lãi năm đầu 6,5% – 7,5%" nhưng chưa có văn bản xác nhận biên độ cộng thêm (thường 3,5% – 4,5%/năm) từ tháng 13 hoặc tháng 25.',
    impact: 'Tiền trả ngân hàng có thể nhảy vọt +25% đến +40% ngay ngày đầu năm thứ 2.',
  },
  {
    id: 'flag-zero-reserve',
    title: '2. Trả xong tiền đặt cọc & vốn tự có 30% là tài khoản tiết kiệm gần về 0 đồng',
    detail:
      'Chưa dự trù thêm 6% – 8% giá trị nhà cho 7 khoản tiền mặt bắt buộc (thuế trước bạ, phí bảo trì 2%, công chứng, bảo hiểm khoản vay, nội thất cơ bản và quỹ dự phòng 6 tháng).',
    impact: 'Nguy cơ phải vay nóng hoặc rút thẻ tín dụng ngay khi nhận bàn giao nhà.',
  },
  {
    id: 'flag-valuation-shortfall',
    title: '3. Ngân hàng chưa thẩm định giá tài sản bằng văn bản trước khi bạn đặt cọc',
    detail:
      'Môi giới cam kết "vay được 70% giá mua 3 tỷ (2,1 tỷ)", nhưng ngân hàng thường chỉ định giá theo khung nội bộ (ví dụ 2,5 tỷ → chỉ giải ngân 1,75 tỷ).',
    impact: 'Hụt 300 – 400 triệu tiền mặt phút chót; nếu không xoay kịp sẽ mất trắng tiền cọc.',
  },
  {
    id: 'flag-high-dsr',
    title: '4. Khoản trả nợ dự kiến khi thả nổi chiếm trên 45% thu nhập thực nhận (Net)',
    detail:
      'Ngân hàng có thể vẫn duyệt vay vì có tài sản thế chấp, nhưng phần tiền còn lại không đủ trang trải chi phí sinh hoạt gia đình và học phí con cái.',
    impact: 'Chỉ cần 1 người giảm thu nhập 20% trong 3–6 tháng là dòng tiền gia đình lập tức âm.',
  },
  {
    id: 'flag-fomo-pressure',
    title: '5. Đang chịu áp lực phải chuyển tiền cọc gấp trong 24–48 giờ vì sợ mất căn',
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

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="p-6 sm:p-8 bg-slate-900 text-white flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Chẩn đoán khẩn cấp trước khi ký hợp đồng đặt cọc</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold">
            Tự kiểm tra 5 &ldquo;Đèn Đỏ Tài Chính&rdquo; trong 30 giây
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Hãy đánh dấu vào những tình huống mà gia đình bạn đang gặp phải trước khi chuyển 100 – 300 triệu đồng tiền đặt cọc:
          </p>
        </div>

        <div
          className={`shrink-0 px-4 py-3 rounded-2xl border text-xs font-bold flex items-center gap-2.5 ${
            activeCount >= 2
              ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
              : activeCount === 1
              ? 'bg-amber-950/90 border-amber-500/50 text-amber-200'
              : 'bg-emerald-950/90 border-blue-600/50 text-emerald-200'
          }`}
        >
          <span className="font-mono text-lg font-extrabold px-2.5 py-0.5 rounded-lg bg-black/30">
            {activeCount}/5
          </span>
          <div>
            <div className="uppercase tracking-wider text-[10px] opacity-80">Mức độ rủi ro đặt cọc</div>
            <div className="text-xs sm:text-sm font-extrabold">
              {activeCount >= 2
                ? 'CẢNH BÁO CAO: Cần chạy Stress-Test ngay!'
                : activeCount === 1
                ? 'CẦN LƯU Ý: Kiểm tra kỹ dòng tiền Tháng 13'
                : 'CHUẨN BỊ TỐT: Hãy kiểm chứng lại bằng con số'}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {RED_FLAGS.map((item) => {
            const isChecked = !!checkedIds[item.id];
            return (
              <label
                key={item.id}
                htmlFor={item.id}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  isChecked
                    ? 'bg-rose-50/70 border-rose-300 shadow-2xs'
                    : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/70'
                }`}
              >
                <input
                  id={item.id}
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleFlag(item.id)}
                  className="mt-1 w-4 h-4 accent-rose-600 rounded cursor-pointer shrink-0"
                />
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm font-bold text-slate-900">
                      {item.title}
                    </span>
                    {isChecked && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        <AlertTriangle className="w-3 h-3" />
                        Đèn đỏ đang bật
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.detail}</p>
                  <p className="text-[11px] font-semibold text-rose-800">
                    ↳ Hệ quả thực tế: {item.impact}
                  </p>
                </div>
              </label>
            );
          })}
        </div>

        {/* Dynamic Recommendation Footer */}
        <div className="mt-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
              {activeCount >= 2 ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>
                    Bạn đang có {activeCount}/5 đèn đỏ — Tuyệt đối đừng xuống tiền cọc khi chưa mô phỏng 240 tháng!
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>
                    Hãy đưa các con số thực tế của căn nhà vào bộ mô phỏng để kiểm chứng độ bền quỹ dự phòng.
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-slate-600">
              Chỉ mất 2 phút để biết chính xác tháng thứ mấy dòng tiền có nguy cơ bị âm và mức vay tối đa an toàn cho gia đình bạn.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              href="/kiem-tra-mua-nha"
              className="px-5 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Calculator className="w-4 h-4" />
              <span>Chạy Stress-Test miễn phí</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/bao-cao-mau"
              className="px-4 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <FileCheck2 className="w-4 h-4 text-blue-700" />
              <span>Xem hồ sơ mẫu</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
