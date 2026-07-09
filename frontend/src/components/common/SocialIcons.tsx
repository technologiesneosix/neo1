import { Github, Instagram, Linkedin, Twitter, Youtube, type LucideIcon } from 'lucide-react';
import type { SocialLink } from '@/types';
import { cn } from '@/lib/cn';

const icons: Record<SocialLink['platform'], LucideIcon> = {
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
  youtube: Youtube,
  github: Github,
};

interface SocialIconsProps {
  links: SocialLink[];
  className?: string;
  iconClassName?: string;
  size?: number;
}

export function SocialIcons({ links, className, iconClassName, size = 16 }: SocialIconsProps) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      {links.map((link) => {
        const Icon = icons[link.platform];
        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            aria-label={link.platform}
            className={cn('text-heading transition-colors hover:text-primary-600', iconClassName)}
          >
            <Icon size={size} />
          </a>
        );
      })}
    </div>
  );
}
