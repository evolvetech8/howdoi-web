import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/kiem-tra-mua-nha',
          '/cach-tinh',
          '/cau-hoi-thuong-gap',
          '/lien-he',
          '/ve-evolvetech',
          '/bao-mat',
          '/dieu-khoan',
          '/huong-dan',
          '/support',
          '/privacy',
        ],
        disallow: ['/ket-qua', '/api/'],
      },
    ],
    sitemap: 'https://www.evolvetech.biz.vn/sitemap.xml',
  };
}
