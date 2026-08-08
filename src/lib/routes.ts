/**
 * Route map — the single source of truth for internal links.
 *
 * The handoff shipped `ROUTES` in `skp-shared.js` pointing at `.dc.html` files.
 * Those are replaced here by the real Next.js routes from HANDOFF.md §2.
 * Never hardcode a path in a component; import from here.
 */
export const ROUTES = {
  home: '/',
  products: '/products',
  solutions: '/#solutions',
  why: '/why-skp',
  calculator: '/solar-calculator',
  book: '/the-book',
  contact: '/contact',
} as const;

export type RouteKey = keyof typeof ROUTES;

/** Anchor targets used by in-body CTAs across pages. */
export const ANCHORS = {
  solutions: '/#solutions',
  calculator: '/#calculator',
  gallery: '/#gallery',
  videos: '/#videos',
  productCategories: '/products#categories',
  enquiry: '/contact#enquiry',
} as const;

/**
 * True when `pathname` should mark `href` as the current page.
 *
 * Section links never claim the active state. "Solutions" points at
 * `/#solutions`, so stripping its hash would leave `/` and light it up
 * alongside "Home" on the homepage — two `aria-current="page"` items at once,
 * which is both wrong for screen readers and visibly wrong in the gold
 * `.menu a[aria-current="page"]` treatment.
 */
export function isActiveRoute(href: string, pathname: string): boolean {
  if (href.includes('#')) return false;
  if (!href) return false;
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}
