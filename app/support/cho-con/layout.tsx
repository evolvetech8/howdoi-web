import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hỗ trợ ứng dụng Cho Con - Chuẩn Bị Đón Bé',
  description: 'Hỗ trợ và câu hỏi thường gặp cho ứng dụng iOS Cho Con - Chuẩn Bị Đón Bé.',
  openGraph: { title: 'Hỗ trợ ứng dụng Cho Con', description: 'Hỗ trợ và câu hỏi thường gặp cho ứng dụng Cho Con.' },
};

export default function ChoConSupportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
