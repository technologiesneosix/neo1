import { CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/ui/Reveal';
import { PageHero } from '@/components/common/PageHero';
import { Seo } from '@/components/common/Seo';
import type { SeoMeta } from '@/types';
import { cn } from '@/lib/cn';

/** Minimum shape a detail entity must satisfy (service, solution, industry). */
export interface DetailPageItem {
  title: string;
  slug: string;
  imageUrl: string;
  /** HTML from the admin rich-text editor. */
  description: string;
  features?: string[];
  seo: SeoMeta;
}

export interface DetailSibling {
  id: string;
  title: string;
  slug: string;
}

interface DetailPageLayoutProps {
  item: DetailPageItem;
  /** All items of the same resource — the sidebar links between them. */
  siblings: DetailSibling[];
  /** Route prefix, e.g. "/services". */
  basePath: string;
  /** Uppercase hero label, e.g. "OUR SERVICES". */
  label: string;
}

/** Derive a breadcrumb label ("Services") from a base path ("/services"). */
function crumbLabelFromPath(basePath: string): string {
  const segment = basePath.replace(/^\//, '');
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

/**
 * Shared two-column detail layout for service / solution / industry pages:
 * hero with breadcrumbs, rich-text main column and a sticky sibling sidebar
 * with a dark contact CTA card.
 */
export function DetailPageLayout({ item, siblings, basePath, label }: DetailPageLayoutProps) {
  const crumbLabel = crumbLabelFromPath(basePath);

  return (
    <>
      <Seo meta={item.seo} />
      <PageHero
        label={label}
        title={item.title}
        crumbs={[{ label: crumbLabel, path: basePath }, { label: item.title }]}
      />

      <section className="section-pad bg-white">
        <div className="container-site">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px]">
            {/* Main content */}
            <article>
              <Reveal>
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full rounded-md object-cover shadow-card"
                  loading="lazy"
                />
              </Reveal>
              <Reveal delay={0.1}>
                <div
                  className={cn(
                    'mt-10',
                    '[&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-heading',
                    '[&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-heading',
                    '[&_p]:mb-5 [&_p]:leading-8 [&_p]:text-body',
                    '[&_ul]:mb-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_li]:text-body',
                    '[&_blockquote]:border-l-4 [&_blockquote]:border-primary-500 [&_blockquote]:pl-5 [&_blockquote]:font-serif [&_blockquote]:italic [&_blockquote]:text-neutral-500',
                    '[&_a]:text-primary-600 [&_a]:underline',
                  )}
                  // Admin-authored rich text — rendered as HTML by design.
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
              </Reveal>

              {item.features && item.features.length > 0 && (
                <Reveal delay={0.15}>
                  <div className="mt-4 rounded-md bg-mist-100 p-8">
                    <h2 className="text-xl font-bold">What&rsquo;s Included</h2>
                    <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                      {item.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm text-body">
                          <CheckCircle2
                            size={18}
                            aria-hidden="true"
                            className="mt-0.5 shrink-0 text-primary-600"
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              )}
            </article>

            {/* Sidebar */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <Reveal direction="left">
                <Card hover={false} className="p-0">
                  <h2 className="border-b border-mist-200 px-6 py-5 text-sm font-bold uppercase tracking-[0.15em] text-heading">
                    All {crumbLabel}
                  </h2>
                  <nav aria-label={`Browse ${crumbLabel.toLowerCase()}`}>
                    <ul className="py-2">
                      {siblings.map((sibling) => {
                        const active = sibling.slug === item.slug;
                        return (
                          <li key={sibling.id}>
                            <Link
                              to={`${basePath}/${sibling.slug}`}
                              aria-current={active ? 'page' : undefined}
                              className={cn(
                                'flex items-center justify-between gap-2 px-6 py-3 text-sm font-medium transition-colors',
                                active
                                  ? 'bg-primary-50 font-semibold text-primary-600'
                                  : 'text-body hover:bg-mist-50 hover:text-heading',
                              )}
                            >
                              {sibling.title}
                              <ChevronRight
                                size={15}
                                aria-hidden="true"
                                className={cn('shrink-0', active ? 'text-primary-600' : 'text-neutral-300')}
                              />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                </Card>
              </Reveal>

              <Reveal direction="left" delay={0.1}>
                <div className="relative mt-8 overflow-hidden rounded-md bg-ink-900 p-8 text-center">
                  <span
                    aria-hidden="true"
                    className="absolute -right-8 -top-8 h-28 w-28 rounded-full border-2 border-primary-500/40"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-brand-gradient opacity-25"
                  />
                  <h2 className="relative text-lg font-bold text-white">Need Help?</h2>
                  <p className="relative mt-3 text-sm leading-6 text-neutral-400">
                    Talk to a Neosix expert about your project — we reply within one business day.
                  </p>
                  <Button to="/contact" size="sm" className="relative mt-6">
                    Contact Us
                  </Button>
                </div>
              </Reveal>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
