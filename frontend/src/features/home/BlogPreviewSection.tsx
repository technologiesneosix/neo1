import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useList } from '@/api/hooks';
import { api } from '@/api/services';
import { WaveDivider } from '@/components/common/WaveDivider';
import { Card } from '@/components/ui/Card';
import { staggerContainer, staggerItem } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PageLoader } from '@/components/ui/Spinner';
import { formatDate } from '@/lib/utils';

/** Mist band with the three latest blog posts in centered reference-style cards. */
export function BlogPreviewSection() {
  const { data: posts, isLoading } = useList(api.blogPosts);
  const { data: authors } = useList(api.authors);

  if (isLoading) {
    return (
      <section className="section-pad bg-mist-100">
        <PageLoader />
      </section>
    );
  }

  const latest = (posts ?? [])
    .filter((post) => post.status === 'published')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);
  if (latest.length === 0) return null;

  return (
    <section aria-label="Latest from our blog">
      <WaveDivider fill="#f1f3f7" className="bg-white" />
      <div className="bg-mist-100">
        <div className="container-site section-pad">
          <SectionHeading
            label="OUR BLOG"
            title="What Is Happening"
            lead="Engineering notes, product thinking and lessons from the delivery trenches — written by the people doing the work."
          />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid gap-8 md:grid-cols-3"
          >
            {latest.map((post) => {
              const authorName =
                authors?.find((author) => author.id === post.authorId)?.name ?? 'Neosix Team';
              return (
                <motion.article key={post.id} variants={staggerItem} className="h-full">
                  <Card className="flex h-full flex-col items-center text-center">
                    <p className="text-[11px] uppercase tracking-[0.15em] text-neutral-400">
                      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                      <span className="mx-2" aria-hidden="true">
                        |
                      </span>
                      {post.commentsCount} Comments
                      <span className="mx-2" aria-hidden="true">
                        |
                      </span>
                      {authorName}
                    </p>
                    <h3 className="mt-4 text-lg leading-snug">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="transition-colors hover:text-primary-600"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-4 flex-1 font-serif text-base leading-7 text-neutral-500">
                      {post.excerpt}
                    </p>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-600 transition-colors hover:text-primary-700"
                    >
                      Read More <span aria-hidden="true">+</span>
                    </Link>
                  </Card>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </div>
      <WaveDivider fill="#ffffff" className="bg-mist-100" />
    </section>
  );
}
