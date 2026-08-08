import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { ROUTES } from '@/lib/routes';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: { path: string; priority: number }[] = [
    { path: ROUTES.home, priority: 1 },
    { path: ROUTES.products, priority: 0.9 },
    { path: ROUTES.why, priority: 0.8 },
    { path: ROUTES.calculator, priority: 0.9 },
    { path: ROUTES.book, priority: 0.7 },
    { path: ROUTES.contact, priority: 0.9 },
  ];

  return entries.map(({ path, priority }) => ({
    url: `${SITE_URL}${path === '/' ? '' : path}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority,
  }));
}
