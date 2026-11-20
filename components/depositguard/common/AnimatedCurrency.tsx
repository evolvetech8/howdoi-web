'use client';

import React, { useEffect, useRef, useState } from 'react';
import { formatCompactVND, formatVND } from '@/lib/depositguard/formatters';

export interface AnimatedCurrencyProps {
  value: number;
  compact?: boolean;
  prefix?: string;
  suffix?: string;
  className?: string;
  durationMs?: number;
}

function isSynchronousTestOrReducedMotion(): boolean {
  if (typeof window === 'undefined') return true;
  if (process.env.NODE_ENV === 'test') return true;
  if (Boolean((globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT)) return true;
  if (typeof navigator !== 'undefined' && navigator.userAgent?.toLowerCase().includes('jsdom')) {
    return true;
  }
  if (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)')?.matches
  ) {
    return true;
  }
  return false;
}

export function AnimatedCurrency({
  value,
  compact = false,
  prefix = '',
  suffix = '',
  className = '',
  durationMs = 320,
}: AnimatedCurrencyProps) {
  const [animatedValue, setAnimatedValue] = useState<number>(value);
  const currentRef = useRef<number>(value);
  const rafRef = useRef<number | null>(null);

  const syncMode = isSynchronousTestOrReducedMotion();

  useEffect(() => {
    if (syncMode) {
      currentRef.current = value;
      setAnimatedValue(value);
      return;
    }

    const startValue = currentRef.current;
    const delta = value - startValue;

    if (Math.abs(delta) < 1) {
      currentRef.current = value;
      setAnimatedValue(value);
      return;
    }

    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }
      const elapsed = timestamp - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      // Cubic ease-out for crisp 60fps financial ticker deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextVal = Math.round(startValue + delta * eased);

      currentRef.current = nextVal;
      setAnimatedValue(nextVal);

      if (progress < 1) {
        rafRef.current = window.requestAnimationFrame(step);
      } else {
        currentRef.current = value;
        setAnimatedValue(value);
      }
    };

    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = window.requestAnimationFrame(step);

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [value, durationMs, syncMode]);

  const effectiveValue = syncMode ? value : animatedValue;
  const formatted = compact ? formatCompactVND(effectiveValue) : formatVND(effectiveValue);

  return (
    <span className={`tabular-nums ${className}`.trim()}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

export default AnimatedCurrency;
