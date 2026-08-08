'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { AmbientOrb } from '@/components/ui/AmbientOrb';
import { Counter } from '@/components/ui/Counter';
import { Icon } from '@/components/ui/Icon';
import { Hl, SectionHeading } from '@/components/ui/SectionHeading';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { testimonials } from '@/content/home';

function Stars() {
  return (
    <div className="stars">
      {Array.from({ length: 5 }, (_, index) => (
        <Icon name="star" key={index} />
      ))}
    </div>
  );
}

/**
 * `.tst` — the testimonial masonry.
 *
 * Card variants (featured quote, video thumbnail, before/after bars, metric
 * counter) all come from the Testimonials collection shape in HANDOFF.md §5.
 * The before/after bars animate their width on scroll, ported from
 * `armBeforeAfter()`.
 */
export function Testimonials() {
  const gridRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const groups = Array.from(grid.querySelectorAll<HTMLElement>('.tst-ba'));
    const fill = (group: HTMLElement) => {
      group.querySelectorAll<HTMLElement>('.tst-ba-fill').forEach((bar) => {
        bar.style.width = `${bar.dataset.w ?? 0}%`;
      });
    };

    if (reduced) {
      groups.forEach(fill);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fill(entry.target as HTMLElement);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 },
    );

    groups.forEach((group) => observer.observe(group));
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <section className="tst" id="testimonials">
      <AmbientOrb
        tone="gold"
        parallax={0.05}
        style={{ width: 320, height: 320, bottom: 40, right: -70 }}
      />
      <div className="wrap">
        <div className="tst-top">
          <SectionHeading
            className="reveal"
            style={{ marginBottom: 0 }}
            kicker="Customer Stories"
            title={
              <>
                Real roofs. <Hl>Real bills. Real savings.</Hl>
              </>
            }
            body="From factory floors to family homes, here’s what owning an SKP system actually feels like."
          />
          <div className="tst-rating-badge reveal dly1">
            <div className="num">4.9</div>
            <div>
              <Stars />
              <div className="sub">Across 140+ installations</div>
            </div>
          </div>
        </div>

        <div className="tst-masonry" ref={gridRef}>
          {testimonials.map((item) => (
            <div
              className={`tst-card${item.variant ? ` ${item.variant}` : ''} reveal${
                item.delay ? ` ${item.delay}` : ''
              }`}
              key={item.name}
            >
              {item.video ? (
                <div className="tst-video">
                  <Image
                    src={item.video.thumbnail}
                    alt={item.video.label}
                    fill
                    sizes="(max-width: 900px) 100vw, 33vw"
                  />
                  <div className="tst-play">
                    <span className="pb">
                      <Icon name="play" />
                    </span>
                  </div>
                  <span className="tst-vlabel">{item.video.label}</span>
                </div>
              ) : (
                <Stars />
              )}

              <p className={`tst-q${item.variant === 'feat' ? ' big' : ''}`}>“{item.quote}”</p>

              {item.metric ? (
                <div className="tst-metric">
                  <span className="v">
                    <Counter
                      to={item.metric.count}
                      suffix={item.metric.suffix}
                      decimals={item.metric.decimals}
                    />
                  </span>
                  <span className="k">{item.metric.label}</span>
                </div>
              ) : null}

              {item.beforeAfter ? (
                <div className="tst-ba">
                  <div className="tst-ba-row">
                    <span className="lab">Before</span>
                    <span className="tst-ba-bar">
                      <span
                        className="tst-ba-fill before"
                        data-w={item.beforeAfter.beforeWidth}
                      />
                    </span>
                    <span className="amt">{item.beforeAfter.beforeLabel}</span>
                  </div>
                  <div className="tst-ba-row">
                    <span className="lab">After</span>
                    <span className="tst-ba-bar">
                      <span className="tst-ba-fill after" data-w={item.beforeAfter.afterWidth} />
                    </span>
                    <span className="amt">{item.beforeAfter.afterLabel}</span>
                  </div>
                </div>
              ) : null}

              <div className="tst-who">
                <span className="tst-av" aria-hidden="true" />
                <span>
                  <b>{item.name}</b>
                  <span>{item.role}</span>
                </span>
              </div>

              {item.logo ? (
                <div className="tst-logo">
                  <span className="mk">{item.logo.initials}</span> {item.logo.name}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        {/* Client logo strip. HANDOFF.md §8 lists licensed logos as still
            outstanding, so these render as the design's empty placeholder
            slots — drop <Image> elements in when the files arrive. */}
        <div className="tst-logos reveal">
          <div className="cap">Trusted by businesses &amp; homes across North India</div>
          <div className="tst-logos-row">
            {Array.from({ length: 5 }, (_, index) => (
              <span className="tst-logo-slot" key={index} aria-hidden="true" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
