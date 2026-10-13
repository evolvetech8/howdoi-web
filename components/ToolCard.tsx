import React from 'react';
import Link from 'next/link';
import { ArrowRight, Building2, PieChart, TrendingUp, Wallet, type LucideIcon } from 'lucide-react';
import { toolPath, type Tool, type ToolSlug } from '@/content/tools';

const ICONS: Record<ToolSlug, { icon: LucideIcon; tone: string }> = {
  'luong-gross-net': { icon: Wallet, tone: 'from-blue-600 to-indigo-700' },
  'lai-kep': { icon: TrendingUp, tone: 'from-emerald-600 to-teal-700' },
  'tinh-lai-vay': { icon: Building2, tone: 'from-amber-600 to-orange-700' },
  'ngan-sach-50-30-20': { icon: PieChart, tone: 'from-teal-600 to-cyan-700' },
};

export default function ToolCard({ tool }: { tool: Tool }) {
  const { icon: Icon, tone } = ICONS[tool.slug];
  return (
    <Link
      href={toolPath(tool.slug)}
      className="group p-6 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all flex flex-col gap-4"
    >
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${tone} text-white flex items-center justify-center shadow-sm`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="space-y-1.5 flex-1">
        <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{tool.name}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">“{tool.question}”</p>
      </div>
      <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
        Tính ngay <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </span>
    </Link>
  );
}
