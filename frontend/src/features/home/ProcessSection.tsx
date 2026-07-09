import { motion } from 'framer-motion';
import { useList } from '@/api/hooks';
import { api } from '@/api/services';
import { DynamicIcon } from '@/components/common/DynamicIcon';
import { staggerContainer, staggerItem } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PageLoader } from '@/components/ui/Spinner';

/** Dark five-step delivery process with numbered gradient circles. */
export function ProcessSection() {
  const { data, isLoading } = useList(api.processSteps);
  const steps = (data ?? []).slice().sort((a, b) => a.order - b.order);

  if (isLoading) {
    return (
      <section className="section-pad bg-ink-900">
        <PageLoader />
      </section>
    );
  }
  if (steps.length === 0) return null;

  return (
    <section className="section-pad relative overflow-hidden bg-ink-900">
      <div className="container-site">
        <SectionHeading
          dark
          label="OUR PROCESS"
          title="From Idea to Launch"
          lead="A transparent, battle-tested delivery path — you always know what we are building, why, and what ships next."
        />
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute left-[10%] right-[10%] top-10 hidden border-t-2 border-dashed border-white/10 lg:block"
          />
          <motion.ol
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="relative grid gap-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8"
          >
            {steps.map((step, index) => (
              <motion.li key={step.id} variants={staggerItem} className="text-center">
                <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-gradient text-white shadow-lg shadow-primary-950/50">
                  <DynamicIcon name={step.icon} size={30} />
                  <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold text-primary-700">
                    {index + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-base text-white">{step.title}</h3>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-neutral-400">
                  {step.description}
                </p>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
