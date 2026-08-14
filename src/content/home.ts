import type { IconName } from '@/components/ui/Icon';

/**
 * Homepage content collections.
 *
 * HANDOFF.md §5 models these as CMS collections (Projects/gallery, Videos,
 * Testimonials, Milestones). Shapes below match that model so a Sanity query
 * can drop straight in.
 */

/* ---------------------------------------------------------------- */
/* Hero stats                                                        */
/* ---------------------------------------------------------------- */

export interface HeroStat {
  icon: IconName;
  value: string;
  label: string;
}

export const heroStats: HeroStat[] = [
  { icon: 'statPanel', value: '500 kW', label: 'On our own factory roof first' },
  { icon: 'statRoof', value: '30+', label: 'years of manufacturing experience' },
  { icon: 'statLayers', value: '~₹5 L', label: 'saved per month, real bill' },
  { icon: 'statSun', value: 'Waaree', label: 'authorized distributor, Punjab' },
];

/* ---------------------------------------------------------------- */
/* "Why SKP" value cards — also reused on the Why SKP page           */
/* ---------------------------------------------------------------- */

export interface ValueCard {
  num: string;
  icon: IconName;
  title: string;
  body: string;
  tag: string;
  /** `.feat` — the dark featured variant. */
  featured?: boolean;
}

export const valueCards: ValueCard[] = [
  {
    num: '01',
    icon: 'emblemBadge',
    title: 'Manufacturer-Backed',
    body: 'Authorized Waaree distributor with direct factory channels — genuine modules, honoured warranties, and supply you can plan around.',
    tag: 'Direct factory warranty',
    featured: true,
  },
  {
    num: '02',
    icon: 'emblemGear',
    title: 'In-House Engineering',
    body: 'Every system is designed, structurally checked and commissioned by our own engineers — no subcontracted guesswork on your roof.',
    tag: 'Own design & install team',
  },
  {
    num: '03',
    icon: 'emblemScales',
    title: 'Honest, Conservative Numbers',
    body: 'We model savings on the cautious side and show our assumptions. Your payback should beat our estimate, never miss it.',
    tag: 'No inflated projections',
  },
  {
    num: '04',
    icon: 'emblemMedal',
    title: 'Tier-1 Hardware Only',
    body: 'Bloomberg Tier-1 modules, reputable inverters and mounting rated for Punjab’s heat, dust and wind. No grey-market components.',
    tag: 'Tier-1 panels & inverters',
  },
  {
    num: '05',
    icon: 'emblemLifecycle',
    title: 'Lifecycle Accountability',
    body: 'Monitoring, cleaning schedules and performance reviews for the full 25 years — we own the output, not just the install date.',
    tag: '25-year performance care',
  },
  {
    num: '06',
    icon: 'emblemNetwork',
    title: 'One Partner, Full Ownership',
    body: 'Survey, financing paperwork, structure, wiring, net-metering and service — a single accountable team from first call to lifetime support.',
    tag: 'End-to-end, one contact',
  },
];

/* ---------------------------------------------------------------- */
/* Founder story                                                     */
/* ---------------------------------------------------------------- */

export const founder = {
  name: 'Ravinder Pabla',
  role: 'Author & Director',
  shortRole: 'Author & Director',
  portrait: '/assets/founder-portrait.png',
  quote:
    'We powered our own factory first. Only once the savings showed up on our bill did we start putting solar on anyone else’s roof.',
  /** The phrase wrapped in `.mk` (marker highlight) inside the quote. */
  quoteHighlight: 'own factory first',
  yearsInManufacturing: 30,
};

export const visionMission = [
  {
    icon: 'eye' as IconName,
    title: 'Our Vision',
    body: 'Make every industrial and family rooftop in North India a clean, self-reliant power plant.',
  },
  {
    icon: 'target' as IconName,
    title: 'Our Mission',
    body: 'Engineer honest, tier-1 solar that pays for itself — backed for its full 25-year life.',
  },
];

/** Milestones collection (HANDOFF.md §5: year/label, event). */
export const milestones = [
  { year: '1992', event: 'Family enters manufacturing in Punjab' },
  { year: '2019', event: '500 kW solar plant on our own roof' },
  { year: '2021', event: 'SKP Solar World founded' },
  { year: 'Today', event: 'Trusted Waaree partner across the region' },
];

/* ---------------------------------------------------------------- */
/* Gallery — Projects collection                                     */
/* ---------------------------------------------------------------- */

export interface GalleryProject {
  size: string;
  location: string;
  type: string;
  typeIcon: IconName;
  description: string;
  image: string;
  alt: string;
  /** Tile span in the masonry grid. */
  span?: 'lg' | 'wide';
  delay: string;
}

export const galleryProjects: GalleryProject[] = [
  {
    size: '500 kW',
    location: 'Ludhiana, Punjab',
    type: 'Industrial',
    typeIcon: 'factory',
    description:
      'Rooftop plant on our own manufacturing facility — the system that started SKP Solar World.',
    image: '/assets/industrial.jpg',
    alt: 'Industrial rooftop solar',
    span: 'lg',
    delay: 'dly1',
  },
  {
    size: '8 kW',
    location: 'Mohali',
    type: 'Residential',
    typeIcon: 'home',
    description: 'A family home running on clean daytime power with full net-metering.',
    image: '/assets/residential.jpg',
    alt: 'Residential rooftop solar',
    delay: 'dly2',
  },
  {
    size: '120 kW',
    location: 'Amritsar',
    type: 'Commercial',
    typeIcon: 'building',
    description: 'Showroom and warehouse complex cutting peak-hour grid costs.',
    image: '/assets/commercial.jpg',
    alt: 'Commercial rooftop solar',
    delay: 'dly3',
  },
  {
    size: '60 kW',
    location: 'Patiala',
    type: 'Institutional',
    typeIcon: 'cap',
    description: 'Campus rooftop lowering running costs for a growing school, year after year.',
    image: '/assets/schools.jpg',
    alt: 'School rooftop solar',
    span: 'wide',
    delay: 'dly2',
  },
  {
    size: '10 HP',
    location: 'Bathinda',
    type: 'Agricultural',
    typeIcon: 'drop',
    description: 'Solar water pump replacing diesel for year-round irrigation.',
    image: '/assets/pump.jpg',
    alt: 'Solar water pump',
    delay: 'dly1',
  },
  {
    size: '15 kW',
    location: 'Chandigarh',
    type: 'Hybrid',
    typeIcon: 'hybrid',
    description: 'Grid plus battery backup keeping a clinic online through outages.',
    image: '/assets/hybrid.jpg',
    alt: 'Hybrid solar system',
    delay: 'dly2',
  },
  {
    size: '25 kW',
    location: 'Jalandhar',
    type: 'On-Grid',
    typeIcon: 'grid',
    description: 'Export-ready rooftop spinning the meter backwards every sunny afternoon.',
    image: '/assets/ongrid.jpg',
    alt: 'On-grid solar system',
    span: 'wide',
    delay: 'dly3',
  },
];

/* ---------------------------------------------------------------- */
/* Videos collection                                                 */
/* ---------------------------------------------------------------- */

export interface VideoItem {
  title: string;
  category: string;
  duration: string;
  thumbnail: string;
  alt: string;
}

export const featuredVideo: VideoItem = {
  title: 'Inside our 500 kW factory rooftop',
  category: 'Project Walkthrough',
  duration: '4:12',
  thumbnail: '/assets/industrial.jpg',
  alt: 'Factory rooftop walkthrough',
};

export const sideVideos: VideoItem[] = [
  {
    title: 'How net-metering actually works',
    category: 'Explainer',
    duration: '2:48',
    thumbnail: '/assets/ongrid.jpg',
    alt: 'Net metering explainer',
  },
  {
    title: 'A homeowner’s first year with solar',
    category: 'Customer Story',
    duration: '3:05',
    thumbnail: '/assets/residential.jpg',
    alt: 'Homeowner story',
  },
  {
    title: 'Commissioning a 120 kW commercial plant',
    category: 'Installation',
    duration: '5:20',
    thumbnail: '/assets/commercial.jpg',
    alt: 'Commercial install',
  },
];

/* ---------------------------------------------------------------- */
/* Testimonials collection                                           */
/* ---------------------------------------------------------------- */

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  /** `feat` renders the large featured card. */
  variant?: 'feat';
  delay?: string;
  /** Counter metric shown under the quote. */
  metric?: { count: number; suffix: string; label: string; decimals?: number };
  /** Video thumbnail variant. */
  video?: { thumbnail: string; label: string };
  /** Before/after bill comparison bars. */
  beforeAfter?: { beforeLabel: string; beforeWidth: number; afterLabel: string; afterWidth: number };
  /** Small company logo row under the card. */
  logo?: { initials: string; name: string };
}

export const testimonials: Testimonial[] = [
  {
    variant: 'feat',
    quote:
      'Our textile unit ran on diesel half the day. SKP sized a 180 kW plant to our actual load and walked us through every number. Two years in, it’s beaten their estimate every single month.',
    metric: { count: 61, suffix: '%', label: 'cut in monthly energy spend' },
    name: 'Rajinder Mehta',
    role: 'MD, Mehta Textiles · Ludhiana',
  },
  {
    delay: 'dly1',
    video: { thumbnail: '/assets/commercial.jpg', label: 'Watch their story' },
    quote:
      'The site survey was the most thorough I’ve seen. No pressure, just engineering. That’s why we signed.',
    name: 'Simran Kaur',
    role: 'Director, Kaur Agro Foods',
  },
  {
    delay: 'dly2',
    quote: 'Monthly bill, before vs after SKP. The chart says it better than I can.',
    beforeAfter: {
      beforeLabel: '₹1.42L',
      beforeWidth: 100,
      afterLabel: '₹46k',
      afterWidth: 32,
    },
    name: 'Vikram Anand',
    role: 'Owner, Anand Steel Works',
    logo: { initials: 'AS', name: 'Anand Steel Works' },
  },
  {
    quote:
      'Five years on, they still call before monsoon to schedule a clean and a performance check. Genuine lifecycle support.',
    metric: { count: 25, suffix: '-yr', label: 'performance care plan' },
    name: 'Dr. Neha Gupta',
    role: 'Principal, Greenfield School',
  },
  {
    delay: 'dly1',
    video: { thumbnail: '/assets/industrial.jpg', label: 'Factory rooftop tour' },
    quote:
      '180 kW, commissioned in six weeks, zero surprises. These are plant people — they get manufacturing.',
    name: 'Amrit Pal',
    role: 'GM Operations, PalTech Industries',
  },
  {
    delay: 'dly2',
    quote:
      'Honest from day one. They told us a smaller system made more sense than what we asked for — and saved us money.',
    name: 'Gurpreet Bansal',
    role: 'Homeowner · Mohali',
  },
];

/* ---------------------------------------------------------------- */
/* Book teaser (homepage) — full detail lives on /the-book           */
/* ---------------------------------------------------------------- */

export const bookTeaser = {
  title: 'Sun Powered Profit',
  intro:
    'Written by entrepreneur Ravinder Pabla, Sun Powered Profit combines real manufacturing experience with practical insights to help business owners make smarter energy decisions through clarity—not sales pitches.',
  achievements: [
    { count: 12, suffix: 'k+', label: 'Copies in circulation' },
    { count: 4.8, decimals: 1, suffix: '', label: 'Average reader rating' },
    { count: 9, suffix: '+', label: 'Industry features' },
  ],
};
