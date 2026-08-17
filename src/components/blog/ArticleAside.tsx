'use client';

import { useEffect, useState } from 'react';
import type { TocEntry } from '@/lib/blog';

/**
 * Article sidebar: scroll-synced table of contents + share block.
 *
 * The TOC entries are computed on the server from the article's H2 blocks; the
 * only client work is highlighting the section currently in view (the same
 * 150px trigger line the approved design used) and the copy-link button.
 */
export function ArticleAside({
  toc,
  url,
  title,
  showToc = true,
}: {
  toc: TocEntry[];
  url: string;
  title: string;
  showToc?: boolean;
}) {
  const [activeId, setActiveId] = useState<string | null>(toc[0]?.id ?? null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!showToc || toc.length === 0) return;

    const onScroll = () => {
      const headings = Array.from(document.querySelectorAll<HTMLElement>('[data-toc-heading]'));
      let current = headings.length ? headings[0].id : null;
      headings.forEach((heading) => {
        if (heading.getBoundingClientRect().top <= 150) current = heading.id;
      });
      setActiveId((previous) => (previous === current ? previous : current));
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [showToc, toc.length]);

  const shareText = encodeURIComponent(`${title} — ${url}`);
  const share = {
    whatsapp: `https://wa.me/?text=${shareText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${shareText}`,
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard blocked — the visible URL below is the fallback */
    }
  };

  return (
    <aside className="art-side">
      {showToc && toc.length > 0 ? (
        <nav className="art-panel toc" aria-label="Table of contents">
          <h4>Table of Contents</h4>
          <div className="art-toc-list">
            {toc.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={item.id === activeId ? 'true' : undefined}
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      ) : null}

      <div className="art-panel">
        <h4>Share Article</h4>
        <div className="art-share">
          <a
            href={share.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on WhatsApp"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2a10 10 0 00-8.5 15.3L2 22l4.8-1.5A10 10 0 1012 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2s-1.2.2-3.6-.9-3.8-3.6-3.9-3.8-1-1.3-1-2.5.6-1.8.9-2 .5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.5c-.2.2-.3.3-.1.6s.7 1.1 1.4 1.7c1 .8 1.7 1.1 2 1.2s.4 0 .6-.2l.7-.8c.2-.2.3-.2.6-.1l1.9.9c.3.1.4.2.5.3s0 .6-.2 1.2z" />
            </svg>
          </a>
          <a
            href={share.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on LinkedIn"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.5c0-1.38-.5-2.32-1.73-2.32-1.05 0-1.67.7-1.94 1.38-.1.24-.13.58-.13.92V21H9z" />
            </svg>
          </a>
          <a href={share.twitter} target="_blank" rel="noopener noreferrer" aria-label="Share on X">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18.2 2H21l-6.3 7.2L22 22h-6.3l-4.4-6.4L5.6 22H2.8l6.7-7.7L2 2h6.4l4.1 6 5.7-6zm-1 18h1.6L7.6 3.7H5.9z" />
            </svg>
          </a>
          <button type="button" className="stroke" onClick={copyLink} aria-label="Copy link">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M10 13a5 5 0 007 0l2-2a5 5 0 00-7-7l-1 1" />
              <path d="M14 11a5 5 0 00-7 0l-2 2a5 5 0 007 7l1-1" />
            </svg>
          </button>
        </div>
        <p className="art-share-note">
          {copied ? 'Link copied to clipboard' : url.replace(/^https?:\/\/[^/]+/, '')}
        </p>
      </div>
    </aside>
  );
}
