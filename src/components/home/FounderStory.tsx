'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { AmbientOrb } from '@/components/ui/AmbientOrb';
import { Counter } from '@/components/ui/Counter';
import { Icon } from '@/components/ui/Icon';
import { Hl, SectionHeading } from '@/components/ui/SectionHeading';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { founder, milestones, visionMission } from '@/content/home';

/**
 * `.fdr` — the founder story: sticky portrait with a floating stat card, the
 * pull quote, vision/mission cards, the milestone rail and the signature.
 *
 * The signature is drawn with a stroke-dashoffset animation, ported from
 * `armSignature()`: each path's length is measured, then revealed on scroll
 * with a 0.5s stagger. Skipped under reduced motion.
 */
export function FounderStory() {
  const signRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const sign = signRef.current;
    if (!sign) return;

    const paths = Array.from(sign.querySelectorAll<SVGPathElement>('.fdr-sign-path'));
    paths.forEach((path) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = String(length);
      path.style.strokeDashoffset = reduced ? '0' : String(length);
    });

    if (reduced) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        paths.forEach((path, index) => {
          path.style.transition = `stroke-dashoffset 1.3s ease ${index * 0.5}s`;
          path.style.strokeDashoffset = '0';
        });
      },
      { threshold: 0.3 },
    );

    observer.observe(sign);
    return () => observer.disconnect();
  }, [reduced]);

  /* Split the quote so the approved `.mk` marker highlight lands on the same
     phrase it does in the design. */
  const [beforeMark, afterMark] = founder.quote.split(founder.quoteHighlight);

  return (
    <section className="fdr" id="founder">
      <AmbientOrb
        tone="gold"
        parallax={-0.04}
        style={{ width: 340, height: 340, top: 60, right: -90 }}
      />
      <div className="wrap">
        <SectionHeading
          className="reveal"
          kicker="The Founder"
          title={
            <>
              Built on a factory floor,
              <br />
              <Hl>not a sales pitch</Hl>
            </>
          }
          body="SKP Solar World started with one stubborn question on our own rooftop: why should clean power be sold on hype instead of engineering?"
        />

        <div className="fdr-grid">
          <div className="fdr-photo-col reveal-x">
            <div className="fdr-photo">
              <Image
                src={founder.portrait}
                alt={`${founder.name}, ${founder.shortRole}`}
                fill
                sizes="(max-width: 900px) 90vw, 30vw"
              />
              <div className="ph-tint" />
              <div className="fdr-namecard">
                <b>{founder.name}</b>
                <span>{founder.role}</span>
              </div>
            </div>
            <div className="fdr-statcard">
              <div className="v">
                <Counter to={founder.yearsInManufacturing} suffix="+" />
              </div>
              <div className="k">Years in manufacturing</div>
            </div>
          </div>

          <div className="fdr-body">
            <p className="fdr-quote reveal">
              “{beforeMark}
              <span className="mk">{founder.quoteHighlight}</span>
              {afterMark}”
            </p>

            <div className="fdr-vm">
              {visionMission.map((card, index) => (
                <div className={`card reveal dly${index + 1}`} key={card.title}>
                  <div className="ic">
                    <Icon name={card.icon} />
                  </div>
                  <h4>{card.title}</h4>
                  <p>{card.body}</p>
                </div>
              ))}
            </div>

            <div className="fdr-journey reveal dly2">
              {milestones.map((milestone) => (
                <div className="fdr-mile" key={milestone.year}>
                  <div className="dot" />
                  <div className="yr">{milestone.year}</div>
                  <div className="ev">{milestone.event}</div>
                </div>
              ))}
            </div>

            <div className="fdr-sign reveal dly1" ref={signRef}>
              <svg viewBox="0 0 168 62" aria-label="Signature">
                <path
                  className="fdr-sign-path"
                  d="M5 46 C 15 8, 23 9, 25 40 C 26 56, 18 54, 22 40 C 29 16, 37 15, 39 41 C 41 54, 47 30, 53 31 C 59 32, 56 46, 63 43 C 72 39, 71 21, 78 24 C 85 27, 79 47, 88 44 C 99 41, 98 17, 106 20 C 113 23, 110 45, 119 42 C 132 38, 133 23, 144 28 C 154 33, 153 45, 164 30"
                />
                <path
                  className="fdr-sign-path"
                  d="M8 55 C 52 61, 112 61, 162 52"
                  strokeWidth="1.6"
                />
              </svg>
              <div className="who">
                <b>{founder.name}</b>
                <span>{founder.shortRole}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
