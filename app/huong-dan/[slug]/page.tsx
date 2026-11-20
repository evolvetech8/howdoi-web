import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIDES } from "@/content/guides-data";
import {
  ArrowLeft,
  Clock,
  Calendar,
  User,
  Lightbulb,
  Calculator,
  ArrowRight,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";
import DisclaimerBanner from "@/components/depositguard/common/DisclaimerBanner";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return GUIDES.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = GUIDES.find((g) => g.slug === slug);
  if (!guide)
    return { title: "Bài viết không tìm thấy — EvolveTech DepositGuard" };

  return {
    title: guide.title,
    description: guide.excerpt,
    alternates: {
      canonical: `https://www.evolvetech.biz.vn/huong-dan/${guide.slug}`,
    },
    openGraph: {
      title: guide.title,
      description: guide.excerpt,
      type: "article",
      publishedTime: guide.date,
      authors: [guide.author],
    },
  };
}

export default async function GuideDetailPage({ params }: Props) {
  const { slug } = await params;
  const guide = GUIDES.find((g) => g.slug === slug);

  if (!guide) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Back Link */}
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/huong-dan"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại tất cả cẩm nang mua nhà</span>
        </Link>
        {guide.scenarioBadge && (
          <span className="font-mono text-[11px] font-bold px-3 py-1 rounded-full bg-slate-900 text-blue-300">
            {guide.scenarioBadge}
          </span>
        )}
      </div>

      {/* Article Header */}
      <header className="space-y-4 border-b border-slate-200 pb-8">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold border border-blue-200">
            {guide.category}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {guide.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2">
          <span className="flex items-center gap-1 font-semibold text-slate-700">
            <User className="w-3.5 h-3.5 text-blue-700" />
            {guide.author}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            Cập nhật: {guide.date}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {guide.readTime}
          </span>
        </div>
      </header>

      <aside className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-base space-y-2">
        <p>
          Biên soạn: EvolveTech / Archonic. Các mức lãi và tình huống trong bài
          là minh họa, không phải báo giá hiện hành.
        </p>
        <p>
          Đối chiếu phép tính tại{" "}
          <Link className="underline" href="/bao-cao-mau">
            báo cáo mẫu tính trực tiếp
          </Link>{" "}
          và{" "}
          <Link className="underline" href="/cach-tinh">
            phương pháp mô hình
          </Link>
          . Điều kiện khoản vay phải được ngân hàng xác nhận riêng.
        </p>
        <a
          className="underline"
          href="https://www.hsbc.com.vn/vi-vn/loans/products/home/"
        >
          Tham khảo cơ chế lãi cố định và thả nổi từ HSBC
        </a>
      </aside>
      {/* Key Takeaways Box */}
      <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-6 space-y-3">
        <h2 className="text-sm font-extrabold text-blue-950 uppercase tracking-wider flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-blue-800" /> Điểm cốt lõi cần nhớ
          trước khi đặt cọc
        </h2>
        <ul className="space-y-2 text-xs sm:text-sm text-slate-900">
          {guide.content.keyTakeaways.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-blue-700 font-bold shrink-0 mt-0.5">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Embedded Infographic Visual if present */}
      {guide.infographicUrl && (
        <figure className="bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300 px-1">
            <span className="font-bold text-blue-400 uppercase tracking-wider">
              Đồ họa trực quan (Archonic Visual Research)
            </span>
            <span className="text-[11px] text-slate-400">
              Mô hình DepositGuard v1.1
            </span>
          </div>
          <div className="flex justify-center bg-slate-950 rounded-2xl p-2 overflow-hidden">
            <img
              src={guide.infographicUrl}
              alt={guide.title}
              className="max-h-[640px] w-auto object-contain rounded-xl"
            />
          </div>
        </figure>
      )}

      {/* Introduction */}
      <div className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
        <p>{guide.content.introduction}</p>
      </div>

      {/* Main Sections */}
      <div className="space-y-8 pt-2">
        {guide.content.sections.map((section, idx) => (
          <section
            key={idx}
            className="space-y-3 bg-white p-6 rounded-2xl border border-slate-200/80"
          >
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              {section.heading}
            </h2>
            <div className="space-y-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              {section.body.map((paragraph, pIdx) => (
                <p key={pIdx}>{paragraph}</p>
              ))}
            </div>
            {section.tip && (
              <div className="mt-3 p-4 bg-amber-50/80 rounded-xl border border-amber-200 text-xs sm:text-sm text-amber-900 flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Khuyến nghị thực chiến:</strong> {section.tip}
                </div>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Conclusion */}
      <div className="pt-4 border-t border-slate-200 space-y-3">
        <h3 className="text-lg font-extrabold text-slate-900">Lời kết</h3>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {guide.content.conclusion}
        </p>
      </div>

      {/* Actionable Simulator Banner */}
      <div className="p-6 sm:p-8 bg-slate-900 text-white rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-wider text-blue-400 font-bold block">
            Kiểm chứng trên số liệu thực của gia đình bạn
          </span>
          <h4 className="text-base sm:text-lg font-extrabold">
            Đưa giá căn nhà và thu nhập của bạn vào bộ mô phỏng DepositGuard
          </h4>
          <p className="text-xs text-slate-300">
            Chạy hoàn toàn trên trình duyệt của bạn trong 2 phút — không cần
            đăng nhập hay để lại số điện thoại.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 shrink-0">
          <Link
            href="/kiem-tra-mua-nha"
            className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-extrabold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Calculator className="w-4 h-4" />
            <span>Mô phỏng ngay</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/bao-cao-mau"
            className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <FileCheck2 className="w-4 h-4 text-blue-400" />
            <span>Hồ sơ mẫu</span>
          </Link>
        </div>
      </div>

      {/* Author Bio */}
      <div className="p-6 bg-white border border-slate-200/90 rounded-2xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-700 text-white font-extrabold flex items-center justify-center text-lg shrink-0">
          A
        </div>
        <div>
          <span className="font-extrabold text-slate-900 flex items-center gap-1.5 text-sm">
            <span>Biên soạn bởi Archonic FinLab (EvolveTech)</span>
            <ShieldCheck className="w-4 h-4 text-blue-700" />
          </span>
          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
            Đơn vị nghiên cứu &amp; phát triển mô hình chẩn đoán rủi ro tài
            chính mua nhà DepositGuard tại evolvetech.biz.vn. Cam kết 100% độc
            lập, không nhận hoa hồng ẩn từ ngân hàng hay sàn môi giới bất động
            sản.
          </p>
        </div>
      </div>

      <DisclaimerBanner />
    </article>
  );
}
