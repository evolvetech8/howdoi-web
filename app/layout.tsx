import type { Metadata } from "next";
import { Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import { SimulationProvider } from "@/lib/depositguard/context";
import SmoothScrollProvider from "@/components/depositguard/common/SmoothScrollProvider";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EvolveTech DepositGuard — Kiểm Tra Rủi Ro Tài Chính Trước Khi Đặt Cọc Mua Nhà",
    template: "%s | EvolveTech DepositGuard",
  },
  description:
    "Đừng đặt cọc trước khi biết mình có đủ sức trả nợ. Mô phỏng dòng tiền gia đình, cú nhảy lãi suất thả nổi sau ưu đãi và quỹ dự phòng khẩn cấp hoàn toàn ẩn danh trên thiết bị.",
  metadataBase: new URL("https://www.evolvetech.biz.vn"),
  alternates: {
    canonical: "/",
  },
  keywords: [
    "DepositGuard",
    "EvolveTech",
    "Archonic",
    "evolvetech.biz.vn",
    "tính lãi vay mua nhà",
    "mô phỏng dòng tiền mua nhà",
    "lãi suất thả nổi sau ưu đãi",
    "kiểm tra tài chính trước khi đặt cọc",
    "rủi ro vay mua nhà",
    "dư nợ giảm dần",
    "niên kim trả góp đều",
  ],
  authors: [{ name: "Archonic (EvolveTech)" }],
  openGraph: {
    title: "EvolveTech DepositGuard — Đừng đặt cọc trước khi biết mình có đủ sức trả nợ",
    description:
      "Mô phỏng lịch trả nợ vay mua nhà, cú nhảy lãi suất tháng 13/25 và sức chịu đựng dòng tiền gia đình trước các kịch bản biến động.",
    url: "https://www.evolvetech.biz.vn",
    siteName: "EvolveTech DepositGuard",
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EvolveTech DepositGuard — Kiểm Tra Tài Chính Trước Khi Đặt Cọc Mua Nhà",
    description:
      "Công cụ mô phỏng dòng tiền và rủi ro vay mua nhà 100% ẩn danh dành cho người mua nhà tại Việt Nam.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body
        className={`${beVietnamPro.variable} ${jetbrainsMono.variable} font-sans antialiased bg-slate-50 text-slate-900 min-h-screen flex flex-col`}
      >
        <LanguageProvider>
          <SimulationProvider>
            <SmoothScrollProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </SmoothScrollProvider>
          </SimulationProvider>
        </LanguageProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
