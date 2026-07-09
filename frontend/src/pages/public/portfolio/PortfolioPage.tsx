import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useList } from '@/api/hooks';
import { api } from '@/api/services';
import { PageHero } from '@/components/common/PageHero';
import { Seo } from '@/components/common/Seo';
import { Button } from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/Spinner';
import { Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/cn';
import type { Project } from '@/types';

const ALL = 'All';

function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/portfolio/${project.slug}`} className="group block">
        <div className="relative overflow-hidden rounded-md shadow-card">
          <img
            src={project.coverImageUrl}
            alt={project.title}
            loading="lazy"
            className="aspect-[10/7] w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary-700/80 to-azure-500/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="px-4 text-center text-lg font-bold text-white">{project.title}</span>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/85">
              View Project
            </span>
          </div>
        </div>
        <div className="pt-5 text-center">
          <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">
            {project.category}
          </span>
          <h3 className="mt-1 text-lg font-bold text-heading transition-colors group-hover:text-primary-600">
            {project.title}
          </h3>
        </div>
      </Link>
    </motion.article>
  );
}

export function PortfolioPage() {
  const { data: projects, isLoading } = useList(api.projects);
  const [activeCategory, setActiveCategory] = useState(ALL);

  const sorted = useMemo(
    () => [...(projects ?? [])].sort((a, b) => a.order - b.order),
    [projects],
  );
  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(sorted.map((project) => project.category)))],
    [sorted],
  );
  const visible =
    activeCategory === ALL
      ? sorted
      : sorted.filter((project) => project.category === activeCategory);

  return (
    <>
      <Seo
        title="Portfolio — Neosix"
        description="Enterprise software projects designed, built and scaled by Neosix across logistics, healthcare, retail and more."
      />
      <PageHero
        label="OUR WORKS"
        title="Projects We're Proud Of"
        lead="A selection of enterprise platforms we have designed, engineered and launched for clients around the world."
        crumbs={[{ label: 'Portfolio' }]}
      />

      <section className="section-pad">
        <div className="container-site">
          <Reveal>
            <div
              className="mb-12 flex flex-wrap items-center justify-center gap-2"
              role="group"
              aria-label="Filter projects by category"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={activeCategory === category}
                  className={cn(
                    'rounded-btn px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300',
                    activeCategory === category
                      ? 'bg-brand-gradient text-white shadow-md shadow-primary-600/25'
                      : 'text-neutral-500 hover:text-primary-600',
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </Reveal>

          {isLoading ? (
            <PageLoader />
          ) : (
            <motion.div layout className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {visible.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!isLoading && visible.length === 0 && (
            <p className="py-16 text-center text-body">
              No projects in this category yet — check back soon.
            </p>
          )}

          <Reveal className="mt-16 text-center">
            <p className="lead-serif mx-auto mb-6 max-w-xl">
              Want the full story behind the numbers? Dive into our in-depth case studies.
            </p>
            <Button to="/portfolio/case-studies" variant="outline">
              Explore Case Studies
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
