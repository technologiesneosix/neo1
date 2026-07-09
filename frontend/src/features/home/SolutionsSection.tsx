import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useList } from '@/api/hooks';
import { api } from '@/api/services';
import { DynamicIcon } from '@/components/common/DynamicIcon';
import { WaveDivider } from '@/components/common/WaveDivider';
import { Card } from '@/components/ui/Card';
import { staggerContainer, staggerItem } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PageLoader } from '@/components/ui/Spinner';

/** Mist-gray band of solution platform cards, framed by wave transitions. */
export function SolutionsSection() {
  const { data, isLoading } = useList(api.solutions);
  const solutions = (data ?? []).slice().sort((a, b) => a.order - b.order);

  if (isLoading) {
    return (
      <section className="section-pad bg-mist-100">
        <PageLoader />
      </section>
    );
  }
  if (solutions.length === 0) return null;

  return (
    <section aria-label="Our solutions">
      <WaveDivider fill="#f1f3f7" className="bg-white" />
      <div className="bg-mist-100">
        <div className="container-site section-pad">
          <SectionHeading
            label="OUR SOLUTIONS"
            title="Platforms We Deliver"
            lead="Proven product platforms we tailor to your workflows — configured, integrated and supported long after launch."
          />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {solutions.map((solution, idx) => (
              <motion.article key={solution.id ?? idx} variants={staggerItem} className="h-full">
                <Card className="flex h-full flex-col">
                  <DynamicIcon name={solution.icon} size={36} className="text-primary-600" />
                  <h3 className="mt-5 text-lg">
                    <Link
                      to={`/solutions/${solution.slug}`}
                      className="transition-colors hover:text-primary-600"
                    >
                      {solution.title}
                    </Link>
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-body">{solution.excerpt}</p>
                  <Link
                    to={`/solutions/${solution.slug}`}
                    className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-600 transition-colors hover:text-primary-700"
                  >
                    Learn More <span aria-hidden="true">+</span>
                  </Link>
                </Card>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>
      <WaveDivider fill="#ffffff" className="bg-mist-100" />
    </section>
  );
}
