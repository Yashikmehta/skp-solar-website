'use client';

import { usePathname } from 'next/navigation';
import { useParallax } from '@/hooks/useParallax';
import { useReveal } from '@/hooks/useReveal';

/**
 * Global motion runner.
 *
 * The handoff repeated the reveal watcher and the parallax loop inside all six
 * page logic classes and named the de-duplication as the next refactor
 * (HANDOFF.md §4). Mounting this once in the root layout does that: it rescans
 * on every route change, so each page gets the same behaviour it had before
 * without carrying its own copy.
 *
 * Renders nothing.
 */
export function SiteMotion() {
  const pathname = usePathname();
  useReveal([pathname]);
  useParallax([pathname]);
  return null;
}
