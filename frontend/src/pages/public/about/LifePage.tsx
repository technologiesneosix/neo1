import { motion } from 'framer-motion';
import {
  Clock,
  GraduationCap,
  HeartPulse,
  Laptop,
  MonitorSmartphone,
  Plane,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal, staggerContainer, staggerItem } from '@/components/ui/Reveal';
import { FloatingShapes } from '@/components/common/FloatingShapes';
import { PageHero } from '@/components/common/PageHero';
import { Seo } from '@/components/common/Seo';
import { AboutNav } from '@/features/about/AboutNav';

interface Perk {
  icon: LucideIcon;
  title: string;
  description: string;
}

const perks: Perk[] = [
  {
    icon: Clock,
    title: 'Flexible Hours',
    description: 'Deep work beats clock-watching. Shape your day around your best hours.',
  },
  {
    icon: GraduationCap,
    title: 'Learning Budget',
    description: 'An annual stipend for courses, books and conferences — no approval maze.',
  },
  {
    icon: HeartPulse,
    title: 'Health Coverage',
    description: 'Comprehensive medical, dental and vision for you and your family.',
  },
  {
    icon: Laptop,
    title: 'Remote-Friendly',
    description: 'Work from LA, Lisbon or your living room — outcomes matter, not zip codes.',
  },
  {
    icon: Plane,
    title: 'Team Retreats',
    description: 'Twice a year the whole company meets somewhere worth the flight.',
  },
  {
    icon: MonitorSmartphone,
    title: 'Latest Hardware',
    description: 'Top-spec machines and any peripherals you need to do your best work.',
  },
];

const mosaicImages = Array.from({ length: 6 }, (_, index) => ({
  src: `https://picsum.photos/seed/neosix-life-${index + 1}/600/400`,
  alt: `Life at Neosix — moment ${index + 1}`,
}));

export function LifePage() {
  return (
    <>
      <Seo
        title="Life at Neosix"
        description="Perks, culture and everyday moments at Neosix — what it feels like to build with us."
      />
      <PageHero
        label="LIFE AT NEOSIX"
        title="Do Great Work, Live a Great Life"
        lead="Culture is what happens between the standups — here is a look at ours."
        crumbs={[{ label: 'About', path: '/about' }, { label: 'Life at Neosix' }]}
      />
      <AboutNav />

      {/* Intro + perks */}
      <section className="section-pad bg-white">
        <div className="container-site">
          <Reveal className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
            <p className="lead-serif">
              We believe senior people do their best work when they are trusted, rested and
              genuinely excited about what they are building. Everything below exists to protect
              exactly that.
            </p>
          </Reveal>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {perks.map((perk) => (
              <motion.div key={perk.title} variants={staggerItem} className="h-full">
                <Card className="h-full">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-md bg-brand-gradient-soft text-white shadow-md shadow-primary-500/25">
                    <perk.icon size={26} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-base font-bold">{perk.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-body">{perk.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Photo mosaic */}
      <section className="section-pad bg-mist-100">
        <div className="container-site">
          <SectionHeading
            label="EVERYDAY MOMENTS"
            title="Snapshots From the Studio"
            lead="Retreats, launch days, whiteboard wars and Friday demos — the moments in between."
          />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6"
          >
            {mosaicImages.map((image, index) => (
              <motion.figure
                key={image.src}
                variants={staggerItem}
                className={index % 3 === 0 ? 'col-span-2 md:col-span-1' : undefined}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  className="h-full w-full rounded-md object-cover shadow-card transition-transform duration-500 hover:scale-[1.02]"
                />
              </motion.figure>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA band */}
      <section className="relative overflow-hidden bg-ink-900">
        <FloatingShapes />
        <div className="container-site relative py-20 text-center md:py-24">
          <Reveal>
            <span className="section-label text-neutral-500">JOIN US</span>
            <h2 className="mt-3 text-display-3 text-white md:text-display-2">
              Sound Like Your Kind of Place?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-7 text-neutral-400">
              We are always looking for kind, ambitious people who love shipping. Browse our open
              roles and say hello.
            </p>
            <Button to="/careers" size="lg" className="mt-8">
              View Open Positions
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
