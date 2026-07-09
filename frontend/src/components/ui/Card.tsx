import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

/** White surface card with the reference's soft shadow; optional hover lift. */
export function Card({ hover = true, className, children, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-md bg-white p-8 shadow-card transition-all duration-300',
        hover && 'hover:-translate-y-2 hover:shadow-card-hover',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
