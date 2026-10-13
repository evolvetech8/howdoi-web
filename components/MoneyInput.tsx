'use client';

import React, { useLayoutEffect, useRef } from 'react';

type BaseProps = {
  id: string;
  max?: number;
  className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type' | 'id'>;

// Ô nhập số tiền VND, luôn hiển thị dạng 20.000.000.
// Sau mỗi lần gõ, con trỏ được đặt lại sau đúng số chữ số đứng trước nó, nên sửa số ở giữa
// hay chọn hết rồi gõ đè đều hoạt động bình thường.
// Với `nullable`, ô trống nghĩa là "chưa nhập" (null), khác với số 0.
export default function MoneyInput(
  props: BaseProps &
    (
      | { nullable?: false; value: number; onChange: (value: number) => void }
      | { nullable: true; value: number | null; onChange: (value: number | null) => void }
    ),
) {
  const { id, value, onChange, nullable, max = 100_000_000_000, className = '', ...rest } = props;
  const ref = useRef<HTMLInputElement>(null);
  const caretDigits = useRef<number | null>(null);
  // Số 0 của ô bắt buộc hiển thị là ô trống (gợi ý "0"), để gõ số mới không bị dính chữ số 0 ở đầu hay cuối.
  const display = value === null || (value === 0 && !nullable) ? '' : value.toLocaleString('vi-VN');

  useLayoutEffect(() => {
    const el = ref.current;
    if (caretDigits.current === null || !el || document.activeElement !== el) return;
    let seen = 0;
    let pos = 0;
    while (pos < el.value.length && seen < caretDigits.current) {
      if (/\d/.test(el.value[pos])) seen++;
      pos++;
    }
    el.setSelectionRange(pos, pos);
    caretDigits.current = null;
  });

  return (
    <input
      placeholder={nullable ? undefined : '0'}
      {...rest}
      ref={ref}
      id={id}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      value={display}
      onChange={(e) => {
        const raw = e.target.value;
        const caret = e.target.selectionStart ?? raw.length;
        const digits = raw.replace(/\D/g, '');
        // Bỏ số 0 ở đầu (vd. "05" → 5) thì con trỏ cũng lùi tương ứng.
        const leadingZeros = digits.length - digits.replace(/^0+(?=\d)/, '').length;
        caretDigits.current = Math.max(0, raw.slice(0, caret).replace(/\D/g, '').length - leadingZeros);
        if (nullable && digits === '') (onChange as (v: number | null) => void)(null);
        else (onChange as (v: number) => void)(Math.min(Number(digits || 0), max));
      }}
      className={`tabular-nums ${className}`}
    />
  );
}
