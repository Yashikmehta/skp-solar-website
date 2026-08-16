import type { Metadata } from 'next';
import '@/styles/pages/contact.css';

import { ContactCards } from '@/components/contact/ContactCards';
import { ContactHero } from '@/components/contact/ContactHero';
import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { Faq } from '@/components/sections/Faq';
import { FinalCta } from '@/components/sections/FinalCta';
import { AmbientOrb } from '@/components/ui/AmbientOrb';
import { Hl, SectionHeading } from '@/components/ui/SectionHeading';
import { contactFaqs } from '@/content/faqs';
import { faqJsonLd, pageMetadata } from '@/lib/seo';
import { ANCHORS, ROUTES } from '@/lib/routes';
import { telHref } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Contact SKP Solar World — Malerkotla, Punjab',
  description:
    'Talk to SKP Solar World about a rooftop or industrial solar plant: enquiry form, phone, WhatsApp and office details in Malerkotla, Punjab.',
  path: ROUTES.contact,
  image: '/assets/industrial.jpg',
});

export default function ContactPage() {
  return (
    <>
      <ContactHero />

      <section className="git" id="enquiry">
        <AmbientOrb
          tone="green"
          parallax={0.05}
          style={{ width: 340, height: 340, top: 40, right: -90 }}
        />
        <div className="wrap" style={{ position: 'relative', zIndex: 2 }}>
          <SectionHeading
            className="reveal"
            kicker="Get in Touch"
            title={
              <>
                Tell us about your project.
                <br />
                <Hl>We&apos;ll handle the rest.</Hl>
              </>
            }
            body="Share a few details and an SKP engineer will call you back with honest guidance — no pressure, no scripted pitch."
          />
          <div className="git-grid">
            <EnquiryForm source="Contact Page" />
            <ContactCards />
          </div>
        </div>
      </section>

      <Faq items={contactFaqs} />

      <FinalCta
        kicker="Start your solar journey"
        title={
          <>
            Ready to <Hl>Switch to Solar?</Hl>
          </>
        }
        subtitle="Our engineers will assess your property, estimate your savings, and recommend the right solar solution for your needs."
        actions={[
          {
            label: 'Book Free Site Survey',
            href: ANCHORS.enquiry,
            variant: 'gold',
            icon: 'arrowRight',
            circled: true,
          },
          {
            label: 'Calculate Solar Savings',
            href: ROUTES.calculator,
            variant: 'ghost',
            icon: 'calculator',
          },
          { label: 'Call Now', href: telHref, variant: 'ghost', icon: 'phone' },
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
              contactFaqs.map((item) => ({
                question: item.question,
                answer: item.plainAnswer,
              })),
            ),
          ),
        }}
      />
    </>
  );
}
