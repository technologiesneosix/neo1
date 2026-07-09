import { cn } from '@/lib/cn';
import { Reveal } from './Reveal';

interface SectionHeadingProps {
  label: string;
  title: string;
  lead?: string;
  align?: 'left' | 'center';
  dark?: boolean;
  className?: string;
}

/** Uppercase letter-spaced label above a bold Poppins title, per reference. */
export function SectionHeading({
  label,
  title,
  lead,
  align = 'center',
  dark = false,
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        'mb-12 max-w-3xl md:mb-16',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className,
      )}
    >
      <span className={cn('section-label block', dark && 'text-neutral-500')}>{label}</span>
      <h2 className={cn('mt-3 text-display-3 md:text-display-2', dark && 'text-white')}>{title}</h2>
      {lead && (
        <p className={cn('mt-6 text-[15px] leading-7', dark ? 'text-neutral-400' : 'text-body')}>
          {lead}
        </p>
      )}
    </Reveal>
  );
}
