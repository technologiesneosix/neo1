import { Star } from 'lucide-react';
import { useList } from '@/api/hooks';
import { api } from '@/api/services';
import { Carousel } from '@/components/ui/Carousel';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PageLoader } from '@/components/ui/Spinner';
import type { Testimonial } from '@/types';

function TestimonialSlide({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="text-center">
      <img
        src={testimonial.avatarUrl}
        alt={testimonial.name}
        loading="lazy"
        className="mx-auto h-20 w-20 rounded-full object-cover shadow-card"
      />
      <div
        className="mt-5 flex justify-center gap-1"
        role="img"
        aria-label={`Rated ${testimonial.rating} out of 5 stars`}
      >
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            size={18}
            aria-hidden="true"
            className={
              index < testimonial.rating
                ? 'fill-accent-400 text-accent-400'
                : 'fill-neutral-200 text-neutral-200'
            }
          />
        ))}
      </div>
      <blockquote className="lead-serif mx-auto mt-6 max-w-2xl italic">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-7">
        <span className="block text-base font-bold text-heading">{testimonial.name}</span>
        <span className="mt-1.5 block text-xs uppercase tracking-[0.15em] text-neutral-400">
          {testimonial.role} &middot; {testimonial.company}
        </span>
      </figcaption>
    </figure>
  );
}

/** Centered testimonial carousel with avatar, stars and serif quote. */
export function TestimonialsSection() {
  const { data, isLoading } = useList(api.testimonials);
  const testimonials = (data ?? [])
    .filter((testimonial) => testimonial.active)
    .sort((a, b) => a.order - b.order);

  if (isLoading) {
    return (
      <section className="section-pad bg-white">
        <PageLoader />
      </section>
    );
  }
  if (testimonials.length === 0) return null;

  return (
    <section className="section-pad bg-white">
      <div className="container-site">
        <SectionHeading label="TESTIMONIALS" title="What Clients Say" />
        <Carousel
          className="mx-auto max-w-3xl"
          count={testimonials.length}
          render={(index) => {
            const testimonial = testimonials[index];
            return testimonial ? <TestimonialSlide testimonial={testimonial} /> : null;
          }}
        />
      </div>
    </section>
  );
}
