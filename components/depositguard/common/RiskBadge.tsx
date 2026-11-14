'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle, AlertCircle } from 'lucide-react';
import { AffordabilityStatus } from '@/lib/depositguard/engine/types';

export interface RiskBadgeProps {
  status: AffordabilityStatus;
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
  className?: string;
}

export const RISK_CONFIG: Record<
  AffordabilityStatus,
  {
    label: string;
    shortLabel: string;
    badgeClass: string;
    textClass: string;
    icon: typeof ShieldCheck;
    iconColor: string;
    description: string;
  }
> = {
  SAFE: {
    label: 'Dư địa dự phòng an toàn',
    shortLabel: 'An toàn',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    textClass: 'text-emerald-700',
    icon: ShieldCheck,
    iconColor: 'text-emerald-600',
    description: 'Kế hoạch tài chính lành mạnh; dòng tiền dương và có quỹ dự phòng duy trì trên ngưỡng an toàn.',
  },
  VULNERABLE: {
    label: 'Nhạy cảm với biến động',
    shortLabel: 'Nhạy cảm',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200/80',
    textClass: 'text-amber-700',
    icon: AlertTriangle,
    iconColor: 'text-amber-600',
    description: 'Dòng tiền hiện tại duy trì được nhưng dễ rơi vào thiếu hụt nếu lãi suất thả nổi tăng hoặc phát sinh chi phí đột xuất.',
  },
  DEFICIT: {
    label: 'Thiếu hụt dòng tiền',
    shortLabel: 'Thiếu hụt',
    badgeClass: 'bg-rose-50 text-rose-800 border-rose-200/80',
    textClass: 'text-rose-700',
    icon: AlertCircle,
    iconColor: 'text-rose-600',
    description: 'Thu nhập hàng tháng không đủ bù đắp chi phí sinh hoạt và nghĩa vụ trả nợ; có nguy cơ cạn kiệt quỹ dự phòng.',
  },
};

export default function RiskBadge({
  status,
  size = 'md',
  showDescription = false,
  className = '',
}: RiskBadgeProps) {
  const config = RISK_CONFIG[status] || RISK_CONFIG.SAFE;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 gap-1.5',
    md: 'text-xs sm:text-sm px-3 py-1 gap-1.5',
    lg: 'text-sm sm:text-base px-4 py-1.5 gap-2 font-semibold',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className={`inline-flex flex-col ${className}`}>
      <span
        className={`inline-flex items-center rounded-full font-medium border shadow-2xs ${
          sizeClasses[size]
        } ${config.badgeClass}`}
      >
        <Icon className={`${iconSizes[size]} ${config.iconColor} shrink-0`} />
        <span>{config.label}</span>
      </span>

      {showDescription && (
        <p className="mt-2 text-xs text-slate-600 leading-relaxed max-w-lg">
          {config.description}
        </p>
      )}
    </div>
  );
}
