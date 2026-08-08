/**
 * ============================================================================
 * SANITY CMS — CONTENT MODEL
 * ============================================================================
 * This file is the bridge between the typed content in `src/content/*` and a
 * future Sanity Studio. It contains no Sanity dependency: it declares the
 * document types, their fields, and which module each one currently feeds.
 *
 * The migration is deliberately incremental — one document type at a time:
 *
 *   1. Create the matching schema in Sanity Studio from the shape below.
 *   2. Write a GROQ query in `src/lib/sanity.ts` returning the same TypeScript
 *      interface the component already consumes.
 *   3. Swap the import in the page: `@/content/home` → the query result.
 *
 * Nothing in `src/components/*` changes, because every component already reads
 * typed data via props rather than reaching for a literal.
 *
 * Model taken from HANDOFF.md §5.
 * ============================================================================
 */

export interface ContentTypeSpec {
  /** Sanity document `name`. */
  name: string;
  title: string;
  /** Singleton documents have exactly one instance. */
  singleton?: boolean;
  fields: string[];
  /** Where this content lives today. */
  currentSource: string;
  /** Which TypeScript interface the query must satisfy. */
  consumedAs: string;
}

export const contentModel: ContentTypeSpec[] = [
  {
    name: 'siteSettings',
    title: 'Site settings',
    singleton: true,
    fields: [
      'name',
      'logo',
      'phoneDisplay',
      'phone',
      'whatsapp',
      'email',
      'addressLines[]',
      'hours',
      'hoursNote',
      'areas',
      'pitch',
      'social[]',
    ],
    currentSource: 'src/lib/site.ts → siteSettings',
    consumedAs: 'SiteSettings',
  },
  {
    name: 'navigation',
    title: 'Navigation',
    singleton: true,
    fields: ['items[] { label, href }', 'headerCta { label, href }'],
    currentSource: 'src/lib/site.ts → navigation, headerCta',
    consumedAs: 'NavItem[]',
  },
  {
    name: 'footer',
    title: 'Footer',
    singleton: true,
    fields: ['pitch', 'badges[] { icon, label }', 'columns[] { heading, links[] }'],
    currentSource: 'src/lib/site.ts → footerColumns, footerBadges',
    consumedAs: 'FooterColumn[]',
  },
  {
    name: 'pageSeo',
    title: 'Page SEO',
    fields: ['route', 'title', 'description', 'shareImage'],
    currentSource: 'each page.tsx → pageMetadata()',
    consumedAs: 'PageSeoInput',
  },
  {
    name: 'solution',
    title: 'Solution',
    fields: ['name', 'blurb', 'icon', 'photo', 'tab (application | product)', 'order'],
    currentSource: 'src/content/solutions.ts → solutionTabs',
    consumedAs: 'SolutionItem',
  },
  {
    name: 'product',
    title: 'Product',
    fields: [
      'category (modules | flexible | inverters | optimizers)',
      'name',
      'description',
      'specs[4] { value, label }',
      'features[]',
      'applications[]',
      'datasheet (file)',
      'image',
      'flagship (bool)',
    ],
    currentSource: 'src/content/products.tsx → solarModules, flexibleApplications, …',
    consumedAs: 'ModuleProduct',
  },
  {
    name: 'project',
    title: 'Project / gallery item',
    fields: ['size', 'location', 'type', 'description', 'image', 'tileSpan (lg | wide | null)'],
    currentSource: 'src/content/home.ts → galleryProjects',
    consumedAs: 'GalleryProject',
  },
  {
    name: 'testimonial',
    title: 'Testimonial',
    fields: [
      'quote',
      'name',
      'role',
      'avatar',
      'metric { count, suffix, label }',
      'variant (feat | default)',
      'beforeAfter { beforeLabel, beforeWidth, afterLabel, afterWidth }',
      'video { thumbnail, label }',
    ],
    currentSource: 'src/content/home.ts → testimonials',
    consumedAs: 'Testimonial',
  },
  {
    name: 'faq',
    title: 'FAQ',
    fields: ['category', 'question', 'answer (portable text)', 'page (home | calculator | contact)'],
    currentSource: 'src/content/faqs.tsx, faqs-home.tsx, calculator.tsx',
    consumedAs: 'FaqItem',
  },
  {
    name: 'video',
    title: 'Video',
    fields: ['title', 'category', 'duration', 'thumbnail', 'source (file or URL)', 'featured'],
    currentSource: 'src/content/home.ts → featuredVideo, sideVideos',
    consumedAs: 'VideoItem',
  },
  {
    name: 'book',
    title: 'Book',
    singleton: true,
    fields: [
      'title',
      'subtitle',
      'chapters',
      'intro',
      'achievements[] { count, suffix, label }',
      'coverArt',
      'qr',
      'orderLink',
      'learnCards[]',
      'peekCards[]',
    ],
    currentSource: 'src/content/book.tsx',
    consumedAs: 'typeof book',
  },
  {
    name: 'milestone',
    title: 'Milestone',
    fields: ['year', 'event', 'order'],
    currentSource: 'src/content/home.ts → milestones',
    consumedAs: '{ year, event }',
  },
  {
    name: 'calculatorConfig',
    title: 'Calculator assumptions',
    singleton: true,
    fields: [
      'states[] { key, name, sunHours, tariff }',
      'costPerKw { res, com, ind }',
      'areaPerKw { res, com, ind }',
      'performanceRatio',
      'degradation',
      'tariffEscalation',
      'co2PerKwh',
      'sheet { unitsPerKwDay, ratePerUnit, costPerKw }',
    ],
    currentSource: 'src/lib/calculator.ts',
    consumedAs: 'CalculatorInput constants',
  },
];

/**
 * Leads are write-only and do NOT belong in the content model — they are
 * delivered by `POST /api/leads`. If the client wants them in Sanity, add a
 * `lead` document type and write to it from `deliverLead()` in the route
 * handler using a token with create-only permissions.
 */
export const WRITE_ONLY = ['lead'] as const;
