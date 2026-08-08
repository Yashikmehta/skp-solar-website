import { Book3D } from '@/components/book/Book3D';
import { AmbientOrb } from '@/components/ui/AmbientOrb';
import { Counter } from '@/components/ui/Counter';
import { Cta, CtaGhost, CtaRow } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { bookTeaser } from '@/content/home';
import { ROUTES } from '@/lib/routes';

/** What the book teaches — the `.book-learn` checklist. */
const LEARNINGS: { lead: string; bold: string; tail: string }[] = [
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

/**
 * `.book` — the homepage book section.
 *
 * The handoff swept the "Get Your Copy" CTA to `/contact` (§6.2); both CTAs
 * here point at real routes rather than the original dead buttons.
 */
export function BookTeaser() {
  return (
    <section className="book" id="book">
      <AmbientOrb
        tone="green"
        parallax={-0.05}
        style={{ width: 360, height: 360, top: -40, left: -80, opacity: 0.5 }}
      />
      <div className="wrap">
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
            <p className="book-why reveal">{bookTeaser.intro}</p>

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
              {bookTeaser.achievements.map((achievement, index) => (
                <div className={`a reveal dly${index + 1}`} key={achievement.label}>
                  <div className="v">
                    <Counter
                      to={achievement.count}
                      suffix={achievement.suffix}
                      decimals={achievement.decimals}
                    />
                  </div>
                  <div className="k">{achievement.label}</div>
                </div>
              ))}
            </div>

            <CtaRow className="reveal dly2">
              <Cta href={ROUTES.book}>Get The Book</Cta>
              <CtaGhost href={ROUTES.contact} icon="book" onDark>
                Get Energy Stability Review
              </CtaGhost>
            </CtaRow>
          </div>
        </div>
      </div>
    </section>
  );
}
