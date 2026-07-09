import { Check, ExternalLink } from 'lucide-react';
import { useMemo, useState } from 'react';
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
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import type { Project } from '@/types';

function RelatedProjects({ current, projects }: { current: Project; projects: Project[] }) {
  const others = projects.filter((project) => project.id !== current.id);
  const sameCategory = others.filter((project) => project.category === current.category);
  const related = [...sameCategory, ...others.filter((p) => p.category !== current.category)].slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="section-pad bg-mist-100">
      <div className="container-site">
        <Reveal className="mb-12 text-center">
          <span className="section-label block">MORE WORKS</span>
          <h2 className="mt-3 text-display-3">Related Projects</h2>
        </Reveal>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {related.map((project) => (
            <motion.article key={project.id} variants={staggerItem}>
              <Link to={`/portfolio/${project.slug}`} className="group block">
                <div className="overflow-hidden rounded-md shadow-card">
                  <img
                    src={project.coverImageUrl}
                    alt={project.title}
                    loading="lazy"
                    className="aspect-[10/7] w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="pt-4 text-center">
                  <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                    {project.category}
                  </span>
                  <h3 className="mt-1 font-bold text-heading transition-colors group-hover:text-primary-600">
                    {project.title}
                  </h3>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading, isError } = useBySlug(api.projects, slug);
  const { data: allProjects } = useList(api.projects);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const images = useMemo(
    () => (project ? [project.coverImageUrl, ...project.gallery] : []),
    [project],
  );
  const mainImage = activeImage && images.includes(activeImage) ? activeImage : images[0];

  if (isLoading) return <PageLoader className="min-h-[60vh]" />;

  if (isError || !project) {
    return (
      <section className="section-pad">
        <div className="container-site py-16 text-center">
          <h1 className="text-display-3">Project Not Found</h1>
          <p className="lead-serif mx-auto mt-4 max-w-md">
            The project you are looking for does not exist or may have been moved.
          </p>
          <div className="mt-8">
            <Button to="/portfolio">Back to Portfolio</Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <Seo meta={project.seo} title={project.seo.metaTitle} description={project.seo.metaDescription} />
      <PageHero
        label={project.category.toUpperCase()}
        title={project.title}
        lead={project.excerpt}
        crumbs={[{ label: 'Portfolio', path: '/portfolio' }, { label: project.title }]}
      />

      <section className="section-pad">
        <div className="container-site">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Reveal>
                <div className="overflow-hidden rounded-md shadow-card">
                  <img
                    src={mainImage}
                    alt={project.title}
                    className="aspect-[10/7] w-full object-cover"
                  />
                </div>
                {images.length > 1 && (
                  <div className="mt-4 grid grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <button
                        key={image}
                        type="button"
                        onClick={() => setActiveImage(image)}
                        aria-label={`Show project image ${index + 1}`}
                        className={cn(
                          'overflow-hidden rounded-md border-2 transition-all',
                          mainImage === image
                            ? 'border-primary-500'
                            : 'border-transparent opacity-70 hover:opacity-100',
                        )}
                      >
                        <img
                          src={image}
                          alt=""
                          loading="lazy"
                          className="aspect-[10/7] w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </Reveal>

              <Reveal className="mt-10">
                <h2 className="text-display-3">About the Project</h2>
                <div
                  className="mt-4 space-y-4 text-[15px] leading-8 text-body [&_p]:mb-4"
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />
              </Reveal>

              {project.features.length > 0 && (
                <Reveal className="mt-10">
                  <h2 className="text-display-3">Key Features</h2>
                  <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                    {project.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm font-medium text-heading">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                          <Check size={14} aria-hidden="true" />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}

              {project.results.length > 0 && (
                <Reveal className="mt-12">
                  <div className="grid gap-6 rounded-md bg-mist-100 p-8 sm:grid-cols-3">
                    {project.results.map((result) => {
                      const [figure, ...rest] = result.split(' ');
                      return (
                        <div key={result} className="text-center">
                          <span className="block text-3xl font-bold text-primary-600">{figure}</span>
                          <span className="mt-1 block text-sm text-body">{rest.join(' ')}</span>
                        </div>
                      );
                    })}
                  </div>
                </Reveal>
              )}
            </div>

            <aside>
              <Reveal>
                <Card hover={false} className="lg:sticky lg:top-28">
                  <h2 className="text-lg font-bold">Project Details</h2>
                  <dl className="mt-6 space-y-5 text-sm">
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">Client</dt>
                      <dd className="mt-1 font-semibold text-heading">{project.client}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">Timeline</dt>
                      <dd className="mt-1 font-semibold text-heading">{project.timeline}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">Category</dt>
                      <dd className="mt-1 font-semibold text-heading">{project.category}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">Technologies</dt>
                      <dd className="mt-2 flex flex-wrap gap-2">
                        {project.technologies.map((technology) => (
                          <Badge key={technology} tone="neutral">
                            {technology}
                          </Badge>
                        ))}
                      </dd>
                    </div>
                  </dl>
                  {project.liveUrl && (
                    <Button href={project.liveUrl} className="mt-8 w-full">
                      Visit Live Site
                      <ExternalLink size={16} aria-hidden="true" />
                    </Button>
                  )}
                </Card>
              </Reveal>
            </aside>
          </div>
        </div>
      </section>

      {allProjects && <RelatedProjects current={project} projects={allProjects} />}
    </>
  );
}
