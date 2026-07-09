import { motion } from 'framer-motion';
import { ArrowRight, CalendarClock, MapPin, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useList } from '@/api/hooks';
import { api } from '@/api/services';
import { PageHero } from '@/components/common/PageHero';
import { Seo } from '@/components/common/Seo';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PageLoader } from '@/components/ui/Spinner';
import { Reveal, staggerContainer, staggerItem } from '@/components/ui/Reveal';

const programFacts = [
  {
    icon: CalendarClock,
    title: '12-Week Program',
    text: 'A structured summer and winter cohort with a real product brief, not busywork — you ship to production.',
  },
  {
    icon: Users,
    title: '1:1 Mentorship',
    text: 'Every intern is paired with a senior engineer or designer who meets with you weekly and reviews all your work.',
  },
  {
    icon: TrendingUp,
    title: '80% Conversion',
    text: 'Four out of five interns receive a full-time offer at the end of the program — we hire to keep.',
  },
];

export function InternshipsPage() {
  const { data: jobs, isLoading } = useList(api.jobOpenings);
  const internships = (jobs ?? []).filter((job) => job.active && job.type === 'internship');

  return (
    <>
      <Seo
        title="Internships — Neosix"
        description="The Neosix internship program: 12 weeks, real production work, 1:1 mentorship and an 80% conversion rate to full-time roles."
      />
      <PageHero
        label="INTERNSHIPS"
        title="Start Your Career With Real Work"
        lead="No coffee runs, no shadow projects — our interns ship code and designs that real customers use."
        crumbs={[{ label: 'Careers', path: '/careers' }, { label: 'Internships' }]}
      />

      <section className="section-pad">
        <div className="container-site">
          <Reveal className="mx-auto mb-14 max-w-3xl text-center">
            <p className="lead-serif">
              Twice a year we welcome a small cohort of students and new graduates into our
              engineering and design teams. You get a dedicated mentor, a real product brief and
              the same code review bar as everyone else. By week twelve, your work is in
              production and on your resume.
            </p>
          </Reveal>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid gap-8 md:grid-cols-3"
          >
            {programFacts.map((fact) => (
              <motion.div key={fact.title} variants={staggerItem}>
                <Card className="h-full text-center">
                  <fact.icon size={36} className="mx-auto text-primary-600" strokeWidth={1.5} aria-hidden="true" />
                  <h2 className="mt-4 text-lg font-bold">{fact.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-body">{fact.text}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section-pad bg-mist-100">
        <div className="container-site">
          <SectionHeading
            label="OPEN INTERNSHIPS"
            title="Current Internship Openings"
            lead="Applications are reviewed on a rolling basis — apply early."
          />
          {isLoading ? (
            <PageLoader />
          ) : internships.length === 0 ? (
            <p className="py-8 text-center text-body">
              The current cohort is full. Follow our{' '}
              <Link to="/blog" className="font-semibold text-primary-600">
                blog
              </Link>{' '}
              or{' '}
              <Link to="/contact" className="font-semibold text-primary-600">
                drop us a line
              </Link>{' '}
              to hear when the next one opens.
            </p>
          ) : (
            <div className="mx-auto max-w-3xl space-y-5">
              {internships.map((job) => (
                <Reveal key={job.id}>
                  <Card className="hover:-translate-y-1">
                    <Link
                      to={`/careers/${job.slug}`}
                      className="group flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <h3 className="text-lg font-bold text-heading transition-colors group-hover:text-primary-600">
                          {job.title}
                        </h3>
                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-neutral-500">
                          <span className="uppercase tracking-wider">{job.department}</span>
                          <span className="flex items-center gap-1">
                            <MapPin size={13} className="text-primary-600" aria-hidden="true" />
                            {job.location}
                          </span>
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
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-gradient">
        <div className="container-site relative py-16 text-center md:py-20">
          <Reveal>
            <h2 className="text-display-3 text-white md:text-display-2">
              Not Sure Which Team Fits You?
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-serif text-lg leading-8 text-white/80">
              Learn how our hiring works, or just say hello — we read everything.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button to="/careers/hiring-process" variant="dark">
                See the Hiring Process
              </Button>
              <Button
                to="/contact"
                className="bg-none bg-transparent border-2 border-white shadow-none hover:bg-white/10 hover:shadow-none hover:brightness-100"
              >
                Contact Us
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
