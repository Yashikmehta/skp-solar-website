'use client';

import { useEffect, useRef } from 'react';
import { AmbientOrb } from '@/components/ui/AmbientOrb';
import { Cta } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { processSteps } from '@/content/why-skp';
import { ANCHORS } from '@/lib/routes';

/**
 * `.proc` — the eight-stage delivery timeline.
 *
 * The rail fill is scroll-driven, ported from `runProc()`:
 * `p = (viewportHeight * 0.78 − railTop) / railHeight`, clamped to 0–1 and
 * applied as `scaleY`. Under reduced motion the rail renders full.
 */
export function ProcessTimeline() {
  const stepsRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const steps = stepsRef.current;
    const fill = fillRef.current;
    if (!steps || !fill) return;

    if (reduced) {
      fill.style.transform = 'scaleY(1)';
      return;
    }

    let ticking = false;
    const update = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const rect = steps.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (vh * 0.78 - rect.top) / rect.height));
      fill.style.transform = `scaleY(${progress.toFixed(3)})`;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reduced]);

  return (
    <section className="proc" id="process">
      <AmbientOrb
        tone="green"
        parallax={-0.05}
        style={{ width: 360, height: 360, top: -40, left: -80, opacity: 0.5 }}
      />
      <div className="wrap">
        <SectionHeading
          center
          className="reveal"
          kicker="Our End-to-End Process"
          title="From Consultation to Lifetime Support"
          body="One accountable team walks your project through every stage — no handoffs, no subcontracted guesswork."
        />

        <div className="proc-steps" ref={stepsRef}>
          <div className="proc-rail">
            <div className="proc-fill" ref={fillRef} />
          </div>

          {processSteps.map((step, index) => {
            const number = `0${index + 1}`.slice(-2);
            /* Odd steps sit left of the rail, even steps right — as designed. */
            const alignLeft = index % 2 === 0;

            const card = (
              <div className="proc-card">
                <div className="st">{step.step}</div>
                <h4>{step.title}</h4>
                <p>{step.body}</p>
              </div>
            );
            const node = (
              <div className="proc-node">
                <span>
                  <Icon name={step.icon} />
                </span>
              </div>
            );

            return (
              <div className="proc-step reveal" key={step.step}>
                {alignLeft ? (
                  <>
                    <div className="proc-side">{card}</div>
                    {node}
                    <div className="proc-ghost r">{number}</div>
                  </>
                ) : (
                  <>
                    <div className="proc-ghost l">{number}</div>
                    {node}
                    <div className="proc-side r">{card}</div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="proc-cta reveal">
          <Cta href={ANCHORS.enquiry}>Start with a free survey</Cta>
        </div>
      </div>
    </section>
  );
}
