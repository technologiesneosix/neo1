import { useList } from '@/api/hooks';
import { api } from '@/api/services';
import { Button } from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/Spinner';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { FloatingShapes } from '@/components/common/FloatingShapes';
import { PageHero } from '@/components/common/PageHero';
import { Seo } from '@/components/common/Seo';
import { CatalogGrid } from '@/features/catalog/CatalogGrid';

export function IndustriesPage() {
  const { data: industries, isLoading } = useList(api.industries);
  const sortedIndustries = [...(industries ?? [])].sort((a, b) => a.order - b.order);

  return (
    <>
      <Seo
        title="Industries | Neosix"
        description="Domain expertise across healthcare, education, finance, retail, logistics, manufacturing and more."
      />
      <PageHero
        label="INDUSTRIES"
        title="Domains We Know Deeply"
        lead="We arrive knowing your regulations, integrations and edge cases — not learning them on your dime."
        crumbs={[{ label: 'Industries' }]}
      />

      {/* Industries grid */}
      <section className="section-pad bg-white">
        <div className="container-site">
          <SectionHeading
            label="SECTOR EXPERTISE"
            title="Where We Have Shipped Before"
            lead="Production systems delivered across eight sectors — each with its own compliance, workflow and integration landscape."
          />
          {isLoading ? (
            <PageLoader />
          ) : (
            <CatalogGrid items={sortedIndustries} basePath="/industries" columns={4} />
          )}
        </div>
      </section>

      {/* Dark CTA band */}
      <section className="relative overflow-hidden bg-ink-900">
        <FloatingShapes />
        <div className="container-site relative py-20 text-center md:py-24">
          <Reveal>
            <span className="section-label text-neutral-500">YOUR INDUSTRY</span>
            <h2 className="mt-3 text-display-3 text-white md:text-display-2">
              Working in a Different Domain?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-7 text-neutral-400">
              Our discovery process is built to absorb new domains fast — tell us about yours and
              we will show you how we ramp up.
            </p>
            <Button to="/contact" size="lg" className="mt-8">
              Start a Conversation
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
