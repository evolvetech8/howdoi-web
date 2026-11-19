'use client';

import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import Link from 'next/link';

export default function DisclaimerCard() {
  return (
    <div className="bg-slate-100/80 rounded-3xl p-6 sm:p-8 border border-slate-200/90 text-slate-600 text-xs space-y-3">
      <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
        <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0" />
        Tuyên Bố Miễn Trừ Trách Nhiệm & Khung Pháp Lý
      </div>

      <div className="space-y-2 leading-relaxed text-slate-600">
        <p>
          <strong>1. Mục đích mô phỏng:</strong> DepositGuard là công cụ toán học độc lập được thiết kế nhằm giúp người mua nhà tại Việt Nam hình dung trực quan về áp lực trả nợ, điểm rơi thâm hụt dòng tiền và rủi ro lãi suất thả nổi trước khi đặt cọc mua bất động sản.
        </p>
        <p>
          <strong>2. Không phải thẩm định tín dụng hay tư vấn pháp lý:</strong> Kết quả tính toán không cấu thành lời mời chào vay vốn, cam kết phê duyệt tín dụng của bất kỳ ngân hàng thương mại nào, cũng như không thay thế cho việc thẩm định pháp lý dự án (sổ hồng, quy hoạch, tranh chấp) của luật sư có chứng chỉ hành nghề.
        </p>
        <p>
          <strong>3. Sai số thực tế:</strong> Các ngân hàng thương mại tại Việt Nam có thể áp dụng phương pháp làm tròn ngày thực tế (30/360 hoặc actual/365) và các loại phí phát sinh (bảo hiểm khoản vay, phí định giá tài sản, phí trả nợ trước hạn) khiến số liệu thanh toán thực tế chênh lệch nhỏ so với mô hình mô phỏng.
        </p>
      </div>

      <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500">
        <span>Bản quyền © {new Date().getFullYear()} DepositGuard (EvolveTech). Mọi quyền được bảo lưu.</span>
        <div className="flex items-center gap-4 font-semibold text-blue-800">
          <Link href="/cach-tinh" className="hover:underline flex items-center gap-1">
            Minh bạch phương pháp tính <Info className="w-3 h-3" />
          </Link>
          <Link href="/bao-mat" className="hover:underline">
            Chính sách bảo mật
          </Link>
          <Link href="/dieu-khoan" className="hover:underline">
            Điều khoản sử dụng
          </Link>
        </div>
      </div>
    </div>
  );
}
