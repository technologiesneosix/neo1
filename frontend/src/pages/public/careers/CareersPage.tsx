import { motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  Clock,
  GraduationCap,
  HeartPulse,
  Laptop,
  MapPin,
  Plane,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useList } from '@/api/hooks';
import { api } from '@/api/services';
import { BlobFrame } from '@/components/common/BlobFrame';
import { PageHero } from '@/components/common/PageHero';
import { Seo } from '@/components/common/Seo';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PageLoader } from '@/components/ui/Spinner';
import { Reveal, staggerContainer, staggerItem } from '@/components/ui/Reveal';

const cultureHighlights = [
  'Senior, low-ego teams that ship together',
  'Remote-friendly with real flexibility',
  'A learning budget you are expected to spend',
  'Client work that reaches millions of users',
];

const perks = [
  { icon: HeartPulse, title: 'Health First', text: 'Full medical, dental and vision cover for you and your family.' },
  { icon: Laptop, title: 'Top Gear', text: 'The hardware and tools you need, refreshed every two years.' },
  { icon: GraduationCap, title: 'Learning Budget', text: 'Annual budget for courses, books and conferences.' },
  { icon: Plane, title: 'Generous Time Off', text: '25+ days of paid vacation plus local public holidays.' },
  { icon: Clock, title: 'Flexible Hours', text: 'Organize your day around deep work, not the clock.' },
  { icon: TrendingUp, title: 'Clear Growth', text: 'Transparent leveling with twice-yearly progression reviews.' },
];

const typeTone = {
  'full-time': 'primary',
  'part-time': 'accent',
  contract: 'warning',
  internship: 'success',
} as const;

export function CareersPage() {
  const { data: jobs, isLoading } = useList(api.jobOpenings);
  const openings = (jobs ?? []).filter((job) => job.active);

  return (
    <>
      <Seo
        title="Careers — Neosix"
        description="Join Neosix and build enterprise software that reaches millions of users. Explore open positions, internships and our hiring process."
      />
      <PageHero
        label="CAREERS"
        title="Do Your Best Work Here"
        lead="Join a senior team that cares about craft, ships real products and treats people like adults."
        crumbs={[{ label: 'Careers' }]}
      />

      <section className="section-pad">
        <div className="container-site">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal direction="right">
              <BlobFrame
                imageUrl="https://picsum.photos/seed/neosix-careers/900/900"
                alt="The Neosix team collaborating in the studio"
              />
            </Reveal>
            <Reveal direction="left">
              <span className="section-label block">LIFE AT NEOSIX</span>
              <h2 className="mt-3 text-display-3 md:text-display-2">Built by People Who Love the Craft</h2>
              <p className="lead-serif mt-6">
                We are a team of engineers, designers and strategists who believe great software
                comes from small teams with high trust and high standards.
              </p>
              <ul className="mt-8 space-y-3">
                {cultureHighlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-3 text-sm font-medium text-heading">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                      <Check size={14} aria-hidden="true" />
                    </span>
                    {highlight}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button to="/careers/internships" variant="outline">
                  Internship Program
                </Button>
                <Button to="/careers/hiring-process" variant="outline">
                  Our Hiring Process
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-pad bg-mist-100">
        <div className="container-site">
          <SectionHeading
            label="PERKS & BENEFITS"
            title="We Take Care of Our Own"
            lead="Compensation is only the start — here is what working at Neosix actually comes with."
          />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {perks.map((perk) => (
              <motion.div key={perk.title} variants={staggerItem}>
                <Card className="h-full text-center">
                  <perk.icon size={36} className="mx-auto text-primary-600" strokeWidth={1.5} aria-hidden="true" />
                  <h3 className="mt-4 text-lg font-bold">{perk.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-body">{perk.text}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section-pad" id="openings">
        <div className="container-site">
          <SectionHeading
            label="OPEN POSITIONS"
            title="Find Your Next Role"
            lead="Every application is read by a human — usually the person you would be working with."
          />
          {isLoading ? (
            <PageLoader />
          ) : openings.length === 0 ? (
            <p className="py-8 text-center text-body">
              No open positions right now — send us a note at{' '}
              <Link to="/contact" className="font-semibold text-primary-600">
                our contact page
              </Link>{' '}
              and we will keep you in mind.
            </p>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              className="mx-auto max-w-4xl space-y-5"
            >
              {openings.map((job) => (
                <motion.div key={job.id} variants={staggerItem}>
                  <Card className="hover:-translate-y-1">
                    <Link
                      to={`/careers/${job.slug}`}
                      className="group flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <h3 className="text-lg font-bold text-heading transition-colors group-hover:text-primary-600">
                          {job.title}
                        </h3>
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-neutral-500">
                          <span className="uppercase tracking-wider">{job.department}</span>
                          <span className="flex items-center gap-1">
                            <MapPin size={13} className="text-primary-600" aria-hidden="true" />
                            {job.location}
                          </span>
                          <Badge tone={typeTone[job.type]} className="capitalize">
                            {job.type.replace('-', ' ')}
                          </Badge>
                          <span>{job.experience}</span>
                        </div>
                      </div>
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center self-end rounded-full bg-primary-50 text-primary-600 transition-all duration-300 group-hover:bg-brand-gradient group-hover:text-white sm:self-center"
                        aria-hidden="true"
                      >
                        <ArrowRight size={18} />
                      </span>
                    </Link>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
