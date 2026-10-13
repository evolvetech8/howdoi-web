'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calculator, BookOpen, Info, Menu, X, NotebookPen } from 'lucide-react';
import Logo from '@/components/Logo';

const NAV_LINKS = [
  { href: '/huong-dan', label: 'Hướng dẫn', icon: BookOpen },
  { href: '/cong-cu', label: 'Công cụ tính', icon: Calculator },
  { href: '/gioi-thieu', label: 'Giới thiệu', icon: Info },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" aria-label="HowDoI, trang chủ">
            <Logo />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors flex items-center gap-1.5"
              >
                <Icon className="w-4 h-4 text-slate-400" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center">
            <Link
              href="/so-tra-no"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <NotebookPen className="w-3.5 h-3.5" />
              <span>Sổ trả nợ của tôi</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Mở menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-1">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2.5 text-sm font-medium text-slate-700 hover:text-emerald-700"
            >
              <Icon className="w-4 h-4 text-slate-400" />
              {label}
            </Link>
          ))}
          <Link
            href="/so-tra-no"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-2.5 mt-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold shadow"
          >
            <NotebookPen className="w-4 h-4" />
            Sổ trả nợ của tôi
          </Link>
        </div>
      )}
    </header>
  );
}
