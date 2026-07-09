import { motion } from 'framer-motion';
import { Compass, Eye, Gem, ShieldCheck, type LucideIcon } from 'lucide-react';
import { useList } from '@/api/hooks';
import { api } from '@/api/services';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageLoader } from '@/components/ui/Spinner';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal, staggerContainer, staggerItem } from '@/components/ui/Reveal';
import { BlobFrame } from '@/components/common/BlobFrame';
import { PageHero } from '@/components/common/PageHero';
import { Seo } from '@/components/common/Seo';
import { WaveDivider } from '@/components/common/WaveDivider';
import { AboutNav } from '@/features/about/AboutNav';

const valueIcons: LucideIcon[] = [ShieldCheck, Gem, Eye, Compass];

export function AboutCompanyPage() {
  const { data: aboutRecords, isLoading } = useList(api.about);
  const { data: certifications } = useList(api.certifications);
  const about = aboutRecords?.[0];

  return (
    <>
      <Seo
        title="About Neosix | Enterprise Software Solutions"
        description="Meet Neosix — the team designing, building and operating enterprise software since 2014."
      />
      <PageHero
        label="ABOUT US"
        title="We Create Digital Solutions, Products and Services."
        crumbs={[{ label: 'About' }]}
      />
      <AboutNav />

      {isLoading && <PageLoader />}

      {about && (
        <>
          {/* Intro: blob image + copy */}
          <section className="relative overflow-hidden bg-white pt-16 md:pt-24">
            <div className="container-site pb-16 md:pb-24">
              <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                <Reveal direction="right">
                  <BlobFrame imageUrl={about.imageUrl} alt="The Neosix team at work" />
                </Reveal>
                <Reveal>
                  <span className="section-label">{about.sectionLabel}</span>
                  <h2 className="mt-3 text-display-3 md:text-display-2">{about.title}</h2>
                  <p className="lead-serif mt-6">{about.leadText}</p>
                  <p className="mt-5 leading-8 text-body">{about.description}</p>
                  <Button to={about.ctaLink} className="mt-8">
                    {about.ctaLabel}
                  </Button>
                </Reveal>
              </div>
            </div>
            <WaveDivider fill="#1b1d23" />
          </section>

          {/* Stats band */}
          <section className="bg-ink-900" aria-label="Neosix in numbers">
            <div className="container-site py-16 md:py-20">
              <div className="grid gap-10 text-center sm:grid-cols-2 lg:grid-cols-4">
                {about.stats.map((stat, index) => (
                  <Reveal key={stat.id} delay={index * 0.08}>
                    <div className="flex flex-col-reverse">
                      <span className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                        {stat.label}
                      </span>
                      <span className="text-display-3 text-white md:text-display-2">
                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                      </span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Values */}
          <section className="section-pad bg-mist-100">
            <div className="container-site">
              <SectionHeading
                label="OUR VALUES"
                title="What We Stand For"
                lead="Four principles guide every engagement, every sprint and every line of code we ship."
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
                          {value} is not a poster on our wall — it is how we plan, build and
                          communicate every single day.
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

      {/* Certifications preview */}
      {certifications && certifications.length > 0 && (
        <section className="section-pad bg-white">
          <div className="container-site">
            <SectionHeading
              label="CREDENTIALS"
              title="Certified & Trusted"
              lead="Independent audits and partner programs back up the way we work."
            />
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
            >
              {certifications.slice(0, 4).map((certification) => (
                <motion.div key={certification.id} variants={staggerItem} className="h-full">
                  <Card className="flex h-full flex-col items-center p-6 text-center">
                    <img
                      src={certification.imageUrl}
                      alt={certification.name}
                      className="h-28 w-full rounded object-cover"
                      loading="lazy"
                    />
                    <h3 className="mt-4 text-sm font-bold">{certification.name}</h3>
                    <p className="mt-1 text-xs text-body">{certification.issuer}</p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
            <Reveal className="mt-12 text-center">
              <Button to="/about/certifications" variant="outline">
                View All Certifications
              </Button>
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}
