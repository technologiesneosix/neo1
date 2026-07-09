import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  Menu,
  X,
  Laptop,
  Smartphone,
  Code2,
  Layers,
  PenTool,
  Palette,
  Layout,
  Brain,
  Cpu,
  Cloud,
  RefreshCw,
  Shield,
  ShieldCheck,
  Key,
  Users,
  Compass,
  Briefcase,
  HelpCircle,
  FileText,
  DollarSign,
  Activity,
  BookOpen,
  Building2,
  ShoppingBag,
  Truck,
  Factory,
  Home as HomeIcon
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { useSiteSettings } from '@/api/hooks';
import { cn } from '@/lib/cn';
import { Logo } from '@/components/common/Logo';
import { SocialIcons } from '@/components/common/SocialIcons';
import { Button } from '@/components/ui/Button';

// Structured Navbar Configuration
const navConfig = [
  {
    label: 'Home',
    path: '/',
    type: 'link' as const,
  },
  {
    label: 'Company',
    type: 'dropdown' as const,
    children: [
      { label: 'About Us', path: '/about', description: 'Our history, mission, and who we are', icon: Compass },
      { label: 'Our Team', path: '/about/team', description: 'Meet the talented people behind Neosix', icon: Users },
      { label: 'Careers', path: '/careers', description: 'Join us and shape the future of IT', icon: Briefcase },
      { label: 'Contact', path: '/contact', description: 'Get in touch with our experts', icon: HelpCircle },
    ],
  },
  {
    label: 'Services',
    type: 'megamenu' as const,
    columns: [
      {
        title: 'Development',
        items: [
          { label: 'Web Development', path: '/services/web-development', description: 'High-performance web applications', icon: Laptop },
          { label: 'Mobile App Development', path: '/services/mobile-app-development', description: 'Fast native iOS & Android apps', icon: Smartphone },
          { label: 'Custom Software', path: '/services/custom-software-development', description: 'Bespoke systems for workflows', icon: Code2 },
          { label: 'SaaS Development', path: '/services/saas-development', description: 'Scalable multi-tenant products', icon: Layers },
        ]
      },
      {
        title: 'Design',
        items: [
          { label: 'UI/UX Design', path: '/services/ui-ux-design', description: 'Intuitive, research-backed interfaces', icon: PenTool },
          { label: 'Branding', path: '/services/ui-ux-design', description: 'Coherent and premium visual identity', icon: Palette },
          { label: 'Product Design', path: '/services/ui-ux-design', description: 'Wireframes to premium shipped products', icon: Layout },
        ]
      },
      {
        title: 'Cloud & AI',
        items: [
          { label: 'AI Solutions', path: '/services/ai-solutions', description: 'LLMs, AI agents & cognitive search', icon: Brain },
          { label: 'Machine Learning', path: '/services/ai-solutions', description: 'Predictive analytics & pipelines', icon: Cpu },
          { label: 'Cloud Solutions', path: '/services/cloud-solutions', description: 'Secure AWS, GCP & Azure setups', icon: Cloud },
          { label: 'DevOps', path: '/services/devops', description: 'IaC, CI/CD, and site reliability', icon: RefreshCw },
        ]
      },
      {
        title: 'Security',
        items: [
          { label: 'Cybersecurity', path: '/services', description: 'Enterprise-grade threat protection', icon: Shield },
          { label: 'Security Audits', path: '/services', description: 'Penetration testing and compliance', icon: ShieldCheck },
          { label: 'API Security', path: '/services/api-development', description: 'OAuth & secure API gateways', icon: Key },
        ]
      }
    ]
  },
  {
    label: 'Solutions',
    type: 'dropdown' as const,
    children: [
      { label: 'Enterprise Solutions', path: '/solutions/custom-enterprise-software', description: 'Bespoke architectures for scaling', icon: Building2 },
      { label: 'Startup Solutions', path: '/solutions/crm-software', description: 'Agile platforms to launch rapidly', icon: Compass },
      { label: 'Digital Transformation', path: '/solutions/erp', description: 'Modernize legacy workflows with SaaS', icon: RefreshCw },
      { label: 'Automation', path: '/solutions/inventory-management', description: 'Eliminate manual work with custom APIs', icon: Cpu },
      { label: 'AI Integration', path: '/solutions', description: 'Infuse intelligence into your product', icon: Brain },
    ]
  },
  {
    label: 'Industries',
    type: 'dropdown' as const,
    children: [
      { label: 'Healthcare', path: '/industries/healthcare', description: 'HIPAA-compliant portals & tools', icon: Activity },
      { label: 'FinTech', path: '/industries/finance', description: 'Secure ledger & payment applications', icon: DollarSign },
      { label: 'Education', path: '/industries/education', description: 'LMS and virtual learning platforms', icon: BookOpen },
      { label: 'Real Estate', path: '/industries/real-estate', description: 'Property listing databases & client portals', icon: HomeIcon },
      { label: 'E-commerce', path: '/industries/retail', description: 'High-conversion checkout systems', icon: ShoppingBag },
      { label: 'Logistics', path: '/industries/logistics', description: 'Delivery tracking & fleet dispatching', icon: Truck },
      { label: 'Manufacturing', path: '/industries/manufacturing', description: 'Supply chain management & control', icon: Factory },
    ]
  },
  {
    label: 'Portfolio',
    path: '/portfolio',
    type: 'link' as const,
  },
  {
    label: 'Resources',
    type: 'dropdown' as const,
    children: [
      { label: 'Case Studies', path: '/portfolio/case-studies', description: 'Engineering deep-dives & reviews', icon: FileText },
      { label: 'Blog', path: '/blog', description: 'Latest industry trends and thoughts', icon: BookOpen },
      { label: 'Technologies', path: '/technologies', description: 'Our custom modern production stack', icon: Cpu },
      { label: 'FAQs', path: '/faq', description: 'Common answers about our processes', icon: HelpCircle },
    ]
  }
];

export function Header() {
  const { settings } = useSiteSettings();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setHoveredId(null);
  }, [pathname]);

  // Lock scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isItemActive = (item: typeof navConfig[0]) => {
    if (item.path) {
      if (item.path === '/') return pathname === '/';
      return pathname === item.path || pathname.startsWith(item.path + '/');
    }
    if (item.children) {
      return item.children.some((child) => pathname === child.path || pathname.startsWith(child.path + '/'));
    }
    if (item.columns) {
      return item.columns.some((col) =>
        col.items.some((sub) => pathname === sub.path || pathname.startsWith(sub.path + '/')),
      );
    }
    return false;
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-[90] bg-white transition-all duration-300',
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-header border-b border-neutral-100/50'
          : 'bg-white border-b border-transparent',
      )}
    >
      {/* Relative container ensures the megamenu anchors to the header's boundaries, not the nav link item */}
      <div className="container-site relative flex h-[76px] items-center justify-between gap-6">
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 xl:flex" aria-label="Primary">
          {navConfig.map((item) => {
            const active = isItemActive(item);
            return (
              <div
                key={item.label}
                // Only make simple dropdown containers relative, NOT megamenu containers
                className={cn('py-4', item.type === 'dropdown' && 'relative')}
                onMouseEnter={() => setHoveredId(item.label)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="flex items-center gap-1 cursor-pointer">
                  {item.path ? (
                    <RouterNavLink
                      to={item.path}
                      className={cn(
                        'text-sm font-semibold transition-colors duration-200 relative py-1',
                        active ? 'text-primary-600' : 'text-heading hover:text-primary-600',
                      )}
                    >
                      {item.label}
                      {active && (
                        <motion.span
                          layoutId="active-underline"
                          className="absolute bottom-0 left-0 h-[2px] w-full bg-primary-600 rounded-full"
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}
                    </RouterNavLink>
                  ) : (
                    <span
                      className={cn(
                        'text-sm font-semibold transition-colors duration-200 relative py-1 flex items-center gap-1 select-none',
                        active ? 'text-primary-600' : 'text-heading hover:text-primary-600',
                      )}
                    >
                      {item.label}
                      <ChevronDown
                        size={14}
                        className={cn(
                          'transition-transform duration-200',
                          hoveredId === item.label && 'rotate-180 text-primary-600',
                        )}
                      />
                      {active && (
                        <motion.span
                          layoutId="active-underline"
                          className="absolute bottom-0 left-0 h-[2px] w-full bg-primary-600 rounded-full"
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}
                    </span>
                  )}
                </div>

                {/* Standard Dropdowns (Company, Solutions, Industries, Resources) */}
                {item.type === 'dropdown' && item.children && (
                  <AnimatePresence>
                    {hoveredId === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute top-full left-0 z-50 pt-2"
                      >
                        <div className="w-[320px] rounded-2xl bg-white p-3 shadow-card-hover border border-neutral-100/70">
                          {item.children.map((child) => {
                            const childActive = pathname === child.path;
                            return (
                              <RouterNavLink
                                key={child.path + child.label}
                                to={child.path}
                                onClick={() => setHoveredId(null)}
                                className={cn(
                                  'group flex items-start gap-3.5 p-3 rounded-xl transition-all duration-200 hover:bg-mist-50',
                                  childActive && 'bg-mist-50',
                                )}
                              >
                                <div
                                  className={cn(
                                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mist-100 text-neutral-500 transition-colors group-hover:bg-primary-50 group-hover:text-primary-600',
                                    childActive && 'bg-primary-50 text-primary-600',
                                  )}
                                >
                                  <child.icon size={18} />
                                </div>
                                <div className="min-w-0">
                                  <div
                                    className={cn(
                                      'text-[13px] font-semibold transition-colors',
                                      childActive ? 'text-primary-600' : 'text-heading group-hover:text-primary-600',
                                    )}
                                  >
                                    {child.label}
                                  </div>
                                  {child.description && (
                                    <div className="text-[11px] text-neutral-400 mt-0.5 leading-normal truncate">
                                      {child.description}
                                    </div>
                                  )}
                                </div>
                              </RouterNavLink>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}

                {/* Services Mega Menu (Aligned perfectly to the navbar container limits) */}
                {item.type === 'megamenu' && item.columns && (
                  <AnimatePresence>
                    {hoveredId === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute top-full left-0 right-0 z-50 pt-2"
                      >
                        <div className="rounded-2xl bg-white p-8 shadow-card-hover border border-neutral-100/70 grid grid-cols-4 gap-8">
                          {item.columns.map((col) => (
                            <div key={col.title}>
                              <div className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-400 mb-5 border-b border-neutral-100 pb-2">
                                {col.title}
                              </div>
                              <div className="flex flex-col gap-1.5">
                                {col.items.map((subItem) => {
                                  const subActive = pathname === subItem.path;
                                  return (
                                    <RouterNavLink
                                      key={subItem.path + subItem.label}
                                      to={subItem.path}
                                      onClick={() => setHoveredId(null)}
                                      className={cn(
                                        'group flex items-start gap-3 p-2.5 rounded-xl transition-all duration-200 hover:bg-mist-50',
                                        subActive && 'bg-mist-50',
                                      )}
                                    >
                                      <div
                                        className={cn(
                                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-mist-100 text-neutral-500 transition-colors group-hover:bg-primary-50 group-hover:text-primary-600',
                                          subActive && 'bg-primary-50 text-primary-600',
                                        )}
                                      >
                                        <subItem.icon size={16} />
                                      </div>
                                      <div className="min-w-0">
                                        <div
                                          className={cn(
                                            'text-[13px] font-semibold transition-colors',
                                            subActive ? 'text-primary-600' : 'text-heading group-hover:text-primary-600',
                                          )}
                                        >
                                          {subItem.label}
                                        </div>
                                        <div className="text-[11px] text-neutral-400 mt-0.5 leading-normal truncate">
                                          {subItem.description}
                                        </div>
                                      </div>
                                    </RouterNavLink>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right side CTA Button only (Mobile number completely removed) */}
        <div className="hidden items-center gap-6 xl:flex">
          <Button to="/contact" size="sm" className="rounded-full shadow-lg shadow-primary-600/10 py-2.5 px-6">
            Let's Talk
          </Button>
        </div>

        {/* Hamburger Menu Icon */}
        <button
          type="button"
          className="rounded-full p-2.5 text-heading hover:bg-mist-100 transition-colors xl:hidden"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile Slide-In Drawer Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[100] bg-ink-950/45 backdrop-blur-sm xl:hidden"
            />

            {/* Sidebar drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed top-0 right-0 bottom-0 z-[101] w-full max-w-[380px] bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto xl:hidden"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
                  <Logo />
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="p-2 text-heading hover:bg-mist-100 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="mt-6 flex flex-col gap-2">
                  {navConfig.map((item) => {
                    const isExpandable = item.type !== 'link';
                    const expanded = mobileExpanded === item.label;

                    return (
                      <div key={item.label} className="border-b border-neutral-50 last:border-0 pb-2 last:pb-0">
                        {isExpandable ? (
                          <div>
                            <button
                              type="button"
                              onClick={() => setMobileExpanded(expanded ? null : item.label)}
                              className="flex w-full items-center justify-between py-3 text-[15px] font-bold text-heading"
                            >
                              <span>{item.label}</span>
                              <ChevronDown
                                size={16}
                                className={cn('transition-transform duration-200', expanded && 'rotate-180')}
                              />
                            </button>

                            <AnimatePresence initial={false}>
                              {expanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.25 }}
                                  className="overflow-hidden pl-3"
                                >
                                  {item.type === 'dropdown' && item.children && (
                                    <div className="flex flex-col gap-1 py-1">
                                      {item.children.map((child) => (
                                        <RouterNavLink
                                          key={child.path + child.label}
                                          to={child.path}
                                          onClick={() => setMobileOpen(false)}
                                          className="flex items-center gap-3 py-2 px-3 rounded-lg text-sm text-neutral-600 hover:bg-mist-50"
                                        >
                                          <child.icon size={16} className="text-primary-600" />
                                          <span>{child.label}</span>
                                        </RouterNavLink>
                                      ))}
                                    </div>
                                  )}

                                  {item.type === 'megamenu' && item.columns && (
                                    <div className="flex flex-col gap-4 py-2">
                                      {item.columns.map((col) => (
                                        <div key={col.title}>
                                          <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1 px-3">
                                            {col.title}
                                          </div>
                                          <div className="flex flex-col gap-1">
                                            {col.items.map((sub) => (
                                              <RouterNavLink
                                                key={sub.path + sub.label}
                                                to={sub.path}
                                                onClick={() => setMobileOpen(false)}
                                                className="flex items-center gap-3 py-2 px-3 rounded-lg text-sm text-neutral-600 hover:bg-mist-50"
                                              >
                                                <sub.icon size={16} className="text-primary-600" />
                                                <span>{sub.label}</span>
                                              </RouterNavLink>
                                            ))}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ) : (
                          <RouterNavLink
                            to={item.path!}
                            onClick={() => setMobileOpen(false)}
                            className="block py-3 text-[15px] font-bold text-heading"
                          >
                            {item.label}
                          </RouterNavLink>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Drawer footer details (CTA button & social icons only, phone numbers completely removed) */}
              <div className="pt-6 border-t border-neutral-100 flex flex-col gap-4">
                <Button
                  to="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="w-full rounded-full py-3"
                >
                  Let's Talk
                </Button>

                {settings && (
                  <div className="flex justify-center">
                    <SocialIcons links={settings.socialLinks} />
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
