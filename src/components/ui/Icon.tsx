import type { SVGProps } from 'react';

/**
 * Icon library.
 *
 * Every path here is lifted verbatim from the approved pages so the rendered
 * glyphs are pixel-identical. Stroke/fill/size are *not* set on the SVG —
 * `skp-system.css` and the page stylesheets already size and colour icons via
 * their parent selector (e.g. `.cta .circ svg`, `.ft-contact svg`). Setting
 * them here would override the design.
 *
 * The handoff also flagged mangled SVG attributes (`sc-camel-view-box`,
 * `strokewidth`) that were breaking icons on three pages — those are repaired.
 */

export type IconName = keyof typeof PATHS;

const PATHS = {
  /** Circled arrow used inside `.cta .circ` and the header CTA. */
  arrowCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 12h6M13 8l4 4-4 4" />
    </>
  ),
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  phone: (
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.6A2 2 0 0 1 4.1 4h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 11.6a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
  ),
  mail: (
    <>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <path d="M22 6l-10 7L2 6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z" />
      <circle cx="12" cy="9" r="2.4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>
  ),
  check: <path d="M20 6L9 17l-5-5" />,
  chat: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  calculator: (
    <>
      <rect x="5" y="2.5" width="14" height="19" rx="2" />
      <path d="M8.5 6.5h7M8.5 11h.01M12 11h.01M15.5 11h.01M8.5 14.5h.01M12 14.5h.01M15.5 14.5h.01M8.5 18h.01M12 18h.01M15.5 18h.01" />
    </>
  ),
  factory: (
    <>
      <path d="M2 21h20" />
      <path d="M4 21V9l5 3V9l5 3V8l5 3v10" />
      <path d="M9 21v-4M14 21v-4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  home: (
    <>
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v10h5v-6h4v6h5V10" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  refresh: (
    <>
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M21 4v4h-4" />
    </>
  ),

  /* ---- Solutions switcher + gallery category glyphs ---- */
  building: (
    <>
      <rect x="4" y="3" width="9" height="18" rx="1" />
      <path d="M13 9h7v12M7 7h3M7 11h3M7 15h3" />
    </>
  ),
  cap: (
    <>
      <path d="M22 9 12 5 2 9l10 4 10-4Z" />
      <path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
      <path d="M22 9v5" />
    </>
  ),
  grid: (
    <>
      <path d="M9 2v5M15 2v5" />
      <path d="M5 7h14v3a7 7 0 0 1-14 0V7Z" />
      <path d="M12 17v5" />
    </>
  ),
  battery: (
    <>
      <rect x="2" y="8" width="17" height="10" rx="2" />
      <path d="M22 11v4" />
      <path d="M7 13h5" />
    </>
  ),
  hybrid: (
    <>
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M21 4v4h-4" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
      <path d="M3 20v-4h4" />
    </>
  ),
  drop: <path d="M12 3s6 6 6 11a6 6 0 0 1-12 0c0-5 6-11 6-11Z" />,
  star: (
    <path d="M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 17.8 5.8 20.9l1.6-6.8L2.2 8.9l6.9-.6z" />
  ),
  play: <path d="M8 5v14l11-7z" />,
  arrowUpRight: <path d="M7 17 17 7M9 7h8v8" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  document: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M9 13h6M9 17h6" />
    </>
  ),
  book: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19" />
    </>
  ),

  /* ---- Hero stat glyphs (homepage) ---- */
  statPanel: (
    <>
      <rect x="3" y="8" width="18" height="11" rx="1" />
      <path d="M3 13h18M9 8v11M15 8v11" />
      <circle cx="19" cy="5" r="2" />
    </>
  ),
  statRoof: (
    <>
      <path d="M3 21V9l9-6 9 6v12" />
      <path d="M9 21v-6h6v6" />
    </>
  ),
  statLayers: <path d="M12 2v20M5 7l7-4 7 4M5 17l7 4 7-4" />,
  statSun: (
    <>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
      <circle cx="12" cy="12" r="4" />
    </>
  ),

  /* ---- "Why SKP" value-card emblems ---- */
  emblemBadge: (
    <>
      <path d="M12 2l2.3 1.7 2.9.1 1 2.7 2.3 1.7-.9 2.8.9 2.8-2.3 1.7-1 2.7-2.9.1L12 22l-2.3-1.7-2.9-.1-1-2.7-2.3-1.7.9-2.8-.9-2.8 2.3-1.7 1-2.7 2.9-.1z" />
      <path d="M8.7 12l2.2 2.2 4.4-4.4" />
    </>
  ),
  emblemGear: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" />
    </>
  ),
  emblemScales: (
    <>
      <path d="M12 3v18M7 21h10M5 7h14" />
      <path d="M5 7l-2.4 5a2.4 2.4 0 0 0 4.8 0zM19 7l-2.4 5a2.4 2.4 0 0 0 4.8 0z" />
    </>
  ),
  emblemMedal: (
    <>
      <circle cx="12" cy="9" r="5" />
      <path d="M9.4 13.2 8 21l4-2 4 2-1.4-7.8" />
      <path d="M12 6.6l.85 1.7 1.9.3-1.37 1.33.32 1.9L12 11l-1.7.83.32-1.9L9.25 8.6l1.9-.3z" />
    </>
  ),
  emblemLifecycle: (
    <>
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <path d="M21 4v4h-4" />
      <path d="M12 8v4l2.6 1.5" />
    </>
  ),
  emblemNetwork: (
    <>
      <circle cx="12" cy="12" r="3" />
      <circle cx="5" cy="6" r="2" />
      <circle cx="19" cy="6" r="2" />
      <circle cx="5" cy="18" r="2" />
      <circle cx="19" cy="18" r="2" />
      <path d="M6.7 7.3 9.6 10M17.3 7.3 14.4 10M6.7 16.7 9.6 14M17.3 16.7 14.4 14" />
    </>
  ),

  /* ---- Founder vision / mission ---- */
  eye: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.4" />
    </>
  ),

  /* ---- Why SKP: legacy, Waaree, process, industries ---- */
  users: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="10" cy="7" r="4" />
      <path d="M21 21v-2a4 4 0 0 0-3-3.87" />
    </>
  ),
  bolt: <path d="M13 2 3 14h7l-1 8 10-12h-7z" />,
  equalizer: (
    <>
      <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" />
      <path d="M1 14h6M9 8h6M17 16h6" />
    </>
  ),
  layers3: (
    <>
      <path d="M12 2l9 5-9 5-9-5z" />
      <path d="M3 12l9 5 9-5" />
      <path d="M3 17l9 5 9-5" />
    </>
  ),
  climate: (
    <>
      <path d="M12 9a4 4 0 0 0-2 7.5" />
      <path d="M12 3v2M6.6 18.4l-1.4 1.4M20 12h2M19.4 4.6l-1.4 1.4M2 12h2M4.6 4.6l1.4 1.4" />
      <path d="M16 16a3 3 0 1 1 0 6H9a4 4 0 1 1 .5-7.97A5 5 0 0 1 16 16z" />
    </>
  ),
  clipboardCheck: (
    <>
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M9 13l2 2 4-4" />
    </>
  ),
  blueprint: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 3v18" />
    </>
  ),
  chartUp: (
    <>
      <path d="M3 3v18h18" />
      <path d="M7 14l4-4 3 3 5-6" />
    </>
  ),
  wrench: (
    <path d="M14.7 6.3a4.6 4.6 0 0 0-6.4 6.4L3 18v3h3l5.3-5.3a4.6 4.6 0 0 0 6.4-6.4L14 13l-3-3 3.7-3.7z" />
  ),
  meter: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 12l3.5-3.5" />
      <path d="M7 12h.01M12 7v.01M17 12h.01" />
    </>
  ),
  pulse: <path d="M22 12h-4l-3 8-4-16-3 8H2" />,
  textiles: (
    <>
      <path d="M4 20V8l4-4h8l4 4v12" />
      <path d="M2 20h20M9 20v-5h6v5M9 8h6" />
    </>
  ),
  healthcare: (
    <>
      <path d="M12 8v8M8 12h8" />
      <rect x="3" y="3" width="18" height="18" rx="4" />
    </>
  ),

  /* ---- ROI calculator panel heading ---- */
  sliders: (
    <>
      <path d="M9 3H5a2 2 0 0 0-2 2v4M15 3h4a2 2 0 0 1 2 2v4M9 21H5a2 2 0 0 1-2-2v-4M15 21h4a2 2 0 0 0 2-2v-4" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </>
  ),
} as const;

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
}

/**
 * Stroked icon. Sizing and colour come from the surrounding CSS, matching how
 * the approved markup worked.
 */
export function Icon({ name, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      {PATHS[name]}
    </svg>
  );
}

/**
 * WhatsApp mark — a filled glyph, so it is kept separate from the stroked set
 * above (the CSS targets `.wa svg { fill:#fff }` etc.).
 */
export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path d="M12 2a10 10 0 00-8.5 15.3L2 22l4.8-1.5A10 10 0 1012 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2s-1.2.2-3.6-.9-3.8-3.6-3.9-3.8-1-1.3-1-2.5.6-1.8.9-2 .5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.5c-.2.2-.3.3-.1.6s.7 1.1 1.4 1.7c1 .8 1.7 1.1 2 1.2s.4 0 .6-.2l.7-.8c.2-.2.3-.2.6-.1l1.9.9c.3.1.4.2.5.3s0 .6-.2 1.2z" />
    </svg>
  );
}

/** Icons used with `fill="none" stroke="currentColor"` inline in the design. */
export function CurrentColorIcon({ name, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {PATHS[name]}
    </svg>
  );
}
