'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { AmbientOrb } from '@/components/ui/AmbientOrb';
import { Counter } from '@/components/ui/Counter';
import { Icon } from '@/components/ui/Icon';
import { Hl, SectionHeading } from '@/components/ui/SectionHeading';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import {
  certifications,
  industries,
  recentProjects,
  trustStats,
} from '@/content/why-skp';
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
 * `.trust` — proof section: stat bar, industries served, a recent-project
 * strip, three customer stories and the certification chips.
 *
 * The three testimonials reuse the shared Testimonials collection rather than
 * duplicating copy — they are entries 1, 3 and 4 from the same source.
 */
export function TrustSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  const galStripRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState(0);
  const [activeStory, setActiveStory] = useState(0);
  const [isMobileCarousel, setIsMobileCarousel] = useState(false);
  const storyWrapping = useRef(false);
  const reduced = usePrefersReducedMotion();
  const DOT_COUNT = 3;
  const stories = [testimonials[0], testimonials[2], testimonials[3]];
  const storyCount = stories.length;
  const loopedStories = [...stories, ...stories, ...stories];

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 760px)');
    const update = () => setIsMobileCarousel(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  /* Mobile swipe carousel — track which project card is in view so the
     dot indicator below the strip can highlight it. */
  useEffect(() => {
    const strip = galStripRef.current;
    if (!strip) return;
    const cards = Array.from(strip.querySelectorAll<HTMLElement>('.gal-card'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = cards.indexOf(entry.target as HTMLElement);
            if (idx !== -1) setActiveProject(idx);
          }
        });
      },
      { root: strip, threshold: 0.6 },
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  const scrollToProject = (index: number) => {
    const strip = galStripRef.current;
    const card = strip?.querySelectorAll<HTMLElement>('.gal-card')[index];
    card?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  };

  /* Before/after bar fill, same behaviour as the homepage. */
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
  }, [reduced, isMobileCarousel, storyCount]);

  /* Mobile swipe carousel — start in the middle copy so users can loop both ways. */
  useEffect(() => {
    const grid = gridRef.current;
    if (!isMobileCarousel || !grid || storyCount === 0) return;

    const startInMiddle = () => {
      const cards = grid.querySelectorAll<HTMLElement>('.tst-card');
      const middle = cards[storyCount];
      if (!middle) return;
      storyWrapping.current = true;
      grid.scrollLeft = middle.offsetLeft - 18;
      setActiveStory(0);
      requestAnimationFrame(() => {
        storyWrapping.current = false;
      });
    };

    startInMiddle();
    window.addEventListener('resize', startInMiddle);
    return () => window.removeEventListener('resize', startInMiddle);
  }, [isMobileCarousel, storyCount]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!isMobileCarousel || !grid || storyCount === 0) return;

    const sync = () => {
      if (storyWrapping.current) return;
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

      if (best < storyCount) {
        storyWrapping.current = true;
        const twin = cards[best + storyCount];
        if (twin) grid.scrollLeft = twin.offsetLeft - 18;
        setActiveStory(best);
        requestAnimationFrame(() => {
          storyWrapping.current = false;
        });
        return;
      }

      if (best >= storyCount * 2) {
        storyWrapping.current = true;
        const twin = cards[best - storyCount];
        if (twin) grid.scrollLeft = twin.offsetLeft - 18;
        setActiveStory(best - storyCount * 2);
        requestAnimationFrame(() => {
          storyWrapping.current = false;
        });
        return;
      }

      setActiveStory(best - storyCount);
    };

    grid.addEventListener('scroll', sync, { passive: true });
    return () => grid.removeEventListener('scroll', sync);
  }, [isMobileCarousel, storyCount]);

  const goToStory = (index: number) => {
    const grid = gridRef.current;
    if (!grid || storyCount === 0) return;
    const real = ((index % storyCount) + storyCount) % storyCount;
    const cards = grid.querySelectorAll<HTMLElement>('.tst-card');
    const card = cards[real + storyCount];
    if (!card) return;
    grid.scrollTo({ left: card.offsetLeft - 18, behavior: 'smooth' });
    setActiveStory(real);
  };

  const goToStoryDot = (dotIndex: number) => {
    if (storyCount <= 1) {
      goToStory(0);
      return;
    }
    const target = Math.round((dotIndex / (DOT_COUNT - 1)) * (storyCount - 1));
    goToStory(target);
  };

  const activeStoryDot =
    storyCount <= 1
      ? 0
      : Math.min(DOT_COUNT - 1, Math.round((activeStory / (storyCount - 1)) * (DOT_COUNT - 1)));

  return (
    <section className="trust" id="trust">
      <AmbientOrb
        tone="gold"
        parallax={0.05}
        style={{ width: 320, height: 320, bottom: 40, right: -70 }}
      />
      <AmbientOrb
        tone="green"
        parallax={-0.05}
        style={{ width: 340, height: 340, top: 0, left: -90 }}
      />
      <div className="wrap">
        <SectionHeading
          center
          className="reveal"
          kicker="Proven Trust"
          title={
            <>
              Why Industries Trust <Hl>SKP Solar World</Hl>
            </>
          }
          body="The numbers, the projects and the people behind a 25-year partnership."
        />

        <div className="stats reveal">
          {trustStats.map((stat) => (
            <div className="stat" key={stat.label}>
              <div className="ic">
                <Icon name={stat.icon} />
              </div>
              <div>
                <div className="v">
                  <Counter to={stat.count} suffix={stat.suffix} decimals={stat.decimals} />
                </div>
                <div className="k">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="trust-label reveal" style={{ marginTop: 0 }}>
          <i /> Industries We Serve
        </div>
        <div className="ind-grid">
          {industries.map((industry, index) => (
            <div className={`ind-card reveal dly${index + 1}`} key={industry.label}>
              <div className="ic">
                <Icon name={industry.icon} />
              </div>
              <b>{industry.label}</b>
            </div>
          ))}
        </div>

        <div className="trust-label reveal">
          <i /> Recent Projects
        </div>
        <div className="gal-strip" ref={galStripRef}>
          {recentProjects.map((project, index) => (
            <div className={`gal-card reveal dly${index + 1}`} key={project.location}>
              <div className="gal-imgwrap">
                <Image
                  src={project.image}
                  alt={project.alt}
                  fill
                  sizes="(max-width: 900px) 100vw, 33vw"
                />
              </div>
              <div className="gal-tint" />
              <span className="gal-type">
                <Icon name={project.typeIcon} /> {project.type}
              </span>
              <div className="gal-info">
                <div className="gal-size">{project.size}</div>
                <div className="gal-loc">
                  <Icon name="pin" /> {project.location}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="gal-dots">
          {recentProjects.map((project, index) => (
            <span
              key={project.location}
              className={`gal-dot${index === activeProject ? ' active' : ''}`}
              role="button"
              tabIndex={0}
              aria-label={`Show project ${index + 1}`}
              onClick={() => scrollToProject(index)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  scrollToProject(index);
                }
              }}
            />
          ))}
        </div>

        <div className="trust-label reveal">
          <i /> Customer Stories
        </div>
        <div className="trust-tst" ref={gridRef}>
          {loopedStories.map((item, index) => {
            const isClone = index < storyCount || index >= storyCount * 2;
            const revealIndex = index % storyCount;
            return (
            <div
              className={`tst-card${item.variant ? ` ${item.variant}` : ''}${
                isClone ? ' is-clone' : ' reveal'
              }${!isClone && revealIndex > 0 ? ` dly${revealIndex}` : ''}`}
              key={`${item.name}-${index}`}
            >
              <Stars />
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
                      <span className="tst-ba-fill before" data-w={item.beforeAfter.beforeWidth} />
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
            </div>
            );
          })}
        </div>

        <div className="trust-tst-dots" role="tablist" aria-label="Customer story slides">
          {Array.from({ length: DOT_COUNT }, (_, index) => (
            <button
              type="button"
              key={index}
              className={`trust-tst-dot${index === activeStoryDot ? ' active' : ''}`}
              aria-label={`Show customer stories group ${index + 1}`}
              aria-selected={index === activeStoryDot}
              onClick={() => goToStoryDot(index)}
            />
          ))}
        </div>

        <div className="trust-label reveal">
          <i /> Certifications &amp; Standards
        </div>
        <div className="certs reveal dly1">
          {certifications.map((cert) => (
            <span key={cert}>
              <Icon name="check" /> {cert}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
