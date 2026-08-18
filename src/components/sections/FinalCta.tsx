import { Fragment, type ReactNode } from 'react';
import { FButton } from '@/components/ui/Button';
import { Icon, WhatsAppIcon, type IconName } from '@/components/ui/Icon';

export interface FinalCtaAction {
  label: string;
  href: string;
  variant: 'gold' | 'ghost' | 'wa';
  icon?: IconName;
  /** Gold actions wrap their glyph in the `.circ` badge. */
  circled?: boolean;
}

interface FinalCtaProps {
  title: ReactNode;
  subtitle: string;
  actions: FinalCtaAction[];
  /** Short trust points rendered under the actions, separated by dots. */
  trust?: string[];
  id?: string;
}

/**
 * `.fcta` — the final CTA band, identical on all six pages (HANDOFF.md §4).
 * Orbs, headline, actions, and trust row follow the approved markup order and reveal delays.
 */
export function FinalCta({
  title,
  subtitle,
  actions,
  trust,
  id = 'contact',
}: FinalCtaProps) {
  return (
    <section className="fcta" id={id}>
      <div className="fcta-orb1" data-parallax="0.04" />
      <div className="fcta-orb2" data-parallax="-0.04" />
      <div className="wrap">
        <div className="fcta-inner">
          <h2 className="reveal dly1">{title}</h2>
          <p className="fcta-sub reveal dly2">{subtitle}</p>

          <div className="fcta-actions reveal dly3">
            {actions.map((action) =>
              action.variant === 'wa' ? (
                <FButton key={action.label} href={action.href} variant="wa">
                  <WhatsAppIcon />
                  {action.label}
                </FButton>
              ) : (
                <FButton
                  key={action.label}
                  href={action.href}
                  variant={action.variant}
                  icon={action.icon}
                  circled={action.circled}
                >
                  {action.label}
                </FButton>
              ),
            )}
          </div>

          {trust && trust.length > 0 ? (
            <div className="fcta-trust reveal dly2">
              {trust.map((point, index) => (
                <Fragment key={point}>
                  {index > 0 ? <span className="dot">•</span> : null}
                  <span>
                    <Icon name="check" /> {point}
                  </span>
                </Fragment>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
