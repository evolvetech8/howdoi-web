import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'List of all my projects ever — Frank (@evolvetech)',
  description:
    'Every web app, iOS application, micro-tool and side experiment Frank has ever built, complete with candid success & failure status, scoreboard breakdown, and post-mortems.',
  openGraph: {
    title: 'List of all my projects ever — Frank (evolvetech.biz.vn)',
    description:
      'Transparent portfolio and indie resume: all web apps, iOS apps, and micro-tools built by Frank, with success/failure breakdown.',
    url: 'https://www.evolvetech.biz.vn/projects',
    siteName: 'Frank Indie Developer',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'List of all my projects ever — Frank (@evolvetech)',
    description:
      'Transparent scoreboard of all apps and tools built by solo maker Frank.',
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
