import type { ReactNode } from 'react';
import type { FaqItem } from '@/components/sections/Faq';

const svg = (children: ReactNode) => <svg viewBox="0 0 24 24">{children}</svg>;

/** `.whyc-card` — why use the calculator. */
export const whyCalculatorCards = [
  {
    num: '01',
    glyph: svg(<path d="M13 2L3 14h7l-1 8 10-12h-7z" />),
    title: 'Instant Savings Estimate',
    body: 'Get your projected monthly, annual and 25-year savings in seconds — no waiting for a callback or a quote.',
  },
  {
    num: '02',
    glyph: svg(
      <>
        <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
        <circle cx="12" cy="12" r="3.4" />
      </>,
    ),
    title: 'No Cost, No Obligation',
    body: 'The calculator and your personalized report are completely free. No hidden fees, no pushy sales calls.',
  },
  {
    num: '03',
    glyph: svg(
      <>
        <path d="M9 3H5a2 2 0 0 0-2 2v4M15 3h4a2 2 0 0 1 2 2v4M9 21H5a2 2 0 0 1-2-2v-4M15 21h4a2 2 0 0 0 2-2v-4" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </>,
    ),
    title: 'Engineer-Based Calculations',
    body: 'Sizing, generation and payback follow the exact formulas our engineers apply on site — realistic, not best-case.',
  },
  {
    num: '04',
    glyph: svg(
      <>
        <path d="M3 11l9-8 9 8" />
        <path d="M5 10v10h5v-6h4v6h5V10" />
        <path d="M12 14v0" />
      </>,
    ),
    title: 'Personalized Recommendation',
    body: 'See the ideal system size for your roof, sector and bill — matched to your usage, not a generic template.',
  },
];

/** `.how-step` — the five-step explainer. */
export const howItWorks = [
  {
    glyph: svg(
      <>
        <path d="M9 3H5a2 2 0 0 0-2 2v4M15 3h4a2 2 0 0 1 2 2v4M9 21H5a2 2 0 0 1-2-2v-4M15 21h4a2 2 0 0 0 2-2v-4" />
        <path d="M8 9h8M8 13h8M8 17h5" />
      </>,
    ),
    title: 'Enter Details',
    body: 'Share your monthly bill, sector and contact — under a minute.',
  },
  {
    glyph: svg(
      <>
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <path d="M9 9h.01M15 9h.01M8 15c1 1.3 2.5 2 4 2s3-.7 4-2" />
      </>,
    ),
    title: 'Consumption Estimation',
    body: 'We convert your bill into real energy usage using local tariffs.',
  },
  {
    glyph: svg(
      <>
        <path d="M3 3v18h18" />
        <path d="M7 14l4-4 3 3 5-6" />
      </>,
    ),
    title: 'ROI Calculated',
    body: 'Engineer-grade formulas size your plant, savings and payback.',
  },
  {
    glyph: svg(
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M9 15l2 2 4-4" />
      </>,
    ),
    title: 'Receive Instant Report',
    body: 'A personalized, animated savings report appears on screen.',
  },
  {
    glyph: svg(
      <>
        <path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z" />
        <circle cx="12" cy="9" r="2.4" />
      </>,
    ),
    title: 'Book Site Survey',
    body: 'Ready to proceed? Book a free visit to confirm your numbers.',
  },
];

/** `.trust-card` — why customers trust SKP. */
export const calculatorTrustCards = [
  {
    glyph: svg(
      <>
        <path d="M9 3H5a2 2 0 0 0-2 2v4M15 3h4a2 2 0 0 1 2 2v4M9 21H5a2 2 0 0 1-2-2v-4M15 21h4a2 2 0 0 0 2-2v-4" />
        <path d="M12 8v8M8 12h8" />
      </>,
    ),
    title: 'Engineering Expertise',
    body: 'In-house engineers design, structurally check and commission every system — no subcontracted guesswork.',
  },
  {
    glyph: svg(
      <>
        <path d="M12 2l2.3 1.7 2.9.1 1 2.7 2.3 1.7-.9 2.8.9 2.8-2.3 1.7-1 2.7-2.9.1L12 22l-2.3-1.7-2.9-.1-1-2.7-2.3-1.7.9-2.8-.9-2.8 2.3-1.7 1-2.7 2.9-.1z" />
        <path d="M8.7 12l2.2 2.2 4.4-4.4" />
      </>,
    ),
    title: 'Premium Brands',
    body: 'Authorized Waaree distributor with Tier-1 modules and reputable inverters — genuine hardware, honoured warranties.',
  },
  {
    glyph: svg(
      <path d="M14.7 6.3a4 4 0 0 1 0 5.6l-6 6a2 2 0 0 1-2.8 0l-.8-.8a2 2 0 0 1 0-2.8l6-6a4 4 0 0 1 3.6-1zM17 3l4 4-2 2-4-4z" />,
    ),
    title: 'Professional Installation',
    body: "Clean, code-compliant workmanship rated for Punjab's heat, dust and wind — built to perform for decades.",
  },
  {
    glyph: svg(
      <>
        <path d="M12 3v18M7 21h10M5 7h14" />
        <path d="M5 7l-2.4 5a2.4 2.4 0 0 0 4.8 0zM19 7l-2.4 5a2.4 2.4 0 0 0 4.8 0z" />
      </>,
    ),
    title: 'Transparent Pricing',
    body: "Fixed, itemised quotes after your survey. Conservative estimates you'll beat, never inflated projections.",
  },
  {
    glyph: svg(
      <>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M8 9h8M8 13h5" />
      </>,
    ),
    title: 'After-Sales Support',
    body: 'Remote monitoring, pre-monsoon cleaning and annual health checks — we own the output, not just the install.',
  },
  {
    glyph: svg(
      <>
        <path d="M21 12a9 9 0 1 1-3-6.7" />
        <path d="M21 4v4h-4" />
        <path d="M12 8v4l2.6 1.5" />
      </>,
    ),
    title: '25+ Year Performance',
    body: 'Tier-1 panels carry 25–30 year performance warranties, backed through the factory for the full lifecycle.',
  },
];

/** Bar heights for the hero dashboard sparkline, from the approved page. */
export const dashboardBars = [38, 52, 44, 66, 58, 78, 70, 92, 84, 100, 88, 96];

export const calculatorFaqs: FaqItem[] = [
  {
    category: 'Savings',
    question: 'How much will I actually save with solar?',
    answer: (
      <>
        Most clients cut <b>50–90%</b> off their grid bill depending on roof size and usage. Our
        calculator sizes the system to your real bill using conservative engineering figures, so
        the savings hold up month after month.
      </>
    ),
    plainAnswer:
      'Most clients cut 50–90% off their grid bill depending on roof size and usage. Our calculator sizes the system to your real bill using conservative engineering figures, so the savings hold up month after month.',
  },
  {
    category: 'Subsidy',
    question: 'Is there a government subsidy available?',
    answer: (
      <>
        Residential rooftop systems qualify for central <b>PM Surya Ghar</b> subsidies, and we
        manage the full application for you. Commercial and industrial sites benefit from
        accelerated depreciation — we&apos;ll show which path saves you more.
      </>
    ),
    plainAnswer:
      'Residential rooftop systems qualify for central PM Surya Ghar subsidies, and we manage the full application for you. Commercial and industrial sites benefit from accelerated depreciation.',
  },
  {
    category: 'Installation',
    question: 'How long does installation take?',
    answer: (
      <>
        A typical home install is commissioned in <b>1–2 weeks</b> once approvals are in. Larger
        commercial and industrial plants run 4–8 weeks depending on structure and net-metering
        paperwork, which we handle for you.
      </>
    ),
    plainAnswer:
      'A typical home install is commissioned in 1–2 weeks once approvals are in. Larger commercial and industrial plants run 4–8 weeks depending on structure and net-metering paperwork, which we handle for you.',
  },
  {
    category: 'Payback',
    question: 'What payback period can I expect?',
    answer: (
      <>
        Most clients see payback in <b>2.5–5 years</b>, then 20+ years of near-free power. The
        report models this on conservative assumptions, so your real return should beat the
        estimate, not miss it.
      </>
    ),
    plainAnswer:
      'Most clients see payback in 2.5–5 years, then 20+ years of near-free power. The report models this on conservative assumptions, so your real return should beat the estimate, not miss it.',
  },
  {
    category: 'Maintenance',
    question: 'How much maintenance does solar need?',
    answer: (
      <>
        Very little — periodic cleaning and an annual health check. We schedule cleaning before
        monsoon and run <b>remote monitoring</b>, so you&apos;re never the one watching the numbers.
      </>
    ),
    plainAnswer:
      'Very little — periodic cleaning and an annual health check. We schedule cleaning before monsoon and run remote monitoring.',
  },
  {
    category: 'Warranty',
    question: 'What warranties come with the system?',
    answer: (
      <>
        Tier-1 panels carry <b>25–30 year</b> performance warranties and 10–12 years on product;
        inverters typically 5–10 years. As an authorised Waaree distributor, those warranties are
        honoured through the factory, not a middleman.
      </>
    ),
    plainAnswer:
      'Tier-1 panels carry 25–30 year performance warranties and 10–12 years on product; inverters typically 5–10 years. As an authorised Waaree distributor, those warranties are honoured through the factory.',
  },
];
