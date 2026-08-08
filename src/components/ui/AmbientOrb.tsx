import type { CSSProperties } from 'react';

/**
 * `.amb` — the blurred ambient orb used as section background decoration.
 * Position and size are inline in the approved markup, so they stay props here.
 */
interface AmbientOrbProps {
  tone: 'gold' | 'green';
  /** `data-parallax` speed, e.g. -0.05. Omit for a static orb. */
  parallax?: number;
  style: CSSProperties;
}

export function AmbientOrb({ tone, parallax, style }: AmbientOrbProps) {
  return (
    <div
      className={`amb ${tone}`}
      data-parallax={parallax !== undefined ? String(parallax) : undefined}
      style={style}
    />
  );
}
