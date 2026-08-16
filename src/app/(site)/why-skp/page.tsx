import type { Metadata } from 'next';
import Image from 'next/image';
import '@/styles/pages/why-skp.css';

import { FinalCta } from '@/components/sections/FinalCta';
import { ValueCards } from '@/components/sections/ValueCards';
import { AmbientOrb } from '@/components/ui/AmbientOrb';
import { Counter } from '@/components/ui/Counter';
import { Icon } from '@/components/ui/Icon';
import { Hl, SectionHeading } from '@/components/ui/SectionHeading';
import { FeatureCardGrid } from '@/components/why-skp/FeatureCardGrid';
import { ProcessTimeline } from '@/components/why-skp/ProcessTimeline';
import { TrustSection } from '@/components/why-skp/TrustSection';
import { WhySkpHero } from '@/components/why-skp/WhySkpHero';
import { legacyCards, waareeCards, whySkpCards } from '@/content/why-skp';
import { ANCHORS, ROUTES } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';
import { telHref } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Why SKP Solar World — Built on Engineering',
  description:
    'Thirty years of precision manufacturing behind every solar plant we build — the Pabla Bearings legacy, Waaree partnership and our own 500 kW rooftop.',
  path: ROUTES.why,
  image: '/assets/industrial.jpg',
});

export default function WhySkpPage() {
  return (
    <>
      <WhySkpHero />

      {/* ---------- Pabla Bearings legacy ---------- */}
      <section className="leg" id="legacy">
        <AmbientOrb
          tone="gold"
          parallax={-0.05}
          style={{ width: 360, height: 360, top: -60, left: -90 }}
        />
        <AmbientOrb
          tone="green"
          parallax={0.05}
          style={{ width: 320, height: 320, bottom: -40, right: -70 }}
        />
        <div className="wrap">
          <div className="leg-grid">
            <div className="leg-photos reveal-x">
              <div className="leg-photo">
                <Image
                  src="/assets/industrial.jpg"
                  alt="Pabla Bearings manufacturing facility"
                  fill
                  sizes="(max-width: 900px) 90vw, 34vw"
                />
                <div className="ph-tint" />
                <div className="leg-photo-cap">
                  <b>Pabla Bearings Limited</b>
                  <span>Precision manufacturing since 1992 · Punjab</span>
                </div>
              </div>
              <div className="leg-photo2">
                <Image
                  src="/assets/commercial.jpg"
                  alt="SKP engineering and leadership team"
                  fill
                  sizes="(max-width: 900px) 45vw, 18vw"
                />
              </div>
              <div className="leg-statcard">
                <div className="v">
                  <Counter to={30} suffix="+" />
                </div>
                <div className="k">Years of engineering</div>
              </div>
            </div>

            <div className="leg-body">
              <SectionHeading
                className="reveal"
                kicker="Our Industrial Heritage"
                title={
                  <>
                    Built on the Legacy of <Hl>Pabla Bearings Limited</Hl>
                  </>
                }
              />
              <p className="reveal dly1">
                SKP Solar World is backed by the engineering excellence and industrial legacy of
                Pabla Bearings Limited. For decades, Pabla Bearings has earned the trust of
                industries through precision engineering, quality manufacturing, reliability, and
                long-term customer relationships.
              </p>
              <p className="reveal dly2">
                Those same values now power every solar solution delivered by SKP Solar World.
              </p>
              <FeatureCardGrid cards={legacyCards} className="leg-cards" />
            </div>
          </div>
        </div>
      </section>

      <ValueCards
        kicker="Why SKP Solar World"
        title={
          <>
            More Than a <Hl>Solar Installer</Hl>
          </>
        }
        body="We provide complete solar solutions engineered for long-term performance."
        cards={whySkpCards}
      />

      {/* ---------- Waaree partnership ---------- */}
      <section className="war" id="waaree">
        <AmbientOrb
          tone="green"
          parallax={-0.05}
          style={{ width: 360, height: 360, top: 40, right: -80 }}
        />
        <AmbientOrb
          tone="gold"
          parallax={0.05}
          style={{ width: 300, height: 300, bottom: 0, left: -70 }}
        />
        <div className="wrap">
          <div className="war-grid">
            <div className="war-photos reveal-x">
              <div className="war-photo">
                <Image
                  src="/assets/ongrid.jpg"
                  alt="Waaree modules on an SKP installation"
                  fill
                  sizes="(max-width: 900px) 90vw, 34vw"
                />
                <div className="ph-tint" />
                <span className="war-chip">
                  <Icon name="sun" /> Waaree Tier-1 Modules
                </span>
                {/* Co-branding badge, top-right — the only corner the chip,
                    brand card and inset photo leave free. On a light plate
                    because the logo's green would otherwise sit on the
                    photo's green sky. */}
                <span className="war-photo-logo">
                  <Image src="/assets/waaree-logo.png" alt="Waaree" width={78} height={23} />
                </span>
              </div>
              <div className="war-photo2">
                <Image
                  src="/assets/commercial.jpg"
                  alt="Commercial rooftop installation"
                  fill
                  sizes="(max-width: 900px) 45vw, 18vw"
                />
              </div>
              {/* The design shipped a gold "W" tile and a WAAREE wordmark as a
                  stand-in for the real logo. Now that the artwork exists it
                  replaces both — the logo already carries the wordmark, so
                  repeating it in type would be redundant. */}
              <div className="war-brandcard">
                <Image
                  className="war-brandlogo"
                  src="/assets/waaree-logo.png"
                  alt="Waaree"
                  width={104}
                  height={31}
                />
                <span>India’s leading solar module manufacturer</span>
              </div>
            </div>

            <div className="war-body">
              <SectionHeading
                className="reveal"
                kicker="Powered by Waaree"
                title={
                  <>
                    Powered by India’s Leading <Hl>Solar Technology</Hl>
                  </>
                }
              />
              <p className="reveal dly1">
                Every solar system is only as reliable as the components behind it. That’s why SKP
                Solar World installs premium Waaree Solar modules to deliver maximum efficiency,
                dependable performance, and long-term reliability.
              </p>
              <FeatureCardGrid cards={waareeCards} className="war-cards" />
            </div>
          </div>
        </div>
      </section>

      <ProcessTimeline />
      <TrustSection />

      <FinalCta
        kicker="Start your solar journey"
        title={
          <>
            Ready to Build on <Hl>Real Engineering?</Hl>
          </>
        }
        subtitle="Book a free site survey and get honest, conservative numbers from the engineers who will actually build your plant."
        actions={[
          {
            label: 'Book Free Site Survey',
            href: ANCHORS.enquiry,
            variant: 'gold',
            icon: 'arrowRight',
            circled: true,
          },
          {
            label: 'Calculate Solar Savings',
            href: ROUTES.calculator,
            variant: 'ghost',
            icon: 'calculator',
          },
          { label: 'Call Now', href: telHref, variant: 'ghost', icon: 'phone' },
        ]}
        trust={[
          'Authorised Waaree distributor',
          'In-house engineering team',
          'Honest, conservative estimates',
        ]}
      />
    </>
  );
}
