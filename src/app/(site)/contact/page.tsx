import type { Metadata } from 'next';
import '@/styles/pages/contact.css';

import { ContactCards } from '@/components/contact/ContactCards';
import { ContactHero } from '@/components/contact/ContactHero';
import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { Faq } from '@/components/sections/Faq';
import { AmbientOrb } from '@/components/ui/AmbientOrb';
import { Hl, SectionHeading } from '@/components/ui/SectionHeading';
import { contactFaqs } from '@/content/faqs';
import { faqJsonLd, pageMetadata } from '@/lib/seo';
import { ROUTES } from '@/lib/routes';

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
