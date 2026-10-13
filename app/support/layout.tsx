import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hỗ trợ ứng dụng',
  description: 'Trang hỗ trợ chính thức cho các ứng dụng của Frank, gồm ứng dụng iOS Cho Con - Chuẩn Bị Đón Bé.',
  openGraph: { title: 'Hỗ trợ ứng dụng của Frank', description: 'Hỗ trợ và câu hỏi thường gặp.' },
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
