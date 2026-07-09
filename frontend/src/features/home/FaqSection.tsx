import { useList } from '@/api/hooks';
import { api } from '@/api/services';
import { Accordion } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PageLoader } from '@/components/ui/Spinner';

/** Two-column FAQ teaser — heading and CTA on the left, accordion on the right. */
export function FaqSection() {
  const { data, isLoading } = useList(api.faqs);
  const faqs = (data ?? [])
    .slice()
    .sort((a, b) => a.order - b.order)
    .slice(0, 5);

  if (isLoading) {
    return (
      <section className="section-pad bg-white">
        <PageLoader />
      </section>
    );
  }
  if (faqs.length === 0) return null;

  return (
    <section className="section-pad bg-white">
      <div className="container-site grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            align="left"
            label="FAQ"
            title="Answers, Up Front"
            className="mb-6 md:mb-8"
          />
          <p className="text-sm leading-7 text-body">
            The questions every prospective client asks us before kickoff — answered plainly. If
            yours is not here, we are one message away.
          </p>
          <div className="mt-8">
            <Button to="/contact">Ask Your Question</Button>
          </div>
        </div>
        <Reveal direction="left">
          <Accordion
            items={faqs.map((faq) => ({
              id: faq.id,
              title: faq.question,
              content: faq.answer,
            }))}
          />
        </Reveal>
      </div>
    </section>
  );
}
