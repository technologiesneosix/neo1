import { motion } from 'framer-motion';
import { FloatingShapes } from '@/components/common/FloatingShapes';
import { Seo } from '@/components/common/Seo';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  return (
    <>
      <Seo
        title="Page Not Found — Neosix"
        description="The page you are looking for could not be found."
        meta={{ robots: 'noindex,nofollow' }}
      />
      <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-mist-50">
        <FloatingShapes />
        <div className="container-site relative py-24 text-center">
          <motion.p
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="bg-brand-gradient bg-clip-text text-[7rem] font-bold leading-none text-transparent md:text-[11rem]"
            aria-hidden="true"
          >
            404
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="mt-4 text-display-3 md:text-display-2"
          >
            Page Not Found
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="lead-serif mx-auto mt-4 max-w-md"
          >
            The page you are looking for has moved, been renamed, or never existed at all.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.28 }}
            className="mt-10"
          >
            <Button to="/">Back to Home</Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
