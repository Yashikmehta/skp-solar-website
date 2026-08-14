import { ROUTES } from './routes';

/**
 * ============================================================================
 * SITE SETTINGS — THE CMS BOUNDARY
 * ============================================================================
 * This file is the direct successor to `window.SKP` from the handoff's
 * `skp-shared.js`. HANDOFF.md §5 designates it as the CMS boundary: every
 * value below is *content*, not layout.
 *
 * When Sanity lands, `siteSettings` and `navigation` are populated from the
 * `siteSettings` singleton (see `src/content/schemas.ts`) and nothing else in
 * the codebase has to change — components already read from here.
 *
 * ✅ CONFIRMED BY THE CLIENT: phone and email below are the live business
 *    details. Every tel:, mailto: and wa.me link on the site derives from
 *    them — change them here and nowhere else.
 *
 * ⚠️  STILL UNCONFIRMED (HANDOFF.md §8): the office address is carried over
 *    from the design. It shows on the Contact page and in the LocalBusiness
 *    JSON-LD. `whatsapp` currently mirrors the business phone — see the note
 *    on that field.
 * ============================================================================
 */

export interface SiteSettings {
  name: string;
  legalName: string;
  tagline: string;
  phoneDisplay: string;
  /** E.164, used for tel: links */
  phone: string;
  /** digits only, used for wa.me links */
  whatsapp: string;
  email: string;
  addressLines: string[];
  postalCode: string;
  locality: string;
  region: string;
  country: string;
  hours: string;
  hoursNote: string;
  areas: string;
  areasShort: string;
  pitch: string;
}

export const siteSettings: SiteSettings = {
  name: 'SKP Solar World',
  legalName: 'SKP Solar World',
  tagline: 'Industrial & Rooftop Solar in Punjab',
  phoneDisplay: '+91 76969 25523',
  phone: '+917696925523',
  /* ⚠️ AWAITING CONFIRMATION: mirrors the business phone. If SKP uses a
     separate WhatsApp Business number, change this one field. */
  whatsapp: '917696925523',
  email: 'sales@skpsolarworld.com',
  addressLines: ['SKP Solar World, Industrial Area,', 'Jalandhar, Punjab 144004'],
  postalCode: '144004',
  locality: 'Jalandhar',
  region: 'Punjab',
  country: 'IN',
  hours: 'Mon – Sat · 9:00 AM – 6:30 PM',
  hoursNote: 'Sunday: site visits by appointment',
  areas:
    'Jalandhar · Ludhiana · Amritsar · Chandigarh — and industrial projects across Punjab & North India',
  areasShort: 'Jalandhar · Ludhiana · Amritsar · Chandigarh',
  pitch:
    'Engineering-led solar from a manufacturing family. We commissioned 500 kW on our own factory roof before we sold a single system.',
};

/** Derived link helpers — always use these instead of building hrefs inline. */
export const telHref = `tel:${siteSettings.phone}`;
export const mailHref = `mailto:${siteSettings.email}`;
export const waHref = `https://wa.me/${siteSettings.whatsapp}`;

/** Header / drawer CTA. */
export const headerCta = {
  label: 'Get a Review',
  href: ROUTES.contact,
} as const;

export interface NavItem {
  label: string;
  href: string;
}

/**
 * Navigation is defined ONCE (HANDOFF.md §2). The desktop menu and the mobile
 * drawer both render from this array — they cannot drift apart.
 */
export const navigation: NavItem[] = [
  { label: 'Home', href: ROUTES.home },
  { label: 'Products', href: ROUTES.products },
  { label: 'Why SKP', href: ROUTES.why },
  { label: 'Calculator', href: ROUTES.calculator },
  { label: 'The Book', href: ROUTES.book },
  { label: 'Contact', href: ROUTES.contact },
];

export interface FooterColumn {
  heading: string;
  links: NavItem[];
}

export const footerColumns: FooterColumn[] = [
  {
    heading: 'Explore',
    links: [
      { label: 'Home', href: ROUTES.home },
      { label: 'Solutions', href: ROUTES.solutions },
      { label: 'Why SKP', href: ROUTES.why },
      { label: 'ROI Calculator', href: ROUTES.calculator },
      { label: 'The Book', href: ROUTES.book },
      { label: 'Contact', href: ROUTES.contact },
    ],
  },
  {
    heading: 'Products',
    links: [
      { label: 'Solar Modules', href: '/products#categories' },
      { label: 'Flexible Modules', href: '/products#categories' },
      { label: 'Inverters', href: '/products#categories' },
      { label: 'Power Optimizers', href: '/products#categories' },
      { label: 'On-Grid · Off-Grid · Hybrid', href: ROUTES.solutions },
    ],
  },
];

/** Credential badges in the footer brand column. */
export const footerBadges = [
  { icon: 'shield' as const, label: 'Waaree authorized distributor · Punjab' },
  { icon: 'factory' as const, label: '30+ years of manufacturing' },
];

/**
 * Calculator assumptions live in `src/lib/calculator.ts` — state solar-yield
 * profiles, cost and area per kW, performance ratio, degradation, escalation
 * and the emission factor. They are the approved values, kept beside the maths
 * they drive. HANDOFF.md §8 lists client sign-off on them as outstanding.
 */
