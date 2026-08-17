import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { ROUTES } from '@/lib/routes';
import { blogHref, sortedPosts } from '@/lib/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: { path: string; priority: number }[] = [
    { path: ROUTES.home, priority: 1 },
    { path: ROUTES.products, priority: 0.9 },
    { path: ROUTES.why, priority: 0.8 },
    { path: ROUTES.calculator, priority: 0.9 },
    { path: ROUTES.book, priority: 0.7 },
    { path: ROUTES.blogs, priority: 0.8 },
    { path: ROUTES.contact, priority: 0.9 },
  ];

  const pages: MetadataRoute.Sitemap = entries.map(({ path, priority }) => ({
    url: `${SITE_URL}${path === '/' ? '' : path}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority,
  }));

  /* One entry per article, using the post's own publish date. */
  const articles: MetadataRoute.Sitemap = sortedPosts().map((post) => ({
    url: `${SITE_URL}${blogHref(post.slug)}`,
    lastModified: new Date(`${post.date}T00:00:00Z`),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...pages, ...articles];
}
