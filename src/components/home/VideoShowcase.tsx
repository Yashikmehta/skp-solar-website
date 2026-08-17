'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { AmbientOrb } from '@/components/ui/AmbientOrb';
import { Icon } from '@/components/ui/Icon';
import { Hl, SectionHeading } from '@/components/ui/SectionHeading';
import { featuredVideo, type VideoItem } from '@/content/home';

/**
 * `.vid` — the video showcase and its lightbox.
 *
 * Featured (and any item with `src`) plays a real `<video>` in the modal.
 * Side video cards are hidden for now — data remains in `sideVideos` in home.ts.
 */
export function VideoShowcase() {
  const [active, setActive] = useState<VideoItem | null>(null);

  /* Escape closes the lightbox; scroll locks while it is open. */
  useEffect(() => {
    if (!active) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActive(null);
    };
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [active]);

  return (
    <section className="vid" id="videos">
      <AmbientOrb
        tone="gold"
        parallax={-0.05}
        style={{ width: 340, height: 340, top: 30, right: -80 }}
      />
      <div className="wrap">
        <SectionHeading
          center
          className="reveal"
          kicker="Video Showcase"
          title={
            <>
              See SKP Solar <Hl>in Action</Hl>
            </>
          }
          body="Real installations. Real customers. Real energy savings."
        />

        <div className="vid-grid vid-grid-solo">
          <button
            type="button"
            className="vid-feat reveal-x"
            onClick={() => setActive(featuredVideo)}
            aria-label={`Play: ${featuredVideo.title}`}
          >
            <div className="vid-thumb">
              <Image
                src={featuredVideo.thumbnail}
                alt={featuredVideo.alt}
                fill
                sizes="(max-width: 900px) 100vw, 70vw"
              />
            </div>
            <div className="vid-grad" />
            <span className="vid-chip">
              <Icon name="play" /> Featured
            </span>
            <span className="vid-dur">{featuredVideo.duration}</span>
            <span className="vid-playbtn">
              <Icon name="play" />
            </span>
            <div className="vid-meta">
              <div className="vid-cat">{featuredVideo.category}</div>
              <div className="vid-title">{featuredVideo.title}</div>
            </div>
          </button>
        </div>
      </div>

      <div
        className={`vmodal${active ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!active}
        aria-label={active?.title}
      >
        <div className="vmodal-bg" onClick={() => setActive(null)} />
        <div className="vmodal-box">
          <button
            type="button"
            className="vmodal-close"
            aria-label="Close"
            onClick={() => setActive(null)}
          >
            <Icon name="close" />
          </button>
          <div className="vmodal-frame">
            {active?.src ? (
              <video
                key={active.src}
                className="vmodal-video"
                src={active.src}
                poster={active.thumbnail}
                controls
                autoPlay
                playsInline
              />
            ) : active ? (
              <>
                <Image src={active.thumbnail} alt={active.alt} fill sizes="90vw" />
                <div className="vid-grad" />
                <span className="vid-playbtn">
                  <Icon name="play" />
                </span>
                <div className="vmodal-note">
                  <div className="vid-title">{active.title}</div>
                  <p>{active.category}</p>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
