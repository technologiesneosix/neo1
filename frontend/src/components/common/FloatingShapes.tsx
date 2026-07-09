import { cn } from '@/lib/cn';

interface Shape {
  kind: 'ring' | 'dot';
  color: string;
  size: number;
  top: string;
  left: string;
  delay?: string;
}

const defaultShapes: Shape[] = [
  { kind: 'ring', color: 'border-primary-400', size: 44, top: '12%', left: '10%' },
  { kind: 'ring', color: 'border-accent-400', size: 30, top: '70%', left: '6%', delay: '1.2s' },
  { kind: 'dot', color: 'bg-primary-600', size: 12, top: '20%', left: '88%' },
  { kind: 'ring', color: 'border-accent-400', size: 34, top: '78%', left: '90%', delay: '0.6s' },
  { kind: 'dot', color: 'bg-neutral-300', size: 14, top: '52%', left: '48%', delay: '1.8s' },
];

/** Decorative floating rings and dots scattered around hero-style sections. */
export function FloatingShapes({ shapes = defaultShapes, className }: { shapes?: Shape[]; className?: string }) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 hidden md:block', className)} aria-hidden="true">
      {shapes.map((shape, index) => (
        <span
          key={index}
          className={cn(
            'absolute animate-float-y rounded-full',
            shape.kind === 'ring' ? cn('border-2 bg-transparent', shape.color) : shape.color,
          )}
          style={{
            width: shape.size,
            height: shape.size,
            top: shape.top,
            left: shape.left,
            animationDelay: shape.delay,
          }}
        />
      ))}
    </div>
  );
}
