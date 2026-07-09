import { forwardRef, useCallback, type ButtonHTMLAttributes, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'outline' | 'dark' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  to?: string;
  href?: string;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-brand-gradient text-white shadow-md shadow-primary-600/25 hover:shadow-lg hover:shadow-primary-600/35 hover:brightness-110',
  outline:
    'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white',
  dark: 'bg-ink-900 text-white hover:bg-ink-800',
  ghost: 'text-heading hover:bg-mist-100',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-8 py-3.5 text-sm',
  lg: 'px-10 py-4 text-sm',
};

/** Gradient CTA button matching the reference design, with a ripple effect. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', to, href, loading, className, children, onClick, ...rest },
  ref,
) {
  const handleRipple = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      const target = event.currentTarget;
      const rect = target.getBoundingClientRect();
      const ripple = document.createElement('span');
      const diameter = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = `${diameter}px`;
      ripple.style.left = `${event.clientX - rect.left - diameter / 2}px`;
      ripple.style.top = `${event.clientY - rect.top - diameter / 2}px`;
      target.appendChild(ripple);
      window.setTimeout(() => ripple.remove(), 650);
    },
    [],
  );

  const classes = cn(
    'btn-ripple inline-flex items-center justify-center gap-2 rounded-btn font-semibold tracking-wide transition-all duration-300 disabled:pointer-events-none disabled:opacity-60',
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  if (to) {
    return (
      <Link to={to} className={classes} onClick={handleRipple}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} onClick={handleRipple} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }
  return (
    <button
      ref={ref}
      className={classes}
      onClick={(event) => {
        handleRipple(event);
        onClick?.(event);
      }}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      )}
      {children}
    </button>
  );
});
