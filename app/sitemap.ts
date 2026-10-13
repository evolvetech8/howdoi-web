import type { MetadataRoute } from 'next';
import { GUIDES } from '@/content/guides-data';
import { TOOLS, toolPath } from '@/content/tools';
import { SITE } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const latest = (dates: string[]) => dates.reduce((a, b) => (a > b ? a : b));
  const toolsUpdated = latest(TOOLS.map((t) => t.updatedAt));
  const guidesUpdated = latest(GUIDES.map((g) => g.updatedAt));

  return [
    { url: SITE.url, lastModified: latest([toolsUpdated, guidesUpdated]) },
    { url: `${SITE.url}/so-tra-no`, lastModified: '2026-10-13' },
    { url: `${SITE.url}/cong-cu`, lastModified: toolsUpdated },
    ...TOOLS.map((tool) => ({ url: `${SITE.url}${toolPath(tool.slug)}`, lastModified: tool.updatedAt })),
    { url: `${SITE.url}/huong-dan`, lastModified: guidesUpdated },
    ...GUIDES.map((guide) => ({ url: `${SITE.url}/huong-dan/${guide.slug}`, lastModified: guide.updatedAt })),
    { url: `${SITE.url}/gioi-thieu` },
    { url: `${SITE.url}/support` },
    { url: `${SITE.url}/privacy` },
  ];
}
