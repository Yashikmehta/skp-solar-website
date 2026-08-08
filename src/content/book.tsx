import type { ReactNode } from 'react';

const svg = (children: ReactNode) => <svg viewBox="0 0 24 24">{children}</svg>;

/**
 * Book collection (HANDOFF.md §5: title, subtitle, chapters, achievements,
 * cover art, QR, order link).
 */
export const book = {
  title: 'Sun Powered Profit',
  subtitle: 'The Industrial Solar Playbook',
  chapters: 13,
  cover: '/assets/book-cover-sky.png',
  qr: '/assets/book-qr.png',
  intro:
    'Written by entrepreneur Ravinder Pabla, Sun Powered Profit combines real manufacturing experience with practical insights to help business owners make smarter energy decisions through clarity—not sales pitches.',
  achievements: [
    { count: 13, suffix: '', label: 'Chapters of field-tested thinking' },
    { count: 500, suffix: ' kW', label: 'Real case study, real bills' },
    { count: 30, suffix: '+', label: 'Years in manufacturing' },
  ],
};

/** `.story-time` — the author's five-stage journey. */
export const storyMilestones = [
  {
    title: 'The Factory Problem',
    body: 'A 24/7 bearing unit in Ludhiana. Power quietly becomes the largest uncontrolled cost.',
  },
  {
    title: 'Five Years of Research',
    body: 'Proposals reviewed, none comparable. The decision keeps getting postponed.',
  },
  {
    title: '500 kW Installation',
    body: "Commissioned under our own engineering oversight, not a trader's.",
  },
  {
    title: '₹5 Lakh Monthly Savings',
    body: 'The first full bill after net metering. Measured, not projected.',
  },
  {
    title: 'Sun Powered Profit',
    body: 'The framework written down for the industrialists who come next.',
  },
];

/** `.story-vm` — the two summary cards beside the story. */
export const storyCards = [
  {
    glyph: svg(
      <>
        <path d="M3 3v18h18" />
        <path d="M7 15l4-4 3 3 5-6" />
      </>,
    ),
    title: 'Why read this book',
    items: [
      'Avoid expensive EPC mistakes',
      'Evaluate proposals with confidence',
      'Understand industrial ROI',
      'Apply a practical decision framework',
    ],
  },
  {
    glyph: svg(<path d="M12 2l2.5 5.5L20 8l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z" />),
    title: 'Who it is for',
    items: [
      'Factory owners',
      'Manufacturing businesses',
      'Plant heads',
      'CFOs and finance leads',
      'Industrial decision makers',
    ],
  },
];

/** `.learn-grid` — the six learning pillars. */
export const learnCards = [
  {
    num: '01',
    glyph: svg(
      <>
        <path d="M3 17l6-6 4 4 8-8" />
        <path d="M21 7v5h-5" />
      </>,
    ),
    title: 'Understanding Rising Energy Costs',
    body: 'Electricity is 15–40% of production cost in most units — and the only major input that reliably moves one way.',
    more: 'See what a 5% annual escalation does to a ₹10 lakh monthly bill over ten years.',
    tag: 'Chapters 1–2',
  },
  {
    num: '02',
    featured: true,
    glyph: svg(
      <>
        <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
        <path d="M12 9v4M12 17h.01" />
      </>,
    ),
    title: 'Avoiding Costly Solar Mistakes',
    body: 'Why delay feels like caution and behaves like an expense — and how confusion, not capital, stalls the decision.',
    more: 'The psychology behind a five-year postponement, and the price tag attached to it.',
    tag: 'Chapters 3–4',
  },
  {
    num: '03',
    glyph: svg(
      <>
        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </>,
    ),
    title: 'Evaluating Solar Like an Industrialist',
    body: 'Move energy out of the expense column. A rooftop plant is a 25-year asset with an IRR you can defend.',
    more: 'Capital allocation, depreciation, financing and EMI-versus-savings alignment.',
    tag: 'Chapter 5',
  },
  {
    num: '04',
    glyph: svg(
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
        <circle cx="10" cy="7" r="4" />
        <path d="M21 21v-2a4 4 0 0 0-3-3.87" />
      </>,
    ),
    title: 'Choosing the Right Solar Partner',
    body: 'Traders, EPCs and manufacturer-backed partners are not the same purchase. Learn the questions that separate them.',
    more: 'A seven-point checklist covering engineering depth, monitoring and lifecycle accountability.',
    tag: 'Chapters 7 & 9',
  },
  {
    num: '05',
    glyph: svg(
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </>,
    ),
    title: 'Building Long-Term Energy Stability',
    body: 'What changes after commissioning: relief, pricing flexibility, and a team that finally treats energy as a managed asset.',
    more: 'The three patterns owners report once the first stabilised bills arrive.',
    tag: 'Chapters 10 & 12',
  },
  {
    num: '06',
    glyph: svg(
      <>
        <path d="M2 21h20" />
        <path d="M4 21V9l5 3V9l5 3V8l5 3v10" />
        <path d="M9 21v-4M14 21v-4" />
      </>,
    ),
    title: 'Learning Through Real Industrial Case Studies',
    body: 'A 500 kW rooftop on a working bearing plant — the financing, the surprises, and the first bill after net metering.',
    more: 'Including the structural reinforcement the brochures never mention.',
    tag: 'Chapter 8',
  },
];

/** `.peek-list` — the sample pages. */
export interface PeekCard {
  page: string;
  type: string;
  variant?: 'quote';
  quote?: ReactNode;
  by?: string;
  title?: string;
  body?: string;
  steps?: { label: string; body: string; locked?: boolean }[];
  numbers?: { count: number; prefix?: string; suffix?: string; label: string }[];
}

export const peekCards: PeekCard[] = [
  {
    page: 'Ch. 2',
    type: 'From the book',
    variant: 'quote',
    quote: (
      <>
        The most expensive decision in manufacturing is not a wrong investment. It is a{' '}
        <span className="hl">delayed right investment.</span>
      </>
    ),
    by: 'Chapter 2 — The Silent Margin Killer in Manufacturing',
  },
  {
    page: 'Ch. 6',
    type: 'Framework preview',
    title: 'The Industrial Solar Decision Framework',
    body: 'Six disciplined steps that replace vendor guesswork with the same rigour you apply to a machinery purchase. The first two are below.',
    steps: [
      {
        label: 'STEP 1',
        body: 'Run a real energy audit on 12 months of your own consumption data.',
      },
      { label: 'STEP 2', body: 'Standardise every proposal into one comparison format.' },
      {
        label: 'STEPS 3–6',
        body: 'Generation validation, execution, accountability, opportunity cost.',
        locked: true,
      },
    ],
  },
  {
    page: 'Ch. 9',
    type: 'Industrial insight',
    title: 'A trader sells a plant. A partner carries it for 25 years.',
    body: 'Pure traders outsource execution, EPCs rely on external suppliers, manufacturer-backed partners carry direct supply-chain accountability. The 5–7% price gap rarely matches the risk gap.',
  },
  {
    page: 'Ch. 8',
    type: 'Case study teaser',
    title: '500 kW on a working bearing plant',
    body: 'A ₹1.40 crore annual power bill. Months of hesitation over a ₹1.5 crore investment. A subsidised SIDBI loan whose EMI landed at roughly 30% of the old bill.',
    numbers: [
      { count: 500, suffix: ' kW', label: 'Rooftop system installed' },
      { count: 5, prefix: '₹', suffix: ' L', label: 'Cut from the first full bill' },
      { count: 30, suffix: '%', label: 'EMI as share of old bill' },
    ],
  },
  {
    page: 'Ch. 12',
    type: 'The takeaway',
    title: 'Clarity must come before capital.',
    body: 'Across successful installations four elements repeat: structured financial modelling, conservative generation maths, disciplined execution, and long-term accountability. Miss one and satisfaction drops.',
  },
];

/** `.gcta-trust` — credibility chips in the closing panel. */
export const bookTrustPoints = [
  'Written by Ravinder Pabla',
  'Founder of SKP Solar World',
  'Industrial entrepreneur, 30+ years',
  'Engineering-led solar solutions',
  'Trusted by businesses across North India',
  'Honest, conservative estimates',
];
