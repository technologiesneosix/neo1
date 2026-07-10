import { NavLink } from 'react-router-dom';
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
  return (
    <nav aria-label="About sections" className="relative z-10 bg-white pt-2">
      <div className="container-site">
        <ul className="-mt-6 flex flex-wrap items-center justify-center gap-2 md:-mt-8">
          {aboutLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                end={'end' in link ? link.end : false}
                className={({ isActive }) =>
                  cn(
                    'inline-flex items-center rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300',
                    isActive
                      ? 'bg-brand-gradient text-white shadow-md shadow-primary-600/25'
                      : 'bg-mist-100 text-neutral-500 hover:bg-mist-200 hover:text-heading',
                  )
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
