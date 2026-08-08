import Image from 'next/image';
import { Cta } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { heroStats } from '@/content/home';
import { ANCHORS } from '@/lib/routes';

/**
 * `.hero` — homepage hero: headline + primary CTA beside the rotating globe,
 * with the four-up stat strip beneath.
 *
 * The handoff swept the "Explore More" CTA to `#solutions` (§6.2); that target
 * is kept here via `ANCHORS.solutions`.
 */
export function HomeHero() {
  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-copy">
            <h1>
              Powering <b>Lower Energy Costs</b>
            </h1>
            <p className="sub">
              Reducing electricity costs with solar solutions built on real-world experience.
            </p>
            <Cta href={ANCHORS.solutions}>Explore More</Cta>
          </div>

          <div className="globe-col">
            <div className="orbit-ring" />
            <div className="globe-wrap">
              <Image
                className="globe-img"
                src="/assets/hero-globe.png"
                alt="Solar globe"
                width={540}
                height={540}
                priority
              />
            </div>
          </div>
        </div>

        <div className="stats">
          {heroStats.map((stat) => (
            <div className="stat" key={stat.value + stat.label}>
              <div className="ic">
                <Icon name={stat.icon} fill="none" strokeWidth="1.6" />
              </div>
              <div>
                <div className="v">{stat.value}</div>
                <div className="k">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
