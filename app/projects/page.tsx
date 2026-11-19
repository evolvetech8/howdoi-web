'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ExternalLink,
  Search,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Sparkles,
  Layers,
  ArrowLeft,
  Mail,
  GitBranch,
  Smartphone,
  Flame,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import {
  ALL_PROJECTS,
  STATUS_CONFIG,
  ProjectStatus,
  getProjectStats,
} from '@/lib/projects/projectsData';

export default function ProjectsPage() {
  const { lang, t } = useLanguage();
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = useMemo(() => getProjectStats(), []);

  // Filtered list based on search and status filter
  const filteredProjects = useMemo(() => {
    return ALL_PROJECTS.filter((p) => {
      const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        p.name.toLowerCase().includes(q) ||
        p.tagline[lang].toLowerCase().includes(q) ||
        p.description[lang].toLowerCase().includes(q) ||
        p.notes[lang].toLowerCase().includes(q) ||
        p.techStack.some((tech) => tech.toLowerCase().includes(q));

      return matchesStatus && matchesSearch;
    });
  }, [selectedStatus, searchQuery, lang]);

  // Group filtered projects by year (descending)
  const projectsByYear = useMemo(() => {
    const map = new Map<number, typeof ALL_PROJECTS>();
    filteredProjects.forEach((p) => {
      if (!map.has(p.year)) {
        map.set(p.year, []);
      }
      map.get(p.year)!.push(p);
    });
    return Array.from(map.entries()).sort(([a], [b]) => b - a);
  }, [filteredProjects]);

  const scrollToProject = (id: string) => {
    // If the project is filtered out, clear filter first
    const project = ALL_PROJECTS.find((p) => p.id === id);
    if (project && selectedStatus !== 'all' && project.status !== selectedStatus) {
      setSelectedStatus('all');
    }
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const statusList: ProjectStatus[] = ['success', 'okay', 'failed', 'nonprofit', 'newproj'];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Top Header / Breadcrumb */}
      <div className="border-b border-slate-200/80 bg-white/70 backdrop-blur-md sticky top-16 sm:top-20 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between text-xs">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-semibold text-slate-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.projects.backToHome}</span>
          </Link>
          <div className="flex items-center gap-2 text-slate-400">
            <span>evolvetech.biz.vn</span>
            <span>/</span>
            <span className="font-semibold text-slate-700">projects</span>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 space-y-12">
        {/* Hero Section */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold border border-blue-200/60">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.projects.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            {t.projects.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
            <span>{t.projects.updatedDate}</span>
            <span>•</span>
            <span>{t.projects.views}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-blue-800 font-semibold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
              <Flame className="w-3 h-3" />
              100% Bootstrapped
            </span>
          </div>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl pt-2">
            {t.projects.intro}
          </p>
        </div>

        {/* 100% Stacked Proportion Bar (Pieter Levels signature) */}
        <section className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              {t.projects.statsHeading}
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              {lang === 'vi'
                ? 'Nhấp vào từng thanh hoặc phân loại bên dưới để lọc danh sách'
                : 'Click any bar segment or category to filter'}
            </span>
          </div>

          {/* The Stacked Bar */}
          <div className="h-9 sm:h-10 w-full rounded-xl overflow-hidden flex border border-slate-200/80 shadow-inner bg-slate-100 p-0.5 gap-0.5">
            {statusList.map((statusKey) => {
              const cfg = STATUS_CONFIG[statusKey];
              const pct = stats.percentages[statusKey];
              const count = stats.counts[statusKey];
              if (count === 0) return null;

              const isSelected = selectedStatus === statusKey;
              return (
                <button
                  key={statusKey}
                  type="button"
                  onClick={() =>
                    setSelectedStatus(selectedStatus === statusKey ? 'all' : statusKey)
                  }
                  style={{ width: `${pct}%`, backgroundColor: cfg.color }}
                  className={`h-full transition-all duration-150 relative group flex items-center justify-center text-white text-xs font-bold ${
                    isSelected ? 'ring-2 ring-slate-900 ring-offset-1 z-10' : 'hover:opacity-90'
                  }`}
                  title={`${cfg.title[lang]}: ${count} (${pct}%)`}
                >
                  {pct >= 10 && (
                    <span className="drop-shadow-sm text-[11px] sm:text-xs">
                      {count} <span className="hidden sm:inline">({pct}%)</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Interactive Legend Items */}
          <div className="flex flex-wrap gap-2 sm:gap-3 pt-2">
            <button
              type="button"
              onClick={() => setSelectedStatus('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                selectedStatus === 'all'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {t.projects.filterAll} ({stats.total})
            </button>

            {statusList.map((statusKey) => {
              const cfg = STATUS_CONFIG[statusKey];
              const count = stats.counts[statusKey];
              const isSelected = selectedStatus === statusKey;

              return (
                <button
                  key={statusKey}
                  type="button"
                  onClick={() =>
                    setSelectedStatus(selectedStatus === statusKey ? 'all' : statusKey)
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'ring-2 ring-slate-900 shadow-sm font-bold ' + cfg.bgPastel + ' ' + cfg.borderPastel
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: cfg.color }}
                  />
                  <span>{cfg.title[lang]}</span>
                  <span className="text-slate-400 font-normal">({count})</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Scoreboard Pastel Cards (Like levels.io/projects cards) */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Success */}
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider font-bold text-blue-900 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {STATUS_CONFIG.success.title[lang]}
                </span>
                <span className="text-xs font-semibold text-blue-800">
                  {stats.percentages.success}%
                </span>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 mt-2 mb-1">
                {stats.counts.success}
              </div>
              <p className="text-xs text-blue-900/80">
                {STATUS_CONFIG.success.desc[lang]}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-blue-200/60 flex flex-wrap gap-1.5">
              {ALL_PROJECTS.filter((p) => p.status === 'success').map((p) => (
                <button
                  key={p.id}
                  onClick={() => scrollToProject(p.id)}
                  className="px-2.5 py-1 bg-white/90 hover:bg-white text-blue-950 text-xs font-semibold rounded-full border border-blue-300/60 transition-all hover:scale-105 shadow-2xs"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Card 2: Okay */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider font-bold text-amber-800 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {STATUS_CONFIG.okay.title[lang]}
                </span>
                <span className="text-xs font-semibold text-amber-700">
                  {stats.percentages.okay}%
                </span>
              </div>
              <div className="text-3xl font-extrabold text-amber-950 mt-2 mb-1">
                {stats.counts.okay}
              </div>
              <p className="text-xs text-amber-800/80">{STATUS_CONFIG.okay.desc[lang]}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-200/60 flex flex-wrap gap-1.5">
              {ALL_PROJECTS.filter((p) => p.status === 'okay').map((p) => (
                <button
                  key={p.id}
                  onClick={() => scrollToProject(p.id)}
                  className="px-2.5 py-1 bg-white/90 hover:bg-white text-amber-900 text-xs font-semibold rounded-full border border-amber-300/60 transition-all hover:scale-105 shadow-2xs"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Card 3: Failed */}
          <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider font-bold text-rose-800 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" />
                  {STATUS_CONFIG.failed.title[lang]}
                </span>
                <span className="text-xs font-semibold text-rose-700">
                  {stats.percentages.failed}%
                </span>
              </div>
              <div className="text-3xl font-extrabold text-rose-950 mt-2 mb-1">
                {stats.counts.failed}
              </div>
              <p className="text-xs text-rose-800/80">{STATUS_CONFIG.failed.desc[lang]}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-rose-200/60 flex flex-wrap gap-1.5">
              {ALL_PROJECTS.filter((p) => p.status === 'failed').map((p) => (
                <button
                  key={p.id}
                  onClick={() => scrollToProject(p.id)}
                  className="px-2.5 py-1 bg-white/90 hover:bg-white text-rose-900 text-xs font-semibold rounded-full border border-rose-300/60 transition-all hover:scale-105 shadow-2xs"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Card 4: Nonprofit / Free */}
          <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider font-bold text-purple-800 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" />
                  {STATUS_CONFIG.nonprofit.title[lang]}
                </span>
                <span className="text-xs font-semibold text-purple-700">
                  {stats.percentages.nonprofit}%
                </span>
              </div>
              <div className="text-3xl font-extrabold text-purple-950 mt-2 mb-1">
                {stats.counts.nonprofit}
              </div>
              <p className="text-xs text-purple-800/80">
                {STATUS_CONFIG.nonprofit.desc[lang]}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-purple-200/60 flex flex-wrap gap-1.5">
              {ALL_PROJECTS.filter((p) => p.status === 'nonprofit').map((p) => (
                <button
                  key={p.id}
                  onClick={() => scrollToProject(p.id)}
                  className="px-2.5 py-1 bg-white/90 hover:bg-white text-purple-900 text-xs font-semibold rounded-full border border-purple-300/60 transition-all hover:scale-105 shadow-2xs"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Search & Filter Bar */}
        <section className="flex flex-col sm:flex-row gap-3 pt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.projects.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex items-center text-xs text-slate-500 px-3 py-2 bg-slate-100 rounded-xl font-medium">
            <span>
              {lang === 'vi' ? 'Hiển thị' : 'Showing'}:{' '}
              <strong className="text-slate-800 font-bold">
                {filteredProjects.length}
              </strong>{' '}
              / {ALL_PROJECTS.length}
            </span>
          </div>
        </section>

        {/* Chronological Projects List (Grouped by Year) */}
        <section className="space-y-10">
          {projectsByYear.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80">
              <p className="text-slate-500 text-sm font-medium">
                {t.projects.noResults}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedStatus('all');
                  setSearchQuery('');
                }}
                className="mt-3 text-xs font-bold text-blue-800 hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            projectsByYear.map(([year, projects]) => (
              <div key={year} className="space-y-4">
                {/* Year Header */}
                <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {year}
                  </h3>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {projects.length} {lang === 'vi' ? 'dự án' : 'projects'}
                  </span>
                </div>

                {/* Projects in this year */}
                <div className="space-y-4">
                  {projects.map((proj) => {
                    const cfg = STATUS_CONFIG[proj.status];
                    return (
                      <article
                        key={proj.id}
                        id={proj.id}
                        className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-all shadow-2xs hover:shadow-sm space-y-3 scroll-mt-28"
                      >
                        {/* Entry Header: Date, Name, Status Pill */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            {/* Status Dot */}
                            <span
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{ backgroundColor: cfg.color }}
                              title={cfg.title[lang]}
                            />
                            <time className="text-xs font-mono font-bold text-slate-400">
                              {proj.date}
                            </time>
                            <h4 className="text-base sm:text-lg font-bold text-slate-900">
                              {proj.name}
                            </h4>
                          </div>

                          {/* Status Badge */}
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${cfg.badgeBg} ${cfg.badgeText}`}
                            >
                              {proj.statusLabel[lang]}
                            </span>
                            {proj.metrics && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                                {proj.metrics[lang]}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Tagline */}
                        <p className="text-xs sm:text-sm font-semibold text-slate-700">
                          {proj.tagline[lang]}
                        </p>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {proj.description[lang]}
                        </p>

                        {/* What I Learned / Notes (Pieter Levels Post-Mortem style) */}
                        <div className="p-3 sm:p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 leading-relaxed space-y-1">
                          <div className="font-bold text-slate-700 flex items-center gap-1.5">
                            <span className="text-slate-400 font-mono">#</span>
                            <span>{t.projects.whatILearned}</span>
                          </div>
                          <p>{proj.notes[lang]}</p>
                        </div>

                        {/* Tech Stack & Links */}
                        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          {/* Tech chips */}
                          <div className="flex flex-wrap gap-1.5">
                            {proj.techStack.map((tech) => (
                              <span
                                key={tech}
                                className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-mono text-[10px]"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>

                          {/* Action Links */}
                          <div className="flex items-center gap-2 shrink-0">
                            {proj.appStoreUrl && (
                              <a
                                href={proj.appStoreUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-900 hover:bg-blue-100 font-semibold transition-colors"
                              >
                                <Smartphone className="w-3.5 h-3.5" />
                                <span>{t.projects.appStoreBadge}</span>
                                <ExternalLink className="w-3 h-3 ml-0.5" />
                              </a>
                            )}
                            {proj.githubUrl && (
                              <a
                                href={proj.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold transition-colors"
                              >
                                <GitBranch className="w-3.5 h-3.5" />
                                <span>{t.projects.sourceCode}</span>
                                <ExternalLink className="w-3 h-3 ml-0.5" />
                              </a>
                            )}
                            {proj.url && !proj.appStoreUrl && (
                              <a
                                href={proj.url}
                                target={proj.url.startsWith('http') && !proj.url.includes('evolvetech.biz.vn') ? '_blank' : '_self'}
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-blue-700 font-semibold transition-colors shadow-2xs"
                              >
                                <span>{t.projects.openLink}</span>
                                <ExternalLink className="w-3 h-3 ml-0.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </section>

        {/* Bottom Callout / Contact */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-4 text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              {lang === 'vi'
                ? 'Bạn có ý tưởng hoặc muốn hợp tác?'
                : 'Have an app idea or want to collaborate?'}
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {lang === 'vi'
                ? 'Tôi luôn hào hứng trao đổi về phát triển sản phẩm độc lập, tối ưu hoá chuyển đổi và giải pháp kỹ thuật tinh gọn.'
                : 'Always excited to discuss indie software, conversion optimizations, and lean engineering.'}
            </p>
          </div>
          <a
            href="mailto:archonic88@gmail.com"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-sm shadow-lg transition-all hover:scale-105 shrink-0"
          >
            <Mail className="w-4 h-4" />
            <span>{t.nav.contact}</span>
          </a>
        </section>
      </main>
    </div>
  );
}
