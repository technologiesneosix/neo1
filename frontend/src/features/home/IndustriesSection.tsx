import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useList } from '@/api/hooks';
import { api } from '@/api/services';
import { DynamicIcon } from '@/components/common/DynamicIcon';
import { Card } from '@/components/ui/Card';
import { staggerContainer, staggerItem } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PageLoader } from '@/components/ui/Spinner';

/** Compact centered industry cards in a 2/4-column grid. */
export function IndustriesSection() {
  const { data, isLoading } = useList(api.industries);
  const industries = (data ?? []).slice().sort((a, b) => a.order - b.order);

  if (isLoading) {
    return (
      <section className="section-pad bg-white">
        <PageLoader />
      </section>
    );
  }
  if (industries.length === 0) return null;

  return (
    <section className="section-pad bg-white">
      <div className="container-site">
        <SectionHeading
          label="INDUSTRIES"
          title="Domains We Know Deeply"
          lead="Sector experience means we arrive fluent in your regulations, integrations and edge cases — not learning on your dime."
        />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-2 gap-5 md:gap-6 lg:grid-cols-4"
        >
          {industries.map((industry, idx) => (
            <motion.article key={industry.id ?? idx} variants={staggerItem} className="h-full">
              <Link to={`/industries/${industry.slug}`} className="group block h-full">
                <Card className="flex h-full flex-col items-center p-6 text-center md:p-8">
                  <DynamicIcon
                    name={industry.icon}
                    size={34}
                    className="text-primary-600 transition-transform duration-300 group-hover:scale-110"
                  />
                  <h3 className="mt-4 text-[15px] transition-colors group-hover:text-primary-600">
                    {industry.title}
                  </h3>
                </Card>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
