import type { Metadata } from 'next';
import '@/styles/pages/home.css';

import { RoiCalculator } from '@/components/calculator/RoiCalculator';
import { BookTeaser } from '@/components/home/BookTeaser';
import { FounderStory } from '@/components/home/FounderStory';
import { Gallery } from '@/components/home/Gallery';
import { HomeHero } from '@/components/home/HomeHero';
import { SolutionsSwitcher } from '@/components/home/SolutionsSwitcher';
import { Testimonials } from '@/components/home/Testimonials';
import { TrustedBy } from '@/components/home/TrustedBy';
import { VideoShowcase } from '@/components/home/VideoShowcase';
import { Faq } from '@/components/sections/Faq';
import { FinalCta } from '@/components/sections/FinalCta';
import { ValueCards } from '@/components/sections/ValueCards';
import { Hl } from '@/components/ui/SectionHeading';
import { homeFaqs } from '@/content/faqs-home';
import { valueCards } from '@/content/home';
import { faqJsonLd, pageMetadata } from '@/lib/seo';
import { ROUTES } from '@/lib/routes';
import { telHref, waHref } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'SKP Solar World — Industrial & Rooftop Solar in Punjab',
  description:
    'Engineering-led solar from a manufacturing family: 500 kW on our own factory roof, 30+ years of engineering, Waaree authorized distributor in Punjab.',
  path: ROUTES.home,
  image: '/assets/industrial.jpg',
});

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <SolutionsSwitcher />

      <ValueCards
        kicker="Why SKP Solar World"
        title={
          <>
            Trusted Hardware. Proven Engineering.
            <br />
            <Hl>Complete Accountability.</Hl>
          </>
        }
        body="We combine technical excellence, trusted hardware, and end-to-end accountability to maximize your solar investment."
        cards={valueCards}
      />

      <RoiCalculator />
      <VideoShowcase />
      <TrustedBy />
      <FounderStory />
      <BookTeaser />
      <Testimonials />
      <Gallery />

      <Faq
        items={homeFaqs}
        body="The honest answers we give every business owner and family before they ever sign."
        helpTitle="Still have questions?"
        helpBody="Talk to an SKP engineer — not a call centre. We’ll answer honestly, even if the answer is “solar isn’t right for you yet.”"
      />

      <FinalCta
        title={
          <>
            Ready to Start <Hl>Saving With Solar?</Hl>
          </>
        }
        subtitle="Get a personalized solar consultation and discover how much you can save with SKP Solar."
        actions={[
          { label: 'Call us now', href: telHref, variant: 'ghost', icon: 'phone' },
          { label: 'WhatsApp', href: waHref, variant: 'wa' },
        ]}
        trust={[
          'Authorised Waaree distributor',
          'In-house engineering team',
          'Honest, conservative estimates',
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            faqJsonLd(
              homeFaqs.map((item) => ({ question: item.question, answer: item.plainAnswer })),
            ),
          ),
        }}
      />
    </>
  );
}
