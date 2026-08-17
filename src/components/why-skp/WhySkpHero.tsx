import Image from 'next/image';
import { AmbientOrb } from '@/components/ui/AmbientOrb';
import { Cta, CtaGhost, CtaRow } from '@/components/ui/Button';
import { Counter } from '@/components/ui/Counter';
import { Icon } from '@/components/ui/Icon';
import { ANCHORS } from '@/lib/routes';

const TRUST_POINTS = [
  '30+ years of engineering',
  'Authorised Waaree distributor',
  '50+ projects commissioned',
];

/** `.whero` — Why SKP hero with the stacked photo composition. */
export function WhySkpHero() {
  return (
    <section className="whero">
      <AmbientOrb
        tone="gold"
        parallax={-0.04}
        style={{ width: 380, height: 380, top: -80, right: -60 }}
      />
      <div className="wrap">
        <div className="whero-grid">
          <div className="whero-copy">
            <div className="sec-kicker">
              <i /> Why SKP Solar World
            </div>
            <h1>
              Built on <b>Engineering.</b>
              <br />
              Powered by <b>Trust.</b>
            </h1>
            <p className="sub">
              SKP Solar World combines decades of industrial expertise, premium solar technology,
              and engineering excellence to deliver dependable solar solutions for residential,
              commercial, industrial, and institutional projects.
            </p>
            <CtaRow style={{ marginTop: 0 }}>
              <Cta href={ANCHORS.enquiry}>Book Free Site Survey</Cta>
              <CtaGhost href="#legacy">Our Story</CtaGhost>
            </CtaRow>
            <div className="whero-trust">
              {TRUST_POINTS.map((point) => (
                <span key={point}>
                  <Icon name="check" /> {point}
                </span>
              ))}
            </div>
          </div>

          <div className="whero-visual">
            <div className="wv-main">
              <Image
                src="/assets/industrial.jpg"
                alt="Industrial rooftop solar plant"
                fill
                sizes="(max-width: 900px) 76vw, 38vw"
                priority
              />
              <div className="tint" />
            </div>
            <div className="wv-sub">
              <Image
                src="/assets/residential.jpg"
                alt="Residential rooftop solar"
                fill
                sizes="(max-width: 900px) 46vw, 23vw"
              />
              <div className="tint" />
            </div>
            <div className="wv-chip">
              <Icon name="emblemBadge" /> Authorised Waaree Distributor
            </div>
            <div className="wv-stat">
              <div className="v">
                <Counter to={25} suffix="-yr" />
              </div>
              <div className="k">Performance care</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
