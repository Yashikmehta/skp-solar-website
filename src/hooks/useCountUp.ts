'use client';

import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

interface CountUpOptions {
  /** Target value to count to. */
  to: number;
  /** Animation length in ms. Matches the design's counter feel. */
  duration?: number;
  /** Decimal places to render. */
  decimals?: number;
}

/** easeOutCubic — the curve the approved counters use. */
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Stat counter — ported from `runCount()` / `[data-count]`.
 *
 * Returns a ref to attach to the element and the current display value. The
 * count starts the first time the element scrolls into view and runs once.
 */
export function useCountUp({ to, duration = 1600, decimals = 0 }: CountUpOptions) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduced) {
      setValue(to);
      return;
    }

    let frame = 0;
    let start = 0;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setValue(to * ease(progress));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          observer.disconnect();
          frame = requestAnimationFrame(step);
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to, duration, reduced]);

  return { ref, display: value.toFixed(decimals) };
}
