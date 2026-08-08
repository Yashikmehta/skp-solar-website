'use client';

import type { ReactNode } from 'react';
import { AmbientOrb } from '@/components/ui/AmbientOrb';
import { Icon } from '@/components/ui/Icon';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useTilt } from '@/hooks/useTilt';
import type { ValueCard } from '@/content/home';

interface ValueCardsProps {
  kicker: ReactNode;
  title: ReactNode;
  body?: ReactNode;
  cards: ValueCard[];
  /** Section class — `.why` on Home, reused on the Why SKP page. */
  sectionClassName?: string;
  id?: string;
}

/**
 * `.why-grid` / `.why-card` — the value-card grid shared by Home and Why SKP
 * (HANDOFF.md §4). The cursor-follow glow uses `--mx`/`--my`, which the
 * approved `.why-card::before` rule reads.
 */
export function ValueCards({
  kicker,
  title,
  body,
  cards,
  sectionClassName = 'why',
  id = 'why',
}: ValueCardsProps) {
  const tilt = useTilt();

  return (
    <section className={sectionClassName} id={id}>
      <AmbientOrb
        tone="gold"
        parallax={-0.05}
        style={{ width: 380, height: 380, top: -60, left: -90 }}
      />
      <AmbientOrb
        tone="green"
        parallax={0.06}
        style={{ width: 340, height: 340, bottom: -40, right: -70 }}
      />
      <div className="wrap">
        <SectionHeading center className="reveal" kicker={kicker} title={title} body={body} />
        <div className="why-grid">
          {cards.map((card, index) => (
            <div
              key={card.num}
              className={`why-card${card.featured ? ' feat' : ''} tilt reveal dly${
                (index % 3) + 1
              }`}
              onPointerMove={tilt.onPointerMove}
              onPointerLeave={tilt.onPointerLeave}
            >
              <div className="why-num">{card.num}</div>
              <div className="why-emblem">
                <Icon name={card.icon} />
              </div>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
              <span className="why-tag">
                <Icon name="check" />
                {card.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
