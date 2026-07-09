import { cn } from '@/lib/cn';

interface WaveDividerProps {
  /** Fill color of the wave shape (the section it belongs to). */
  fill?: string;
  flip?: boolean;
  className?: string;
}

/** Sweeping wave section divider, as used throughout the reference design. */
export function WaveDivider({ fill = '#ffffff', flip = false, className }: WaveDividerProps) {
  return (
    <div className={cn('pointer-events-none w-full overflow-hidden leading-[0]', flip && 'rotate-180', className)}>
      <svg
        viewBox="0 0 1440 110"
        preserveAspectRatio="none"
        className="block h-[60px] w-full md:h-[110px]"
        aria-hidden="true"
      >
        <path
          d="M0,64 C240,110 480,110 720,75 C960,40 1200,10 1440,45 L1440,110 L0,110 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}
