import { useId } from 'react';
import { cn } from '@/lib/cn';

interface BlobFrameProps {
  imageUrl: string;
  alt?: string;
  className?: string;
}

/**
 * Organic blob-clipped image with layered soft blobs and a rotating outline
 * ring — the hero/about visual motif from the reference design.
 */
export function BlobFrame({ imageUrl, alt = '', className }: BlobFrameProps) {
  const uniqueId = useId().replace(/[^a-zA-Z0-9]/g, '');
  const clipId = `blob-clip-${uniqueId}`;
  const ringId = `blob-ring-${uniqueId}`;
  return (
    <div className={cn('relative mx-auto aspect-square w-full max-w-[540px]', className)}>
      {/* soft background blob */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-blob-drift" aria-hidden="true">
        <path
          d="M44.9,-64.9C58.2,-55.4,68.9,-42.4,74.6,-27.3C80.3,-12.2,81,4.9,75.9,19.8C70.8,34.6,59.8,47.2,46.5,57.4C33.2,67.6,16.6,75.5,-0.4,76C-17.3,76.6,-34.6,69.8,-48.7,59.1C-62.8,48.4,-73.7,33.8,-77.6,17.4C-81.5,1,-78.5,-17.2,-69.9,-31.6C-61.3,-46,-47.2,-56.5,-32.6,-65.6C-18,-74.7,-2.9,-82.3,11,-80.4C24.8,-78.4,31.5,-74.4,44.9,-64.9Z"
          transform="translate(100 100)"
          fill="#bcd8f5"
          opacity="0.7"
        />
      </svg>
      {/* mid blob */}
      <svg viewBox="0 0 200 200" className="absolute inset-[4%] h-[92%] w-[92%] animate-float-y" aria-hidden="true">
        <path
          d="M39.5,-61C52.8,-52.2,66,-43.3,72.6,-30.6C79.3,-17.9,79.4,-1.5,74.9,12.7C70.4,26.9,61.3,38.9,50,48.6C38.7,58.4,25.3,66,10.2,70.4C-4.9,74.8,-21.7,76,-35.6,70C-49.5,64,-60.4,50.8,-67.3,36C-74.2,21.2,-77.1,4.8,-74.2,-10.3C-71.3,-25.4,-62.7,-39.1,-51,-48.4C-39.3,-57.6,-24.5,-62.3,-9.8,-62.9C4.9,-63.6,26.2,-69.8,39.5,-61Z"
          transform="translate(100 100)"
          fill="#69a7f8"
          opacity="0.55"
        />
      </svg>
      {/* image clipped to blob + gradient ring */}
      <svg viewBox="0 0 200 200" className="absolute inset-[8%] h-[84%] w-[84%]" aria-hidden={alt === ''}>
        <defs>
          <clipPath id={clipId}>
            <path
              d="M42.7,-62.9C55.9,-54.5,67.5,-43.1,73.4,-29.2C79.3,-15.3,79.4,1.2,74.4,15.6C69.4,29.9,59.2,42.2,46.9,52.5C34.6,62.8,20.1,71.2,4.2,71.9C-11.7,72.7,-29,65.8,-42.6,55.3C-56.2,44.8,-66.1,30.6,-70.6,14.6C-75.1,-1.4,-74.2,-19.3,-66.5,-33.4C-58.8,-47.6,-44.3,-58,-29.6,-65.6C-14.9,-73.1,0,-77.9,14,-75.5C28,-73.1,29.4,-71.3,42.7,-62.9Z"
              transform="translate(100 100)"
            />
          </clipPath>
          <linearGradient id={ringId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4130c9" />
            <stop offset="1" stopColor="#3d64ff" />
          </linearGradient>
          <linearGradient id="ring-grad-1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4c3de4" stopOpacity="0.25" />
            <stop offset="1" stopColor="#2ab6f1" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="ring-grad-2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2ab6f1" stopOpacity="0.2" />
            <stop offset="1" stopColor="#4c3de4" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Two concentric outline circles rotating in opposite directions in the background */}
        <circle
          cx="100"
          cy="100"
          r="91"
          fill="none"
          stroke="url(#ring-grad-1)"
          strokeWidth="1.5"
          strokeDasharray="6 8"
          className="animate-spin-slow origin-center"
        />
        <circle
          cx="100"
          cy="100"
          r="95"
          fill="none"
          stroke="url(#ring-grad-2)"
          strokeWidth="1"
          strokeDasharray="4 6"
          className="animate-spin-slow origin-center"
          style={{ animationDirection: 'reverse', animationDuration: '32s' }}
        />

        <image
          href={imageUrl}
          width="200"
          height="200"
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${clipId})`}
        />
        <path
          d="M42.7,-62.9C55.9,-54.5,67.5,-43.1,73.4,-29.2C79.3,-15.3,79.4,1.2,74.4,15.6C69.4,29.9,59.2,42.2,46.9,52.5C34.6,62.8,20.1,71.2,4.2,71.9C-11.7,72.7,-29,65.8,-42.6,55.3C-56.2,44.8,-66.1,30.6,-70.6,14.6C-75.1,-1.4,-74.2,-19.3,-66.5,-33.4C-58.8,-47.6,-44.3,-58,-29.6,-65.6C-14.9,-73.1,0,-77.9,14,-75.5C28,-73.1,29.4,-71.3,42.7,-62.9Z"
          transform="translate(100 100)"
          fill="none"
          stroke={`url(#${ringId})`}
          strokeWidth="5"
        />
      </svg>
      {alt && <span className="sr-only">{alt}</span>}
    </div>
  );
}
