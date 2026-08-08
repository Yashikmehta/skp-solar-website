import type { IconName } from '@/components/ui/Icon';
import type { ValueCard } from './home';

/** Content for `/why-skp`. Shapes mirror the CMS model in HANDOFF.md §5. */

export interface FeatureCard {
  icon: IconName;
  title: string;
  body: string;
}

/** `.leg-cards` — the Pabla Bearings heritage grid. */
export const legacyCards: FeatureCard[] = [
  {
    icon: 'factory',
    title: 'Industrial Heritage',
    body: 'Three decades of running real factory floors, not just selling to them.',
  },
  {
    icon: 'emblemGear',
    title: 'Engineering Excellence',
    body: 'Systems designed and checked by engineers who live with the results.',
  },
  {
    icon: 'target',
    title: 'Precision Manufacturing',
    body: 'Tolerances measured in microns — the same discipline on every roof.',
  },
  {
    icon: 'shield',
    title: 'Quality & Reliability',
    body: 'Built to specification, tested before handover, backed for the long run.',
  },
  {
    icon: 'emblemMedal',
    title: 'Trusted Industrial Legacy',
    body: 'A name industries across Punjab have relied on for a generation.',
  },
  {
    icon: 'users',
    title: 'Long-Term Relationships',
    body: 'Customers who came for a product and stayed for decades of service.',
  },
];

/** `.why-grid` on this page — the "More Than a Solar Installer" set. */
export const whySkpCards: ValueCard[] = [
  {
    num: '01',
    icon: 'emblemGear',
    title: 'Engineering-First Approach',
    body: 'Every project starts with load analysis and structural checks — not a sales quota. Decisions are made by engineers, on data.',
    tag: 'Designed on data',
    featured: true,
  },
  {
    num: '02',
    icon: 'equalizer',
    title: 'Customized Solar Solutions',
    body: 'Sized to your actual load curve, roof structure and usage pattern — never a one-size template pulled off a shelf.',
    tag: 'Sized to your site',
  },
  {
    num: '03',
    icon: 'layers3',
    title: 'Premium Components',
    body: 'Waaree Tier-1 modules, reputable inverters and mounting rated for heat, dust and wind. No grey-market hardware, ever.',
    tag: 'Tier-1 only',
  },
  {
    num: '04',
    icon: 'emblemMedal',
    title: 'Certified Installation',
    body: 'Trained, certified crews following documented procedures — structural, electrical and safety standards on every job.',
    tag: 'Documented standards',
  },
  {
    num: '05',
    icon: 'emblemScales',
    title: 'Transparent Pricing',
    body: 'One fixed, itemised quote after your site survey. What we quote is what you pay — no hidden “extras” later.',
    tag: 'Fixed itemised quotes',
  },
  {
    num: '06',
    icon: 'emblemLifecycle',
    title: 'Lifetime Support',
    body: 'Monitoring, cleaning schedules and performance reviews for the full 25 years — we own the output, not just the install date.',
    tag: '25-year care plan',
  },
];

/** `.war-cards` — the Waaree partnership grid. */
export const waareeCards: FeatureCard[] = [
  {
    icon: 'bolt',
    title: 'High Efficiency Modules',
    body: 'More generation from every square foot of roof you have.',
  },
  {
    icon: 'factory',
    title: 'Advanced Manufacturing',
    body: 'Produced in India’s largest solar module facilities.',
  },
  {
    icon: 'sun',
    title: 'Excellent Energy Output',
    body: 'Consistent performance validated by real generation data.',
  },
  {
    icon: 'shield',
    title: 'Long-Term Reliability',
    body: 'Engineered to keep producing decades after installation.',
  },
  {
    icon: 'document',
    title: 'Comprehensive Warranty',
    body: '25–30 year performance warranty, honoured through the factory.',
  },
  {
    icon: 'climate',
    title: 'Designed for Indian Climate',
    body: 'Rated for the heat, dust and monsoons your roof actually faces.',
  },
];

/** `.proc-steps` — the eight-stage delivery timeline. */
export interface ProcessStep {
  step: string;
  icon: IconName;
  title: string;
  body: string;
}

export const processSteps: ProcessStep[] = [
  {
    step: 'Step 01',
    icon: 'clipboardCheck',
    title: 'Free Site Survey',
    body: 'Engineers visit your site to assess roof, structure and shading.',
  },
  {
    step: 'Step 02',
    icon: 'bolt',
    title: 'Energy Assessment',
    body: 'We study your bills and load curve to understand real usage.',
  },
  {
    step: 'Step 03',
    icon: 'blueprint',
    title: 'Custom Solar Design',
    body: 'A system engineered for your site — layout, structure and wiring.',
  },
  {
    step: 'Step 04',
    icon: 'chartUp',
    title: 'ROI Proposal',
    body: 'Conservative savings, payback and returns — assumptions shown.',
  },
  {
    step: 'Step 05',
    icon: 'wrench',
    title: 'Professional Installation',
    body: 'Certified crews install to documented structural and electrical standards.',
  },
  {
    step: 'Step 06',
    icon: 'shield',
    title: 'Testing & Commissioning',
    body: 'Every string, inverter and connection verified before handover.',
  },
  {
    step: 'Step 07',
    icon: 'meter',
    title: 'Net Metering Assistance',
    body: 'We handle the paperwork and approvals with your DISCOM.',
  },
  {
    step: 'Step 08',
    icon: 'pulse',
    title: 'Monitoring & After-Sales Support',
    body: 'Remote monitoring, scheduled cleaning and performance reviews for 25 years.',
  },
];

/** `.stats` — the trust bar. */
export const trustStats = [
  { icon: 'statRoof' as IconName, count: 140, suffix: '+', label: 'Projects commissioned' },
  {
    icon: 'statPanel' as IconName,
    count: 500,
    suffix: ' kW',
    label: 'On our own factory roof first',
  },
  {
    icon: 'statLayers' as IconName,
    count: 30,
    suffix: '+',
    label: 'Years of manufacturing experience',
  },
  {
    icon: 'star' as IconName,
    count: 4.9,
    decimals: 1,
    suffix: '★',
    label: 'Average customer rating',
  },
];

/** `.ind-grid` — industries served. */
export const industries: { icon: IconName; label: string }[] = [
  { icon: 'factory', label: 'Manufacturing' },
  { icon: 'textiles', label: 'Textiles' },
  { icon: 'drop', label: 'Agro & Food' },
  { icon: 'cap', label: 'Education' },
  { icon: 'healthcare', label: 'Healthcare' },
  { icon: 'building', label: 'Retail & Warehousing' },
];

/** `.gal-strip` — recent projects. */
export const recentProjects = [
  {
    size: '500 kW',
    location: 'Ludhiana, Punjab',
    type: 'Industrial',
    typeIcon: 'factory' as IconName,
    image: '/assets/industrial.jpg',
    alt: 'Industrial rooftop solar',
  },
  {
    size: '120 kW',
    location: 'Amritsar',
    type: 'Commercial',
    typeIcon: 'building' as IconName,
    image: '/assets/commercial.jpg',
    alt: 'Commercial rooftop solar',
  },
  {
    size: '60 kW',
    location: 'Patiala',
    type: 'Institutional',
    typeIcon: 'cap' as IconName,
    image: '/assets/schools.jpg',
    alt: 'Institutional rooftop solar',
  },
];

/** `.certs` — certification chips. */
export const certifications = [
  'Authorised Waaree distributor',
  'ALMM-listed Tier-1 modules',
  'MNRE-compliant installations',
  'In-house certified engineers',
];
