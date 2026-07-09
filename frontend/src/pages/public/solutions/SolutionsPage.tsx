import { Settings2, ShieldCheck, Wrench } from 'lucide-react';
import { useList } from '@/api/hooks';
import { api } from '@/api/services';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageLoader } from '@/components/ui/Spinner';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { FloatingShapes } from '@/components/common/FloatingShapes';
import { PageHero } from '@/components/common/PageHero';
import { Seo } from '@/components/common/Seo';
import { CatalogGrid } from '@/features/catalog/CatalogGrid';

const highlights = [
  {
    icon: Settings2,
    title: 'Tailored, Not Templated',
    description: 'Every platform is configured to your workflows before it ships — not after.',
  },
  {
    icon: ShieldCheck,
    title: 'Enterprise-Grade Security',
    description: 'Role-based access, audit trails and encryption come standard on every solution.',
  },
  {
    icon: Wrench,
    title: 'Supported for the Long Haul',
    description: 'SLA-backed monitoring, patching and a roadmap that keeps improving after launch.',
  },
];

export function SolutionsPage() {
  const { data: solutions, isLoading } = useList(api.solutions);
  const sortedSolutions = [...(solutions ?? [])].sort((a, b) => a.order - b.order);

  return (
    <>
      <Seo
        title="Solutions | Neosix"
        description="Ready-to-tailor platforms from Neosix: CRM, ERP, HRMS, POS, LMS, booking and more."
      />
      <PageHero
        label="OUR SOLUTIONS"
        title="Platforms We Deliver"
        lead="Proven product foundations, tailored to your operation — faster than building from zero."
        crumbs={[{ label: 'Solutions' }]}
      />

      {/* Solutions grid */}
      <section className="section-pad bg-white">
        <div className="container-site">
          {isLoading ? (
            <PageLoader />
          ) : (
            <CatalogGrid items={sortedSolutions} basePath="/solutions" columns={3} />
          )}
        </div>
      </section>

      {/* Why our solutions */}
      <section className="section-pad bg-mist-100">
        <div className="container-site">
          <SectionHeading
            label="WHY NEOSIX"
            title="Product Speed, Custom Fit"
            lead="Our solutions start from battle-tested cores, so you get to value in weeks — without settling for off-the-shelf compromises."
          />
          <div className="grid gap-8 lg:grid-cols-3">
            {highlights.map((highlight, index) => (
              <Reveal key={highlight.title} delay={index * 0.1} className="h-full">
                <Card className="h-full text-center">
                  <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-gradient-soft text-white">
                    <highlight.icon size={24} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-base font-bold">{highlight.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-body">{highlight.description}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Dark CTA band */}
      <section className="relative overflow-hidden bg-ink-900">
        <FloatingShapes />
        <div className="container-site relative py-20 text-center md:py-24">
          <Reveal>
            <span className="section-label text-neutral-500">NOT SEEING YOUR PLATFORM?</span>
            <h2 className="mt-3 text-display-3 text-white md:text-display-2">
              We Build Custom Enterprise Software Too
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-7 text-neutral-400">
              If off-the-shelf never quite fits, tell us what your operation needs and we will
              scope it together.
            </p>
            <Button to="/contact" size="lg" className="mt-8">
              Talk to an Expert
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
