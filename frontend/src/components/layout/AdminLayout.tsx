import {
  Award,
  BadgeDollarSign,
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  ClipboardList,
  Cpu,
  ExternalLink,
  FileText,
  FolderKanban,
  Globe,
  HelpCircle,
  History,
  Image,
  Inbox,
  Info,
  Layers,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  Mail,
  Menu,
  MonitorPlay,
  PenSquare,
  Quote,
  Search,
  Settings,
  Shield,
  Tags,
  Users,
  UserSquare,
  Wrench,
  X,
  type LucideIcon,
} from 'lucide-react';
import { Suspense, useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '@/components/common/Logo';
import { PageLoader } from '@/components/ui/Spinner';
import { useAuth } from '@/features/auth/AuthContext';
import { cn } from '@/lib/cn';

interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: 'Content',
    items: [
      { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
      { label: 'Hero', to: '/admin/hero', icon: MonitorPlay },
      { label: 'About', to: '/admin/about', icon: Info },
      { label: 'Services', to: '/admin/services', icon: Wrench },
      { label: 'Solutions', to: '/admin/solutions', icon: Layers },
      { label: 'Industries', to: '/admin/industries', icon: Building2 },
      { label: 'Technologies', to: '/admin/technologies', icon: Cpu },
      { label: 'Process Steps', to: '/admin/process-steps', icon: ListOrdered },
    ],
  },
  {
    label: 'Portfolio',
    items: [
      { label: 'Projects', to: '/admin/projects', icon: FolderKanban },
      { label: 'Case Studies', to: '/admin/case-studies', icon: BookOpen },
    ],
  },
  {
    label: 'Blog',
    items: [
      { label: 'Blogs', to: '/admin/blogs', icon: PenSquare },
      { label: 'Categories', to: '/admin/categories', icon: Tags },
      { label: 'Authors', to: '/admin/authors', icon: UserSquare },
    ],
  },
  {
    label: 'People',
    items: [
      { label: 'Team', to: '/admin/team', icon: Users },
      { label: 'Testimonials', to: '/admin/testimonials', icon: Quote },
      { label: 'Timeline', to: '/admin/timeline', icon: History },
      { label: 'Certifications', to: '/admin/certifications', icon: Award },
    ],
  },
  {
    label: 'HR',
    items: [
      { label: 'Careers', to: '/admin/careers', icon: Briefcase },
      { label: 'Applications', to: '/admin/applications', icon: ClipboardList },
    ],
  },
  {
    label: 'Inbox',
    items: [
      { label: 'Messages', to: '/admin/messages', icon: Inbox },
      { label: 'Subscribers', to: '/admin/subscribers', icon: Mail },
    ],
  },
  {
    label: 'Site',
    items: [
      { label: 'FAQ', to: '/admin/faqs', icon: HelpCircle },
      { label: 'Pricing', to: '/admin/pricing', icon: BadgeDollarSign },
      { label: 'Media', to: '/admin/media', icon: Image },
      { label: 'SEO', to: '/admin/seo', icon: Search },
      { label: 'Settings', to: '/admin/settings', icon: Settings },
      { label: 'Analytics', to: '/admin/analytics', icon: BarChart3 },
      { label: 'Users', to: '/admin/users', icon: FileText },
      { label: 'Roles', to: '/admin/roles', icon: Shield },
    ],
  },
];

const allItems = navGroups.flatMap((group) => group.items);

/** Enterprise admin shell: dark grouped sidebar, topbar, mist content area. */
export function AdminLayout() {
  const isDesktop = () => window.innerWidth >= 1024;
  const [sidebarOpen, setSidebarOpen] = useState(isDesktop);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Keep sidebar open when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const current =
    allItems.find((item) => item.to === location.pathname) ??
    allItems.find((item) => item.to !== '/admin' && location.pathname.startsWith(item.to));

  const sidebar = (
    <div className="flex h-full flex-col">
      <div
        role="link"
        tabIndex={0}
        aria-label="Go to admin dashboard"
        className="flex h-16 shrink-0 cursor-pointer items-center border-b border-white/10 px-5"
        onClick={(event) => {
          event.preventDefault();
          navigate('/admin');
          if (window.innerWidth < 1024) setSidebarOpen(false);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            navigate('/admin');
          }
        }}
      >
        <span className="pointer-events-none">
          <Logo dark />
        </span>
      </div>
      <nav aria-label="Admin navigation" className="scrollbar-thin flex-1 overflow-y-auto px-3 py-4">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={() => { if (window.innerWidth < 1024) setSidebarOpen(false); }}
                    className={({ isActive }) =>
                      cn(
                        'relative flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium transition-colors',
                        isActive
                          ? 'bg-white/10 text-white'
                          : 'text-neutral-400 hover:bg-white/5 hover:text-white',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span
                            className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-accent-400"
                            aria-hidden="true"
                          />
                        )}
                        <item.icon size={16} aria-hidden="true" />
                        {item.label}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-mist-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-ink-950/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar — always visible on lg+, slide-in drawer on mobile */}
      <aside
        className="fixed inset-y-0 left-0 z-50 w-64 bg-ink-900 transition-transform duration-300"
        style={{ transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)' }}
        aria-label="Sidebar"
      >
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="absolute right-3 top-4 rounded-md p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={18} aria-hidden="true" />
          </button>
        )}
        {sidebar}
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-neutral-100 bg-white px-4 shadow-header sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation"
              onClick={() => setSidebarOpen(true)}
              className="rounded-md p-2 text-neutral-500 hover:bg-mist-100 hover:text-heading lg:hidden"
            >
              <Menu size={20} aria-hidden="true" />
            </button>
            <h2 className="text-sm font-semibold text-heading">
              {current?.label ?? 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-btn px-3 py-2 text-xs font-semibold text-neutral-500 transition-colors hover:bg-mist-100 hover:text-primary-600"
            >
              <Globe size={14} aria-hidden="true" />
              <span className="hidden sm:inline">View Site</span>
              <ExternalLink size={11} aria-hidden="true" className="hidden sm:inline" />
            </Link>
            <div className="flex items-center gap-2.5 border-l border-neutral-100 pl-2 sm:pl-4">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-white"
                aria-hidden="true"
              >
                {(user?.name ?? 'A').slice(0, 1).toUpperCase()}
              </span>
              <span className="hidden text-sm font-medium text-heading sm:inline">
                {user?.name}
              </span>
              <button
                type="button"
                onClick={logout}
                aria-label="Log out"
                title="Log out"
                className="rounded-md p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </header>

        <main className="min-h-screen bg-mist-50 p-6 lg:p-8">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
