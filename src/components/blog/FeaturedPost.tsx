import Image from 'next/image';
import Link from 'next/link';
import type { DecoratedPost } from '@/lib/blog';
import { RichText } from './RichText';

/**
 * The large card at the top of /blogs.
 *
 * It always shows the most recently dated post (see `sortedPosts()` in
 * `src/lib/blog.ts`), so publishing a new article rotates it automatically —
 * no `featured` flag to maintain.
 */
export function FeaturedPost({ post }: { post: DecoratedPost }) {
  return (
    <Link href={post.href} className="bfeat rise">
      <div className="bfeat-img">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(max-width: 1000px) 100vw, 640px"
          priority
        />
        <span className="bfeat-flag">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 17.8 5.8 20.9l1.6-6.8L2.2 8.9l6.9-.6z" />
          </svg>
          Latest
        </span>
      </div>
      <div className="bfeat-body">
        <span className="bfeat-kicker">
          <i />
          {post.category}
        </span>
        <h2>{post.title}</h2>
        <p className="bfeat-excerpt">
          <RichText text={post.excerpt} />
        </p>
        <div className="bfeat-author">
          <span className="bfeat-badge">{post.initials}</span>
          <span className="who">
            <b>{post.author}</b>
            <span>
              {post.dateLabel} · {post.readingLabel}
            </span>
          </span>
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
