import { zodResolver } from '@hookform/resolvers/zod';
import { Briefcase, Check, MapPin, UserRound } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import { useBySlug } from '@/api/hooks';
import { api } from '@/api/services';
import { PageHero } from '@/components/common/PageHero';
import { Seo } from '@/components/common/Seo';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/FormControls';
import { PageLoader } from '@/components/ui/Spinner';
import { Reveal } from '@/components/ui/Reveal';

const applicationSchema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
  resumeUrl: z.string().url('Please enter a valid link to your resume'),
  coverLetter: z.string().min(30, 'Tell us a little more — at least 30 characters'),
});

type ApplicationValues = z.infer<typeof applicationSchema>;

function CheckList({ heading, items }: { heading: string; items: string[] }) {
  return (
    <div className="mt-10">
      <h2 className="text-display-3">{heading}</h2>
      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm font-medium text-heading">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
              <Check size={14} aria-hidden="true" />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function JobDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: job, isLoading, isError } = useBySlug(api.jobOpenings, slug);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationValues>({ resolver: zodResolver(applicationSchema) });

  if (isLoading) return <PageLoader className="min-h-[60vh]" />;

  if (isError || !job) {
    return (
      <section className="section-pad">
        <div className="container-site py-16 text-center">
          <h1 className="text-display-3">Position Not Found</h1>
          <p className="lead-serif mx-auto mt-4 max-w-md">
            This opening may have been filled or is no longer available.
          </p>
          <div className="mt-8">
            <Button to="/careers">Back to Careers</Button>
          </div>
        </div>
      </section>
    );
  }

  const onSubmit = async (values: ApplicationValues) => {
    try {
      await api.jobApplications.create({ jobId: job.id, ...values, status: 'new' });
      toast.success('Application sent — we will get back to you within a week.');
      reset();
    } catch {
      toast.error('Something went wrong sending your application. Please try again.');
    }
  };

  return (
    <>
      <Seo
        title={`${job.title} — Careers at Neosix`}
        description={`Apply for the ${job.title} role at Neosix. ${job.location}, ${job.type}.`}
      />
      <PageHero
        label={job.department.toUpperCase()}
        title={job.title}
        crumbs={[{ label: 'Careers', path: '/careers' }, { label: job.title }]}
      />

      <section className="section-pad">
        <div className="container-site">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Reveal>
                <h2 className="text-display-3">About the Role</h2>
                <div
                  className="mt-4 text-[15px] leading-8 text-body [&_p]:mb-4"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
              </Reveal>
              <Reveal>
                <CheckList heading="Responsibilities" items={job.responsibilities} />
              </Reveal>
              <Reveal>
                <CheckList heading="Requirements" items={job.requirements} />
              </Reveal>
            </div>

            <aside>
              <Reveal>
                <Card hover={false} className="lg:sticky lg:top-28">
                  <h2 className="text-lg font-bold">Role Overview</h2>
                  <dl className="mt-6 space-y-5 text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin size={18} className="mt-0.5 shrink-0 text-primary-600" aria-hidden="true" />
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                          Location
                        </dt>
                        <dd className="mt-1 font-semibold text-heading">{job.location}</dd>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Briefcase size={18} className="mt-0.5 shrink-0 text-primary-600" aria-hidden="true" />
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                          Employment Type
                        </dt>
                        <dd className="mt-1">
                          <Badge className="capitalize">{job.type.replace('-', ' ')}</Badge>
                        </dd>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <UserRound size={18} className="mt-0.5 shrink-0 text-primary-600" aria-hidden="true" />
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                          Experience
                        </dt>
                        <dd className="mt-1 font-semibold text-heading">{job.experience}</dd>
                      </div>
                    </div>
                  </dl>
                  <a
                    href="#apply"
                    className="btn-ripple mt-8 inline-flex w-full items-center justify-center gap-2 rounded-btn bg-brand-gradient px-8 py-3.5 text-sm font-semibold tracking-wide text-white shadow-md shadow-primary-600/25 transition-all duration-300 hover:shadow-lg hover:shadow-primary-600/35 hover:brightness-110"
                  >
                    Apply Now
                  </a>
                </Card>
              </Reveal>
            </aside>
          </div>
        </div>
      </section>

      <section id="apply" className="section-pad bg-mist-100 scroll-mt-24">
        <div className="container-site">
          <div className="mx-auto max-w-2xl">
            <Reveal className="mb-10 text-center">
              <span className="section-label block">APPLY NOW</span>
              <h2 className="mt-3 text-display-3">Join the {job.department} Team</h2>
              <p className="lead-serif mt-4">
                Fill in the form below — we review every application personally.
              </p>
            </Reveal>
            <Reveal>
              <Card hover={false}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input
                      label="Full Name"
                      required
                      placeholder="Jane Doe"
                      autoComplete="name"
                      error={errors.name?.message}
                      {...register('name')}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      required
                      placeholder="jane@example.com"
                      autoComplete="email"
                      error={errors.email?.message}
                      {...register('email')}
                    />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input
                      label="Phone"
                      type="tel"
                      required
                      placeholder="+1 555 000 1234"
                      autoComplete="tel"
                      error={errors.phone?.message}
                      {...register('phone')}
                    />
                    <Input
                      label="Resume URL"
                      type="url"
                      required
                      placeholder="https://link-to-your-resume.pdf"
                      error={errors.resumeUrl?.message}
                      {...register('resumeUrl')}
                    />
                  </div>
                  <Textarea
                    label="Cover Letter"
                    required
                    rows={6}
                    placeholder="Tell us why this role is a great fit..."
                    error={errors.coverLetter?.message}
                    {...register('coverLetter')}
                  />
                  <Button type="submit" loading={isSubmitting} className="w-full sm:w-auto">
                    Submit Application
                  </Button>
                </form>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
