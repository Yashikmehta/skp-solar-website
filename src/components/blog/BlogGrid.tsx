'use client';

import { useState } from 'react';
import type { DecoratedPost } from '@/lib/blog';
import { BlogCard } from './BlogCard';

/**
 * "Latest Solar Insights" — the paged grid.
 *
 * Client-side only for the Load More button; the posts themselves are rendered
 * from data passed by the server component, so the first paint is complete
 * markup (good for SEO, same as the approved design's first screen).
 */
export function BlogGrid({ posts, perPage = 9 }: { posts: DecoratedPost[]; perPage?: number }) {
  const [limit, setLimit] = useState(perPage);
  const visible = posts.slice(0, limit);
  const hasMore = posts.length > visible.length;

  return (
    <section className="blist" id="latest">
      <div className="wrap">
        <div className="blist-head">
          <span className="blist-kicker">
            <i />
            SKP Solar World · Insights
          </span>
          <h2>Latest Solar Insights</h2>
        </div>

        <div className="bgrid">
          {visible.map((post, index) => (
            <BlogCard key={post.slug} post={post} priority={index < 3} />
          ))}
        </div>

        <div className="bmore">
          {hasMore ? (
            <button type="button" className="bmore-btn" onClick={() => setLimit((n) => n + perPage)}>
              <span className="circ">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 5v13M6 13l6 6 6-6" />
                </svg>
              </span>
              Load More Articles
            </button>
          ) : null}
          <p className="bmore-count">
            {posts.length === 0
              ? 'No articles published yet.'
              : `Showing ${visible.length} of ${posts.length} insights`}
          </p>
        </div>
      </div>
    </section>
  );
}
