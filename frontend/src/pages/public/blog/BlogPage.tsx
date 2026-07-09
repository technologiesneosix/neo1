import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useList } from '@/api/hooks';
import { api } from '@/api/services';
import { PageHero } from '@/components/common/PageHero';
import { Seo } from '@/components/common/Seo';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageLoader } from '@/components/ui/Spinner';
import { Reveal, staggerContainer, staggerItem } from '@/components/ui/Reveal';
import { cn } from '@/lib/cn';
import { formatDate } from '@/lib/utils';
import type { BlogPost } from '@/types';

interface PostMetaProps {
  post: BlogPost;
  authorName: string;
}

function PostMeta({ post, authorName }: PostMetaProps) {
  return (
    <p className="flex flex-wrap items-center justify-center gap-x-2 text-[11px] font-medium uppercase tracking-wider text-neutral-400">
      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt).toUpperCase()}</time>
      <span aria-hidden="true">|</span>
      <span>
        {post.commentsCount} {post.commentsCount === 1 ? 'Comment' : 'Comments'}
      </span>
      <span aria-hidden="true">|</span>
      <span>{authorName}</span>
    </p>
  );
}

export function BlogPage() {
  const { data: posts, isLoading: loadingPosts } = useList(api.blogPosts);
  const { data: categories, isLoading: loadingCategories } = useList(api.categories);
  const { data: authors } = useList(api.authors);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');

  const activeCategorySlug = searchParams.get('category') ?? '';
  const isLoading = loadingPosts || loadingCategories;

  const authorName = (authorId: string) =>
    authors?.find((author) => author.id === authorId)?.name ?? 'Neosix Team';

  const published = useMemo(
    () =>
      (posts ?? [])
        .filter((post) => post.status === 'published')
        .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)),
    [posts],
  );

  const activeCategory = categories?.find((category) => category.slug === activeCategorySlug);

  const filtered = published.filter((post) => {
    const matchesCategory = activeCategory ? post.categoryId === activeCategory.id : true;
    const matchesSearch = search
      ? post.title.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  const featured = filtered.find((post) => post.featured);
  const rest = featured ? filtered.filter((post) => post.id !== featured.id) : filtered;

  const selectCategory = (slug: string) => {
    if (slug) setSearchParams({ category: slug });
    else setSearchParams({});
  };

  return (
    <>
      <Seo
        title="Blog — Neosix"
        description="Engineering insights, design lessons and practical playbooks from the Neosix team."
      />
      <PageHero
        label="OUR BLOG"
        title="What Is Happening"
        lead="Practical lessons from production systems, written by the engineers and designers who ship them."
        crumbs={[{ label: 'Blog' }]}
      />

      <section className="section-pad">
        <div className="container-site">
          <Reveal>
            <div className="mb-12 flex flex-col items-center gap-6">
              <div
                className="flex flex-wrap items-center justify-center gap-2"
                role="group"
                aria-label="Filter articles by category"
              >
                <button
                  type="button"
                  onClick={() => selectCategory('')}
                  aria-pressed={!activeCategorySlug}
                  className={cn(
                    'rounded-btn px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300',
                    !activeCategorySlug
                      ? 'bg-brand-gradient text-white shadow-md shadow-primary-600/25'
                      : 'text-neutral-500 hover:text-primary-600',
                  )}
                >
                  All
                </button>
                {(categories ?? []).map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => selectCategory(category.slug)}
                    aria-pressed={activeCategorySlug === category.slug}
                    className={cn(
                      'rounded-btn px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300',
                      activeCategorySlug === category.slug
                        ? 'bg-brand-gradient text-white shadow-md shadow-primary-600/25'
                        : 'text-neutral-500 hover:text-primary-600',
                    )}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
              <label className="relative w-full max-w-sm">
                <span className="sr-only">Search articles</span>
                <Search
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search articles..."
                  className="w-full rounded-btn border border-neutral-200 bg-white py-3 pl-11 pr-4 text-sm text-heading placeholder:text-neutral-400 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                />
              </label>
            </div>
          </Reveal>

          {isLoading ? (
            <PageLoader />
          ) : (
            <>
              {featured && (
                <Reveal className="mb-14">
                  <Card hover={false} className="overflow-hidden p-0">
                    <article className="grid items-center lg:grid-cols-2">
                      <Link to={`/blog/${featured.slug}`} className="group block overflow-hidden">
                        <img
                          src={featured.bannerUrl}
                          alt={featured.title}
                          className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105 lg:h-full"
                        />
                      </Link>
                      <div className="p-8 text-center md:p-12">
                        <PostMeta post={featured} authorName={authorName(featured.authorId)} />
                        <h2 className="mt-4 text-display-3">
                          <Link
                            to={`/blog/${featured.slug}`}
                            className="transition-colors hover:text-primary-600"
                          >
                            {featured.title}
                          </Link>
                        </h2>
                        <p className="lead-serif mt-4 text-base">{featured.excerpt}</p>
                        <div className="mt-8">
                          <Button to={`/blog/${featured.slug}`}>Read Article</Button>
                        </div>
                      </div>
                    </article>
                  </Card>
                </Reveal>
              )}

              {rest.length === 0 && !featured ? (
                <p className="py-16 text-center text-body">
                  No articles match your search — try a different keyword or category.
                </p>
              ) : (
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-80px' }}
                  className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {rest.map((post) => (
                    <motion.article key={post.id} variants={staggerItem}>
                      <Card hover className="h-full overflow-hidden p-0">
                        <Link to={`/blog/${post.slug}`} className="group block overflow-hidden">
                          <img
                            src={post.bannerUrl}
                            alt={post.title}
                            loading="lazy"
                            className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </Link>
                        <div className="p-7 text-center">
                          <PostMeta post={post} authorName={authorName(post.authorId)} />
                          <h3 className="mt-3 text-lg font-bold leading-snug">
                            <Link
                              to={`/blog/${post.slug}`}
                              className="text-heading transition-colors hover:text-primary-600"
                            >
                              {post.title}
                            </Link>
                          </h3>
                          <p className="mt-3 font-serif text-sm leading-7 text-neutral-500">
                            {post.excerpt}
                          </p>
                          <Link
                            to={`/blog/${post.slug}`}
                            className="mt-5 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary-600 transition-colors hover:text-primary-700"
                          >
                            Read More +
                          </Link>
                        </div>
                      </Card>
                    </motion.article>
                  ))}
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
