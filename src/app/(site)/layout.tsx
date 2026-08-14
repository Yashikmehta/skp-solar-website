import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SiteMotion } from '@/components/layout/SiteMotion';
import { SkipLink } from '@/components/layout/SkipLink';
import { WhatsAppFab } from '@/components/layout/WhatsAppFab';
import { organizationJsonLd } from '@/lib/seo';

/**
 * Chrome for the public website: header, footer, WhatsApp FAB and the
 * LocalBusiness JSON-LD.
 *
 * `(site)` is a route group, so it adds nothing to any URL — `/`, `/contact`
 * and the rest are exactly where they were. It exists so the admin panel at
 * `/admin` can render without the public header and footer; nothing about the
 * approved pages changed.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <WhatsAppFab />
      <SiteMotion />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
      />
    </>
  );
}
