import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { staggerContainer, staggerItem } from '@/components/ui/Reveal';
import { DynamicIcon } from '@/components/common/DynamicIcon';
import { cn } from '@/lib/cn';

/** Minimum shape a catalog entity must satisfy (services, solutions, industries). */
export interface CatalogGridItem {
  id: string;
  icon: string;
  title: string;
  excerpt: string;
  slug: string;
}

interface CatalogGridProps {
  items: CatalogGridItem[];
  /** Route prefix each card links to, e.g. "/services". */
  basePath: string;
  columns?: 2 | 3 | 4;
  className?: string;
}

const columnClasses: Record<NonNullable<CatalogGridProps['columns']>, string> = {
  2: 'grid gap-8 sm:grid-cols-2',
  3: 'grid gap-8 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid gap-8 sm:grid-cols-2 lg:grid-cols-4',
};

/**
 * Reusable grid of icon cards for the services / solutions / industries index
 * pages — white soft-shadow cards with a gradient icon tile and a read-more link.
 */
export function CatalogGrid({ items, basePath, columns = 3, className }: CatalogGridProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className={cn(columnClasses[columns], className)}
    >
      {items.map((item) => (
        <motion.div key={item.id} variants={staggerItem} className="h-full">
          <Card className="group flex h-full flex-col">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-md bg-brand-gradient-soft text-white shadow-md shadow-primary-500/25">
              <DynamicIcon name={item.icon} size={26} />
            </span>
            <h3 className="mt-6 text-lg font-bold">
              <Link
                to={`${basePath}/${item.slug}`}
                className="transition-colors hover:text-primary-600"
              >
                {item.title}
              </Link>
            </h3>
            <p className="mt-3 flex-1 text-sm leading-6 text-body">{item.excerpt}</p>
            <Link
              to={`${basePath}/${item.slug}`}
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-primary-600 transition-colors hover:text-azure-500"
            >
              Learn More
              <ArrowRight
                size={14}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
