'use client';

import React from 'react';
import { Shield, Info } from 'lucide-react';
import Link from 'next/link';

export interface DisclaimerBannerProps {
  className?: string;
}

export default function DisclaimerBanner({ className = '' }: DisclaimerBannerProps) {
  return (
    <div
      className={`bg-slate-50 border border-slate-200/90 rounded-2xl p-4 text-xs text-slate-600 flex items-start gap-3 shadow-2xs ${className}`}
    >
      <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
      <div className="space-y-1">
        <p className="font-semibold text-slate-800">
          Công cụ mô phỏng toán học độc lập — 100% Ẩn danh
        </p>
        <p className="leading-relaxed">
          DepositGuard tính toán dựa trên mô hình tài chính minh bạch, không thu thập danh tính và không đại diện cho quyết định cấp tín dụng hay phê duyệt hạn mức thực tế của bất kỳ tổ chức tín dụng nào.{' '}
          <Link
            href="/cach-tinh"
            className="text-emerald-700 hover:text-emerald-800 font-medium underline inline-flex items-center gap-0.5"
          >
            Tìm hiểu phương pháp tính <Info className="w-3 h-3 inline" />
          </Link>
        </p>
      </div>
    </div>
  );
}
