import { Cpu } from 'lucide-react';
import { useList } from '@/api/hooks';
import { api } from '@/api/services';
import { Reveal } from '@/components/ui/Reveal';
import { PageLoader } from '@/components/ui/Spinner';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Tabs, type TabItem } from '@/components/ui/Tabs';
import type { Technology, TechnologyCategory } from '@/types';

const CATEGORY_LABELS: { id: TechnologyCategory; label: string }[] = [
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'database', label: 'Database' },
  { id: 'devops', label: 'DevOps' },
  { id: 'design', label: 'Design' },
  { id: 'other', label: 'Other' },
];

function TechChips({ technologies }: { technologies: Technology[] }) {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-3">
      {technologies.map((tech, idx) => (
        <li
          key={tech.id ?? (tech as any).slug ?? idx}
          className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-5 py-2.5 text-sm font-medium text-heading"
        >
          <Cpu size={16} className="text-primary-600" aria-hidden="true" />
          {tech.name}
        </li>
      ))}
    </ul>
  );
}

/** Tabbed technology stack — one tab per category, chips per technology. */
export function TechStackSection() {
  const { data, isLoading } = useList(api.technologies);

  if (isLoading) {
    return (
      <section className="section-pad bg-white">
        <PageLoader />
      </section>
    );
  }

  const technologies = (data ?? []).slice().sort((a, b) => a.order - b.order);
  const tabs: TabItem[] = CATEGORY_LABELS.map(({ id, label }) => {
    const group = technologies.filter((tech) => tech.category === id);
    return { id, label, content: <TechChips technologies={group} /> };
  }).filter((tab) => technologies.some((tech) => tech.category === tab.id));

  if (tabs.length === 0) return null;

  return (
    <section className="section-pad bg-white">
      <div className="container-site">
        <SectionHeading
          label="TECHNOLOGIES"
          title="Our Production Stack"
          lead="Boring where it should be, cutting-edge where it counts — every tool below runs in production for our clients today."
        />
        <Reveal>
          <Tabs items={tabs} className="mx-auto max-w-4xl" />
        </Reveal>
      </div>
    </section>
  );
}
