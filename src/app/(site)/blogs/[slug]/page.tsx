import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import '@/styles/pages/blog.css';

import { ArticleAside } from '@/components/blog/ArticleAside';
import { ArticleBody } from '@/components/blog/ArticleBody';
import { BlogCard } from '@/components/blog/BlogCard';
import { blogPosts } from '@/content/blog-posts';
import {
  blogHref,
  decorate,
  getPost,
  plainText,
  relatedPosts,
  tocFromBlocks,
} from '@/lib/blog';
import { ANCHORS, ROUTES } from '@/lib/routes';
import { pageMetadata, SITE_URL } from '@/lib/seo';
import { siteSettings, telHref } from '@/lib/site';

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  /* Every `seoTitle` in the content already ends "| SKP Solar World", and the
     root layout's metadata template appends the site name again — which
     rendered as "… | SKP Solar World | SKP Solar World". Trim the suffix here
     so the template supplies it exactly once. */
  const suffix = ` | ${siteSettings.name}`;
  const rawTitle = post.seoTitle || post.title;
  const title = rawTitle.endsWith(suffix) ? rawTitle.slice(0, -suffix.length) : rawTitle;

  return {
    ...pageMetadata({
      title,
      description: plainText(post.seoDescription || post.excerpt),
      path: blogHref(post.slug),
      image: post.image,
    }),
    openGraph: {
      ...pageMetadata({
        title,
        description: plainText(post.seoDescription || post.excerpt),
        path: blogHref(post.slug),
        image: post.image,
      }).openGraph,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

/** Article structured data — helps the post qualify for rich results. */
function articleJsonLd(post: ReturnType<typeof decorate>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: plainText(post.seoDescription || post.excerpt),
    image: `${SITE_URL}${post.image}`,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: siteSettings.name,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/assets/skp-logo.png` },
    },
    mainEntityOfPage: `${SITE_URL}${blogHref(post.slug)}`,
    articleSection: post.category,
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const raw = getPost(slug);
  if (!raw) notFound();

  const post = decorate(raw);
  const toc = tocFromBlocks(post.blocks);
  const related = relatedPosts(raw).map(decorate);
  const url = `${SITE_URL}${post.href}`;

  return (
    <div className="blog-page">
      <article>
        <section className="art-hero">
          <div className="wrap">
            <nav className="art-crumb" aria-label="Breadcrumb">
              <Link href={ROUTES.home}>Home</Link>
              <span className="sep">/</span>
              <Link href={ROUTES.blogs}>Blogs</Link>
              <span className="sep">/</span>
              <span className="now">{post.title}</span>
            </nav>

            <div className="art-head">
              <span className="art-cat">{post.category}</span>
              <h1>{post.title}</h1>
              <div className="art-byline">
                <span className="art-badge">{post.initials}</span>
                <span className="who">
                  <b>By {post.author}</b>
                  <span>
                    {post.dateLabel} · {post.readingLabel}
                  </span>
                </span>
              </div>
            </div>

            <div className="art-heroimg">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 760px) 100vw, 1200px"
                priority
              />
            </div>
          </div>
        </section>

        <section className="art-body">
          <div className="wrap">
            <div className="art-grid">
              <div className="prose">
                <ArticleBody
                  intro={post.intro}
                  quickAnswer={post.quickAnswer}
                  blocks={post.blocks}
                />

                <div className="art-cta">
                  <div className="orb" />
                  <span className="kicker">
                    <i />
                    Next step
                  </span>
                  <h2>Ready to Explore Solar for Your Property?</h2>
                  <p>
                    Model your own numbers in two minutes, or have an SKP engineer walk your roof
                    and give you the conservative version.
                  </p>
                  <div className="art-cta-actions">
                    <Link href={ROUTES.calculator} className="art-cta-gold">
                      <span className="circ">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </span>
                      Calculate Solar Savings
                    </Link>
                    <Link href={ANCHORS.enquiry} className="art-cta-ghost">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <rect x="8" y="2" width="8" height="4" rx="1" />
                        <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
                        <path d="M9 13l2 2 4-4" />
                      </svg>
                      Book Free Site Survey
                    </Link>
                    <a href={telHref} className="art-cta-ghost">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.6A2 2 0 0 1 4.1 4h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 11.6a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
                      </svg>
                      Talk to a Solar Expert
                    </a>
                  </div>
                </div>
              </div>

              <ArticleAside toc={toc} url={url} title={post.title} />
            </div>
          </div>
        </section>

        {related.length > 0 ? (
          <section className="art-rel">
            <div className="wrap">
              <div className="art-rel-head">
                <span className="blist-kicker">
                  <i />
                  Keep reading
                </span>
                <h2>You May Also Like</h2>
              </div>
              <div className="art-rel-grid">
                {related.map((item) => (
                  <BlogCard key={item.slug} post={item} />
                ))}
              </div>
              <div className="art-rel-all">
                <Link href={ROUTES.blogs}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 6h16M4 12h16M4 18h10" />
                  </svg>
                  All Solar Insights
                </Link>
              </div>
            </div>
          </section>
        ) : null}
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(post)) }}
      />
    </div>
  );
}
