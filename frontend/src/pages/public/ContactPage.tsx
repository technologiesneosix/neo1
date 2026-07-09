import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarDays, Mail, MapPin, Smartphone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { useSiteSettings } from '@/api/hooks';
import { api } from '@/api/services';
import { PageHero } from '@/components/common/PageHero';
import { Seo } from '@/components/common/Seo';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/FormControls';
import { PageLoader } from '@/components/ui/Spinner';
import { Reveal } from '@/components/ui/Reveal';
import { parsePhoneNumbers, phoneHref } from '@/lib/utils';

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Please tell us a bit more — at least 10 characters'),
});

type ContactValues = z.infer<typeof contactSchema>;

export function ContactPage() {
  const { settings, isLoading } = useSiteSettings();
  const phoneNumbers = parsePhoneNumbers(settings?.phone ?? '');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (values: ContactValues) => {
    try {
      await api.contactMessages.create({
        ...values,
        subject: 'Website inquiry',
        read: false,
      });
      toast.success("Message sent — we'll get back to you within one business day.");
      reset();
    } catch {
      toast.error('Something went wrong sending your message. Please try again.');
    }
  };

  return (
    <>
      <Seo
        title="Contact Us — Neosix"
        description="Talk to the Neosix team about your project. Offices, phone, email and a form that reaches real humans."
      />
      <PageHero
        label="CONTACT US"
        title="Let's Talk About Your Project"
        lead="Tell us where you are and where you want to be — we will map the shortest route between the two."
        crumbs={[{ label: 'Contact' }]}
      />

      <section className="section-pad bg-ink-900">
        <div className="container-site">
          {isLoading ? (
            <PageLoader />
          ) : (
            <div className="grid gap-16 lg:grid-cols-2">
              <Reveal direction="right">
                <h2 className="text-display-3 text-white">Contact Us</h2>
                <div className="mt-10 grid gap-10 sm:grid-cols-2">
                  <div className="text-center">
                    <MapPin size={40} strokeWidth={1} className="mx-auto text-accent-400" aria-hidden="true" />
                    <h3 className="mt-4 text-sm font-bold uppercase tracking-wider text-white">
                      Address
                    </h3>
                    <address className="mt-2 whitespace-pre-line text-sm not-italic leading-7 text-neutral-400">
                      {settings?.address ?? '—'}
                    </address>
                  </div>
                  <div className="text-center">
                    <Smartphone size={40} strokeWidth={1} className="mx-auto text-primary-400" aria-hidden="true" />
                    <h3 className="mt-4 text-sm font-bold uppercase tracking-wider text-white">
                      Phone Number
                    </h3>
                    <div className="mt-2 text-sm leading-7 text-neutral-400">
                      {phoneNumbers.length > 0 ? (
                        phoneNumbers.map((phone) => (
                          <a
                            key={phone}
                            href={phoneHref(phone)}
                            className="block transition-colors hover:text-white"
                          >
                            {phone}
                          </a>
                        ))
                      ) : (
                        '—'
                      )}
                    </div>
                  </div>
                  <div className="text-center">
                    <Mail size={40} strokeWidth={1} className="mx-auto text-primary-400" aria-hidden="true" />
                    <h3 className="mt-4 text-sm font-bold uppercase tracking-wider text-white">
                      E-mail Address
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-neutral-400">
                      {settings?.email ? (
                        <a
                          href={`mailto:${settings.email}`}
                          className="transition-colors hover:text-white"
                        >
                          {settings.email}
                        </a>
                      ) : (
                        '—'
                      )}
                    </p>
                  </div>
                  <div className="text-center">
                    <CalendarDays size={40} strokeWidth={1} className="mx-auto text-accent-400" aria-hidden="true" />
                    <h3 className="mt-4 text-sm font-bold uppercase tracking-wider text-white">
                      Working Days/Hours
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-neutral-400">
                      {settings?.workingHours ?? '—'}
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal direction="left">
                <h2 className="text-display-3 text-white">Send a Message</h2>
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-10 space-y-5">
                  <div className="space-y-5">
                    <Input
                      aria-label="Your Name"
                      required
                      placeholder="Your Name"
                      autoComplete="name"
                      error={errors.name?.message}
                      {...register('name')}
                    />
                    <Input
                      aria-label="Email Address"
                      type="email"
                      required
                      placeholder="Email Address"
                      autoComplete="email"
                      error={errors.email?.message}
                      {...register('email')}
                    />
                  </div>
                  <Textarea
                    aria-label="Your Message"
                    required
                    rows={7}
                    placeholder="Your Message"
                    error={errors.message?.message}
                    {...register('message')}
                  />
                  <Button type="submit" loading={isSubmitting}>
                    Send Message
                  </Button>
                </form>
              </Reveal>
            </div>
          )}
        </div>
      </section>

      {settings?.mapEmbedUrl && (
        <section aria-label="Office location map">
          <iframe
            src={settings.mapEmbedUrl}
            title="Neosix office location"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block aspect-[16/9] w-full border-0 grayscale md:aspect-[16/6]"
          />
        </section>
      )}
    </>
  );
}
