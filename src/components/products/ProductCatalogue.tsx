'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useState } from 'react';
import { AmbientOrb } from '@/components/ui/AmbientOrb';
import { Icon } from '@/components/ui/Icon';
import { Hl, SectionHeading } from '@/components/ui/SectionHeading';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import {
  flexibleApplications,
  onGridInverter,
  optimizerBenefits,
  optimizerFlow,
  productCategories,
  solarModules,
  synergyCards,
  synergyModels,
  type ProductCategory,
} from '@/content/products';
import { ANCHORS } from '@/lib/routes';

/**
 * `.pcats` + `.ppanel` — the product category tabs and their four panels.
 *
 * Ported from `setCat()`: switching a tab swaps which panel carries `.active`
 * and, if the tab bar has scrolled out of view, scrolls it back to the top
 * (instantly under reduced motion).
 *
 * The optimizer flow keeps its own selected node, ported from `setNode()`.
 */
export function ProductCatalogue() {
  const [category, setCategory] = useState<ProductCategory>('modules');
  const [nodeIndex, setNodeIndex] = useState(1);
  const reduced = usePrefersReducedMotion();

  function selectCategory(next: ProductCategory) {
    setCategory(next);

    const isMobile = window.matchMedia('(max-width: 760px)').matches;
    if (isMobile) {
      /* Keep the tab bar horizontal-only — scroll the active tab into view
         without jumping the page vertically. */
      requestAnimationFrame(() => {
        const index = productCategories.findIndex((tab) => tab.key === next);
        const button = document.querySelector<HTMLButtonElement>(
          `#categories .pcats-row button:nth-child(${index + 1})`,
        );
        button?.scrollIntoView({
          behavior: reduced ? 'auto' : 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      });
      return;
    }

    const bar = document.getElementById('categories');
    if (!bar) return;
    const top = bar.getBoundingClientRect().top + window.scrollY;
    if (window.scrollY > top) {
      window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
    }
  }

  const panel = (key: ProductCategory) => `ppanel${category === key ? ' active' : ''}`;

  return (
    <>
      <div className="pcats" id="categories">
        <div className="wrap">
          <div className="pcats-row">
            {productCategories.map((tab) => (
              <button
                type="button"
                key={tab.key}
                className={category === tab.key ? 'active' : undefined}
                aria-pressed={category === tab.key}
                onClick={() => selectCategory(tab.key)}
              >
                {tab.label}
                <i />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- Solar modules ---------- */}
      <section className={`${panel('modules')} pmod`}>
        <AmbientOrb
          tone="gold"
          parallax={-0.05}
          style={{ width: 360, height: 360, top: -60, left: -90 }}
        />
        <AmbientOrb
          tone="green"
          parallax={0.05}
          style={{ width: 320, height: 320, bottom: -40, right: -70 }}
        />
        <div className="wrap">
          <SectionHeading
            center
            className="reveal"
            kicker="Solar Modules"
            title={
              <>
                Three module technologies.
                <br />
                <Hl>One engineering standard.</Hl>
              </>
            }
            body="Every SKP module is Tier-1 manufactured, tested for Punjab's heat, dust and wind, and backed through the factory — not a middleman."
          />
          <div className="pm-grid">
            {solarModules.map((product, index) => (
              <div className={`pm-card reveal dly${index + 1}`} key={product.name}>
                <div className="pm-img">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 900px) 100vw, 33vw"
                  />
                  <span className={`pm-tag${product.flagship ? ' flag' : ''}`}>
                    {product.tagGlyph} {product.tag}
                  </span>
                </div>
                <div className="pm-body">
                  <h3>{product.name}</h3>
                  <p className="pm-intro">{product.intro}</p>
                  <div className="pm-specs">
                    {product.specs.map((spec) => (
                      <div className="pm-spec" key={spec.label}>
                        <div className="v">{spec.value}</div>
                        <div className="k">{spec.label}</div>
                      </div>
                    ))}
                  </div>
                  <ul className="pm-feats">
                    {product.features.map((feature) => (
                      <li key={feature}>
                        <span className="ck">
                          <Icon name="check" />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="pm-apps">
                    {product.applications.map((application) => (
                      <span className="pm-app" key={application}>
                        {application}
                      </span>
                    ))}
                  </div>
                  <div className="pm-ctas">
                    <Link href={ANCHORS.enquiry} className="pm-btn">
                      <span className="c">
                        <Icon name="arrowRight" />
                      </span>
                      Get a Quote
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Flexible modules ---------- */}
      <section className={`${panel('flexible')} pflex`}>
        <AmbientOrb
          tone="green"
          parallax={-0.05}
          style={{ width: 360, height: 360, top: -40, left: -80, opacity: 0.5 }}
        />
        <div className="wrap">
          <SectionHeading
            center
            className="reveal"
            kicker="Flexible Solar Modules"
            title={
              <>
                Solar that follows <Hl>the architecture</Hl>
              </>
            }
            body="Lightweight, bendable modules that turn curved and unconventional surfaces into clean energy — where rigid panels simply can't go."
          />
          <div className="pf-grid">
            {flexibleApplications.map((application, index) => (
              <div className={`pf-card reveal dly${(index % 4) + 1}`} key={application.title}>
                <div className="pf-img">
                  <Image
                    src={application.image}
                    alt={application.title}
                    fill
                    sizes="(max-width: 900px) 50vw, 25vw"
                  />
                </div>
                <div className="pf-body">
                  <span className="pf-ic">{application.glyph}</span>
                  <h4>{application.title}</h4>
                  <p>{application.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Inverters ---------- */}
      <section className={`${panel('inverters')} pinv`}>
        <AmbientOrb
          tone="green"
          parallax={-0.05}
          style={{ width: 340, height: 340, top: 20, right: -80 }}
        />
        <AmbientOrb
          tone="gold"
          parallax={0.05}
          style={{ width: 300, height: 300, bottom: 0, left: -70 }}
        />
        <div className="wrap">
          <SectionHeading
            center
            className="reveal"
            kicker="Commercial Inverters"
            title={
              <>
                The intelligent heart of <Hl>every solar plant</Hl>
              </>
            }
            body="Power electronics chosen the way we choose modules — proven efficiency, serious protection ratings, and monitoring you can actually use."
          />

          <div className="pi-split">
            <div className="pi-visual reveal-x">
              <div className="pi-frame">
                <Image
                  src={onGridInverter.image}
                  alt="SKP on-grid inverter"
                  fill
                  sizes="(max-width: 900px) 90vw, 40vw"
                />
              </div>
              <div className="pi-chip">
                <div className="v">{onGridInverter.headlineChip.value}</div>
                <div className="k">{onGridInverter.headlineChip.label}</div>
              </div>
            </div>

            <div className="pi-content reveal dly1">
              <div className="sec-kicker">
                <i /> {onGridInverter.kicker}
              </div>
              <h3>{onGridInverter.title}</h3>
              <p className="lead">{onGridInverter.lead}</p>
              <div className="pi-stats">
                {onGridInverter.stats.map((stat) => (
                  <div className="pi-stat" key={stat.label}>
                    <div className="v">{stat.value}</div>
                    <div className="k">{stat.label}</div>
                  </div>
                ))}
              </div>
              <div className="pi-feats">
                {onGridInverter.features.map((feature) => (
                  <span className="pi-feat" key={feature}>
                    <Icon name="check" />
                    {feature}
                  </span>
                ))}
              </div>
              <div className="cta-row">
                <Link href={ANCHORS.enquiry} className="pm-btn">
                  <span className="c">
                    <Icon name="arrowRight" />
                  </span>
                  Talk to an Engineer
                </Link>
              </div>
            </div>
          </div>

          <div className="syn reveal">
            <div className="syn-kicker">
              <i /> Synergy Technology
            </div>
            <h3>Inverters with Synergy Technology</h3>
            <p className="lead">
              Modular architecture built for large-scale rooftop installations — commission
              faster, monitor every module, and keep the plant running.
            </p>
            <div className="syn-grid">
              {synergyCards.map((card) => (
                <div className="syn-card" key={card.title}>
                  <span className="ic">{card.glyph}</span>
                  <b>{card.title}</b>
                  <span>{card.body}</span>
                </div>
              ))}
            </div>
            <div className="syn-models">
              <span className="lab">Available models</span>
              {synergyModels.map((model) => (
                <span className="syn-model" key={model}>
                  {model}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Power optimizers ---------- */}
      <section className={`${panel('optimizers')} popt`}>
        <AmbientOrb
          tone="gold"
          parallax={-0.05}
          style={{ width: 340, height: 340, top: 30, right: -80 }}
        />
        <div className="wrap">
          <SectionHeading
            center
            className="reveal"
            kicker="Power Optimizers"
            title={
              <>
                Every module performing <Hl>at its own maximum</Hl>
              </>
            }
            body="Optimizers track the maximum power point of each individual panel — so one shaded module never drags down the whole string. Tap each stage to see how power flows."
          />

          <div className="opt-flow reveal">
            {optimizerFlow.map((node, index) => (
              <Fragment key={node.title}>
                {index > 0 ? (
                  <div className="opt-link">
                    <svg viewBox="0 0 64 24" aria-hidden="true">
                      <line className="dash" x1="2" y1="12" x2="52" y2="12" />
                      <path className="head" d="M52 6l10 6-10 6z" />
                    </svg>
                  </div>
                ) : null}
                <button
                  type="button"
                  className={`opt-node${nodeIndex === index ? ' active' : ''}`}
                  aria-pressed={nodeIndex === index}
                  onClick={() => setNodeIndex(index)}
                >
                  <span className="stepnum">{node.step}</span>
                  <span className="em">{node.glyph}</span>
                  <b>{node.title}</b>
                  <span>{node.subtitle}</span>
                </button>
              </Fragment>
            ))}
          </div>

          <p className="opt-desc reveal dly1" aria-live="polite">
            {optimizerFlow[nodeIndex].description}
          </p>

          <div className="opt-benefits">
            {optimizerBenefits.map((benefit, index) => (
              <div className={`opt-b reveal dly${(index % 4) + 1}`} key={benefit.title}>
                <span className="ic">{benefit.glyph}</span>
                <b>{benefit.title}</b>
                <span>{benefit.body}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
