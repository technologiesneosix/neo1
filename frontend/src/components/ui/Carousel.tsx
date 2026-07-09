import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface CarouselProps {
  count: number;
  render: (index: number) => ReactNode;
  autoPlayMs?: number;
  className?: string;
  dark?: boolean;
}

/** Fade carousel with the reference's small circular dot pagination. */
export function Carousel({ count, render, autoPlayMs = 6000, className, dark = false }: CarouselProps) {
  const [index, setIndex] = useState(0);

  const goTo = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);

  useEffect(() => {
    if (!autoPlayMs || count <= 1) return;
    const timer = window.setInterval(() => goTo(index + 1), autoPlayMs);
    return () => window.clearInterval(timer);
  }, [index, count, autoPlayMs, goTo]);

  if (count === 0) return null;

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          {render(index)}
        </motion.div>
      </AnimatePresence>
      {count > 1 && (
        <div className="mt-10 flex justify-center gap-2.5">
          {Array.from({ length: count }, (_, dot) => (
            <button
              key={dot}
              type="button"
              aria-label={`Go to slide ${dot + 1}`}
              onClick={() => goTo(dot)}
              className={cn(
                'h-3.5 w-3.5 rounded-full border-2 transition-all duration-300',
                dark ? 'border-white/70' : 'border-neutral-400',
                dot === index
                  ? dark
                    ? 'bg-white'
                    : 'border-primary-600 bg-primary-600'
                  : 'bg-transparent hover:scale-110',
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
