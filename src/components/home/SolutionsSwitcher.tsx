'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Icon } from '@/components/ui/Icon';
import { padIndex, solutionTabs } from '@/content/solutions';
import { ROUTES } from '@/lib/routes';

/**
 * `.sol` — the Solutions switcher.
 *
 * Two tabs ("By Application" / "By Product"), each with a featured panel plus a
 * hover/click list on desktop, and a swipeable 3D card stack on mobile. All
 * transforms, opacities, blurs and z-indexes below are the exact values from
 * `positionStack()` in the approved page.
 */
export function SolutionsSwitcher() {
  const [tabKey, setTabKey] = useState<'app' | 'prod'>('app');
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const swipeStartX = useRef(0);
  const fadeTimer = useRef<number | undefined>(undefined);

  /* Don't leave a pending fade timer behind on unmount. */
  useEffect(() => () => window.clearTimeout(fadeTimer.current), []);

  const tab = useMemo(
    () => solutionTabs.find((entry) => entry.key === tabKey) ?? solutionTabs[0],
    [tabKey],
  );
  const featured = tab.items[index] ?? tab.items[0];
  const count = tab.items.length;

  /* `fade()` in the approved page: brief opacity/translate dip on change. */
  function withFade(change: () => void) {
    setFading(true);
    /* Apply the content change straight away and use the timer only to lift
       `.sol-fade` back off. Deferring the state update into the timeout made
       every selection land one interaction late. */
    change();
    window.clearTimeout(fadeTimer.current);
    fadeTimer.current = window.setTimeout(() => setFading(false), 40);
  }

  function selectTab(key: 'app' | 'prod') {
    if (key === tabKey) return;
    withFade(() => {
      setTabKey(key);
      setIndex(0);
    });
  }

  function selectIndex(next: number) {
    if (next === index) return;
    withFade(() => setIndex(next));
  }

  /** Stack geometry, ported 1:1 from `positionStack()`. */
  function cardStyle(cardIndex: number): CSSProperties {
    const offset = (cardIndex - index + count) % count;
    if (offset === 0) {
      return {
        transform: 'translate(-50%,0) translateZ(60px) scale(1)',
        opacity: 1,
        filter: 'blur(0px)',
        zIndex: 40,
        boxShadow: '0 34px 70px rgba(14,26,60,.42)',
      };
    }
    if (offset === 1) {
      return {
        transform: 'translate(-50%,0) translateX(66%) scale(.78) rotateY(-24deg)',
        opacity: 0.5,
        filter: 'blur(2.5px)',
        zIndex: 30,
        boxShadow: '0 20px 44px rgba(14,26,60,.28)',
      };
    }
    if (offset === count - 1) {
      return {
        transform: 'translate(-50%,0) translateX(-66%) scale(.78) rotateY(24deg)',
        opacity: 0.5,
        filter: 'blur(2.5px)',
        zIndex: 30,
        boxShadow: '0 20px 44px rgba(14,26,60,.28)',
      };
    }
    return {
      transform: 'translate(-50%,0) translateY(-26px) scale(.62)',
      opacity: 0.24,
      filter: 'blur(4px)',
      zIndex: 20,
      boxShadow: '0 20px 44px rgba(14,26,60,.28)',
    };
  }

  const fade = fading ? ' sol-fade' : '';

  return (
    <section className="sol" id="solutions">
      <div className="wrap">
        <div className="sol-head">
          <h2>Solar, engineered for every site</h2>
          <p>
            From factory rooftops to family homes, explore our complete range — by where it
            goes, or by how it works.
          </p>
        </div>

        <div className="sol-toggle">
          <button
            type="button"
            className={`sol-tab${tabKey === 'app' ? ' active' : ''}`}
            onClick={() => selectTab('app')}
          >
            By Application
            <i />
          </button>
          <div className="sol-emblem">
            <span>
              <Icon name="sun" />
            </span>
          </div>
          <button
            type="button"
            className={`sol-tab${tabKey === 'prod' ? ' active' : ''}`}
            onClick={() => selectTab('prod')}
          >
            By Product
            <i />
          </button>
        </div>

        {/* ---------- Desktop ---------- */}
        <div className="sol-desk">
          <div className="sol-grid">
            <div className={`sol-intro${fade}`}>
              <div className="sol-kicker">Explore SKP</div>
              <h3>{tab.title}</h3>
              <p>{tab.intro}</p>
              <div className="sol-actions">
                <Link href={ROUTES.products} className="sol-btn sol-btn--gold">
                  <span className="c">
                    <Icon name="arrowRight" />
                  </span>
                  View All Solutions
                </Link>
                <Link href={ROUTES.contact} className="sol-btn sol-btn--ghost">
                  <span className="c">
                    <Icon name="arrowRight" />
                  </span>
                  Get In Touch
                </Link>
              </div>
            </div>

            <div className={`sol-show${fade}`}>
              <div className="sol-featured">
                <div className="sol-feat-img">
                  <Image
                    src={featured.photo}
                    alt={featured.name}
                    fill
                    sizes="(max-width: 1000px) 100vw, 46vw"
                  />
                  <div className="tint" />
                  <span className="sol-chip">
                    <Icon name={featured.icon} />
                    <span>{padIndex(index)} · Featured</span>
                  </span>
                </div>
                <div className="sol-feat-body">
                  <h4>{featured.name}</h4>
                  <p>{featured.tag}</p>
                  <Link href={ROUTES.products} className="sol-mini-btn">
                    <span className="c">
                      <Icon name="arrowRight" />
                    </span>
                    Know More
                  </Link>
                </div>
              </div>

              <div className="sol-list">
                {tab.items.map((item, itemIndex) => (
                  <div
                    key={item.name}
                    className={`sol-item${itemIndex === index ? ' active' : ''}`}
                    role="button"
                    tabIndex={0}
                    aria-pressed={itemIndex === index}
                    onMouseOver={() => selectIndex(itemIndex)}
                    onFocus={() => selectIndex(itemIndex)}
                    onClick={() => selectIndex(itemIndex)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        selectIndex(itemIndex);
                      }
                    }}
                  >
                    <div className="sol-item-thumb">
                      <Image src={item.photo} alt={item.name} fill sizes="44px" />
                      <div className="ti">
                        <Icon name={item.icon} stroke="#fff" />
                      </div>
                    </div>
                    <div className="sol-item-tx">
                      <b>{item.name}</b>
                      <span>{item.tag}</span>
                    </div>
                    <div className="sol-item-arrow">
                      <Icon name="arrowRight" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ---------- Mobile ---------- */}
        <div className="sol-mob">
          <p className="sol-swipe-hint">Swipe or tap a card</p>
          <div
            className="sol-stack"
            onPointerDown={(event) => {
              swipeStartX.current = event.clientX;
            }}
            onPointerUp={(event) => {
              const dx = event.clientX - swipeStartX.current;
              if (dx > 38) selectIndex((index - 1 + count) % count);
              else if (dx < -38) selectIndex((index + 1) % count);
            }}
          >
            {tab.items.map((item, cardIndex) => (
              <div
                key={item.name}
                className="sol-card"
                style={cardStyle(cardIndex)}
                onClick={() => selectIndex(cardIndex)}
              >
                <div className="sol-card-inner">
                  <div className="sol-card-img">
                    <Image src={item.photo} alt={item.name} fill sizes="62vw" />
                    <div className="tint" />
                    <span className="sol-chip">
                      <Icon name={item.icon} stroke="#ffd98a" width="14" height="14" />
                      <span>{padIndex(cardIndex)}</span>
                    </span>
                  </div>
                  <div className="sol-card-body">
                    <h4>{item.name}</h4>
                    <p>{item.tag}</p>
                    <Link href={ROUTES.products} className="sol-mini-btn">
                      <span className="c">
                        <Icon name="arrowRight" stroke="#0e1a3c" />
                      </span>
                      Know More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="sol-dots">
            {tab.items.map((item, dotIndex) => (
              <span
                key={item.name}
                className={`sol-dot${dotIndex === index ? ' active' : ''}`}
                role="button"
                tabIndex={0}
                aria-label={`Show ${item.name}`}
                onClick={() => selectIndex(dotIndex)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    selectIndex(dotIndex);
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
