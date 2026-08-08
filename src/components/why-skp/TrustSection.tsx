'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
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
  const reduced = usePrefersReducedMotion();

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
  }, [reduced]);

  const stories = [testimonials[0], testimonials[2], testimonials[3]];

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
        <div className="gal-strip">
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

        <div className="trust-label reveal">
          <i /> Customer Stories
        </div>
        <div className="trust-tst" ref={gridRef}>
          {stories.map((item, index) => (
            <div
              className={`tst-card${item.variant ? ` ${item.variant}` : ''} reveal${
                index > 0 ? ` dly${index}` : ''
              }`}
              key={item.name}
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
