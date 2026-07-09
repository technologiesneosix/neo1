import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FloatingShapes } from './FloatingShapes';
import { WaveDivider } from './WaveDivider';

interface Crumb {
  label: string;
  path?: string;
}

interface PageHeroProps {
  label: string;
  title: string;
  lead?: string;
  crumbs?: Crumb[];
}

/** Inner-page hero: light tinted band with wave bottom and breadcrumbs. */
export function PageHero({ label, title, lead, crumbs }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-mist-100 pt-16">
      <FloatingShapes />
      <div className="container-site relative pb-20 pt-12 text-center md:pb-28 md:pt-16">
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center justify-center gap-1 text-xs font-medium text-neutral-400">
            <Link to="/" className="transition-colors hover:text-primary-600">
              Home
            </Link>
            {crumbs.map((crumb) => (
              <span key={crumb.label} className="flex items-center gap-1">
                <ChevronRight size={13} aria-hidden="true" />
                {crumb.path ? (
                  <Link to={crumb.path} className="transition-colors hover:text-primary-600">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-neutral-500">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="section-label block"
        >
          {label}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="mt-3 text-display-2 md:text-display-1"
        >
          {title}
        </motion.h1>
        {lead && (
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="lead-serif mx-auto mt-6 max-w-2xl"
          >
            {lead}
          </motion.p>
        )}
      </div>
      <WaveDivider fill="#ffffff" />
    </section>
  );
}
