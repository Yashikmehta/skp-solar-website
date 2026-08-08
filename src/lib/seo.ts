import type { Metadata } from 'next';
import { siteSettings } from './site';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://www.skpsolarworld.com';

interface PageSeoInput {
  title: string;
  description: string;
  path: string;
  /** Share image relative to /public, e.g. `/assets/industrial.jpg` */
  image?: string;
}

/**
 * Per-page SEO (HANDOFF.md §5: title, meta description, share image).
 * Titles below are carried over verbatim from each `.dc.html` `<helmet>`.
 */
export function pageMetadata({
  title,
  description,
  path,
  image = '/assets/industrial.jpg',
}: PageSeoInput): Metadata {
  const url = `${SITE_URL}${path === '/' ? '' : path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: siteSettings.name,
      locale: 'en_IN',
      type: 'website',
      images: [{ url: `${SITE_URL}${image}`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}${image}`],
    },
  };
}

/** LocalBusiness structured data, rendered once in the root layout. */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#organization`,
    name: siteSettings.name,
    legalName: siteSettings.legalName,
    description: siteSettings.pitch,
    url: SITE_URL,
    telephone: siteSettings.phone,
    email: siteSettings.email,
    image: `${SITE_URL}/assets/skp-logo.png`,
    logo: `${SITE_URL}/assets/skp-logo.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteSettings.addressLines[0].replace(/,$/, ''),
      addressLocality: siteSettings.locality,
      addressRegion: siteSettings.region,
      postalCode: siteSettings.postalCode,
      addressCountry: siteSettings.country,
    },
    openingHours: 'Mo-Sa 09:00-18:30',
    areaServed: siteSettings.areasShort.split(' · ').map((name) => ({
      '@type': 'City',
      name,
    })),
  };
}

/** FAQPage structured data for pages that carry the FAQ accordion. */
export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}
