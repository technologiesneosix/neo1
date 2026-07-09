import { motion } from 'framer-motion';
import { CodeXml, FileText, Handshake, PhoneCall, Users } from 'lucide-react';
import { PageHero } from '@/components/common/PageHero';
import { Seo } from '@/components/common/Seo';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal, staggerContainer, staggerItem } from '@/components/ui/Reveal';

const steps = [
  {
    icon: FileText,
    title: 'Apply',
    text: 'Send your resume and a short note. A real person — usually your future teammate — reads every application within five working days.',
  },
  {
    icon: PhoneCall,
    title: 'Intro Call',
    text: 'A relaxed 30-minute conversation about your background, what you are looking for, and how we work. No trick questions.',
  },
  {
    icon: CodeXml,
    title: 'Technical Deep-Dive',
    text: 'A 90-minute practical session built around realistic work — pairing on a problem or walking through a design — never whiteboard puzzles.',
  },
  {
    icon: Users,
    title: 'Team Fit',
    text: 'Meet the people you would actually work with. You interview us as much as we interview you — ask anything.',
  },
  {
    icon: Handshake,
    title: 'Offer',
    text: 'A clear written offer with transparent leveling and compensation. Most candidates go from application to offer in under three weeks.',
  },
];

export function HiringProcessPage() {
  return (
    <>
      <Seo
        title="Hiring Process — Neosix"
        description="How hiring at Neosix works: five transparent steps from application to offer, usually in under three weeks."
      />
      <PageHero
        label="HIRING PROCESS"
        title="How We Hire"
        lead="Five steps, zero trick questions, and a decision in under three weeks — here is exactly what to expect."
        crumbs={[{ label: 'Careers', path: '/careers' }, { label: 'Hiring Process' }]}
      />

      <section className="section-pad">
        <div className="container-site">
          <motion.ol
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="relative mx-auto max-w-3xl space-y-8"
          >
            <span
              className="absolute bottom-8 left-6 top-8 hidden w-px bg-gradient-to-b from-primary-500 to-accent-400 sm:block"
              aria-hidden="true"
            />
            {steps.map((step, index) => (
              <motion.li key={step.title} variants={staggerItem} className="relative sm:pl-20">
                <span
                  className="absolute left-0 top-8 hidden h-12 w-12 items-center justify-center rounded-full bg-brand-gradient text-lg font-bold text-white shadow-md shadow-primary-600/25 sm:flex"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <Card className="hover:-translate-y-1">
                  <div className="flex items-start gap-5">
                    <step.icon
                      size={34}
                      strokeWidth={1.5}
                      className="mt-1 shrink-0 text-primary-600"
                      aria-hidden="true"
                    />
                    <div>
                      <h2 className="text-lg font-bold">
                        <span className="mr-2 text-primary-600 sm:hidden">{index + 1}.</span>
                        {step.title}
                      </h2>
                      <p className="mt-2 text-sm leading-7 text-body">{step.text}</p>
                    </div>
                  </div>
                </Card>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </section>

      <section className="section-pad bg-mist-100">
        <div className="container-site">
          <SectionHeading
            label="GOOD TO KNOW"
            title="Questions Before You Apply?"
            lead="Ownership, engagement models, time zones — the answers to the questions we hear most often live in our FAQ."
          />
          <Reveal className="text-center">
            <Button to="/faq">Read the FAQ</Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
