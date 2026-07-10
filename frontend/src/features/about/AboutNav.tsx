import { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/cn';

const aboutLinks = [
  { label: 'Company', path: '/about', end: true },
  { label: 'Mission & Vision', path: '/about/mission-vision' },
  { label: 'Our Journey', path: '/about/journey' },
  { label: 'Our Team', path: '/about/team' },
  { label: 'Life at Neosix', path: '/about/life' },
  { label: 'Certifications', path: '/about/certifications' },
] as const;

/**
 * Horizontal pill sub-navigation shared by every /about* page — rendered
 * directly under the PageHero.
 */
export function AboutNav() {
  const { pathname } = useLocation();
  const activeRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
  }, [pathname]);

  return (
    <nav aria-label="About sections" className="relative z-10 bg-white pt-2">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div className="container-site">
        <ul className="-mt-6 flex flex-nowrap items-center justify-start overflow-x-auto gap-2 pb-3 md:pb-0 md:justify-center md:flex-wrap md:overflow-visible md:-mt-8 px-4 md:px-0 no-scrollbar">
          {aboutLinks.map((link) => {
            const active = link.path === '/about' ? pathname === '/about' : pathname.startsWith(link.path);
            return (
              <li key={link.path} className="shrink-0">
                <NavLink
                  ref={active ? activeRef : undefined}
                  to={link.path}
                  end={'end' in link ? link.end : false}
                  className={({ isActive }) =>
                    cn(
                      'inline-flex items-center rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300 whitespace-nowrap',
                      isActive
                        ? 'bg-brand-gradient text-white shadow-md shadow-primary-600/25'
                        : 'bg-mist-100 text-neutral-500 hover:bg-mist-200 hover:text-heading',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
