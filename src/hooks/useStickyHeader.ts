'use client';

import { useEffect, useState } from 'react';

/**
 * Sticky-header shadow — ported from `stick()` in `skp-shared.js`.
 * `header.stuck` is applied past 8px of scroll, on every page.
 */
export function useStickyHeader(threshold = 8): boolean {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [threshold]);

  return stuck;
}
