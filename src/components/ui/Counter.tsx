'use client';

import { useCountUp } from '@/hooks/useCountUp';

interface CounterProps {
  /** Target value — the design's `data-count`. */
  to: number;
  /** Suffix rendered after the number — the design's `data-suf`. */
  suffix?: string;
  /** Decimal places — the design's `data-dec`. */
  decimals?: number;
  /** Wraps the suffix in `.u`, as the final-CTA stats do. */
  suffixClassName?: string;
  className?: string;
}

/**
 * `data-count` stat counter (HANDOFF.md §4 — reused on Home, Why SKP and Book).
 * Counts once when it scrolls into view; renders the final value immediately
 * under reduced motion.
 */
export function Counter({
  to,
  suffix,
  decimals = 0,
  suffixClassName,
  className,
}: CounterProps) {
  const { ref, display } = useCountUp({ to, decimals });

  return (
    <>
      <span ref={ref} className={className}>
        {display}
      </span>
      {suffix ? <span className={suffixClassName}>{suffix}</span> : null}
    </>
  );
}
