import { motion } from 'framer-motion';
import { Compass, Eye, Gem, ShieldCheck, Target, Telescope, type LucideIcon } from 'lucide-react';
import { useList } from '@/api/hooks';
import { api } from '@/api/services';
import { Card } from '@/components/ui/Card';
import { PageLoader } from '@/components/ui/Spinner';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal, staggerContainer, staggerItem } from '@/components/ui/Reveal';
import { PageHero } from '@/components/common/PageHero';
import { Seo } from '@/components/common/Seo';
import { AboutNav } from '@/features/about/AboutNav';

const valueIcons: LucideIcon[] = [ShieldCheck, Gem, Eye, Compass];

export function MissionVisionPage() {
  const { data: aboutRecords, isLoading } = useList(api.about);
  const about = aboutRecords?.[0];

  return (
    <>
      <Seo
        title="Mission & Vision | Neosix"
        description="The mission that drives Neosix and the future we are building toward."
      />
      <PageHero
        label="MISSION & VISION"
        title="Why Neosix Exists"
        lead="A clear purpose keeps 85+ people pulling in the same direction — here it is, in plain words."
        crumbs={[{ label: 'About', path: '/about' }, { label: 'Mission & Vision' }]}
      />
      <AboutNav />

      {isLoading && <PageLoader />}

      {about && (
        <>
          <section className="section-pad bg-white">
            <div className="container-site">
              <div className="grid gap-8 lg:grid-cols-2">
                <Reveal>
                  <Card className="h-full border-t-4 border-primary-600">
                    <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-gradient text-white shadow-md shadow-primary-600/25">
                      <Target size={28} aria-hidden="true" />
                    </span>
                    <span className="section-label mt-8 block">OUR MISSION</span>
                    <h2 className="mt-3 text-display-3">What Drives Us Daily</h2>
                    <p className="lead-serif mt-6">{about.mission}</p>
                  </Card>
                </Reveal>
                <Reveal delay={0.12}>
                  <Card className="h-full border-t-4 border-accent-500">
                    <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-gradient-soft text-white shadow-md shadow-accent-500/25">
                      <Telescope size={28} aria-hidden="true" />
                    </span>
                    <span className="section-label mt-8 block">OUR VISION</span>
                    <h2 className="mt-3 text-display-3">Where We Are Headed</h2>
                    <p className="lead-serif mt-6">{about.vision}</p>
                  </Card>
                </Reveal>
              </div>
            </div>
          </section>

          <section className="section-pad bg-mist-100">
            <div className="container-site">
              <SectionHeading
                label="OUR VALUES"
                title="The Principles Behind the Promise"
                lead="Mission and vision only matter when values back them up in day-to-day decisions."
              />
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
              >
                {about.values.map((value, index) => {
                  const Icon = valueIcons[index % valueIcons.length];
                  return (
                    <motion.div key={value} variants={staggerItem} className="h-full">
                      <Card className="h-full text-center">
                        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-gradient-soft text-white">
                          <Icon size={24} aria-hidden="true" />
                        </span>
                        <h3 className="mt-5 text-base font-bold">{value}</h3>
                        <p className="mt-3 text-sm leading-6 text-body">
                          We hire for it, review against it and celebrate it — {value.toLowerCase()}{' '}
                          shows up in how we work, not just what we say.
                        </p>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
