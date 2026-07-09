import { useList } from '@/api/hooks';
import { api } from '@/api/services';
import { BlobFrame } from '@/components/common/BlobFrame';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { PageLoader } from '@/components/ui/Spinner';

/** Two-column about teaser with blob imagery and an animated stats row. */
export function AboutPreviewSection() {
  const { data, isLoading } = useList(api.about);
  const about = data?.[0];

  if (isLoading) {
    return (
      <section className="section-pad bg-white">
        <PageLoader />
      </section>
    );
  }
  if (!about) return null;

  return (
    <section className="section-pad overflow-hidden bg-white">
      <div className="container-site">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal direction="right">
            <BlobFrame imageUrl={about.imageUrl} alt="The Neosix team at work" />
          </Reveal>
          <Reveal direction="left" delay={0.1}>
            <span className="section-label block">{about.sectionLabel}</span>
            <h2 className="mt-3 text-display-3 md:text-display-2">{about.title}</h2>
            <p className="lead-serif mt-6">{about.leadText}</p>
            <p className="mt-5 text-[15px] leading-7 text-body">{about.description}</p>
            <div className="mt-9">
              <Button to={about.ctaLink}>{about.ctaLabel}</Button>
            </div>
          </Reveal>
        </div>

        {about.stats.length > 0 && (
          <Reveal delay={0.15} className="mt-16 md:mt-24">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-10 text-center lg:grid-cols-4">
              {about.stats.map((stat) => (
                <div key={stat.id}>
                  <dd className="text-display-3 text-heading md:text-display-2">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </dd>
                  <dt className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          </Reveal>
        )}
      </div>
    </section>
  );
}
