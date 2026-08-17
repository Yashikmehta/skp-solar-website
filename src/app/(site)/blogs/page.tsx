import type { Metadata } from 'next';
import '@/styles/pages/blog.css';

import { BlogGrid } from '@/components/blog/BlogGrid';
import { FeaturedPost } from '@/components/blog/FeaturedPost';
import { decorate, sortedPosts } from '@/lib/blog';
import { ROUTES } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Solar Blogs & Insights — Industrial, Commercial & Rooftop Solar',
  description:
    'Practical insights, industry knowledge and expert perspectives to help businesses, industries and homeowners make smarter solar and energy decisions.',
  path: ROUTES.blogs,
  image: '/assets/blog/geo-0005.png',
});

export default function BlogsPage() {
  const posts = sortedPosts().map(decorate);
  const [featured, ...rest] = posts;

  return (
    <div className="blog-page">
      <section className="bhero">
        <div className="wrap">
          <span className="bhero-kicker">
            <i />
            Blog Posts
          </span>
          <h1>
            Solar Insights That Help You <b>Make Better Energy Decisions</b>
          </h1>
          <p>
            Practical insights, industry knowledge and expert perspectives to help businesses,
            industries and homeowners make smarter solar and energy decisions.
          </p>
        </div>
      </section>

      {featured ? (
        <section className="bfeat-sec">
          <div className="wrap">
            <FeaturedPost post={featured} />
          </div>
        </section>
      ) : null}

      <BlogGrid posts={rest} perPage={9} />
    </div>
  );
}
