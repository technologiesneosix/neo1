import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { useList } from '@/api/hooks';
import { api } from '@/api/services';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageLoader } from '@/components/ui/Spinner';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal, staggerContainer, staggerItem } from '@/components/ui/Reveal';
import { PageHero } from '@/components/common/PageHero';
import { Seo } from '@/components/common/Seo';
import { AboutNav } from '@/features/about/AboutNav';

export function CertificationsPage() {
  const { data: certifications, isLoading } = useList(api.certifications);

  return (
    <>
      <Seo
        title="Certifications | Neosix"
        description="ISO 27001, SOC 2 Type II and top-tier cloud partnerships — the audits and accreditations behind Neosix."
      />
      <PageHero
        label="CERTIFICATIONS"
        title="Independently Verified, Continuously Audited"
        lead="Security and quality claims are easy to make — ours are checked by third parties every year."
        crumbs={[{ label: 'About', path: '/about' }, { label: 'Certifications' }]}
      />
      <AboutNav />

      <section className="section-pad bg-white">
        <div className="container-site">
          <SectionHeading
            label="CREDENTIALS"
            title="Standards We Are Held To"
            lead="Every certification below is renewed on schedule and available for review during vendor due diligence."
          />

          {isLoading && <PageLoader />}

          {certifications && certifications.length > 0 && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
            >
              {certifications.map((certification) => (
                <motion.div key={certification.id} variants={staggerItem} className="h-full">
                  <Card className="flex h-full flex-col p-6">
                    <img
                      src={certification.imageUrl}
                      alt={`${certification.name} certificate`}
                      className="h-36 w-full rounded object-cover"
                      loading="lazy"
                    />
                    <div className="mt-5 flex items-start justify-between gap-3">
                      <h3 className="text-base font-bold">{certification.name}</h3>
                      <Badge tone="primary">{certification.year}</Badge>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-body">{certification.issuer}</p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Trust copy */}
          <Reveal className="mt-16">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 rounded-md bg-mist-100 p-8 text-center md:p-10">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-gradient text-white">
                <ShieldCheck size={26} aria-hidden="true" />
              </span>
              <h3 className="text-xl font-bold">Compliance Without the Friction</h3>
              <p className="lead-serif">
                From HIPAA-adjacent healthcare builds to SOC 2-scoped SaaS platforms, our security
                program is designed to pass your procurement review — audit reports, policies and
                penetration test summaries are ready when your team asks.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
