import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { useSiteSettings } from '@/api/hooks';

interface LogoProps {
  dark?: boolean;
  className?: string;
}

/** Wordmark with the custom brand logo image pulled from site settings. */
export function Logo({ dark = false, className }: LogoProps) {
  const { settings } = useSiteSettings();
  const name = settings?.siteName ?? 'Neosix';
  const logoSrc = settings?.logoUrl || '/logo.png';

  return (
    <Link to="/" className={cn('inline-flex items-center gap-2.5', className)} aria-label={`${name} home`}>
      <img src={logoSrc} alt={name} className="h-9 w-9 rounded-lg shadow-sm object-contain" />
      <span
        className={cn(
          'text-[24px] font-extrabold uppercase tracking-tight',
          dark ? 'text-white' : 'text-heading',
        )}
      >
        {name}
      </span>
    </Link>
  );
}
