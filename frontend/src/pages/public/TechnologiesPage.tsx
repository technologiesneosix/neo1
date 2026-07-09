import { motion } from 'framer-motion';
import { RefreshCw, ShieldCheck, Zap } from 'lucide-react';
import { useList } from '@/api/hooks';
import { api } from '@/api/services';
import { Card } from '@/components/ui/Card';
import { PageLoader } from '@/components/ui/Spinner';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal, staggerContainer, staggerItem } from '@/components/ui/Reveal';
import { DynamicIcon } from '@/components/common/DynamicIcon';
import { PageHero } from '@/components/common/PageHero';
import { Seo } from '@/components/common/Seo';
import { Tabs, type TabItem } from '@/components/ui/Tabs';
import type { Technology, TechnologyCategory } from '@/types';

const categoryLabels: Record<TechnologyCategory, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  mobile: 'Mobile',
  database: 'Database',
  cloud: 'Cloud',
  devops: 'DevOps',
  ai: 'AI & ML',
  design: 'Design',
  other: 'Other',
};

const categoryOrder: TechnologyCategory[] = [
  'frontend',
  'backend',
  'mobile',
  'database',
  'cloud',
  'devops',
  'ai',
  'design',
  'other',
];

const stackReasons = [
  {
    icon: ShieldCheck,
    title: 'Battle-Tested Choices',
    description:
      'Every tool here has survived years of production traffic on client systems — we adopt proven technology, not hype.',
  },
  {
    icon: Zap,
    title: 'Performance by Default',
    description:
      'Type-safe languages, efficient runtimes and edge-ready infrastructure keep your product fast as it grows.',
  },
  {
    icon: RefreshCw,
    title: 'Easy to Maintain & Hire For',
    description:
      'Mainstream, well-documented stacks mean your own team can take over the codebase — and find talent to grow it.',
  },
];

function TechnologyGrid({ technologies }: { technologies: Technology[] }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
    >
      {technologies.map((technology) => (
        <motion.div key={technology.id} variants={staggerItem} className="h-full">
          <Card className="flex h-full items-start gap-4 p-6">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary-600">
              <DynamicIcon name={technology.icon} size={22} />
            </span>
            <div>
              <h3 className="text-sm font-bold">{technology.name}</h3>
              <p className="mt-1.5 text-xs leading-5 text-body">{technology.description}</p>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

export function TechnologiesPage() {
  const { data: technologies, isLoading } = useList(api.technologies);

  const tabs: TabItem[] = categoryOrder
    .map((category) => {
      const categoryTechnologies = (technologies ?? [])
        .filter((technology) => technology.category === category)
        .sort((a, b) => a.order - b.order);
      return {
        id: category,
        label: categoryLabels[category],
        content: <TechnologyGrid technologies={categoryTechnologies} />,
        count: categoryTechnologies.length,
      };
    })
    .filter((tab) => tab.count > 0)
    .map(({ id, label, content }) => ({ id, label, content }));

  return (
    <>
      <Seo
        title="Technologies | Neosix"
        description="The production stack behind Neosix products — frontend, backend, mobile, database, cloud, DevOps and AI."
      />
      <PageHero
        label="TECHNOLOGIES"
        title="Our Production Stack"
        lead="Every tool below runs in production for our clients today — nothing experimental, nothing abandoned."
        crumbs={[{ label: 'Technologies' }]}
      />

      {/* Stack tabs */}
      <section className="section-pad bg-white">
        <div className="container-site">
          <SectionHeading
            label="THE TOOLKIT"
            title="Explore the Stack by Layer"
            lead="From pixel to pipeline — browse the technologies we reach for at each layer of a modern product."
          />
          {isLoading ? <PageLoader /> : tabs.length > 0 && <Tabs items={tabs} />}
        </div>
      </section>

      {/* Why our stack */}
      <section className="section-pad bg-mist-100">
        <div className="container-site">
          <SectionHeading
            label="WHY THIS STACK"
            title="Chosen for the Long Run"
            lead="Technology choices are ten-year decisions. Ours optimize for reliability, speed and your team's independence."
          />
          <div className="grid gap-8 lg:grid-cols-3">
            {stackReasons.map((reason, index) => (
              <Reveal key={reason.title} delay={index * 0.1} className="h-full">
                <Card className="h-full text-center">
                  <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-gradient-soft text-white">
                    <reason.icon size={24} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-base font-bold">{reason.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-body">{reason.description}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
