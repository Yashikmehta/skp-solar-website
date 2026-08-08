import type { FaqItem } from '@/components/sections/Faq';

/**
 * FAQ content.
 *
 * HANDOFF.md §5 models FAQs as a collection: category, question, answer, page.
 * They live here as typed data so the Sanity migration is a swap of the data
 * source, not a rewrite of the component.
 */

export const contactFaqs: FaqItem[] = [
  {
    category: 'Response',
    question: 'How soon will someone contact me?',
    answer: (
      <>
        Within <b>24 hours</b> on working days — and if you enquire before 4 PM, usually the
        same day. Your enquiry goes straight to our sales engineers, not a queue.
      </>
    ),
    plainAnswer:
      'Within 24 hours on working days — and if you enquire before 4 PM, usually the same day. Your enquiry goes straight to our sales engineers, not a queue.',
  },
  {
    category: 'Cost',
    question: 'Is the consultation free?',
    answer: (
      <>
        Yes — the consultation and your first <b>site survey are completely free</b>, with no
        obligation. You only pay if you decide to go ahead, against a fixed, itemised quote.
      </>
    ),
    plainAnswer:
      'Yes — the consultation and your first site survey are completely free, with no obligation. You only pay if you decide to go ahead, against a fixed, itemised quote.',
  },
  {
    category: 'Industrial',
    question: 'Do you provide industrial solutions?',
    answer: (
      <>
        That&apos;s our origin. We powered our own <b>500 kW factory roof</b> first, and now
        engineer industrial and commercial plants with structural design, net-metering and
        lifecycle service all in-house.
      </>
    ),
    plainAnswer:
      "That's our origin. We powered our own 500 kW factory roof first, and now engineer industrial and commercial plants with structural design, net-metering and lifecycle service all in-house.",
  },
  {
    category: 'Survey',
    question: 'Can you visit my site?',
    answer: (
      <>
        Absolutely. Our engineers visit your site to check <b>structure, shading and load</b>,
        then size the system to your real usage — that&apos;s how the quote stays fixed with no
        surprises later.
      </>
    ),
    plainAnswer:
      'Absolutely. Our engineers visit your site to check structure, shading and load, then size the system to your real usage — that is how the quote stays fixed with no surprises later.',
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
    category: 'Coverage',
    question: 'Which areas do you serve?',
    answer: (
      <>
        We&apos;re based in <b>Jalandhar</b> and serve homes and businesses across Punjab —
        Ludhiana, Amritsar, the Chandigarh region and beyond. For larger industrial projects, we
        travel across North India.
      </>
    ),
    plainAnswer:
      "We're based in Jalandhar and serve homes and businesses across Punjab — Ludhiana, Amritsar, the Chandigarh region and beyond. For larger industrial projects, we travel across North India.",
  },
  {
    category: 'Savings',
    question: 'Can I calculate my savings?',
    answer: (
      <>
        Yes — use the <b>solar savings calculator</b> on our homepage for a conservative estimate
        in under a minute. Your free site survey then confirms the numbers against your actual
        bill and roof.
      </>
    ),
    plainAnswer:
      'Yes — use the solar savings calculator on our homepage for a conservative estimate in under a minute. Your free site survey then confirms the numbers against your actual bill and roof.',
  },
];
