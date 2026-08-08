'use client';

import Image from 'next/image';
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
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
  /** Back-cover pull quote. Defaults to the homepage/hero wording. */
  backQuote?: ReactNode;
  /** Back-cover body copy. */
  backText?: string;
  /** Label beside the QR code. */
  scanTitle?: string;
  scanSubtitle?: string;
  /** Set false to hide the "Drag to rotate" hint and bestseller badge. */
  showChrome?: boolean;
  /** Inline override for `.book-shadow` position. */
  shadowStyle?: CSSProperties;
}

/**
 * The 3D book object — shared by the homepage teaser and `/the-book`
 * (HANDOFF.md §4).
 *
 * Interaction is ported verbatim from `initBookTilt()`:
 *  · drag to spin (0.65°/px yaw, 0.30°/px pitch clamped to ±26°)
 *  · desktop pointer-follow tilt until the first real drag
 *  · a one-time 34° nudge when the book scrolls into view, hinting it spins
 * Resting pose is `rotateY(-30deg) rotateX(7deg)`, as in the design.
 */
export function Book3D({
  stageClassName = 'book-stage reveal-x',
  beforeBook,
  children,
  className,
  backQuote = (
    <>
      Profit favors <span className="hl">clarity.</span>
    </>
  ),
  backText = 'Most businesses track raw materials, machinery and manpower — few track the one cost that quietly rises every year. This is the playbook for industrial leaders who decide to turn energy into a long-term strategic advantage.',
  scanTitle = 'Get your copy',
  scanSubtitle = 'Scan to order or download',
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
    let lastX = 0;
    let lastY = 0;
    let moved = 0;
    let spun = false;

    const apply = () => {
      obj.style.transform = `rotateY(${rotY.toFixed(1)}deg) rotateX(${rotX.toFixed(1)}deg)`;
    };

    const down = (event: PointerEvent) => {
      dragging = true;
      moved = 0;
      lastX = event.clientX;
      lastY = event.clientY;
      obj.style.transition = 'none';
      stage.classList.add('grabbing');
      if (event.pointerId != null) {
        try {
          stage.setPointerCapture(event.pointerId);
        } catch {
          /* setPointerCapture can throw if the pointer is already released */
        }
      }
    };

    const move = (event: PointerEvent) => {
      if (!dragging) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      moved += Math.abs(dx) + Math.abs(dy);
      rotY += dx * 0.65;
      rotX = Math.max(-26, Math.min(26, rotX - dy * 0.3));
      apply();
      if (!spun && moved > 14) {
        spun = true;
        stage.classList.add('spun');
      }
    };

    const up = () => {
      if (!dragging) return;
      dragging = false;
      obj.style.transition = 'transform .25s ease-out';
      stage.classList.remove('grabbing');
    };

    /* Ambient pointer-follow tilt, only before the user has dragged. */
    const hover = (event: PointerEvent) => {
      if (dragging || spun || event.pointerType === 'touch') return;
      const rect = stage.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      rotY = -30 + px * 22;
      rotX = 7 - py * 14;
      apply();
    };

    const leave = () => {
      if (dragging || spun) return;
      obj.style.transition = 'transform .5s ease-out';
      rotY = -30;
      rotX = 7;
      apply();
    };

    stage.addEventListener('pointerdown', down);
    stage.addEventListener('pointermove', move);
    stage.addEventListener('pointermove', hover);
    stage.addEventListener('pointerleave', leave);
    stage.addEventListener('pointercancel', up);
    window.addEventListener('pointerup', up);

    let observer: IntersectionObserver | undefined;
    let nudgeTimer = 0;

    if (!reduced) {
      let seen = false;
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting || seen) return;
            seen = true;
            obj.style.transition = 'transform 1.5s cubic-bezier(.34,1.2,.5,1)';
            rotY = -30 + 34;
            apply();
            nudgeTimer = window.setTimeout(() => {
              if (!dragging && !spun) {
                obj.style.transition = 'transform 1s ease-out';
                rotY = -30;
                apply();
              }
            }, 1500);
          });
        },
        { threshold: 0.4 },
      );
      observer.observe(stage);
    }

    apply();

    return () => {
      stage.removeEventListener('pointerdown', down);
      stage.removeEventListener('pointermove', move);
      stage.removeEventListener('pointermove', hover);
      stage.removeEventListener('pointerleave', leave);
      stage.removeEventListener('pointercancel', up);
      window.removeEventListener('pointerup', up);
      observer?.disconnect();
      window.clearTimeout(nudgeTimer);
    };
  }, [reduced]);

  return (
    <div className={stageClassName} ref={stageRef}>
      {beforeBook}
      <div className="book-float">
        <div className={`book-obj${className ? ` ${className}` : ''}`} ref={objRef}>
          {/* ---- Back cover ---- */}
          <div className="book-face book-back">
            <div className="bb-in">
              <div className="bb-kicker">Sun Powered Profit</div>
              <div className="bb-quote">{backQuote}</div>
              <div className="bb-text">{backText}</div>
              <div className="bb-author-row">
                <div className="bb-photo">
                  <Image src={founder.portrait} alt={founder.name} width={64} height={64} />
                </div>
                <div>
                  <div className="bb-name">{founder.name}</div>
                  <div className="bb-role">Founder &amp; MD, SKP Solar World</div>
                </div>
              </div>
              <div className="bb-bottom">
                <div className="bb-qr">
                  <Image
                    src="/assets/book-qr.png"
                    alt="Scan to order Sun Powered Profit"
                    width={72}
                    height={72}
                  />
                </div>
                <div className="bb-scan">
                  <b>{scanTitle}</b>
                  <span>{scanSubtitle}</span>
                </div>
              </div>
            </div>
            <div className="glare" />
          </div>

          {/* ---- Spine + page block ---- */}
          <div className="book-face book-spine">
            <span>SUN POWERED PROFIT · R. PABLA</span>
          </div>
          <div className="book-face book-pages" />

          {/* ---- Front cover ---- */}
          <div className="book-face book-front">
            <Image
              className="bf-bg"
              src="/assets/book-cover-sky.png"
              alt=""
              fill
              sizes="(max-width: 900px) 80vw, 32vw"
            />
            <div className="bf-shade" />
            <div className="bf-in">
              <div className="bf-top">
                <div className="bf-emblem">S</div>
                <div className="bf-kicker">
                  The Industrial
                  <br />
                  Solar Playbook
                </div>
              </div>
              <div className="bf-mid">
                <div className="bf-rule" />
                <div className="bf-title">
                  Sun
                  <br />
                  Powered
                  <br />
                  Profit
                </div>
                <div className="bf-sub">
                  Turn energy from your most unpredictable cost into a lasting strategic
                  advantage.
                </div>
              </div>
              <div className="bf-author">
                <div className="nm">{founder.name}</div>
                <div className="rl">Industrial Entrepreneur</div>
              </div>
            </div>
            <div className="glare" />
          </div>
        </div>
      </div>

      <div className="book-shadow" style={shadowStyle} />
      {showChrome ? (
        <>
          <div className="book-spin-hint">
            <Icon name="refresh" /> Drag to rotate
          </div>
          <div className="book-badge">
            <Icon name="star" /> #1 Bestseller
          </div>
        </>
      ) : null}
      {children}
    </div>
  );
}
