'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useStickyHeader } from '@/hooks/useStickyHeader';
import { isActiveRoute, ROUTES } from '@/lib/routes';
import { headerCta, navigation, siteSettings, telHref } from '@/lib/site';
import { CurrentColorIcon, Icon } from '@/components/ui/Icon';

/**
 * Site header — built once, identical on all six pages (HANDOFF.md §4).
 *
 * Markup mirrors the approved design exactly: sticky `<header>` with the
 * `.stuck` scroll shadow, desktop `.menu`, `.nav-actions` (CTA + tap-to-call
 * pill), the hamburger, and the `.mobile-menu` drawer.
 *
 * The drawer is rendered from the same `navigation` array as the desktop menu,
 * so the two can never drift — the handoff called this out as a defect in the
 * original pages, where every page carried a different menu.
 */
export function Header() {
  const pathname = usePathname();
  const stuck = useStickyHeader();
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  /* Close the drawer on navigation. */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /* Click-outside and Escape, ported from `initNav()`. */
  useEffect(() => {
    if (!open) return;

    const onClick = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header ref={headerRef} className={stuck ? 'stuck' : undefined}>
      <div className="wrap nav">
        <Link href={ROUTES.home} className="logo" aria-label={`${siteSettings.name} — home`}>
          <Image
            src="/assets/skp-logo.png"
            alt={siteSettings.name}
            width={180}
            height={48}
            priority
          />
        </Link>

        <nav className="menu" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActiveRoute(item.href, pathname) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <Link href={headerCta.href} className="dms">
            <CurrentColorIcon name="arrowCircle" />
            {headerCta.label}
          </Link>

          <a href={telHref} className="pill" aria-label={`Call ${siteSettings.name}`}>
            <Icon
              name="phone"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </a>

          <button
            type="button"
            className={`nav-toggle${open ? ' open' : ''}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobileMenu"
            onClick={(event) => {
              event.stopPropagation();
              setOpen((value) => !value);
            }}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`mobile-menu${open ? ' open' : ''}`} id="mobileMenu">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActiveRoute(item.href, pathname) ? 'page' : undefined}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <Link href={headerCta.href} className="mm-cta" onClick={() => setOpen(false)}>
          <CurrentColorIcon name="arrowCircle" />
          {headerCta.label}
        </Link>
      </div>
    </header>
  );
}
