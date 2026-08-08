import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { CurrentColorIcon, Icon, type IconName } from './Icon';

/**
 * The button set from HANDOFF.md §4: `.cta`, `.cta-ghost`, `.fbtn`, `.pill`.
 * Class names and markup structure are exactly those of the approved design —
 * these components exist to stop the same markup being hand-repeated on six
 * pages, not to restyle anything.
 */

type Common = {
  children: ReactNode;
  className?: string;
};

type AsLink = Common & { href: string } & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    'href' | 'className' | 'children'
  >;

type AsButton = Common & { href?: undefined } & Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'className' | 'children'
  >;

const cx = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(' ');

/** Internal links go through next/link; hash, tel:, mailto: and http stay raw. */
function isInternal(href: string) {
  return href.startsWith('/') && !href.startsWith('//');
}

function Anchor({ href, className, children, ...rest }: AsLink) {
  if (isInternal(href)) {
    return (
      <Link href={href} className={className} {...rest}>
        {children}
      </Link>
    );
  }
  const external = href.startsWith('http');
  return (
    <a
      href={href}
      className={className}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* .cta — solid gold pill with a circled arrow                         */
/* ------------------------------------------------------------------ */

type CtaProps = (AsLink | AsButton) & {
  /** Glyph inside the `.circ` badge. The design uses a plain arrow. */
  icon?: IconName;
};

export function Cta({ icon = 'arrowRight', className, children, ...rest }: CtaProps) {
  const inner = (
    <>
      <span className="circ">
        <CurrentColorIcon name={icon} />
      </span>
      {children}
    </>
  );

  if ('href' in rest && rest.href) {
    return (
      <Anchor className={cx('cta', className)} {...(rest as AsLink)}>
        {inner}
      </Anchor>
    );
  }

  return (
    <button type="button" className={cx('cta', className)} {...(rest as AsButton)}>
      {inner}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* .cta-ghost — outlined pill, with an `on-dark` variant               */
/* ------------------------------------------------------------------ */

type CtaGhostProps = (AsLink | AsButton) & {
  icon?: IconName;
  /** Adds `.on-dark` for use on the navy bands. */
  onDark?: boolean;
};

export function CtaGhost({ icon, onDark, className, children, ...rest }: CtaGhostProps) {
  const inner = (
    <>
      {icon ? <Icon name={icon} /> : null}
      {children}
    </>
  );
  const cls = cx('cta-ghost', onDark && 'on-dark', className);

  if ('href' in rest && rest.href) {
    return (
      <Anchor className={cls} {...(rest as AsLink)}>
        {inner}
      </Anchor>
    );
  }

  return (
    <button type="button" className={cls} {...(rest as AsButton)}>
      {inner}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* .fbtn — compact button used in the final CTA band                   */
/* ------------------------------------------------------------------ */

type FButtonProps = (AsLink | AsButton) & {
  variant: 'gold' | 'ghost' | 'wa';
  icon?: IconName;
  /** Wraps the icon in a `.circ` badge, as the gold variant does. */
  circled?: boolean;
};

export function FButton({
  variant,
  icon,
  circled,
  className,
  children,
  ...rest
}: FButtonProps) {
  const inner = (
    <>
      {icon ? (
        circled ? (
          <span className="circ">
            <Icon name={icon} />
          </span>
        ) : (
          <Icon name={icon} />
        )
      ) : null}
      {children}
    </>
  );
  const cls = cx('fbtn', `fbtn-${variant}`, className);

  if ('href' in rest && rest.href) {
    return (
      <Anchor className={cls} {...(rest as AsLink)}>
        {inner}
      </Anchor>
    );
  }

  return (
    <button type="button" className={cls} {...(rest as AsButton)}>
      {inner}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* .cta-row — the standard button cluster                              */
/* ------------------------------------------------------------------ */

export function CtaRow({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={cx('cta-row', className)} style={style}>
      {children}
    </div>
  );
}
