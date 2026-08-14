import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import '@/styles/pages/book.css';

import { Book3D } from '@/components/book/Book3D';
import { AmbientOrb } from '@/components/ui/AmbientOrb';
import { Cta, CtaGhost, CtaRow, FButton } from '@/components/ui/Button';
import { Counter } from '@/components/ui/Counter';
import { Icon } from '@/components/ui/Icon';
import { Hl, SectionHeading } from '@/components/ui/SectionHeading';
import {
  book,
  bookTrustPoints,
  learnCards,
  storyCards,
  storyMilestones,
} from '@/content/book';
import { founder } from '@/content/home';
import { ANCHORS, ROUTES } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';
import { siteSettings } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Sun Powered Profit — The Industrial Solar Playbook',
  description:
    "Ravinder Pabla's book for industrial owners: how to turn energy from your most unpredictable cost into a lasting strategic advantage.",
  path: ROUTES.book,
  image: book.cover,
});

const LEARNINGS = [
  { lead: 'The ', bold: 'hidden cost', tail: ' of delaying the right energy decision.' },
  {
    lead: 'Why ',
    bold: 'electricity inflation',
    tail: ' quietly erodes profitability year after year.',
  },
  { lead: 'How to separate ', bold: 'engineering facts', tail: ' from solar sales claims.' },
  {
    lead: 'The framework used to evaluate a ',
    bold: '₹1.5 Crore',
    tail: ' industrial solar investment.',
  },
  {
    lead: 'What actually happens ',
    bold: 'after installation',
    tail: ' — and why most owners wish they had acted sooner.',
  },
  {
    lead: 'How energy stability becomes a ',
    bold: 'competitive advantage',
    tail: ' for the next decade.',
  },
];

export default function BookPage() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="book" id="book">
        <AmbientOrb
          tone="green"
          parallax={-0.05}
          style={{ width: 360, height: 360, top: -40, left: -80, opacity: 0.5 }}
        />
        <div className="wrap">
          <nav className="book-crumb" aria-label="Breadcrumb">
            <Link href={ROUTES.home}>Home</Link>
            <Icon name="arrowRight" />
            <span>The Book</span>
          </nav>

          <SectionHeading
            center
            className="reveal"
            kicker="The Book"
            title="Profit Favors Clarity"
            body="Most businesses track raw materials, machinery and manpower. Few track the one cost that rises every year without resistance. Sun Powered Profit reveals how industrial leaders can transform energy from an unpredictable expense into a long-term strategic advantage."
          />

          <div className="book-grid">
            <Book3D />

            <div className="book-body">
              <p className="book-why reveal">{book.intro}</p>

              <ul className="book-learn">
                {LEARNINGS.map((item, index) => (
                  <li className={`reveal dly${index + 1}`} key={item.bold}>
                    <span className="ck">
                      <Icon name="check" />
                    </span>
                    <span>
                      {item.lead}
                      <b>{item.bold}</b>
                      {item.tail}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="book-ach">
                {book.achievements.map((achievement, index) => (
                  <div className={`a reveal dly${index + 1}`} key={achievement.label}>
                    <div className="v">
                      <Counter to={achievement.count} suffix={achievement.suffix} />
                    </div>
                    <div className="k">{achievement.label}</div>
                  </div>
                ))}
              </div>

              <CtaRow className="reveal dly2">
                <Cta href="#getcopy">Get The Book</Cta>
                <CtaGhost href="#getcopy" icon="book" onDark>
                  Get Energy Stability Review
                </CtaGhost>
              </CtaRow>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 01 · The story ---------- */}
      <section className="story" id="story">
        <AmbientOrb
          tone="gold"
          parallax={-0.04}
          style={{ width: 340, height: 340, top: 60, right: -90 }}
        />
        <div className="wrap">
          <SectionHeading
            className="reveal"
            kicker="The Story Behind the Book"
            title={
              <>
                From Industrial Experience to <Hl>Practical Energy Leadership</Hl>
              </>
            }
            body="Not written by a solar company. Written by a bearing manufacturer who spent five years evaluating the same proposals every factory owner receives."
          />

          <div className="story-grid">
            <div className="story-photo-col reveal-x">
              <div className="story-photo">
                <Image
                  src={founder.portrait}
                  alt={`${founder.name}, author of ${book.title}`}
                  fill
                  sizes="(max-width: 900px) 90vw, 30vw"
                  style={{ objectFit: 'cover', objectPosition: '50% 18%' }}
                />
                <div className="ph-tint" />
                <div className="story-namecard">
                  <b>{founder.name}</b>
                  <span>Author &amp; Director</span>
                </div>
              </div>

              <div className="story-plant reveal dly2">
                <Image
                  src="/assets/industrial.jpg"
                  alt="The 500 kW rooftop in Ludhiana"
                  fill
                  sizes="(max-width: 900px) 90vw, 30vw"
                />
                <div className="cap">The 500 kW rooftop that changed the maths — Ludhiana</div>
              </div>

              <div className="story-time">
                {storyMilestones.map((milestone, index) => (
                  <div className={`story-mile reveal dly${index + 1}`} key={milestone.title}>
                    <span className="dot" />
                    <div className="yr">{milestone.title}</div>
                    <div className="ev">{milestone.body}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="story-text">
              <div className="story-quote reveal">
                In manufacturing we track everything.{' '}
                <span className="mk">Except the one cost that rose every single year.</span>
              </div>
              <p className="story-lead reveal dly1">
                Cost per kg. Output per hour. Rejection rate. Every input had a number and an owner
                — except electricity.
              </p>
              <p className="reveal dly2">
                When the rooftop was finally evaluated, the estimate came back at{' '}
                <b>₹1.5 crore</b>. Three vendors followed. Three generation claims. Three payback
                stories.
              </p>
              <p className="reveal dly2">
                The barrier was never capital. It was <b>confidence</b>.
              </p>

              <div className="story-pull reveal dly2">
                <span className="mark">“</span>
                <q>
                  If I, with 30 years of industrial experience, felt confused during vendor
                  evaluation, how many other factory owners were delaying simply because no one
                  explained solar from an industrialist&apos;s perspective?
                </q>
                <div className="by">
                  — {founder.name}, <i>{book.title}</i>
                </div>
              </div>

              <h3 className="story-sub reveal dly3">
                So the decision was rebuilt like a machinery purchase.
              </h3>
              <p className="reveal dly3">
                Framework first. Proposals second. A <b>500 kW</b> plant went up under our own
                engineering oversight. The first full bill after net metering came in roughly{' '}
                <b>₹5 lakh lower</b> — measured, not projected.
              </p>
              <p className="reveal dly4">
                That five-year journey is now thirteen chapters, so the next owner does not have to
                repeat it.
              </p>

              <div className="story-vm">
                {storyCards.map((card, index) => (
                  <div className={`card reveal dly${index + 1}`} key={card.title}>
                    <div className="ic">{card.glyph}</div>
                    <h4>{card.title}</h4>
                    <ul>
                      {card.items.map((item) => (
                        <li key={item}>
                          <Icon name="check" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <CtaRow className="reveal dly3">
                <Cta href="#getcopy">Get Your Copy</Cta>
              </CtaRow>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 02 · What you'll learn ---------- */}
      <section className="learn" id="learn">
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
          <SectionHeading
            className="reveal"
            kicker="What You'll Learn"
            title={
              <>
                Practical Lessons for <Hl>Smarter Energy Decisions</Hl>
              </>
            }
            body="Thirteen chapters distilled into six pillars — each one written from a factory floor, not a sales deck."
          />
          <div className="learn-grid">
            {learnCards.map((card, index) => (
              <div
                className={`lc tilt${card.featured ? ' feat' : ''} reveal${
                  index > 0 ? ` dly${index}` : ''
                }`}
                key={card.num}
              >
                <div className="lc-num">{card.num}</div>
                <div className="lc-emblem">{card.glyph}</div>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                <div className="lc-more">
                  <span>{card.more}</span>
                </div>
                <div className="lc-tag">
                  <Icon name="check" /> {card.tag}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 04 · Get your copy ---------- */}
      <section className="gcta" id="getcopy">
        <div className="gcta-orb1" data-parallax="0.04" />
        <div className="gcta-orb2" data-parallax="-0.04" />
        <div className="wrap">
          <div className="gcta-grid">
            <div className="gcta-panel reveal dly1">
              <div className="who">
                <Image
                  src={founder.portrait}
                  alt={founder.name}
                  width={56}
                  height={56}
                />
                <div>
                  <b>{siteSettings.name}</b>
                  <span>Engineering-led solar, founded and run by manufacturers</span>
                </div>
              </div>
              <h3>Ready to Apply These Principles to Your Business?</h3>
              <p className="lead">
                We run the same six-step evaluation on your rooftop that the book describes —
                12-month consumption analysis, conservative generation modelling, financing
                comparison and execution feasibility. No pressure. No obligation.
              </p>
              <div className="gcta-actions">
                <FButton href={ANCHORS.enquiry} variant="gold" icon="arrowRight" circled>
                  Book an Energy Stability Review
                </FButton>
                <FButton href={ROUTES.calculator} variant="ghost" icon="calculator">
                  Calculate Solar Savings
                </FButton>
                <FButton href={ANCHORS.enquiry} variant="ghost" icon="pin">
                  Book Free Site Survey
                </FButton>
              </div>
              <div className="gcta-trust">
                {bookTrustPoints.map((point) => (
                  <span key={point}>
                    <Icon name="check" /> {point}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="gcta-stats">
            <div className="gcta-stat reveal dly1">
              <div className="v">
                <Counter to={30} suffix="+" suffixClassName="u" />
              </div>
              <div className="k">Years in manufacturing</div>
            </div>
            <div className="gcta-stat reveal dly2">
              <div className="v">
                <Counter to={140} suffix="+" suffixClassName="u" />
              </div>
              <div className="k">Projects commissioned</div>
            </div>
            <div className="gcta-stat reveal dly3">
              <div className="v">
                <Counter to={4.9} decimals={1} suffix="★" suffixClassName="u" />
              </div>
              <div className="k">Average customer rating</div>
            </div>
            <div className="gcta-stat reveal dly4">
              <div className="v">
                <Counter to={25} suffix="-yr" suffixClassName="u" />
              </div>
              <div className="k">Performance care plan</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
