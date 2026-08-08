'use client';

import { useEffect } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/**
 * Ambient-orb parallax — ported from `initParallax()`.
 *
 * Every `[data-parallax]` element is offset by its distance from the viewport
 * centre times the attribute value, exactly as in the approved design. Skipped
 * entirely under reduced motion (the original did the same).
 */
export function useParallax(deps: unknown[] = []): void {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
    if (elements.length === 0) return;

    let ticking = false;

    const update = () => {
      const vh = window.innerHeight;
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2 - vh / 2;
        const speed = parseFloat(el.getAttribute('data-parallax') ?? '0');
        el.style.transform = `translate3d(0,${(center * speed).toFixed(1)}px,0)`;
      });
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      elements.forEach((el) => {
        el.style.transform = '';
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, ...deps]);
}
