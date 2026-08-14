import type { Metadata, Viewport } from 'next';

/* Load order matters and mirrors the handoff:
   skp-fonts.css → skp-system.css → gap fills → page styles → tailwind. */
import '@/styles/skp-fonts.css';
import '@/styles/skp-system.css';
import '@/styles/skp-system-gaps.css';
import '@/styles/tailwind.css';

import { SITE_URL } from '@/lib/seo';
import { siteSettings } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${siteSettings.name} — ${siteSettings.tagline}`,
    template: `%s | ${siteSettings.name}`,
  },
  description: siteSettings.pitch,
  applicationName: siteSettings.name,
  robots: { index: true, follow: true },
  icons: { icon: '/assets/skp-logo.png' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0e1a3c',
};

/**
 * Document shell only. The public site's header and footer live in
 * `(site)/layout.tsx` so that `/admin` can render without them.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <body>{children}</body>
    </html>
  );
}
