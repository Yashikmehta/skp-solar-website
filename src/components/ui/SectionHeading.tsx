import type { ReactNode } from 'react';

/**
 * `.sec-head2` — the shared section heading from HANDOFF.md §4.
 *
 * The design writes the heading as raw HTML with `<br>` and `<span class="hl">`
 * inside it, so `title` accepts a ReactNode rather than a string. That keeps
 * line breaks and highlight spans exactly where the approved design put them.
 */
interface SectionHeadingProps {
  kicker?: ReactNode;
  title: ReactNode;
  body?: ReactNode;
  /** Adds `.center` — centred heading with a constrained paragraph. */
  center?: boolean;
  /** Reveal utilities, e.g. "reveal dly1". */
  className?: string;
  style?: React.CSSProperties;
}

export function SectionHeading({
  kicker,
  title,
  body,
  center,
  className,
  style,
}: SectionHeadingProps) {
  const classes = ['sec-head2', center && 'center', className].filter(Boolean).join(' ');

  return (
    <div className={classes} style={style}>
      {kicker ? (
        <div className="sec-kicker">
          <i />
          {kicker}
        </div>
      ) : null}
      <h2>{title}</h2>
      {body ? <p>{body}</p> : null}
    </div>
  );
}

/** Convenience wrapper for the `<span class="hl">` highlight inside headings. */
export function Hl({ children }: { children: ReactNode }) {
  return <span className="hl">{children}</span>;
}
