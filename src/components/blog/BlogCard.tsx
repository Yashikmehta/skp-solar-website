import Image from 'next/image';
import Link from 'next/link';
import type { DecoratedPost } from '@/lib/blog';
import { RichText } from './RichText';

/**
 * Insight card — used by the /blogs grid and by "You May Also Like" on an
 * article. Markup and classes come straight from the approved design.
 */
export function BlogCard({
  post,
  showExcerpt = true,
  priority = false,
}: {
  post: DecoratedPost;
  showExcerpt?: boolean;
  priority?: boolean;
}) {
  return (
    <Link href={post.href} className="bcard rise">
      <div className="bcard-img">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(max-width: 760px) 100vw, (max-width: 1000px) 50vw, 400px"
          priority={priority}
        />
        <span className="bcard-cat">{post.category}</span>
      </div>
      <div className="bcard-body">
        <h3 className="bcard-title">{post.title}</h3>
        {showExcerpt ? <p className="bcard-excerpt">
            <RichText text={post.excerpt} />
          </p> : null}
        <div className="bcard-meta">
          <span>{post.dateLabel}</span>
          <span className="dot">·</span>
          <span>{post.author}</span>
          <span className="dot">·</span>
          <span>{post.readingLabel}</span>
        </div>
        <span className="bcard-cta">
          Read Article
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
