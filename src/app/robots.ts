import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    /* `/admin` is `noindex` in its own layout metadata too; this stops
       well-behaved crawlers from requesting it at all. */
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
