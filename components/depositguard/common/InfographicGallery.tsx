'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ZoomIn,
  X,
  ArrowRight,
  Calculator,
  BookOpen,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export interface InfographicAsset {
  id: string;
  figCode: string;
  title: string;
  category: 'Lãi suất & Ân hạn gốc' | 'Chi phí ẩn & Định giá' | 'Ma trận Lương & Thuê vs Mua';
  imageUrl: string;
  aspect: '4:5' | '3:2';
  summary: string;
  keyTakeaway: string;
  relatedGuideSlug: string;
}

export const CURATED_INFOGRAPHICS: InfographicAsset[] = [
  {
    id: 'fg-05-month-25-cliff',
    figCode: 'FIG. 01',
    title: 'Cú Sốc Kép Tháng 25: Khi Hết Ưu Đãi Trùng Lúc Hết Ân Hạn Gốc',
    category: 'Lãi suất & Ân hạn gốc',
    imageUrl: '/media/infographics/fg_05_grace_period_month_25_cliff_4x5.png',
    aspect: '4:5',
    summary:
      'Phân tích định lượng hiệu ứng cộng hưởng khi vừa phải bắt đầu trả nợ gốc (bị nén vào 18 năm còn lại) vừa chịu lãi suất thả nổi 11,5% – 13%/năm.',
    keyTakeaway:
      'Ân hạn nợ gốc không miễn giảm nợ gốc mà dồn áp lực trả gốc vào các năm sau ưu đãi.',
    relatedGuideSlug: 'cu-nhay-lai-suat-thang-13-va-25',
  },
  {
    id: 'fg-02-equal-vs-annuity',
    figCode: 'FIG. 02',
    title: 'So Sánh Dư Nợ Giảm Dần (Gốc Đều) vs Niên Kim (Trả Góp Đều)',
    category: 'Lãi suất & Ân hạn gốc',
    imageUrl: '/media/infographics/fg_02_equal_principal_vs_annuity_4x5.png',
    aspect: '4:5',
    summary:
      'Đặt lên bàn cân cơ cấu Gốc và Lãi tại Năm 1, Năm 3, Năm 5 và Năm 10 cho khoản vay 2 tỷ đồng trong 20 năm.',
    keyTakeaway:
      'Phương thức trả gốc đều giúp tiết kiệm hàng trăm triệu tiền lãi dài hạn nhưng đòi hỏi sức chịu đựng dòng tiền năm đầu cao hơn.',
    relatedGuideSlug: 'cach-doc-bang-chao-lai-suat-ngan-hang',
  },
  {
    id: 'fg-01-valuation-shortfall',
    figCode: 'FIG. 03',
    title: 'Bẫy Định Giá Ngân Hàng Thấp Hơn Giá Mua & Điều Khoản Bảo Vệ Cọc',
    category: 'Chi phí ẩn & Định giá',
    imageUrl: '/media/infographics/fg_01_bank_valuation_shortfall_trap_4x5.png',
    aspect: '4:5',
    summary:
      'Vì sao căn hộ giao dịch 3,0 tỷ nhưng ngân hàng chỉ định giá 2,5 tỷ, khiến người mua bị hụt 350 triệu tiền giải ngân ngay trước ngày công chứng?',
    keyTakeaway:
      'Luôn yêu cầu thẩm định giá sơ bộ hoặc ghi rõ điều khoản hoàn cọc 100% nếu ngân hàng giải ngân thấp hơn mức cam kết.',
    relatedGuideSlug: '5-hang-muc-tai-chinh-truoc-khi-dat-coc',
  },
  {
    id: 'fg-04-closing-costs',
    figCode: 'FIG. 04',
    title: 'Bóc Tách 7 Khoản Tiền Mặt Bắt Buộc Ngoài Giá Mua Nhà',
    category: 'Chi phí ẩn & Định giá',
    imageUrl: '/media/infographics/fg_04_7_cash_closing_costs_breakdown_4x5.png',
    aspect: '4:5',
    summary:
      'Thác nước chi phí thực tế khi mua căn hộ 3 tỷ: Vốn tự có 30% (900tr) chưa đủ — cần thêm 360 đến 410 triệu cho thuế phí, quỹ bảo trì 2%, nội thất và dự phòng.',
    keyTakeaway:
      'Tổng tiền mặt cần chuẩn bị thực tế thường bằng 42% – 45% giá trị căn nhà chứ không chỉ 30%.',
    relatedGuideSlug: '5-hang-muc-tai-chinh-truoc-khi-dat-coc',
  },
  {
    id: 'fg-03-reverse-matrix',
    figCode: 'FIG. 05',
    title: 'Ma Trận Tra Cứu Ngược: Thu Nhập Bao Nhiêu Mua Được Nhà Bấy Nhiêu?',
    category: 'Ma trận Lương & Thuê vs Mua',
    imageUrl: '/media/infographics/fg_03_reverse_affordability_matrix_4x5.png',
    aspect: '4:5',
    summary:
      'Bảng tra cứu trần vay an toàn (DSR <= 40% ở mức lãi thả nổi 11,5%/năm) cho các mốc thu nhập ròng 25 triệu, 40 triệu, 60 triệu và 80 triệu/tháng.',
    keyTakeaway:
      'Luôn tính trần vay tối đa dựa trên lãi suất thả nổi sau ưu đãi thay vì lãi suất chào mời năm đầu.',
    relatedGuideSlug: 'thu-nhap-rong-vs-ty-le-tra-no-dti-dsr',
  },
  {
    id: 'fg-06-rent-vs-buy',
    figCode: 'FIG. 06',
    title: 'Bài Toán Tài Sản Ròng 10 Năm: Mua Nhà Trả Góp vs Thuê Nhà & Đầu Tư',
    category: 'Ma trận Lương & Thuê vs Mua',
    imageUrl: '/media/infographics/fg_06_rent_vs_buy_10yr_wealth_matrix_4x5.png',
    aspect: '4:5',
    summary:
      'Phân tích chi phí cơ hội của 1,0 tỷ vốn tự có trong 10 năm giữa phương án mua căn hộ trả góp và phương án thuê nhà kết hợp tích sản kỷ luật.',
    keyTakeaway:
      'Mua nhà tối ưu khi đã sẵn sàng an cư >= 7–10 năm và có quỹ dự phòng chống sốc lãi suất.',
    relatedGuideSlug: 'mua-nha-gia-dinh-tre-cu-soc-thu-nhap',
  },
];

export default function InfographicGallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [activeModalAsset, setActiveModalAsset] = useState<InfographicAsset | null>(null);

  const categories = [
    'Tất cả',
    'Lãi suất & Ân hạn gốc',
    'Chi phí ẩn & Định giá',
    'Ma trận Lương & Thuê vs Mua',
  ];

  const filtered =
    selectedCategory === 'Tất cả'
      ? CURATED_INFOGRAPHICS
      : CURATED_INFOGRAPHICS.filter((item) => item.category === selectedCategory);

  return (
    <div className="space-y-10">
      {/* Editorial Section Header & Filter Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end pb-6 border-b border-slate-200">
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-extrabold uppercase tracking-widest text-blue-800 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-md">
              05 / ĐỒ HỌA PHÂN TÍCH ĐỊNH LƯỢNG
            </span>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              ARCHONIC VISUAL RESEARCH
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            6 Mô hình Trực quan Mọi Người Mua Nhà Cần Xem Trước Khi Đặt Cọc
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            Bộ đồ họa thông tin độc quyền được biên soạn từ mô hình toán học DepositGuard v1.1. Bấm vào từng bản vẽ để phóng to độ phân giải cao hoặc mở bài phân tích chuyên sâu.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="lg:col-span-5 flex flex-wrap lg:justify-end gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0B1D30] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-400 hover:text-blue-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Museum-Style 1px Architectural Exhibition Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 border border-slate-200 rounded-2xl overflow-hidden">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white flex flex-col justify-between group transition-colors hover:bg-slate-50/70"
          >
            <div>
              {/* Museum Plate Bar */}
              <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between text-[11px] font-mono">
                <span className="font-extrabold text-blue-800">{item.figCode}</span>
                <span className="text-slate-500 uppercase tracking-wider">{item.category}</span>
              </div>

              {/* Thumbnail with Click-to-Zoom */}
              <div
                onClick={() => setActiveModalAsset(item)}
                className="relative bg-[#0B1D30] aspect-[4/5] overflow-hidden cursor-pointer"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white text-slate-900 text-xs font-extrabold shadow-md">
                    <ZoomIn className="w-3.5 h-3.5 text-blue-700" />
                    <span>Phóng to Infographic</span>
                  </span>
                </div>
              </div>

              {/* Editorial Caption Body */}
              <div className="p-5 sm:p-6 space-y-3">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug group-hover:text-blue-800 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.summary}</p>
                <div className="pt-2 border-t border-slate-100 text-xs text-slate-800 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-900">Kết luận cốt lõi:</strong> {item.keyTakeaway}
                  </span>
                </div>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="px-5 sm:px-6 py-4 flex items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/50">
              <button
                type="button"
                onClick={() => setActiveModalAsset(item)}
                className="text-xs font-bold text-slate-700 hover:text-blue-800 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5 text-blue-700" />
                <span>Xem bản phóng to</span>
              </button>
              <Link
                href={`/huong-dan/${item.relatedGuideSlug}`}
                className="text-xs font-extrabold text-blue-800 hover:text-blue-900 inline-flex items-center gap-1"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Đọc phân tích</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeModalAsset && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label={activeModalAsset.title}
          onClick={() => setActiveModalAsset(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-[#0B1D30] text-white flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-300 block">
                  {activeModalAsset.figCode} • {activeModalAsset.category}
                </span>
                <h3 className="text-sm sm:text-base font-extrabold">{activeModalAsset.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalAsset(null)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                aria-label="Đóng cửa sổ xem ảnh"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-7 bg-slate-950 flex items-center justify-center p-4 max-h-[75vh] overflow-y-auto">
                <img
                  src={activeModalAsset.imageUrl}
                  alt={activeModalAsset.title}
                  className="max-h-[70vh] w-auto object-contain rounded-lg"
                />
              </div>
              <div className="lg:col-span-5 p-6 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <h4 className="text-base font-extrabold text-slate-900">
                    Ý nghĩa thực tiễn cho người mua nhà
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {activeModalAsset.summary}
                  </p>
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-slate-900 space-y-1">
                    <div className="font-bold text-blue-900">Nguyên tắc bảo vệ tiền cọc:</div>
                    <p className="leading-relaxed">{activeModalAsset.keyTakeaway}</p>
                  </div>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <Link
                    href="/kiem-tra-mua-nha"
                    onClick={() => setActiveModalAsset(null)}
                    className="w-full py-3 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Calculator className="w-4 h-4" />
                    <span>Áp dụng vào khoản vay của bạn</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/huong-dan/${activeModalAsset.relatedGuideSlug}`}
                    onClick={() => setActiveModalAsset(null)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-4 h-4 text-blue-800" />
                    <span>Đọc bài phân tích đầy đủ</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
