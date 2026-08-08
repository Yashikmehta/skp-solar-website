import Image from 'next/image';
import { AmbientOrb } from '@/components/ui/AmbientOrb';
import { Icon } from '@/components/ui/Icon';
import { Hl, SectionHeading } from '@/components/ui/SectionHeading';
import { galleryProjects } from '@/content/home';

/**
 * `.gallery` — the installation gallery.
 *
 * Tile spans (`.gal-lg`, `.gal-wide`) come from the Projects collection, so
 * the masonry layout stays editable from the CMS (HANDOFF.md §5).
 */
export function Gallery() {
  return (
    <section className="gallery" id="gallery">
      <AmbientOrb
        tone="green"
        parallax={-0.05}
        style={{ width: 360, height: 360, top: 0, left: -90 }}
      />
      <AmbientOrb
        tone="gold"
        parallax={0.05}
        style={{ width: 320, height: 320, bottom: -40, right: -70 }}
      />
      <div className="wrap">
        <SectionHeading
          center
          className="reveal"
          kicker="Installation Gallery"
          title={
            <>
              Powering Homes, Businesses &amp; Industries
              <br />
              <Hl>Across North India</Hl>
            </>
          }
          body="Explore some of the solar projects delivered by SKP Solar across residential, commercial, industrial, educational and institutional sectors."
        />

        <div className="gal-grid">
          {galleryProjects.map((project) => (
            <div
              className={`gal-card${project.span ? ` gal-${project.span}` : ''} reveal ${
                project.delay
              }`}
              key={`${project.size}-${project.location}`}
            >
              <div className="gal-imgwrap">
                <Image
                  src={project.image}
                  alt={project.alt}
                  fill
                  sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw"
                />
              </div>
              <div className="gal-tint" />
              <span className="gal-type">
                <Icon name={project.typeIcon} /> {project.type}
              </span>
              <span className="gal-arrow">
                <Icon name="arrowUpRight" />
              </span>
              <div className="gal-info">
                <div className="gal-size">{project.size}</div>
                <div className="gal-loc">
                  <Icon name="pin" /> {project.location}
                </div>
                <div className="gal-desc">{project.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
