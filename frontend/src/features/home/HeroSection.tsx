import { motion } from 'framer-motion';
import { useList } from '@/api/hooks';
import { api } from '@/api/services';
import { BlobFrame } from '@/components/common/BlobFrame';
import { FloatingShapes } from '@/components/common/FloatingShapes';
import { WaveDivider } from '@/components/common/WaveDivider';
import { Button } from '@/components/ui/Button';
import { Carousel } from '@/components/ui/Carousel';
import { PageLoader } from '@/components/ui/Spinner';
import type { HeroSlide } from '@/types';

const easing: [number, number, number, number] = [0.22, 1, 0.36, 1];

function SlideContent({ slide }: { slide: HeroSlide }) {
  return (
    <div className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-16">
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: easing }}
      >
        <h1 className="text-display-3 sm:text-display-2 xl:text-display-1">
          <span className="block">{slide.title}</span>
          <span className="mt-2 block font-light text-neutral-500">{slide.subtitle}</span>
        </h1>
        <motion.p
          className="lead-serif mt-6 max-w-lg"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: easing }}
        >
          {slide.description}
        </motion.p>
        <motion.div
          className="mt-9 flex flex-wrap items-center gap-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: easing }}
        >
          <Button to={slide.primaryCtaLink}>{slide.primaryCtaLabel}</Button>
          {slide.secondaryCtaLabel && slide.secondaryCtaLink && (
            <Button variant="outline" to={slide.secondaryCtaLink}>
              {slide.secondaryCtaLabel}
            </Button>
          )}
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 40, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.15, ease: easing }}
      >
        <BlobFrame imageUrl={slide.imageUrl} alt={slide.title} />
      </motion.div>
    </div>
  );
}

/** Full-height light hero with rotating slides, blob imagery and a wave into white. */
export function HeroSection() {
  const { data, isLoading } = useList(api.heroSlides);
  const slides = (data ?? [])
    .filter((slide) => slide.active)
    .sort((a, b) => a.order - b.order);

  if (isLoading) {
    return (
      <section className="flex min-h-[85vh] items-center justify-center bg-mist-100">
        <PageLoader />
      </section>
    );
  }
  if (slides.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-mist-50 via-mist-100 to-mist-200">
      <FloatingShapes />
      <div className="container-site relative flex min-h-[85vh] items-center py-16 md:py-20">
        <Carousel
          className="w-full"
          count={slides.length}
          autoPlayMs={7000}
          render={(index) => {
            const slide = slides[index];
            return slide ? <SlideContent slide={slide} /> : null;
          }}
        />
      </div>
      <WaveDivider fill="#ffffff" />
    </section>
  );
}
