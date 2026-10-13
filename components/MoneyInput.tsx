'use client';

import React, { useState } from 'react';

// Ô nhập số tiền VND. Khi đang gõ hiển thị chữ số thô để con trỏ không nhảy;
// khi rời ô thì định dạng lại thành 20.000.000.
export default function MoneyInput({
  id,
  value,
  onChange,
  max = 100_000_000_000,
  className = '',
  ...rest
}: {
  id: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type' | 'id'>) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      {...rest}
      id={id}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      value={focused ? (value ? String(value) : '') : value.toLocaleString('vi-VN')}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onChange={(e) => onChange(Math.min(Number(e.target.value.replace(/\D/g, '') || 0), max))}
      className={`tabular-nums ${className}`}
    />
  );
}
