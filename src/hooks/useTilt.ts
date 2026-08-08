'use client';

import { useCallback } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/**
 * Cursor-follow glow — ported from `initTilt()`.
 *
 * `.why-card::before` is positioned from the `--mx` / `--my` custom properties;
 * this simply keeps them in sync with the pointer. Returns props to spread onto
 * any card that uses that pattern.
 */
export function useTilt() {
  const reduced = usePrefersReducedMotion();

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (reduced) return;
      const el = event.currentTarget;
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      el.style.setProperty('--my', `${event.clientY - rect.top}px`);
    },
    [reduced],
  );

  const onPointerLeave = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const el = event.currentTarget;
    el.style.removeProperty('--mx');
    el.style.removeProperty('--my');
  }, []);

  return { onPointerMove, onPointerLeave };
}
