'use client';

import React, { useEffect } from 'react';
import Lenis from 'lenis';

export interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      process.env.NODE_ENV === 'test' ||
      Boolean((globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT) ||
      (typeof navigator !== 'undefined' && navigator.userAgent?.toLowerCase().includes('jsdom')) ||
      (typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)')?.matches)
    ) {
      return;
    }

    let lenis: Lenis | null = null;
    let rafId: number | null = null;

    try {
      lenis = new Lenis({
        duration: 1.05,
        smoothWheel: true,
      });

      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = window.requestAnimationFrame(raf);
      };

      rafId = window.requestAnimationFrame(raf);
    } catch {
      // Fallback gracefully to native scroll if Lenis fails to initialize
    }

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}

export default SmoothScrollProvider;
