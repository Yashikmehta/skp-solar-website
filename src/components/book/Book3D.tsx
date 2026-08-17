'use client';

import Image from 'next/image';
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { book } from '@/content/book';
import { founder } from '@/content/home';

interface Book3DProps {
  /**
   * Class on the stage element. Defaults to the standard `.book-stage`; the
   * Book page's "glimpse inside" section swaps it for `.peek-stage`, which is
   * how the approved markup structures that variant.
   */
  stageClassName?: string;
  /** Rendered inside the stage before the book (e.g. `.peek-glow`). */
  beforeBook?: ReactNode;
  /** Rendered inside the stage after the shadow (e.g. `.peek-locked`). */
  children?: ReactNode;
  /** Extra class on `.book-obj` — the Book page's "peek" variant uses this. */
  className?: string;
  /** Set false to hide the "Drag to rotate" hint. */
  showChrome?: boolean;
  /** Inline override for `.book-shadow` position. */
  shadowStyle?: CSSProperties;
}

/**
 * The 3D book object — shared by the homepage teaser and `/the-book`
 * (HANDOFF.md §4).
 *
 * Interaction:
 *  · drag to spin (any direction; yaw + pitch)
 *  · desktop pointer-follow tilt until the first real drag
 *  · a one-time nudge when the book scrolls into view
 * Resting pose is `rotateY(-30deg) rotateX(7deg)`.
 */
export function Book3D({
  stageClassName = 'book-stage reveal-x',
  beforeBook,
  children,
  className,
  showChrome = true,
  shadowStyle,
}: Book3DProps = {}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const objRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const stage = stageRef.current;
    const obj = objRef.current;
    if (!stage || !obj) return;

    let rotY = -30;
    let rotX = 7;
    let dragging = false;
    let activePointer: number | null = null;
    let lastX = 0;
    let lastY = 0;
    let moved = 0;
    let spun = false;
    let raf = 0;
    let dirty = false;

    const applyNow = () => {
      obj.style.transform = `rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg)`;
    };

    const scheduleApply = () => {
      if (dirty) return;
      dirty = true;
      raf = window.requestAnimationFrame(() => {
        dirty = false;
        applyNow();
      });
    };

    const setDragging = (on: boolean) => {
      dragging = on;
      stage.classList.toggle('grabbing', on);
      obj.classList.toggle('is-dragging', on);
      if (on) {
        obj.style.transition = 'none';
      }
    };

    const down = (event: PointerEvent) => {
      if (event.button != null && event.button !== 0) return;
      if (dragging) return;

      event.preventDefault();
      activePointer = event.pointerId;
      moved = 0;
      lastX = event.clientX;
      lastY = event.clientY;
      setDragging(true);

      try {
        stage.setPointerCapture(event.pointerId);
      } catch {
        /* capture can fail if the pointer already ended */
      }
    };

    const move = (event: PointerEvent) => {
      if (!dragging || event.pointerId !== activePointer) return;
      event.preventDefault();

      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;

      if (dx === 0 && dy === 0) return;

      moved += Math.abs(dx) + Math.abs(dy);
      rotY += dx * 0.65;
      rotX = Math.max(-26, Math.min(26, rotX - dy * 0.3));
      scheduleApply();

      if (!spun && moved > 10) {
        spun = true;
        stage.classList.add('spun');
      }
    };

    const up = (event: PointerEvent) => {
      if (!dragging) return;
      if (activePointer != null && event.pointerId !== activePointer) return;

      if (activePointer != null) {
        try {
          if (stage.hasPointerCapture(activePointer)) {
            stage.releasePointerCapture(activePointer);
          }
        } catch {
          /* ignore */
        }
      }

      activePointer = null;
      setDragging(false);
      obj.style.transition = 'transform .2s ease-out';
    };

    /* Ambient pointer-follow tilt, only before the user has dragged. */
    const hover = (event: PointerEvent) => {
      if (dragging || spun || event.pointerType === 'touch') return;
      const rect = stage.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      rotY = -30 + px * 22;
      rotX = 7 - py * 14;
      scheduleApply();
    };

    const leave = () => {
      if (dragging || spun) return;
      obj.style.transition = 'transform .45s ease-out';
      rotY = -30;
      rotX = 7;
      applyNow();
    };

    const opts: AddEventListenerOptions = { passive: false };
    stage.addEventListener('pointerdown', down, opts);
    stage.addEventListener('pointermove', move, opts);
    stage.addEventListener('pointermove', hover);
    stage.addEventListener('pointerleave', leave);
    stage.addEventListener('pointercancel', up);
    stage.addEventListener('pointerup', up);
    stage.addEventListener('lostpointercapture', up);

    let observer: IntersectionObserver | undefined;
    let nudgeTimer = 0;

    if (!reduced) {
      let seen = false;
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting || seen) return;
            seen = true;
            if (dragging || spun) return;
            obj.style.transition = 'transform 1.5s cubic-bezier(.34,1.2,.5,1)';
            rotY = -30 + 34;
            applyNow();
            nudgeTimer = window.setTimeout(() => {
              if (!dragging && !spun) {
                obj.style.transition = 'transform 1s ease-out';
                rotY = -30;
                applyNow();
              }
            }, 1500);
          });
        },
        { threshold: 0.4 },
      );
      observer.observe(stage);
    }

    applyNow();

    return () => {
      stage.removeEventListener('pointerdown', down, opts);
      stage.removeEventListener('pointermove', move, opts);
      stage.removeEventListener('pointermove', hover);
      stage.removeEventListener('pointerleave', leave);
      stage.removeEventListener('pointercancel', up);
      stage.removeEventListener('pointerup', up);
      stage.removeEventListener('lostpointercapture', up);
      observer?.disconnect();
      window.clearTimeout(nudgeTimer);
      window.cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div className={stageClassName} ref={stageRef}>
      {beforeBook}
      <div className="book-float">
        <div className={`book-obj${className ? ` ${className}` : ''}`} ref={objRef}>
          {/* ---- Back cover ---- */}
          <div className="book-face book-back">
            <Image
              className="bb-bg"
              src={book.back}
              alt={`${book.title} back cover`}
              fill
              sizes="(max-width: 900px) 80vw, 32vw"
              draggable={false}
              style={{ objectFit: 'cover', pointerEvents: 'none' }}
            />
            <div className="glare" />
          </div>

          {/* ---- Spine + page block ---- */}
          <div
            className="book-face book-spine"
            style={{ backgroundImage: `url(${book.spine})` }}
            aria-hidden="true"
          />
          <div className="book-face book-pages" />
          <div className="book-face book-top" aria-hidden="true" />
          <div className="book-face book-bottom" aria-hidden="true" />

          {/* ---- Front cover ---- */}
          <div className="book-face book-front">
            <Image
              className="bf-bg"
              src={book.cover}
              alt={`${book.title} by ${founder.name}`}
              fill
              sizes="(max-width: 900px) 80vw, 32vw"
              draggable={false}
              style={{ objectFit: 'cover', pointerEvents: 'none' }}
            />
            <div className="glare" />
          </div>
        </div>
      </div>

      <div className="book-shadow" style={shadowStyle} />
      {showChrome ? (
        <div className="book-spin-hint">
          <Icon name="refresh" /> Drag to rotate
        </div>
      ) : null}
      {children}
    </div>
  );
}
