import { useList } from '@/api/hooks';
import { api } from '@/api/services';
import { PageLoader } from '@/components/ui/Spinner';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { PageHero } from '@/components/common/PageHero';
import { Seo } from '@/components/common/Seo';
import { AboutNav } from '@/features/about/AboutNav';
import { cn } from '@/lib/cn';

export function JourneyPage() {
  const { data: timeline, isLoading } = useList(api.timeline);
  const milestones = [...(timeline ?? [])].sort((a, b) => a.order - b.order);

  return (
    <>
      <Seo
        title="Our Journey | Neosix"
        description="From a three-person studio in 2014 to a global enterprise software partner — the Neosix story."
      />
      <PageHero
        label="OUR JOURNEY"
        title="A Decade of Building"
        lead="Every milestone below was earned one shipped product at a time."
        crumbs={[{ label: 'About', path: '/about' }, { label: 'Our Journey' }]}
      />
      <AboutNav />

      <section className="section-pad bg-white">
        <div className="container-site">
          <SectionHeading
            label="MILESTONES"
            title="How Neosix Grew"
            lead="The moments that shaped who we are — and how we deliver today."
          />

          {isLoading && <PageLoader />}

          {milestones.length > 0 && (
            <ol className="relative mx-auto max-w-4xl">
              {/* Center line (left-aligned on mobile) */}
              <span
                aria-hidden="true"
                className="absolute bottom-2 left-4 top-2 w-px bg-mist-200 lg:left-1/2 lg:-translate-x-1/2"
              />
              {milestones.map((milestone, index) => {
                const even = index % 2 === 0;
                return (
                  <li key={milestone.id} className="relative pb-14 last:pb-0">
                    {/* Node dot */}
                    <span
                      aria-hidden="true"
                      className="absolute left-4 top-1.5 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-white bg-brand-gradient shadow-md shadow-primary-600/30 lg:left-1/2"
                    />
                    <Reveal
                      direction={even ? 'right' : 'left'}
                      className={cn(
                        'ml-12 lg:ml-0 lg:w-[calc(50%-3rem)]',
                        even ? 'lg:mr-auto lg:text-right' : 'lg:ml-auto lg:text-left',
                      )}
                    >
                      <div>
                        <span className="inline-flex items-center rounded-full bg-brand-gradient px-4 py-1.5 text-xs font-bold tracking-widest text-white shadow-md shadow-primary-600/25">
                          {milestone.year}
                        </span>
                        <h3 className="mt-4 text-xl font-bold">{milestone.title}</h3>
                        {milestone.description ? (
                          <p className="mt-2 text-sm leading-7 text-body">{milestone.description}</p>
                        ) : null}
                      </div>
                    </Reveal>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </section>
    </>
  );
}
