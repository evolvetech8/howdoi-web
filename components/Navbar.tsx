'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldCheck,
  Calculator,
  BookOpen,
  HelpCircle,
  Menu,
  X,
  Mail,
  Info,
  ArrowRight,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/kiem-tra-mua-nha', label: 'Kiểm tra mua nhà', icon: Calculator },
  { href: '/cach-tinh', label: 'Cách tính', icon: BookOpen },
  { href: '/cau-hoi-thuong-gap', label: 'Câu hỏi thường gặp', icon: HelpCircle },
  { href: '/ve-evolvetech', label: 'Về EvolveTech', icon: Info },
  { href: '/lien-he', label: 'Liên hệ', icon: Mail },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Brand Logo: EvolveTech / DepositGuard */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-xs group-hover:bg-emerald-700 transition-colors">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  EvolveTech
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
                  DepositGuard
                </span>
              </div>
              <span className="block text-[11px] text-slate-500 font-medium -mt-0.5">
                Mô phỏng rủi ro tài chính trước khi đặt cọc
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-5" aria-label="Điều hướng chính">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 py-1.5 px-2 rounded-lg ${
                    isActive
                      ? 'text-emerald-700 bg-emerald-50/70'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Primary Action & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/kiem-tra-mua-nha"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              <span>Kiểm tra miễn phí</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Mở menu điều hướng"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-sm font-semibold min-h-[44px] ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-700'
                }`}
              >
                <Icon className="w-4 h-4 text-emerald-600" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/kiem-tra-mua-nha"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-xs min-h-[44px]"
            >
              <span>Kiểm tra miễn phí ngay</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="flex items-center justify-between text-xs text-slate-500 px-2 pt-1">
              <Link href="/huong-dan" onClick={() => setMobileMenuOpen(false)} className="hover:text-emerald-700">
                Cẩm nang mua nhà
              </Link>
              <Link href="/support" onClick={() => setMobileMenuOpen(false)} className="hover:text-emerald-700">
                App Store Support
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
