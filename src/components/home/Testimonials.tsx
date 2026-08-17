'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { AmbientOrb } from '@/components/ui/AmbientOrb';
import { Counter } from '@/components/ui/Counter';
import { Icon } from '@/components/ui/Icon';
import { Hl, SectionHeading } from '@/components/ui/SectionHeading';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { testimonials } from '@/content/home';
import '@/styles/components/testimonials.css';

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
 * Desktop keeps the multi-column masonry. Mobile becomes a horizontal
 * swipe carousel with snap, 3-dot hints, and seamless looping.
 */
export function Testimonials() {
  const gridRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const wrapping = useRef(false);
  const count = testimonials.length;
  const DOT_COUNT = 3;

  /* Render three copies so swipe can loop: [A][B][C] */
  const looped = [...testimonials, ...testimonials, ...testimonials];

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

  /* Start in the middle copy so users can swipe either direction (mobile only). */
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || count === 0) return;

    const startInMiddle = () => {
      if (!window.matchMedia('(max-width: 760px)').matches) return;
      const cards = grid.querySelectorAll<HTMLElement>('.tst-card');
      const middle = cards[count];
      if (!middle) return;
      wrapping.current = true;
      grid.scrollLeft = middle.offsetLeft - 18;
      setActive(0);
      requestAnimationFrame(() => {
        wrapping.current = false;
      });
    };

    startInMiddle();
    window.addEventListener('resize', startInMiddle);
    return () => window.removeEventListener('resize', startInMiddle);
  }, [count]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || count === 0) return;

    const sync = () => {
      if (wrapping.current) return;
      if (!window.matchMedia('(max-width: 760px)').matches) return;
      const cards = Array.from(grid.querySelectorAll<HTMLElement>('.tst-card'));
      if (cards.length === 0) return;

      const mid = grid.scrollLeft + grid.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      cards.forEach((card, index) => {
        const center = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(center - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = index;
        }
      });

      /* Jump between cloned sets so the loop never hits a hard stop. */
      if (best < count) {
        wrapping.current = true;
        const twin = cards[best + count];
        if (twin) grid.scrollLeft = twin.offsetLeft - 18;
        setActive(best);
        requestAnimationFrame(() => {
          wrapping.current = false;
        });
        return;
      }

      if (best >= count * 2) {
        wrapping.current = true;
        const twin = cards[best - count];
        if (twin) grid.scrollLeft = twin.offsetLeft - 18;
        setActive(best - count * 2);
        requestAnimationFrame(() => {
          wrapping.current = false;
        });
        return;
      }

      setActive(best - count);
    };

    grid.addEventListener('scroll', sync, { passive: true });
    return () => grid.removeEventListener('scroll', sync);
  }, [count]);

  function goToReal(index: number) {
    const grid = gridRef.current;
    if (!grid || count === 0) return;
    const real = ((index % count) + count) % count;
    const cards = grid.querySelectorAll<HTMLElement>('.tst-card');
    const card = cards[real + count];
    if (!card) return;
    grid.scrollTo({ left: card.offsetLeft - 18, behavior: 'smooth' });
    setActive(real);
  }

  function goToDot(dotIndex: number) {
    if (count <= 1) {
      goToReal(0);
      return;
    }
    const target = Math.round((dotIndex / (DOT_COUNT - 1)) * (count - 1));
    goToReal(target);
  }

  const activeDot =
    count <= 1 ? 0 : Math.min(DOT_COUNT - 1, Math.round((active / (count - 1)) * (DOT_COUNT - 1)));

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
              <div className="sub">Across 50+ installations</div>
            </div>
          </div>
        </div>

        <div className="tst-masonry" ref={gridRef}>
          {looped.map((item, index) => {
            const isClone = index < count || index >= count * 2;
            return (
            <div
              className={`tst-card${item.variant ? ` ${item.variant}` : ''}${
                isClone ? ' is-clone' : ' reveal'
              }${item.delay && !isClone ? ` ${item.delay}` : ''}`}
              key={`${item.name}-${index}`}
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
            );
          })}
        </div>

        <div className="tst-dots" role="tablist" aria-label="Testimonial slides">
          {Array.from({ length: DOT_COUNT }, (_, index) => (
            <button
              type="button"
              key={index}
              className={`tst-dot${index === activeDot ? ' active' : ''}`}
              aria-label={`Show testimonials group ${index + 1}`}
              aria-selected={index === activeDot}
              onClick={() => goToDot(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
