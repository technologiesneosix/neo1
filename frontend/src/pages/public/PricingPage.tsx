import { Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useList } from '@/api/hooks';
import { api } from '@/api/services';
import { PageHero } from '@/components/common/PageHero';
import { Seo } from '@/components/common/Seo';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageLoader } from '@/components/ui/Spinner';
import { Reveal, staggerContainer, staggerItem } from '@/components/ui/Reveal';
import { cn } from '@/lib/cn';


export function PricingPage() {
  const { data: pricingPlans, isLoading } = useList(api.pricingPlans);
  const [isAnnual, setIsAnnual] = useState(false);

  const sortedPlans = useMemo(() => {
    return [...(pricingPlans ?? [])].sort((a, b) => a.order - b.order);
  }, [pricingPlans]);

  return (
    <>
      <Seo
        title="Pricing Plans — Neosix"
        description="Choose the plan that fits your stage of growth. Simple, transparent pricing for teams of all sizes."
      />
      <PageHero
        label="PRICING"
        title="Simple, Transparent Pricing"
        lead="Flexible plans tailored for startups, growing companies, and enterprises. Choose what works best for your team."
        crumbs={[{ label: 'Pricing' }]}
      />

      <section className="section-pad bg-neutral-50/50">
        <div className="container-site">
          {/* Billing Switch Toggle */}

          <Reveal>
            <div className="mb-16 flex items-center justify-center gap-4">
              <span className={cn('text-sm font-medium transition-colors duration-200', !isAnnual ? 'text-heading' : 'text-neutral-400')}>
                Monthly Billing
              </span>
              <button
                type="button"
                onClick={() => setIsAnnual(!isAnnual)}
                className={cn(
                  'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                  isAnnual ? 'bg-primary-600' : 'bg-neutral-200',
                )}
                role="switch"
                aria-checked={isAnnual}
              >
                <span
                  className={cn(
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                    isAnnual ? 'translate-x-5' : 'translate-x-0',
                  )}
                />
              </button>
              <span className={cn('text-sm font-medium transition-colors duration-200 flex items-center gap-1.5', isAnnual ? 'text-heading' : 'text-neutral-400')}>
                Annual Billing
                <span className="inline-flex items-center rounded-full bg-primary-100 px-2 py-0.5 text-xs font-semibold text-primary-800">
                  Save 20%
                </span>
              </span>
            </div>
          </Reveal>

          {isLoading ? (
            <PageLoader />
          ) : sortedPlans.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
            >
              {sortedPlans.map((plan) => {
                const displayPrice = isAnnual ? Math.round(plan.price * 0.8) : plan.price;
                const displayPeriod = isAnnual ? 'per month, billed annually' : plan.period;

                return (
                  <motion.div key={plan.id} variants={staggerItem} className="h-full">
                    <Card
                      className={cn(
                        'relative flex h-full flex-col justify-between border-2 transition-all duration-300',
                        plan.highlighted
                          ? 'border-primary-600 bg-white shadow-xl shadow-primary-600/10 scale-105 md:scale-105 lg:scale-105 z-10'
                          : 'border-transparent bg-white shadow-card',
                      )}
                    >
                      {plan.highlighted && (
                        <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 rounded-full bg-primary-600 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
                          <Sparkles size={12} />
                          Popular
                        </span>
                      )}

                      <div>
                        <h3 className="text-xl font-bold text-heading">{plan.name}</h3>
                        <p className="mt-2 text-sm text-neutral-500 min-h-[40px] leading-relaxed">
                          {plan.description}
                        </p>

                        <div className="mt-6 flex items-baseline text-heading">
                          <span className="text-4xl font-extrabold tracking-tight">${displayPrice}</span>
                          <span className="ml-1 text-sm font-semibold text-neutral-500">
                            /{displayPeriod.includes('billed annually') ? 'mo' : plan.period.replace('per ', '')}
                          </span>
                        </div>
                        {isAnnual && (
                          <div className="mt-1 text-xs text-primary-600 font-semibold">
                            Billed annually (${displayPrice * 12}/year)
                          </div>
                        )}

                        <ul className="mt-8 space-y-4">
                          {plan.features.map((feature: string) => (
                            <li key={feature} className="flex items-start text-sm text-neutral-600">
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-50 mr-3 text-primary-600">
                                <Check size={12} strokeWidth={3} />
                              </span>
                              <span className="leading-tight">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button
                        to={`/contact?plan=${encodeURIComponent(plan.name)}&billing=${isAnnual ? 'annual' : 'monthly'}`}
                        variant={plan.highlighted ? 'primary' : 'outline'}
                        className="mt-8 w-full font-semibold"
                      >
                        {plan.ctaLabel}
                      </Button>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (

            <div className="text-center py-20">
              <p className="text-neutral-500">No pricing plans found. Please seed the database or check back later.</p>
            </div>
          )}
        </div>
      </section>

      {/* Frequently Asked Questions Section */}
      <section className="section-pad border-t border-neutral-100 bg-white">
        <div className="container-site text-center">
          <Reveal>
            <h2 className="text-display-3 text-heading">Need more custom services?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-body leading-relaxed">
              If your organization requires custom SLAs, dedicated infrastructure, white-glove migration, or specific regulatory compliances, we can structure a custom engagement.
            </p>
            <Button to="/contact" variant="dark" className="mt-8">
              Talk to Our Enterprise Team
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
