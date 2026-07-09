import { Link } from 'react-router-dom';
import { useList } from '@/api/hooks';
import { api } from '@/api/services';
import { WaveDivider } from '@/components/common/WaveDivider';
import { Carousel } from '@/components/ui/Carousel';
import { Reveal } from '@/components/ui/Reveal';
import { PageLoader } from '@/components/ui/Spinner';
import type { Project } from '@/types';

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group relative overflow-hidden rounded-md shadow-card">
      <img
        src={project.coverImageUrl}
        alt={project.title}
        loading="lazy"
        className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink-900/80 p-6 text-center opacity-0 transition-opacity duration-300 focus-within:opacity-100 group-hover:opacity-100">
        <h3 className="text-lg text-white">{project.title}</h3>
        <p className="text-xs uppercase tracking-[0.2em] text-white/60">{project.category}</p>
        <Link
          to={`/portfolio/${project.slug}`}
          className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent-400 transition-colors hover:text-white"
        >
          View Project <span aria-hidden="true">+</span>
        </Link>
      </div>
    </article>
  );
}

/** Bold blue-violet works band — featured projects carousel between white waves. */
export function PortfolioPreviewSection() {
  const { data, isLoading } = useList(api.projects);

  if (isLoading) {
    return (
      <section className="section-pad bg-primary-500">
        <PageLoader />
      </section>
    );
  }

  const featured = (data ?? [])
    .filter((project) => project.featured)
    .sort((a, b) => a.order - b.order);
  if (featured.length === 0) return null;

  const groups: Project[][] = [];
  for (let i = 0; i < featured.length; i += 3) {
    groups.push(featured.slice(i, i + 3));
  }

  return (
    <section aria-label="Selected projects">
      <WaveDivider fill="#5d5cf2" className="bg-ink-900" />
      <div className="bg-primary-500">
        <div className="container-site section-pad">
          <Reveal className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
            <span className="section-label block text-white/60">OUR WORKS</span>
            <h2 className="mt-3 text-display-3 text-white md:text-display-2">Selected Projects</h2>
          </Reveal>
          <Carousel
            dark
            count={groups.length}
            autoPlayMs={8000}
            render={(index) => {
              const group = groups[index];
              if (!group) return null;
              return (
                <div className="grid gap-6 lg:grid-cols-3">
                  {group.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              );
            }}
          />
        </div>
      </div>
      <WaveDivider fill="#ffffff" className="bg-primary-500" />
    </section>
  );
}
