import Image from 'next/image';
import { AmbientOrb } from '@/components/ui/AmbientOrb';
import { Cta, CtaGhost, CtaRow } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { ANCHORS, ROUTES } from '@/lib/routes';
import { siteSettings, telHref } from '@/lib/site';

const QUICK_POINTS = [
  'Free, no-obligation survey',
  'Response within 24 hours',
  'Talk to an engineer, not a call centre',
];

/** `.chero` — Contact hero: copy column plus the floating photo composition. */
export function ContactHero() {
  return (
    <section className="chero">
      <AmbientOrb
        tone="gold"
        parallax={-0.05}
        style={{ width: 380, height: 380, top: -70, left: -100 }}
      />
      <AmbientOrb
        tone="green"
        parallax={0.05}
        style={{ width: 360, height: 360, bottom: -60, right: -80 }}
      />

      <div className="wrap" style={{ position: 'relative', zIndex: 2 }}>
        <div className="chero-grid">
          <div className="chero-copy">
            <h1>
              Let&apos;s Build Your <b>Solar Future</b> Together
            </h1>
            <p className="sub">
              Whether you&apos;re planning a residential, commercial, industrial, or
              institutional solar project, our experts are here to guide you from consultation
              to installation.
            </p>

            <CtaRow style={{ marginTop: 28 }}>
              <Cta href={ANCHORS.enquiry}>Book Free Site Survey</Cta>
              <CtaGhost href={ROUTES.calculator} icon="calculator">
                Calculate Solar Savings
              </CtaGhost>
            </CtaRow>

            <div className="chero-quick">
              {QUICK_POINTS.map((point) => (
                <span key={point}>
                  <Icon name="check" /> {point}
                </span>
              ))}
            </div>
          </div>

          <div className="chero-visual reveal dly2">
            <div className="cv-float">
              <div className="cv-main">
                <Image
                  src="/assets/industrial.jpg"
                  alt="SKP engineers on an industrial solar installation"
                  fill
                  sizes="(max-width: 900px) 76vw, 38vw"
                  priority
                />
                <div className="cv-tint" />
                <span className="cv-type">
                  <Icon name="factory" /> Industrial · Factory Rooftop
                </span>
              </div>

              <div className="cv-sub">
                <Image
                  src="/assets/residential.jpg"
                  alt="Residential rooftop solar installation"
                  fill
                  sizes="(max-width: 900px) 46vw, 23vw"
                />
                <div className="cv-tint" />
                <span className="cv-type">
                  <Icon name="home" /> Residential
                </span>
              </div>

              <div className="cv-stat">
                <div className="v">&lt; 24 hrs</div>
                <div className="k">Enquiry response</div>
              </div>

              <a href={telHref} className="cv-call">
                <span className="ic">
                  <Icon name="phone" />
                </span>
                <span>
                  <b>{siteSettings.phoneDisplay}</b>
                  <span>Mon–Sat · 9:00 AM – 6:30 PM</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
