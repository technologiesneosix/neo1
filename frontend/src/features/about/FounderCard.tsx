import { Linkedin } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import type { TeamMember } from '@/types';

interface FounderCardProps {
  member: TeamMember;
}

function initialsFromName(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function FounderCard({ member }: FounderCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const linkedinUrl = useMemo(
    () => member.socialLinks.find((link) => link.platform === 'linkedin')?.url,
    [member.socialLinks],
  );
  const initials = useMemo(() => initialsFromName(member.name), [member.name]);
  const imageAlt = `${member.name} - ${member.role} of NeoSix Technologies`;

  return (
    <Card
      hover={false}
      className="group flex h-full flex-col items-center rounded-xl border border-mist-200 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-card-hover focus-within:-translate-y-1 focus-within:scale-[1.01] focus-within:shadow-card-hover"
    >
      <div className="relative mb-5">
        {!imageFailed ? (
          <img
            src={member.photoUrl}
            alt={imageAlt}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-28 w-28 rounded-full object-cover ring-4 ring-mist-100 transition-all duration-300 group-hover:ring-primary-100"
          />
        ) : (
          <div
            role="img"
            aria-label={imageAlt}
            className="flex h-28 w-28 items-center justify-center rounded-full bg-brand-gradient text-2xl font-bold text-white ring-4 ring-mist-100 transition-all duration-300 group-hover:ring-primary-100"
          >
            {initials}
          </div>
        )}
      </div>

      <h3 className="text-xl font-bold text-heading">{member.name}</h3>
      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent-500">{member.role}</p>
      <p className="mt-4 text-sm leading-6 text-body [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden">
        {member.bio}
      </p>

      {linkedinUrl && (
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Connect with ${member.name} on LinkedIn`}
          className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-btn border border-primary-200 px-4 py-2 text-sm font-semibold text-primary-700 transition-all duration-300 hover:border-primary-500 hover:bg-primary-50 hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
        >
          <Linkedin size={16} aria-hidden="true" />
          <span>Connect</span>
        </a>
      )}
    </Card>
  );
}
