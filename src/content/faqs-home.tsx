import type { FaqItem } from '@/components/sections/Faq';

/** Homepage FAQ set (HANDOFF.md §5 — FAQs are scoped per page). */
export const homeFaqs: FaqItem[] = [
  {
    category: 'Cost',
    question: 'How much does a rooftop solar system cost?',
    answer: (
      <>
        Pricing depends on system size and site, but most <b>residential</b> systems land between
        ₹55,000–₹65,000 per kW installed, and commercial or industrial plants come down further
        with scale. After your site survey you get a fixed, itemised quote — no hidden “extras”
        later.
      </>
    ),
    plainAnswer:
      'Pricing depends on system size and site, but most residential systems land between ₹55,000–₹65,000 per kW installed, and commercial or industrial plants come down further with scale. After your site survey you get a fixed, itemised quote — no hidden extras later.',
  },
  {
    category: 'ROI',
    question: 'What kind of return can I expect?',
    answer: (
      <>
        Most clients see payback in <b>3.5–5 years</b>, then 20+ years of near-free power. The
        calculator above models this on deliberately conservative assumptions, so your real return
        should beat the estimate, not miss it.
      </>
    ),
    plainAnswer:
      'Most clients see payback in 3.5–5 years, then 20+ years of near-free power. The calculator models this on deliberately conservative assumptions, so your real return should beat the estimate, not miss it.',
  },
  {
    category: 'Timeline',
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
    category: 'Subsidy',
    question: 'Is there a government subsidy?',
    answer: (
      <>
        Residential rooftop systems qualify for central <b>PM Surya Ghar</b> subsidies, and we
        manage the full application on your behalf. Commercial and industrial sites instead benefit
        from accelerated depreciation — we’ll show which path saves you more.
      </>
    ),
    plainAnswer:
      'Residential rooftop systems qualify for central PM Surya Ghar subsidies, and we manage the full application on your behalf. Commercial and industrial sites instead benefit from accelerated depreciation — we will show which path saves you more.',
  },
  {
    category: 'Maintenance',
    question: 'How much maintenance does solar need?',
    answer: (
      <>
        Very little — periodic cleaning and an annual health check. We schedule cleaning before
        monsoon and run <b>remote monitoring</b>, so you’re never the one watching the numbers.
      </>
    ),
    plainAnswer:
      'Very little — periodic cleaning and an annual health check. We schedule cleaning before monsoon and run remote monitoring, so you are never the one watching the numbers.',
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
      'Tier-1 panels carry 25–30 year performance warranties and 10–12 years on product; inverters typically 5–10 years. As an authorised Waaree distributor, those warranties are honoured through the factory, not a middleman.',
  },
  {
    category: 'Savings',
    question: 'How much will I actually save?',
    answer: (
      <>
        Most clients cut <b>50–90%</b> off their grid bill depending on roof size and usage
        pattern. We size the system to your real load curve, not a best-case spreadsheet, so the
        savings hold up month after month.
      </>
    ),
    plainAnswer:
      'Most clients cut 50–90% off their grid bill depending on roof size and usage pattern. We size the system to your real load curve, not a best-case spreadsheet, so the savings hold up month after month.',
  },
  {
    category: 'Financing',
    question: 'Can the system be financed?',
    answer: (
      <>
        Yes. We work with solar loan partners offering tenures up to <b>5–7 years</b>, often
        structured so your monthly EMI is close to the bill you’re already paying — then the asset
        is fully yours.
      </>
    ),
    plainAnswer:
      'Yes. We work with solar loan partners offering tenures up to 5–7 years, often structured so your monthly EMI is close to the bill you are already paying — then the asset is fully yours.',
  },
  {
    category: 'Commercial',
    question: 'Do you handle large commercial & industrial projects?',
    answer: (
      <>
        That’s our origin. We powered our own <b>500 kW</b> factory roof first, and now engineer
        commercial and industrial plants across Punjab with structural design, net-metering and
        lifecycle service all in-house.
      </>
    ),
    plainAnswer:
      'That is our origin. We powered our own 500 kW factory roof first, and now engineer commercial and industrial plants across Punjab with structural design, net-metering and lifecycle service all in-house.',
  },
  {
    category: 'Residential',
    question: 'Is my home suitable for rooftop solar?',
    answer: (
      <>
        If you have a shade-free roof of roughly <b>100 sq ft per kW</b> and a grid connection,
        almost certainly. A quick survey confirms structure, shading and the ideal system size for
        your family’s usage.
      </>
    ),
    plainAnswer:
      'If you have a shade-free roof of roughly 100 sq ft per kW and a grid connection, almost certainly. A quick survey confirms structure, shading and the ideal system size for your family usage.',
  },
];
