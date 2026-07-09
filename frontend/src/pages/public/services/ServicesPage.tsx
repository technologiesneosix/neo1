import { motion } from 'framer-motion';
import { useList } from '@/api/hooks';
import { api } from '@/api/services';
import { Button } from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/Spinner';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal, staggerContainer, staggerItem } from '@/components/ui/Reveal';
import { DynamicIcon } from '@/components/common/DynamicIcon';
import { FloatingShapes } from '@/components/common/FloatingShapes';
import { PageHero } from '@/components/common/PageHero';
import { Seo } from '@/components/common/Seo';
import { CatalogGrid } from '@/features/catalog/CatalogGrid';

export function ServicesPage() {
  const { data: services, isLoading } = useList(api.services);
  const { data: processSteps } = useList(api.processSteps);
  const sortedServices = [...(services ?? [])].sort((a, b) => a.order - b.order);
  const sortedSteps = [...(processSteps ?? [])].sort((a, b) => a.order - b.order);

  return (
    <>
      <Seo
        title="Services | Neosix"
        description="Web, mobile, custom software, SaaS, AI, cloud, API, DevOps and support services from Neosix."
      />
      <PageHero
        label="OUR SERVICES"
        title="What We Do Best"
        lead="Ten disciplines, one accountable team — pick a service or bring us the whole product."
        crumbs={[{ label: 'Services' }]}
      />

      {/* Services grid */}
      <section className="section-pad bg-white">
        <div className="container-site">
          {isLoading ? (
            <PageLoader />
          ) : (
            <CatalogGrid items={sortedServices} basePath="/services" columns={3} />
          )}
        </div>
      </section>

      {/* Process teaser strip */}
      {sortedSteps.length > 0 && (
        <section className="section-pad bg-mist-100">
          <div className="container-site">
            <SectionHeading
              label="HOW WE WORK"
              title="From Idea to Launch in Five Steps"
              lead="The same proven delivery playbook runs underneath every service we offer."
            />
            <motion.ol
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5"
            >
              {sortedSteps.map((step, index) => (
                <motion.li key={step.id} variants={staggerItem} className="text-center">
                  <div className="relative mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-primary-600 shadow-card">
                    <DynamicIcon name={step.icon} size={26} />
                    <span className="absolute -right-1 -top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-gradient text-[11px] font-bold text-white">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 text-base font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-body">{step.description}</p>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </section>
      )}

      {/* Dark CTA band */}
      <section className="relative overflow-hidden bg-ink-900">
        <FloatingShapes />
        <div className="container-site relative py-20 text-center md:py-24">
          <Reveal>
            <span className="section-label text-neutral-500">READY WHEN YOU ARE</span>
            <h2 className="mt-3 text-display-3 text-white md:text-display-2">
              Let&rsquo;s Scope Your Project
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-7 text-neutral-400">
              A free discovery call gets you an honest read on feasibility, timeline and budget —
              no strings attached.
            </p>
            <Button to="/contact" size="lg" className="mt-8">
              Book a Discovery Call
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
