import { MessageCircleQuestion } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useList } from '@/api/hooks';
import { api } from '@/api/services';
import { PageHero } from '@/components/common/PageHero';
import { Seo } from '@/components/common/Seo';
import { Accordion } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageLoader } from '@/components/ui/Spinner';
import { Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/cn';

const ALL = 'All';

export function FaqPage() {
  const { data: faqs, isLoading } = useList(api.faqs);
  const [activeCategory, setActiveCategory] = useState(ALL);

  const sorted = useMemo(() => [...(faqs ?? [])].sort((a, b) => a.order - b.order), [faqs]);
  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(sorted.map((faq) => faq.category)))],
    [sorted],
  );
  const visible =
    activeCategory === ALL ? sorted : sorted.filter((faq) => faq.category === activeCategory);

  const accordionItems = visible.map((faq) => ({
    id: faq.id,
    title: faq.question,
    content: faq.answer,
  }));

  return (
    <>
      <Seo
        title="FAQ — Neosix"
        description="Answers to the questions we hear most about engagements, ownership, support and how Neosix works."
      />
      <PageHero
        label="FAQ"
        title="Frequently Asked Questions"
        lead="Engagements, ownership, billing and support — the questions every client asks, answered plainly."
        crumbs={[{ label: 'FAQ' }]}
      />

      <section className="section-pad">
        <div className="container-site">
          <Reveal>
            <div
              className="mb-12 flex flex-wrap items-center justify-center gap-2"
              role="group"
              aria-label="Filter questions by category"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={activeCategory === category}
                  className={cn(
                    'rounded-btn px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300',
                    activeCategory === category
                      ? 'bg-brand-gradient text-white shadow-md shadow-primary-600/25'
                      : 'text-neutral-500 hover:text-primary-600',
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </Reveal>

          {isLoading ? (
            <PageLoader />
          ) : (
            <div className="grid gap-10 lg:grid-cols-3">
              <div className="lg:col-span-2">
                {accordionItems.length > 0 ? (
                  <Reveal>
                    <Accordion items={accordionItems} />
                  </Reveal>
                ) : (
                  <p className="py-16 text-center text-body">
                    No questions in this category yet.
                  </p>
                )}
              </div>
              <aside>
                <Reveal>
                  <Card hover={false} className="text-center lg:sticky lg:top-28">
                    <MessageCircleQuestion
                      size={40}
                      strokeWidth={1.25}
                      className="mx-auto text-primary-600"
                      aria-hidden="true"
                    />
                    <h2 className="mt-4 text-lg font-bold">Still Have Questions?</h2>
                    <p className="mt-2 text-sm leading-7 text-body">
                      Can't find what you are looking for? Our team replies to every message
                      within one business day.
                    </p>
                    <Button to="/contact" className="mt-6 w-full">
                      Contact Us
                    </Button>
                  </Card>
                </Reveal>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
