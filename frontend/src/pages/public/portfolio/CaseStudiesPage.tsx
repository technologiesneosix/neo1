import { CheckCircle2 } from 'lucide-react';
import { useList } from '@/api/hooks';
import { api } from '@/api/services';
import { PageHero } from '@/components/common/PageHero';
import { Seo } from '@/components/common/Seo';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/Spinner';
import { Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/cn';

export function CaseStudiesPage() {
  const { data: caseStudies, isLoading: loadingCaseStudies } = useList(api.caseStudies);
  const { data: projects, isLoading: loadingProjects } = useList(api.projects);

  const isLoading = loadingCaseStudies || loadingProjects;

  return (
    <>
      <Seo
        title="Case Studies — Neosix"
        description="In-depth stories of how Neosix helped enterprise clients modernize operations, cut costs and grow."
      />
      <PageHero
        label="CASE STUDIES"
        title="Results You Can Measure"
        lead="The challenge, the solution and the numbers — how our clients transformed their operations with Neosix."
        crumbs={[{ label: 'Portfolio', path: '/portfolio' }, { label: 'Case Studies' }]}
      />

      <section className="section-pad">
        <div className="container-site">
          {isLoading ? (
            <PageLoader />
          ) : !caseStudies || caseStudies.length === 0 ? (
            <p className="py-16 text-center text-body">Case studies are on the way — stay tuned.</p>
          ) : (
            <div className="space-y-20 md:space-y-28">
              {caseStudies.map((study, index) => {
                const project = projects?.find((item) => item.id === study.projectId);
                const reversed = index % 2 === 1;
                return (
                  <Reveal key={study.id} direction={reversed ? 'left' : 'right'}>
                    <article className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                      <div className={cn('overflow-hidden rounded-md shadow-card', reversed && 'lg:order-2')}>
                        <img
                          src={study.coverImageUrl}
                          alt={study.title}
                          loading="lazy"
                          className="aspect-[10/6] w-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                      <div className={cn(reversed && 'lg:order-1')}>
                        <Badge tone="accent" className="uppercase tracking-wider">
                          {study.industry}
                        </Badge>
                        <h2 className="mt-4 text-display-3">{study.title}</h2>
                        <div className="mt-6 space-y-5">
                          <div>
                            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                              The Challenge
                            </h3>
                            <p className="mt-2 text-[15px] leading-7 text-body">{study.challenge}</p>
                          </div>
                          <div>
                            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                              The Solution
                            </h3>
                            <p className="mt-2 text-[15px] leading-7 text-body">{study.solution}</p>
                          </div>
                        </div>
                        <ul className="mt-6 space-y-2.5">
                          {study.results.map((result) => (
                            <li key={result} className="flex items-start gap-2.5 text-sm font-medium text-heading">
                              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary-600" aria-hidden="true" />
                              {result}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-8">
                          {project ? (
                            <Button to={`/portfolio/${project.slug}`}>Read Project</Button>
                          ) : (
                            <Button to="/contact">Talk to Us</Button>
                          )}
                        </div>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
