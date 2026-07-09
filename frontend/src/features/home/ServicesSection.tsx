import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useList } from '@/api/hooks';
import { api } from '@/api/services';
import { DynamicIcon } from '@/components/common/DynamicIcon';
import { Card } from '@/components/ui/Card';
import { staggerContainer, staggerItem } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PageLoader } from '@/components/ui/Spinner';

/** Featured services grid — icon cards with "Learn More +" links. */
export function ServicesSection() {
  const { data, isLoading } = useList(api.services);
  const featured = (data ?? [])
    .filter((service) => service.featured)
    .sort((a, b) => a.order - b.order);

  if (isLoading) {
    return (
      <section className="section-pad bg-white">
        <PageLoader />
      </section>
    );
  }
  if (featured.length === 0) return null;

  return (
    <section className="section-pad bg-white">
      <div className="container-site">
        <SectionHeading
          label="OUR SERVICES"
          title="What We Do Best"
          lead="End-to-end product engineering — strategy, design, build and run — delivered by senior teams who own outcomes."
        />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {featured.map((service) => (
            <motion.article key={service.id} variants={staggerItem} className="h-full">
              <Card className="flex h-full flex-col">
                <DynamicIcon name={service.icon} size={36} className="text-primary-600" />
                <h3 className="mt-5 text-lg">{service.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-body">{service.excerpt}</p>
                <Link
                  to={`/services/${service.slug}`}
                  className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-600 transition-colors hover:text-primary-700"
                >
                  Learn More <span aria-hidden="true">+</span>
                </Link>
              </Card>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
