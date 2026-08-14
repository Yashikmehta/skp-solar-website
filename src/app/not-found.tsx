import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SiteMotion } from '@/components/layout/SiteMotion';
import { SkipLink } from '@/components/layout/SkipLink';
import { WhatsAppFab } from '@/components/layout/WhatsAppFab';
import { Cta, CtaGhost, CtaRow } from '@/components/ui/Button';
import { SectionHeading, Hl } from '@/components/ui/SectionHeading';
import { ROUTES } from '@/lib/routes';

/**
 * Global 404. It lives at the app root (Next.js only uses the root
 * `not-found` for unmatched URLs), which is outside the `(site)` group, so it
 * renders the site chrome itself — the one place that markup is repeated.
 * The page body below is unchanged from the approved design.
 */
export default function NotFound() {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main">
        <section style={{ padding: '80px 0 100px' }}>
          <div className="wrap">
            <SectionHeading
              center
              kicker="404"
              title={
                <>
                  We couldn&apos;t find <Hl>that page</Hl>
                </>
              }
              body="The link may be out of date. Head back to the homepage, or talk to an SKP engineer directly."
            />
            <CtaRow style={{ justifyContent: 'center' }}>
              <Cta href={ROUTES.home}>Back to home</Cta>
              <CtaGhost href={ROUTES.contact} icon="mail">
                Contact us
              </CtaGhost>
            </CtaRow>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFab />
      <SiteMotion />
    </>
  );
}
