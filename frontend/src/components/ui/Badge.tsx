import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'primary' | 'accent' | 'neutral' | 'success' | 'warning' | 'danger';

const tones: Record<Tone, string> = {
  primary: 'bg-primary-50 text-primary-700',
  accent: 'bg-sky-50 text-accent-600',
  neutral: 'bg-mist-100 text-neutral-600',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-red-50 text-red-600',
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ tone = 'primary', className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
        tones[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
