import { motion } from 'framer-motion';
import { CalendarDays, Clock, UserRound } from 'lucide-react';
import DOMPurify from 'dompurify';
import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useBySlug, useList } from '@/api/hooks';
import { api } from '@/api/services';
import { PageHero } from '@/components/common/PageHero';
import { Seo } from '@/components/common/Seo';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageLoader } from '@/components/ui/Spinner';
import { Reveal, staggerContainer, staggerItem } from '@/components/ui/Reveal';
import { formatDate, readingTime } from '@/lib/utils';

const proseClasses = [
  'text-[15px] leading-8 text-body',
  '[&_p]:mb-5',
  '[&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-heading',
  '[&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-heading',
  '[&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-6',
  '[&_li]:mb-2',
  '[&_a]:text-primary-600 [&_a]:underline',
  '[&_blockquote]:my-8 [&_blockquote]:border-l-4 [&_blockquote]:border-primary-500 [&_blockquote]:pl-6 [&_blockquote]:font-serif [&_blockquote]:text-lg [&_blockquote]:italic [&_blockquote]:leading-8 [&_blockquote]:text-neutral-600',
].join(' ');

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, isError } = useBySlug(api.blogPosts, slug);
  const { data: posts } = useList(api.blogPosts);
  const { data: categories } = useList(api.categories);
  const { data: authors } = useList(api.authors);

  const category = categories?.find((item) => item.id === post?.categoryId);
  const author = authors?.find((item) => item.id === post?.authorId);

  const related = useMemo(() => {
    if (!post || !posts) return [];
    const published = posts.filter(
      (item) => item.status === 'published' && item.id !== post.id,
    );
    const sameCategory = published.filter((item) => item.categoryId === post.categoryId);
    const latest = published
      .filter((item) => item.categoryId !== post.categoryId)
      .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
    return [...sameCategory, ...latest].slice(0, 3);
  }, [post, posts]);

  const sanitizedContent = useMemo(() => {
    if (!post) return '';
    // Admin-authored HTML is treated as untrusted input; sanitize on render.
    return DOMPurify.sanitize(post.content, { USE_PROFILES: { html: true } });
  }, [post]);

  if (isLoading) return <PageLoader className="min-h-[60vh]" />;

  if (isError || !post) {
    return (
      <section className="section-pad">
        <div className="container-site py-16 text-center">
          <h1 className="text-display-3">Article Not Found</h1>
          <p className="lead-serif mx-auto mt-4 max-w-md">
            The article you are looking for does not exist or may have been unpublished.
          </p>
          <div className="mt-8">
            <Button to="/blog">Back to Blog</Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <Seo
        type="article"
        meta={post.seo}
        title={post.seo.metaTitle}
        description={post.seo.metaDescription}
      />
      <PageHero
        label="OUR BLOG"
        title={post.title}
        crumbs={[{ label: 'Blog', path: '/blog' }, { label: post.title }]}
      />

      <article className="section-pad">
        <div className="container-site">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <img
                src={post.bannerUrl}
                alt={post.title}
                className="w-full rounded-md shadow-card"
              />
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs font-medium text-neutral-500">
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={15} className="text-primary-600" aria-hidden="true" />
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                </span>
                {category && (
                  <Link to={`/blog?category=${category.slug}`} aria-label={`More articles in ${category.name}`}>
                    <Badge tone="accent">{category.name}</Badge>
                  </Link>
                )}
                <span className="flex items-center gap-1.5">
                  <UserRound size={15} className="text-primary-600" aria-hidden="true" />
                  {author?.name ?? 'Neosix Team'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={15} className="text-primary-600" aria-hidden="true" />
                  {readingTime(post.content)} min read
                </span>
              </div>
            </Reveal>

            <Reveal className="mt-10">
              <div className={proseClasses} dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
            </Reveal>

            {post.tags.length > 0 && (
              <Reveal className="mt-10 flex flex-wrap items-center gap-2 border-t border-neutral-100 pt-8">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  Tags
                </span>
                {post.tags.map((tag) => (
                  <Badge key={tag} tone="neutral">
                    {tag}
                  </Badge>
                ))}
              </Reveal>
            )}

            {author && (
              <Reveal className="mt-10">
                <Card hover={false} className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
                  <img
                    src={author.avatarUrl}
                    alt={author.name}
                    className="h-20 w-20 shrink-0 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-lg font-bold">{author.name}</h2>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
                      {author.role}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-body">{author.bio}</p>
                  </div>
                </Card>
              </Reveal>
            )}
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="section-pad bg-mist-100">
          <div className="container-site">
            <Reveal className="mb-12 text-center">
              <span className="section-label block">KEEP READING</span>
              <h2 className="mt-3 text-display-3">Related Articles</h2>
            </Reveal>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              {related.map((item) => (
                <motion.article key={item.id} variants={staggerItem}>
                  <Card hover className="h-full overflow-hidden p-0">
                    <Link to={`/blog/${item.slug}`} className="group block overflow-hidden">
                      <img
                        src={item.bannerUrl}
                        alt={item.title}
                        loading="lazy"
                        className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>
                    <div className="p-7 text-center">
                      <p className="flex flex-wrap items-center justify-center gap-x-2 text-[11px] font-medium uppercase tracking-wider text-neutral-400">
                        <time dateTime={item.publishedAt}>
                          {formatDate(item.publishedAt).toUpperCase()}
                        </time>
                        <span aria-hidden="true">|</span>
                        <span>
                          {item.commentsCount} {item.commentsCount === 1 ? 'Comment' : 'Comments'}
                        </span>
                      </p>
                      <h3 className="mt-3 text-lg font-bold leading-snug">
                        <Link
                          to={`/blog/${item.slug}`}
                          className="text-heading transition-colors hover:text-primary-600"
                        >
                          {item.title}
                        </Link>
                      </h3>
                      <Link
                        to={`/blog/${item.slug}`}
                        className="mt-4 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary-600 transition-colors hover:text-primary-700"
                      >
                        Read More +
                      </Link>
                    </div>
                  </Card>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>
      )}
    </>
  );
}
