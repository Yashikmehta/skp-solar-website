import type { Metadata } from 'next';
import Image from 'next/image';
import '@/styles/pages/products.css';

import { ComparisonTable } from '@/components/products/ComparisonTable';
import { Downloads } from '@/components/products/Downloads';
import { ProductCatalogue } from '@/components/products/ProductCatalogue';
import { FinalCta } from '@/components/sections/FinalCta';
import { Hl } from '@/components/ui/SectionHeading';
import { ANCHORS, ROUTES } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Solar Products — Modules, Inverters & Optimizers',
  description:
    'Waaree solar modules, flexible modules, on-grid and hybrid inverters and power optimizers — specified, installed and serviced by SKP Solar World.',
  path: ROUTES.products,
  image: '/assets/product-hero-product.webp',
});

const HERO_CHIPS = [
  { value: <>Up to <em>730 W</em></>, label: 'Module power output' },
  { value: <em>23.5%</em>, label: 'Peak module efficiency' },
  { value: <>30-Year</>, label: 'Performance warranty' },
];

export default function ProductsPage() {
  return (
    <>
      <section className="phero">
        <div className="wrap">
          <div className="phero-grid">
            <div className="phero-copy">
              <span className="phero-kicker">
                <i /> SKP Solar World · Products
              </span>
              <h1>
                Solar Products Engineered for <b>Every Energy Requirement</b>
              </h1>
              <p className="sub">
                From high-efficiency solar modules to intelligent power electronics, SKP Solar
                World offers complete solar solutions for residential, commercial and industrial
                projects.
              </p>
            </div>

            <div className="phero-visual">
              <div className="phero-frame">
                <Image
                  src="/assets/product-hero-product.webp"
                  alt="SKP high-efficiency solar module"
                  fill
                  sizes="(max-width: 900px) 80vw, 340px"
                  style={{ objectFit: 'cover' }}
                  priority
                />
                <div className="grid-lines" />
              </div>
              {HERO_CHIPS.map((chip, index) => (
                <div className={`phero-chip c${index + 1}`} key={chip.label}>
                  <div className="v">{chip.value}</div>
                  <div className="k">{chip.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ProductCatalogue />
      <ComparisonTable />
      <Downloads />

      <FinalCta
        kicker="Start your solar journey"
        title={
          <>
            Ready to Power Your Future <Hl>with Solar?</Hl>
          </>
        }
        subtitle="Talk to our solar experts and receive a customized solar solution tailored to your energy requirements."
        actions={[
          {
            label: 'Get Free Consultation',
            href: ANCHORS.enquiry,
            variant: 'gold',
            icon: 'arrowRight',
            circled: true,
          },
          {
            label: 'Download Product Catalogue',
            href: '#downloads',
            variant: 'ghost',
            icon: 'document',
          },
        ]}
        trust={[
          'Authorised Waaree distributor',
          'In-house engineering team',
          '30-year factory-backed warranties',
        ]}
      />
    </>
  );
}
