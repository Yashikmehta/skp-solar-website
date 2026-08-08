import type { ReactNode } from 'react';

/**
 * Products collection (HANDOFF.md §5: category, name, description, 4 spec
 * pairs, applications, datasheet, image).
 *
 * The Products page uses many one-off glyphs. Rather than bloat the shared
 * icon set with single-use paths, each one is stored here as a ReactNode with
 * its `d` attributes exactly as the approved markup had them. `viewBox`,
 * stroke and size still come from the page CSS, as they do in the design.
 */

const svg = (children: ReactNode) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    {children}
  </svg>
);

const PANEL_GLYPH = svg(
  <>
    <rect x="3" y="4" width="18" height="14" rx="1" />
    <path d="M3 11h18M9 4v14M15 4v14" />
  </>,
);

const STAR_GLYPH = svg(
  <path d="M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 17.8 5.8 20.9l1.6-6.8L2.2 8.9l6.9-.6z" />,
);

/* ------------------------------------------------------------------ */
/* Category tabs                                                       */
/* ------------------------------------------------------------------ */

export type ProductCategory = 'modules' | 'flexible' | 'inverters' | 'optimizers';

export const productCategories: { key: ProductCategory; label: string }[] = [
  { key: 'modules', label: 'Solar Modules' },
  { key: 'flexible', label: 'Flexible Solar Modules' },
  { key: 'inverters', label: 'Inverters' },
  { key: 'optimizers', label: 'Power Optimizers' },
];

/* ------------------------------------------------------------------ */
/* Solar modules                                                       */
/* ------------------------------------------------------------------ */

export interface ModuleProduct {
  name: string;
  image: string;
  tag: string;
  tagGlyph: ReactNode;
  /** `.flag` renders the gold flagship tag. */
  flagship?: boolean;
  intro: string;
  specs: { value: string; label: string }[];
  features: string[];
  applications: string[];
}

export const solarModules: ModuleProduct[] = [
  {
    name: 'Mono PERC Module',
    image: '/assets/product-mod-perc.webp',
    tag: 'Mono PERC',
    tagGlyph: PANEL_GLYPH,
    intro:
      'The dependable workhorse — proven half-cut cell technology delivering reliable long-term generation at excellent value.',
    specs: [
      { value: '560–590 Wp', label: 'Power output' },
      { value: '20% ±1%', label: 'Module efficiency' },
      { value: '35 mm', label: 'Frame' },
      { value: '30-Year', label: 'Performance warranty' },
    ],
    features: [
      'Better performance in high temperatures',
      'High-quality materials, durable construction',
      'Half-cut cell technology',
      'Reliable long-term energy generation',
    ],
    applications: ['Residential', 'Commercial', 'Industrial'],
  },
  {
    name: 'N-Type Modules',
    image: '/assets/product-mod-ntype.webp',
    tag: 'N-Type',
    tagGlyph: PANEL_GLYPH,
    intro:
      'Next-generation cell architecture with enhanced crack tolerance and superior performance in weak light and extreme weather.',
    specs: [
      { value: '565–715 W', label: 'Power output' },
      { value: '23.02%', label: 'Max module efficiency' },
      { value: 'High', label: 'Snow & wind resistance' },
      { value: 'Excellent', label: 'Thermal coefficient' },
    ],
    features: [
      'High reliability, enhanced crack tolerance',
      'Better weak-light performance',
      'Excellent thermal coefficient',
      'Heavy snow and wind resistance',
    ],
    applications: ['Residential', 'Commercial', 'Industrial'],
  },
  {
    name: 'HJT Modules',
    image: '/assets/product-mod-hjt.webp',
    tag: 'HJT · Flagship',
    tagGlyph: STAR_GLYPH,
    flagship: true,
    intro:
      'Heterojunction technology at the top of the efficiency curve — maximum generation per square metre of roof.',
    specs: [
      { value: '700–730 W', label: 'Power output' },
      { value: '23.5%', label: 'Max module efficiency' },
      { value: 'Superior', label: 'Thermal performance' },
      { value: 'High', label: 'Snow & wind load rating' },
    ],
    features: [
      'Industry-leading efficiency',
      'Superior thermal performance',
      'Better crack tolerance, excellent weak light',
      'Heavy snow and wind load resistance',
    ],
    applications: ['Residential', 'Commercial', 'Industrial'],
  },
];

/* ------------------------------------------------------------------ */
/* Flexible modules                                                    */
/* ------------------------------------------------------------------ */

export interface FlexibleApplication {
  title: string;
  body: string;
  image: string;
  glyph: ReactNode;
}

export const flexibleApplications: FlexibleApplication[] = [
  {
    title: 'Curved Roofs',
    body: 'Perfect for arched and curved structures.',
    image: '/assets/product-flex-curved.webp',
    glyph: svg(
      <>
        <path d="M2 20c0-8 4.5-13 10-13s10 5 10 13" />
        <path d="M2 20h20" />
      </>,
    ),
  },
  {
    title: 'Tensile Structures',
    body: 'Ideal for canopies, membrane and fabric roofs.',
    image: '/assets/product-flex-tensile.webp',
    glyph: svg(
      <>
        <path d="M3 20L12 5l9 15" />
        <path d="M3 20c3-2 6-3 9-3s6 1 9 3" />
      </>,
    ),
  },
  {
    title: 'Solar Umbrellas',
    body: 'Smart energy for outdoor spaces.',
    image: '/assets/product-flex-umbrella.webp',
    glyph: svg(
      <>
        <path d="M12 2a9.5 9.5 0 0 1 9.5 9.5H2.5A9.5 9.5 0 0 1 12 2z" />
        <path d="M12 11.5V19a2.5 2.5 0 0 1-5 0" />
      </>,
    ),
  },
  {
    title: 'Industrial Sheds',
    body: 'Reduce operational costs for large-scale facilities.',
    image: '/assets/product-flex-shed.webp',
    glyph: svg(
      <>
        <path d="M2 21h20" />
        <path d="M4 21V9l5 3V9l5 3V8l5 3v10" />
        <path d="M9 21v-4M14 21v-4" />
      </>,
    ),
  },
  {
    title: 'Canopies',
    body: 'Stylish and sustainable energy generation.',
    image: '/assets/product-flex-canopy.webp',
    glyph: svg(
      <>
        <path d="M3 10c3-4 15-4 18 0" />
        <path d="M5 10v10M19 10v10M5 16h14" />
      </>,
    ),
  },
  {
    title: 'Portable Buildings',
    body: 'Reliable power for temporary and mobile structures.',
    image: '/assets/product-flex-portable.webp',
    glyph: svg(
      <>
        <rect x="3" y="8" width="18" height="10" rx="1" />
        <path d="M3 12h18M8 8v10M16 8v10" />
        <circle cx="7" cy="20" r="1.4" />
        <circle cx="17" cy="20" r="1.4" />
      </>,
    ),
  },
  {
    title: 'Domes & Vaults',
    body: 'Enable clean energy for unique architectural designs.',
    image: '/assets/product-flex-dome.webp',
    glyph: svg(
      <>
        <path d="M4 20a8 8 0 0 1 16 0" />
        <path d="M2 20h20M12 12V4M9 6l3-2 3 2" />
      </>,
    ),
  },
  {
    title: 'Parking Shades',
    body: 'Generate clean energy while providing shade.',
    image: '/assets/product-flex-parking.webp',
    glyph: svg(
      <>
        <path d="M3 9l3-4h12l3 4" />
        <path d="M3 9h18" />
        <path d="M5 9v11M19 9v11" />
        <path d="M8 20v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4" />
      </>,
    ),
  },
];

/* ------------------------------------------------------------------ */
/* Inverters                                                           */
/* ------------------------------------------------------------------ */

export const onGridInverter = {
  image: '/assets/product-inv-ongrid.webp',
  headlineChip: { value: '98.6%', label: 'Max efficiency' },
  kicker: 'On-Grid Inverter',
  title: 'Utility-scale conversion, engineered for uptime',
  lead: 'Built for utility-scale solar projects — dependable performance, easy installation and user-friendly controls, day after day.',
  stats: [
    { value: '98.6%', label: 'Maximum efficiency' },
    { value: 'IP66', label: 'Protection rating' },
    { value: '10', label: 'MPPT, up to' },
    { value: '90 kg', label: 'Weight' },
  ],
  features: [
    'High energy efficiency',
    'Dependable performance',
    'Easy installation',
    'User-friendly controls',
  ],
};

export interface SynergyCard {
  glyph: ReactNode;
  title: string;
  body: string;
}

export const synergyCards: SynergyCard[] = [
  {
    glyph: svg(
      <>
        <path d="M2 21h20" />
        <path d="M4 21V9l8-5 8 5v12" />
        <path d="M9 21v-5h6v5" />
      </>,
    ),
    title: 'Large-scale rooftops',
    body: 'Designed for big commercial and industrial arrays.',
  },
  {
    glyph: svg(
      <>
        <path d="M12 20V10M6 20v-6M18 20v-13" />
        <path d="M3 20h18" />
      </>,
    ),
    title: 'Up to 175% DC oversizing',
    body: 'Harvest more from every string, all year round.',
  },
  {
    glyph: svg(
      <>
        <rect x="3" y="3" width="8" height="8" rx="1.5" />
        <rect x="13" y="3" width="8" height="8" rx="1.5" />
        <rect x="3" y="13" width="8" height="8" rx="1.5" />
        <rect x="13" y="13" width="8" height="8" rx="1.5" />
      </>,
    ),
    title: 'Modular architecture',
    body: 'Scale capacity in blocks, service without downtime.',
  },
  {
    glyph: svg(
      <>
        <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" />
        <path d="M9 12l2 2 4-4" />
      </>,
    ),
    title: 'Built-in safety',
    body: 'Protection engineered in at the hardware level.',
  },
  {
    glyph: svg(
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" />
      </>,
    ),
    title: 'Faster commissioning',
    body: 'Plants go live sooner, savings start earlier.',
  },
  {
    glyph: svg(
      <>
        <rect x="2" y="4" width="20" height="13" rx="2" />
        <path d="M8 21h8M12 17v4" />
        <path d="M6 12l3-3 2.5 2.5L15 8l3 3" />
      </>,
    ),
    title: 'Module-level monitoring',
    body: "See every panel's output, spot issues instantly.",
  },
  {
    glyph: svg(
      <>
        <path d="M12 3v18M7 21h10M5 7h14" />
        <path d="M5 7l-2.4 5a2.4 2.4 0 0 0 4.8 0zM19 7l-2.4 5a2.4 2.4 0 0 0 4.8 0z" />
      </>,
    ),
    title: 'Reduced install costs',
    body: 'Lighter blocks, simpler BOS, smaller crews.',
  },
  {
    glyph: svg(
      <>
        <path d="M21 12a9 9 0 1 1-3-6.7" />
        <path d="M21 4v4h-4" />
        <path d="M12 8v4l2.6 1.5" />
      </>,
    ),
    title: 'Higher uptime',
    body: 'Redundant design keeps generation flowing.',
  },
];

export const synergyModels = ['66.6 kW', '90 kW', '100 kW', '120 kW'];

/* ------------------------------------------------------------------ */
/* Power optimizers                                                    */
/* ------------------------------------------------------------------ */

export interface OptimizerNode {
  step: string;
  title: string;
  subtitle: string;
  glyph: ReactNode;
  /** Copy shown under the flow when this stage is selected. */
  description: ReactNode;
}

export const optimizerFlow: OptimizerNode[] = [
  {
    step: '01',
    title: 'Solar Panel',
    subtitle: 'DC generation',
    glyph: PANEL_GLYPH,
    description: (
      <>
        <b>Solar Panel:</b> each module generates DC power from sunlight — but shading, dust or
        mismatch can hold an individual panel back.
      </>
    ),
  },
  {
    step: '02',
    title: 'Power Optimizer',
    subtitle: 'Module-level MPPT',
    glyph: svg(<path d="M13 2L4 14h6l-1 8 9-12h-6z" />),
    description: (
      <>
        <b>Power Optimizer:</b> conditions each module’s DC output individually, so shading,
        soiling or mismatch on one panel never limits the rest.
      </>
    ),
  },
  {
    step: '03',
    title: 'Inverter',
    subtitle: 'DC → AC conversion',
    glyph: svg(
      <>
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <path d="M8 9h8M8 13h5" />
        <circle cx="16" cy="15" r="1.2" />
      </>,
    ),
    description: (
      <>
        <b>Inverter:</b> converts the optimized DC into grid-quality AC power at maximum
        efficiency, with every module already performing at its peak.
      </>
    ),
  },
  {
    step: '04',
    title: 'Grid',
    subtitle: 'Clean power out',
    glyph: svg(
      <>
        <path d="M9 2v5M15 2v5" />
        <path d="M5 7h14v3a7 7 0 0 1-14 0V7Z" />
        <path d="M12 17v5" />
      </>,
    ),
    description: (
      <>
        <b>Grid:</b> clean power flows to your loads first — and surplus is exported to the grid
        through net-metering.
      </>
    ),
  },
];

export const optimizerBenefits: SynergyCard[] = [
  {
    glyph: svg(
      <>
        <circle cx="12" cy="12" r="3.2" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" />
      </>,
    ),
    title: 'Module-level MPPT',
    body: 'Each panel tracked and optimized on its own.',
  },
  {
    glyph: svg(
      <>
        <path d="M12 20V10M6 20v-6M18 20v-13" />
        <path d="M3 20h18" />
      </>,
    ),
    title: 'Higher energy generation',
    body: 'More kWh from the same roof, every day.',
  },
  {
    glyph: svg(
      <>
        <path d="M3 11l9-8 9 8" />
        <path d="M5 10v10h14V10" />
        <path d="M9 20v-5h6v5" />
      </>,
    ),
    title: 'Complex roof compatibility',
    body: 'Multiple orientations and shading, handled.',
  },
  {
    glyph: svg(
      <>
        <path d="M12 3v18M7 21h10M5 7h14" />
        <path d="M5 7l-2.4 5a2.4 2.4 0 0 0 4.8 0zM19 7l-2.4 5a2.4 2.4 0 0 0 4.8 0z" />
      </>,
    ),
    title: 'Lower BOS cost',
    body: 'Longer strings mean less balance-of-system.',
  },
  {
    glyph: svg(<path d="M4 12h16M4 12l4-4M4 12l4 4M20 12l-4-4M20 12l-4 4" />),
    title: 'Longer strings',
    body: 'Fewer strings, simpler design, cleaner wiring.',
  },
  {
    glyph: svg(
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" />
      </>,
    ),
    title: 'Remote diagnostics',
    body: 'Issues found from the desk, not the roof.',
  },
  {
    glyph: svg(
      <>
        <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" />
        <path d="M9 12l2 2 4-4" />
      </>,
    ),
    title: 'Advanced safety',
    body: 'Module-level shutdown for safe maintenance.',
  },
  {
    glyph: svg(
      <>
        <rect x="2" y="4" width="20" height="13" rx="2" />
        <path d="M8 21h8M12 17v4" />
        <path d="M6 12l3-3 2.5 2.5L15 8l3 3" />
      </>,
    ),
    title: 'Module-level monitoring',
    body: 'Live per-panel data in one dashboard.',
  },
];

/* ------------------------------------------------------------------ */
/* Comparison table                                                    */
/* ------------------------------------------------------------------ */

export const comparisonColumns = [
  { name: 'Mono PERC', note: 'The proven workhorse' },
  { name: 'N-Type', note: 'The all-round performer' },
  { name: 'HJT', note: 'Maximum efficiency', flag: 'Flagship', highlight: true },
];

/** `value` is either text or a 0–5 dot rating. */
export type CellValue = string | { dots: number };

export const comparisonRows: { parameter: string; values: CellValue[] }[] = [
  { parameter: 'Power Output', values: ['560–590 Wp', '565–715 W', '700–730 W'] },
  { parameter: 'Efficiency', values: ['20% (±1%)', 'Up to 23.02%', 'Up to 23.5%'] },
  {
    parameter: 'Temperature Performance',
    values: [{ dots: 3 }, { dots: 4 }, { dots: 5 }],
  },
  { parameter: 'Low-Light Performance', values: [{ dots: 3 }, { dots: 4 }, { dots: 5 }] },
  { parameter: 'Durability', values: [{ dots: 4 }, { dots: 4 }, { dots: 5 }] },
  { parameter: 'Residential Suitability', values: [{ dots: 5 }, { dots: 4 }, { dots: 4 }] },
  { parameter: 'Commercial Suitability', values: [{ dots: 4 }, { dots: 5 }, { dots: 5 }] },
  { parameter: 'Industrial Suitability', values: [{ dots: 4 }, { dots: 5 }, { dots: 5 }] },
  {
    parameter: 'Warranty',
    values: ['30-Year Performance', '30-Year Performance', '30-Year Performance'],
  },
];

/* ------------------------------------------------------------------ */
/* Downloads                                                           */
/* ------------------------------------------------------------------ */

export interface DownloadCard {
  glyph: ReactNode;
  title: string;
  body: string;
  /** Real file, once supplied by the client (HANDOFF.md §8). */
  href?: string;
}

export const downloads: DownloadCard[] = [
  {
    glyph: svg(
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M9 13h6M9 17h6" />
      </>,
    ),
    title: 'Product Datasheets',
    body: 'Full electrical & mechanical specs for every module and inverter.',
  },
  {
    glyph: svg(
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </>,
    ),
    title: 'Brochures',
    body: 'Product range overviews for homes, businesses and industry.',
  },
  {
    glyph: svg(
      <>
        <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" />
        <path d="M9 12l2 2 4-4" />
      </>,
    ),
    title: 'Warranty Documents',
    body: 'Factory-backed performance and product warranty terms.',
  },
  {
    glyph: svg(
      <>
        <path d="M14.7 6.3a4.5 4.5 0 0 0-6.4 6.4L3 18v3h3l5.3-5.3a4.5 4.5 0 0 0 6.4-6.4z" />
        <circle cx="16" cy="8" r="1" />
      </>,
    ),
    title: 'Installation Guides',
    body: 'Mounting, wiring and commissioning procedures.',
  },
  {
    glyph: svg(
      <>
        <circle cx="12" cy="9" r="5" />
        <path d="M9.4 13.2 8 21l4-2 4 2-1.4-7.8" />
      </>,
    ),
    title: 'Certifications',
    body: 'IEC, BIS and quality certifications for all products.',
  },
];

/** Download arrow glyph, shared by every `.dl-card .go`. */
export const downloadArrow = svg(<path d="M12 4v12M6 12l6 6 6-6" />);
