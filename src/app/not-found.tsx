import { Cta, CtaGhost, CtaRow } from '@/components/ui/Button';
import { SectionHeading, Hl } from '@/components/ui/SectionHeading';
import { ROUTES } from '@/lib/routes';

export default function NotFound() {
  return (
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
  );
}
