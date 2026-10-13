import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SITE } from "@/lib/site";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  display: "swap",
});

const defaultTitle = "HowDoI — Làm sao để hết nợ? Lập kế hoạch trả nợ miễn phí";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: defaultTitle, template: "%s | HowDoI" },
  description: SITE.description,
  authors: [{ name: SITE.author, url: `${SITE.url}/gioi-thieu` }],
  openGraph: {
    title: defaultTitle,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: SITE.description,
  },
  // Cho phép mở như ứng dụng khi thêm vào Màn hình chính. Lưu ý: trên iPhone, biểu tượng đó có bộ nhớ riêng,
  // tách khỏi Safari, nên người dùng phải chuyển sổ sang bằng tệp sao lưu.
  appleWebApp: { capable: true, title: "Sổ trả nợ", statusBarStyle: "default" },
  // Xác minh Google Search Console bằng thẻ meta (không cần nếu đã xác minh qua DNS).
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased bg-slate-50 text-slate-900 min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
