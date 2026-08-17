/**
 * Blog domain helpers — the only place blog ordering, related-post selection,
 * date formatting and the table of contents are decided.
 *
 * Mirrors the logic the approved design shipped with (`SKP-Blogs.dc.html` and
 * `SKP-Blog-Article.dc.html`), so the live pages behave exactly like the
 * signed-off design:
 *   · posts are always sorted newest first by `date`
 *   · the Featured card is the most recently dated post, so it rotates by
 *     itself whenever a newer article is added
 *   · related articles prefer the same category, then fall back to the rest
 */
import { blogPosts } from '@/content/blog-posts';

export interface BlogListItem {
  lead?: string;
  text: string;
}

export type BlogBlock =
  | { t: 'h2'; text: string; id: string }
  | { t: 'h3'; text: string }
  | { t: 'p'; text: string; lead?: string }
  | { t: 'ul'; items: BlogListItem[] }
  | { t: 'table'; rows: string[][] }
  | { t: 'sources'; items: BlogListItem[] };

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  /** ISO date, `YYYY-MM-DD` */
  date: string;
  readingTime: number;
  /** Cover + card thumbnail, relative to /public */
  image: string;
  featured?: boolean;
  intro: string;
  quickAnswer: string;
  blocks: BlogBlock[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface DecoratedPost extends BlogPost {
  href: string;
  dateLabel: string;
  readingLabel: string;
  initials: string;
}

/** `/blogs/<slug>` — never build a blog href by hand. */
export function blogHref(slug: string): string {
  return `/blogs/${slug}`;
}

/** `20 July 2026` — the format the approved design uses on cards and bylines. */
export function formatBlogDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function initialsFor(author: string): string {
  if (/skp/i.test(author)) return 'SKP';
  return author
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase();
}

export function decorate(post: BlogPost): DecoratedPost {
  return {
    ...post,
    href: blogHref(post.slug),
    dateLabel: formatBlogDate(post.date),
    readingLabel: `${post.readingTime} min read`,
    initials: initialsFor(post.author || ''),
  };
}

/** Newest first. */
export function sortedPosts(): BlogPost[] {
  return [...blogPosts].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

/** Same category first, then the newest of everything else. */
export function relatedPosts(current: BlogPost, count = 3): BlogPost[] {
  const rest = sortedPosts().filter((post) => post.slug !== current.slug);
  const sameCategory = rest.filter((post) => post.category === current.category);
  const others = rest.filter((post) => post.category !== current.category);
  return [...sameCategory, ...others].slice(0, count);
}

export interface TocEntry {
  id: string;
  label: string;
}

/** The sidebar table of contents is built from the body's H2 blocks. */
export function tocFromBlocks(blocks: BlogBlock[]): TocEntry[] {
  return blocks
    .filter((block): block is Extract<BlogBlock, { t: 'h2' }> => block.t === 'h2')
    .map((block) => ({ id: block.id, label: block.text }));
}

/**
 * Plain-text form of a copy string, with `**bold**` markers removed.
 *
 * Visible copy renders those markers as bold (see `RichText`), but meta
 * descriptions, Open Graph tags and JSON-LD must be plain — otherwise the
 * asterisks show up in Google results.
 */
export function plainText(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, '$1');
}
