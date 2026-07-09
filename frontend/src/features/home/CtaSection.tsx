import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';

/** Compact near-black closing band with a single gradient call to action. */
export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-ink-900">
      {/* floating ring/dot decorations */}
      <span
        aria-hidden="true"
        className="absolute -left-14 -top-14 h-44 w-44 animate-spin-slow rounded-full border-2 border-dashed border-white/10"
      />
      <span
        aria-hidden="true"
        className="absolute -bottom-16 -right-10 h-52 w-52 animate-float-y rounded-full border border-white/10"
      />
      <span
        aria-hidden="true"
        className="absolute right-[22%] top-8 hidden h-3 w-3 animate-float-y rounded-full bg-primary-500 md:block"
      />
      <span
        aria-hidden="true"
        className="absolute bottom-10 left-[30%] hidden h-2.5 w-2.5 animate-float-y rounded-full bg-accent-400 md:block"
        style={{ animationDelay: '1.4s' }}
      />

      <div className="container-site section-pad relative">
        <Reveal>
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between md:gap-12">
            <div>
              <h2 className="text-display-3 text-white md:text-display-2">
                Have a project in mind? Let&rsquo;s build it.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-400">
                Tell us where you want to be in six months — we will map the shortest, safest
                route to shipped software.
              </p>
            </div>
            <Button to="/contact" size="lg" className="shrink-0">
              Start a Conversation
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
