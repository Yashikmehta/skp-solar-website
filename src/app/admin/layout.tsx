import type { Metadata } from 'next';
import '@/styles/admin.css';

/**
 * Admin shell. Renders outside the `(site)` group, so the public header,
 * footer and WhatsApp button are absent by construction.
 *
 * `noindex, nofollow` keeps the panel out of search results; `robots.ts` also
 * disallows `/admin` for crawlers that read it.
 */
export const metadata: Metadata = {
  title: 'Admin · SKP Solar World',
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
