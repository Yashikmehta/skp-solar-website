import Image from 'next/image';
import { trustedLogos } from '@/content/home';

/**
 * Client logo strip — sits between Video Showcase and Founder on the homepage.
 */
export function TrustedBy() {
  return (
    <section className="trusted-by" aria-label="Trusted by">
      <div className="wrap">
        <div className="tst-logos reveal">
          <div className="cap">Trusted by businesses &amp; homes across North India</div>
          <div className="tst-logos-row">
            {trustedLogos.map((logo) => (
              <div className="tst-logo-img" key={logo.name}>
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={logo.width}
                  height={logo.height}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
