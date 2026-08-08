import { AmbientOrb } from '@/components/ui/AmbientOrb';
import { Hl, SectionHeading } from '@/components/ui/SectionHeading';
import { downloadArrow, downloads } from '@/content/products';

/**
 * `.pdl` — the downloads grid.
 *
 * HANDOFF.md §8 lists the real documents as still outstanding, so each card
 * renders without an `href` until `downloads[].href` is populated. Cards with
 * a file become real links automatically.
 */
export function Downloads() {
  return (
    <section className="pdl" id="downloads">
      <AmbientOrb
        tone="gold"
        parallax={0.04}
        style={{ width: 320, height: 320, bottom: -40, right: -70 }}
      />
      <div className="wrap">
        <SectionHeading
          center
          className="reveal"
          kicker="Downloads"
          title={
            <>
              Everything in writing, <Hl>ready to share</Hl>
            </>
          }
          body="Full technical documentation for every product — take it to your consultant, your bank or your board."
        />

        <div className="dl-grid">
          {downloads.map((item, index) => {
            const inner = (
              <>
                <span className="em">{item.glyph}</span>
                <h4>{item.title}</h4>
                <p>{item.body}</p>
                <span className="go">Download {downloadArrow}</span>
              </>
            );
            const className = `dl-card reveal dly${index + 1}`;

            return item.href ? (
              <a className={className} href={item.href} download key={item.title}>
                {inner}
              </a>
            ) : (
              <div className={className} key={item.title}>
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
