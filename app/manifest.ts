import type { MetadataRoute } from 'next';

// Cho phép thêm Sổ trả nợ vào Màn hình chính như một ứng dụng.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'HowDoI — Sổ trả nợ',
    short_name: 'Sổ trả nợ',
    description: 'Lập kế hoạch trả nợ và ghi sổ mỗi tháng. Số liệu chỉ lưu trên máy bạn.',
    start_url: '/so-tra-no',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#059669',
    lang: 'vi',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  };
}
