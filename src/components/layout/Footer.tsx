import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import {
  footerBadges,
  footerColumns,
  mailHref,
  siteSettings,
  telHref,
  waHref,
} from '@/lib/site';
import { Icon, WhatsAppIcon } from '@/components/ui/Icon';

/**
 * Site footer — one shared footer across all six pages (HANDOFF.md §6.3).
 *
 * Brand + credentials, two link columns and the contact block, all driven by
 * `src/lib/site.ts`. Collapses 4 → 2 → 1 column with clearance for the
 * WhatsApp FAB, exactly as the approved responsive rules specify.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="ft">
      <div className="wrap ft-in">
        <div className="ft-brand">
          <Link
            href={ROUTES.home}
            className="ft-logo"
            aria-label={`${siteSettings.name} — home`}
          >
            <Image src="/assets/skp-logo.png" alt={siteSettings.name} width={195} height={52} />
          </Link>
          <p className="ft-pitch">{siteSettings.pitch}</p>
          <div className="ft-badges">
            {footerBadges.map((badge) => (
              <span className="ft-badge" key={badge.label}>
                <Icon name={badge.icon} fill="none" />
                {badge.label}
              </span>
            ))}
          </div>
        </div>

        {footerColumns.map((column) => (
          <nav className="ft-col" aria-label={`Footer — ${column.heading}`} key={column.heading}>
            <h4>{column.heading}</h4>
            {column.links.map((link) => (
              <Link href={link.href} key={`${column.heading}-${link.label}`}>
                {link.label}
              </Link>
            ))}
          </nav>
        ))}

        <div className="ft-col ft-contact">
          <h4>Contact</h4>

          <Link href={ROUTES.contact}>
            <Icon name="pin" fill="none" />
            <span>
              <span className="lb">Office</span>
              {siteSettings.addressLines.map((line, index) => (
                <span key={line}>
                  {line}
                  {index < siteSettings.addressLines.length - 1 ? <br /> : null}
                </span>
              ))}
            </span>
          </Link>

          <a href={telHref}>
            <Icon
              name="phone"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <span>
              <span className="lb">{siteSettings.phoneDisplay}</span>
              Sales &amp; site survey bookings
            </span>
          </a>

          <a href={mailHref}>
            <Icon name="mail" fill="none" />
            <span>
              <span className="lb">{siteSettings.email}</span>
              Replies within one working day
            </span>
          </a>

          <Link href={ROUTES.contact}>
            <Icon name="clock" fill="none" />
            <span>
              <span className="lb">{siteSettings.hours}</span>
              Sunday site visits by appointment
            </span>
          </Link>

          <a href={waHref} className="ft-wa" target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon /> Chat on WhatsApp
          </a>
        </div>
      </div>

      <div className="wrap ft-bottom">
        <p>
          © <span>{year}</span> {siteSettings.name}. All rights reserved.
        </p>
        <span className="ft-areas">Serving {siteSettings.areas}</span>
      </div>
    </footer>
  );
}
