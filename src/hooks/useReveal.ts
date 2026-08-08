'use client';

import { useEffect } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/** Same trigger point as the handoff's `runWatch()`: 92% of the viewport. */
const TRIGGER_RATIO = 0.92;
const SELECTOR = '.reveal,.reveal-x,.reveal-r';

/**
 * Scroll-reveal — one implementation replacing the six copies of
 * `addWatch`/`runWatch` that HANDOFF.md §4 flagged as the obvious refactor.
 *
 * Behaviour is deliberately identical to the approved design:
 *  - an element gets `.in` once it enters the viewport, and never loses it
 *  - reduced motion reveals everything immediately
 *  - re-scans on route change and after fonts/layout settle, which is what
 *    `skp-shared.js` was doing with its staggered `setTimeout` nudges
 *
 * IntersectionObserver replaces the scroll listener: same visual result,
 * no work on the scroll thread.
 */
export function useReveal(deps: unknown[] = []): void {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));
    if (elements.length === 0) return;

    if (reduced) {
      elements.forEach((el) => el.classList.add('in'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: `0px 0px -${Math.round((1 - TRIGGER_RATIO) * 100)}% 0px`, threshold: 0 },
    );

    elements.forEach((el) => {
      if (!el.classList.contains('in')) observer.observe(el);
    });

    /* Safety net, ported from skp-shared.js: if the first pass ran before
       layout settled, force-reveal anything already inside the viewport. */
    const sweep = () => {
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('in');
          observer.unobserve(el);
        }
      });
    };
    const timers = [400, 1200].map((delay) => window.setTimeout(sweep, delay));

    return () => {
      observer.disconnect();
      timers.forEach(window.clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, ...deps]);
}
