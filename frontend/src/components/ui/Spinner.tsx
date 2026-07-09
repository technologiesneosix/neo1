import { cn } from '@/lib/cn';

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-block h-8 w-8 animate-spin rounded-full border-[3px] border-primary-200 border-t-primary-600',
        className,
      )}
      role="status"
      aria-label="Loading"
    />
  );
}

/** Full-area loading state used while page data resolves. */
export function PageLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex min-h-[40vh] items-center justify-center', className)}>
      <Spinner />
    </div>
  );
}
