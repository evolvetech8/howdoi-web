import type { MetadataRoute } from 'next';
import { GUIDES } from '@/content/guides-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.evolvetech.biz.vn';
  const lastModified = new Date();

  const publicRoutes = [
    { path: '', priority: 1.0 },
    { path: '/kiem-tra-mua-nha', priority: 0.95 },
    { path: '/bao-cao-mau', priority: 0.9 },
    { path: '/cach-tinh', priority: 0.85 },
    { path: '/huong-dan', priority: 0.85 },
    { path: '/cau-hoi-thuong-gap', priority: 0.8 },
    { path: '/ve-evolvetech', priority: 0.75 },
    { path: '/lien-he', priority: 0.7 },
    { path: '/bao-mat', priority: 0.6 },
    { path: '/dieu-khoan', priority: 0.6 },
    { path: '/support', priority: 0.5 },
    { path: '/privacy', priority: 0.5 },
  ];

  const guideRoutes = GUIDES.map((g) => ({
    path: `/huong-dan/${g.slug}`,
    priority: g.isHomebuyerFeatured ? 0.85 : 0.65,
  }));

  return [...publicRoutes, ...guideRoutes].map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: route.priority,
  }));
}
