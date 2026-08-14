'use client';

import { useState, type ReactNode } from 'react';
import { AmbientOrb } from '@/components/ui/AmbientOrb';
import { Cta } from '@/components/ui/Button';
import { Hl, SectionHeading } from '@/components/ui/SectionHeading';
import { Icon } from '@/components/ui/Icon';
import { siteSettings, telHref } from '@/lib/site';

export interface FaqItem {
  /** Short uppercase tag rendered in `.faq-qcat`. */
  category: string;
  question: string;
  /** ReactNode so the design's inline <b> emphasis is preserved. */
  answer: ReactNode;
  /** Plain-text answer, used for FAQPage structured data. */
  plainAnswer: string;
}

interface FaqProps {
  items: FaqItem[];
  /** Optional override for the aside copy; defaults to the approved wording. */
  kicker?: ReactNode;
  title?: ReactNode;
  body?: ReactNode;
  helpTitle?: string;
  helpBody?: string;
}

/**
 * FAQ accordion — shared by Home, Calculator and Contact (HANDOFF.md §4).
 *
 * Behaviour is ported from `initFaq()`: one item open at a time, the first
 * item open on mount. `.faq-a` is hidden via CSS `display:none`, so the only
 * job here is toggling `.open` on the item, which is what the approved design
 * did.
 */
export function Faq({
  items,
  kicker = 'Answers',
  title = (
    <>
      Frequently Asked <Hl>Questions</Hl>
    </>
  ),
  body = "Everything most people want to know before they reach out — answered the way we'd answer on a call.",
  helpTitle = 'Prefer to just talk?',
  helpBody = `Call us directly — you'll reach an SKP engineer, not a call centre. We'll answer honestly, even if the answer is "solar isn't right for you yet."`,
}: FaqProps) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="faq" id="faq">
      <AmbientOrb
        tone="gold"
        parallax={0.05}
        style={{ width: 320, height: 320, top: 60, left: -80 }}
      />
      <div className="wrap" style={{ position: 'relative', zIndex: 2 }}>
        <div className="faq-grid">
          <div className="faq-aside">
            <SectionHeading
              className="reveal"
              style={{ marginBottom: 26 }}
              kicker={kicker}
              title={title}
              body={body}
            />
            <div className="faq-help reveal dly1">
              <div className="ic">
                <Icon name="chat" />
              </div>
              <h4>{helpTitle}</h4>
              <p>{helpBody}</p>
              <Cta href={telHref}>{siteSettings.phoneDisplay}</Cta>
            </div>
          </div>

          <div className="faq-list">
            {items.map((item, index) => {
              const open = openIndex === index;
              return (
                <div
                  className={`faq-item${open ? ' open' : ''}`}
                  key={item.question}
                >
                  <button
                    type="button"
                    className="faq-q"
                    aria-expanded={open}
                    aria-controls={`faq-panel-${index}`}
                    id={`faq-trigger-${index}`}
                    onClick={() => setOpenIndex(open ? -1 : index)}
                  >
                    <span className="faq-qcat">{item.category}</span>
                    <span className="faq-qtxt">{item.question}</span>
                    <span className="faq-ic" />
                  </button>
                  <div
                    className="faq-a"
                    id={`faq-panel-${index}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${index}`}
                  >
                    <div className="faq-a-in">{item.answer}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
