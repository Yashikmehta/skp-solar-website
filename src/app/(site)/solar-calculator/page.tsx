import type { Metadata } from 'next';
import Link from 'next/link';
import '@/styles/pages/calculator.css';

import { SavingsReport } from '@/components/calculator/SavingsReport';
import { Faq } from '@/components/sections/Faq';
import { AmbientOrb } from '@/components/ui/AmbientOrb';
import { Cta, CtaGhost } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Hl, SectionHeading } from '@/components/ui/SectionHeading';
import {
  calculatorFaqs,
  calculatorTrustCards,
  dashboardBars,
  howItWorks,
  whyCalculatorCards,
} from '@/content/calculator';
import { ANCHORS, ROUTES } from '@/lib/routes';
import { faqJsonLd, pageMetadata } from '@/lib/seo';
import { telHref } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Free Solar ROI Calculator',
  description:
    'See your system size, monthly savings and payback in seconds — then get a free engineered review of your roof from SKP Solar World.',
  path: ROUTES.calculator,
  image: '/assets/ongrid.jpg',
});

const HERO_TRUST = [
  'Engineer-verified numbers',
  'No cost, no obligation',
  'Instant personalized report',
];

export default function CalculatorPage() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="hero">
        <AmbientOrb tone="gold" style={{ width: 420, height: 420, top: -80, right: -60 }} />
        <AmbientOrb tone="green" style={{ width: 360, height: 360, bottom: -60, left: -90 }} />
        <div className="wrap">
          <div className="hero-grid">
            <div className="hero-copy">
              <h1 className="reveal dly1">
                Calculate Your Solar Savings in <Hl>Less Than 60 Seconds</Hl>
              </h1>
              <p className="sub reveal dly2">
                Discover how much you can save every month, every year, and over the lifetime of
                your solar system with our intelligent Solar ROI Calculator.
              </p>
              <div className="hero-cta-row reveal dly3">
                <Cta href="#calculator">Start Free Calculation</Cta>
                <CtaGhost href={ANCHORS.enquiry} icon="phone">
                  Talk to an Expert
                </CtaGhost>
              </div>
              <div className="hero-trust reveal dly4">
                {HERO_TRUST.map((point) => (
                  <span key={point}>
                    <Icon name="check" />
                    {point}
                  </span>
                ))}
              </div>
            </div>

            <div className="dash-col reveal-r dly2">
              <div className="dash">
                <div className="dash-main">
                  <div className="dash-head">
                    <span className="lab">Your Solar Dashboard</span>
                    <span className="live">
                      <i /> Live estimate
                    </span>
                  </div>
                  <div className="dash-big">
                    <div className="k">Projected monthly savings</div>
                    <div className="v">
                      <span className="u">₹</span>18,400{' '}
                      <span className="up">
                        <svg
                          viewBox="0 0 24 24"
                          width="14"
                          height="14"
                          fill="none"
                          stroke="#2fe089"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M4 18l7-7 4 4 5-6" />
                          <path d="M20 9V4M15 9h5" transform="translate(-.5 0)" />
                        </svg>
                        82%
                      </span>
                    </div>
                  </div>
                  <div className="dash-bars">
                    {dashboardBars.map((height, index) => (
                      <span
                        className="bar"
                        key={index}
                        style={{ height: `${height}%`, animationDelay: `${index * 0.06}s` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="dash-card dash-bill">
                  <div className="row">
                    <span className="ic">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M6 2h9l3 3v17l-2.5-1.5L13 22l-2.5-1.5L8 22l-2-1.5L4 22V4a2 2 0 0 1 2-2z" />
                        <path d="M8 8h6M8 12h6M8 16h3" />
                      </svg>
                    </span>
                    <span className="tx">
                      <span className="k">Electricity bill</span>
                      <span className="v">↓ 82%</span>
                    </span>
                  </div>
                </div>

                <div className="dash-roof">
                  <svg viewBox="0 0 48 48" aria-hidden="true">
                    <path className="panel" d="M6 30l6-14h24l6 14z" stroke="var(--navy)" />
                    <path d="M6 30l6-14h24l6 14zM14 30l2-14M22 30l1-14M31 30l-1-14M4 30h40M20 38h8M24 34v4" />
                  </svg>
                </div>

                <div className="dash-card dash-sun">
                  <div className="row">
                    <span className="ic">
                      <svg className="dash-sun-rays" viewBox="0 0 24 24" aria-hidden="true">
                        <circle cx="12" cy="12" r="4" />
                        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2 2M17.1 17.1l2 2M19.1 4.9l-2 2M6.9 17.1l-2 2" />
                      </svg>
                    </span>
                    <span className="tx">
                      <span className="k">Sun hours</span>
                      <span className="v">4.9 / day</span>
                    </span>
                  </div>
                </div>

                <div className="dash-card dash-green">
                  <div className="row">
                    <span className="ic">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 21c6-2 9-7 9-13V4l-4 1c-6 1-9 5-9 10 0 3 1.5 5 4 6z" />
                        <path d="M9 18c1-4 4-7 8-8" />
                      </svg>
                    </span>
                    <span className="tx">
                      <span className="k">Green energy</span>
                      <span className="v">100% clean</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Why use the calculator ---------- */}
      <section className="whyc" id="why">
        <AmbientOrb tone="gold" style={{ width: 380, height: 380, top: -60, left: -90 }} />
        <AmbientOrb tone="green" style={{ width: 340, height: 340, bottom: -40, right: -70 }} />
        <div className="wrap">
          <SectionHeading
            center
            className="reveal"
            kicker="Why Use Our Calculator"
            title={
              <>
                Numbers you can actually <Hl>trust</Hl>
              </>
            }
          />
          <div className="whyc-grid">
            {whyCalculatorCards.map((card, index) => (
              <div className={`whyc-card reveal dly${index + 1}`} key={card.num}>
                <div className="whyc-num">{card.num}</div>
                <div className="whyc-emblem">{card.glyph}</div>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Calculator + report ---------- */}
      <section className="calc" id="calculator">
        <div className="calc-orb1" />
        <div className="calc-orb2" />
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
          <defs>
            <linearGradient id="rgrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffb838" />
              <stop offset="1" stopColor="#f4a52a" />
            </linearGradient>
            <linearGradient id="ragrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffb838" stopOpacity="0.34" />
              <stop offset="1" stopColor="#ffb838" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <div className="wrap">
          <SectionHeading
            center
            className="reveal"
            kicker="Free Report"
            title={
              <>
                Let&apos;s Calculate Your <Hl>Solar Savings</Hl>
              </>
            }
            body="Fill in a few details and we'll instantly prepare your personalized solar report — system size, savings and payback, all on the spot."
          />
          <SavingsReport />
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="how" id="how">
        <AmbientOrb tone="green" style={{ width: 340, height: 340, top: 0, left: -90 }} />
        <div className="wrap">
          <SectionHeading
            center
            className="reveal"
            kicker="How Our Calculator Works"
            title={
              <>
                From your bill to your <Hl>report</Hl> in five steps
              </>
            }
          />
          <div className="how-track">
            {howItWorks.map((step, index) => (
              <div className={`how-step reveal dly${index + 1}`} key={step.title}>
                <div className="how-num">{index + 1}</div>
                <div className="how-ic">{step.glyph}</div>
                <h4>{step.title}</h4>
                <p>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Trust ---------- */}
      <section className="trust" id="trust">
        <AmbientOrb tone="gold" style={{ width: 340, height: 340, bottom: -40, right: -70 }} />
        <div className="wrap">
          <SectionHeading
            center
            className="reveal"
            kicker="Why Customers Trust SKP"
            title={
              <>
                Engineering-first solar, <Hl>start to finish</Hl>
              </>
            }
          />
          <div className="trust-grid">
            {calculatorTrustCards.map((card, index) => (
              <div className={`trust-card reveal dly${(index % 3) + 1}`} key={card.title}>
                <div className="trust-ic">{card.glyph}</div>
                <div>
                  <h4>{card.title}</h4>
                  <p>{card.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Faq
        items={calculatorFaqs}
        body="The honest answers we give every business owner and family before they ever sign."
        helpTitle="Still have questions?"
        helpBody="Talk to an SKP engineer — not a call centre. We'll answer honestly, even if the answer is “solar isn't right for you yet.”"
      />

      {/* ---------- Final CTA (page-specific layout) ---------- */}
      <section className="fcta" id="contact">
        <div className="fcta-orb1" />
        <div className="fcta-orb2" />
        <div className="wrap">
          <div className="fcta-inner">
            <h2 className="reveal dly1">
              Stop Paying Rising Electricity Bills.
              <br />
              <Hl>Start Generating Your Own Power.</Hl>
            </h2>
            <p className="fcta-sub reveal dly2">
              You&apos;ve seen the numbers. Now take the next step — recalculate anytime or book a
              free site survey with an SKP engineer.
            </p>
            <div className="fcta-actions reveal dly3">
              <Cta href="#calculator" icon="refresh">
                Calculate Again
              </Cta>
              <CtaGhost href={ANCHORS.enquiry} icon="pin" onDark>
                Book Free Site Survey
              </CtaGhost>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Mobile sticky action bar ---------- */}
      <div className="mcta">
        <Link href="#calculator" className="m-gold">
          <Icon name="arrowRight" />
          Calculate Savings
        </Link>
        <a href={telHref} className="m-call" aria-label="Call SKP Solar World">
          <Icon name="phone" />
        </a>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            faqJsonLd(
              calculatorFaqs.map((item) => ({
                question: item.question,
                answer: item.plainAnswer,
              })),
            ),
          ),
        }}
      />
    </>
  );
}
