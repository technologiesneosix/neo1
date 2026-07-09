import {
  ArrowRight,
  Briefcase,
  ClipboardList,
  FolderKanban,
  Inbox,
  Mail,
  PenSquare,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '@/api/services';
import { useList } from '@/api/hooks';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { formatDate, truncate } from '@/lib/utils';

/* --------------------------- deterministic chart --------------------------- */

/** Pseudo traffic derived purely from the day index — stable across renders. */
function trafficPoint(index: number): number {
  const wave = Math.sin(index * 0.62) * 140 + Math.cos(index * 0.31) * 80;
  const trend = index * 9;
  return Math.round(520 + trend + wave + ((index * 37) % 60));
}

function TrafficChart() {
  const points = Array.from({ length: 30 }, (_, i) => trafficPoint(i));
  const max = Math.max(...points);
  const min = Math.min(...points);
  const width = 600;
  const height = 180;
  const step = width / (points.length - 1);
  const y = (value: number) => height - 16 - ((value - min) / (max - min)) * (height - 40);

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${(i * step).toFixed(1)},${y(p).toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-44 w-full"
      role="img"
      aria-label="Site traffic over the last 30 days"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="traffic-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5d5cf2" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#5d5cf2" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((fraction) => (
        <line
          key={fraction}
          x1="0"
          x2={width}
          y1={height * fraction}
          y2={height * fraction}
          stroke="#e8ebf1"
          strokeDasharray="4 6"
        />
      ))}
      <path d={areaPath} fill="url(#traffic-fill)" />
      <path d={linePath} fill="none" stroke="#4c3de4" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/* --------------------------------- widgets -------------------------------- */

interface StatDef {
  label: string;
  value: number;
  icon: LucideIcon;
  to: string;
}

const quickLinks: { label: string; to: string; icon: LucideIcon }[] = [
  { label: 'Hero Slides', to: '/admin/hero', icon: PenSquare },
  { label: 'Services', to: '/admin/services', icon: FolderKanban },
  { label: 'Blog Posts', to: '/admin/blogs', icon: PenSquare },
  { label: 'Projects', to: '/admin/projects', icon: FolderKanban },
  { label: 'Team', to: '/admin/team', icon: Users },
  { label: 'Messages', to: '/admin/messages', icon: Inbox },
  { label: 'Media Library', to: '/admin/media', icon: ClipboardList },
  { label: 'Settings', to: '/admin/settings', icon: Briefcase },
];

const applicationTone = (status: string) =>
  status === 'hired'
    ? 'success'
    : status === 'rejected'
      ? 'danger'
      : status === 'new'
        ? 'primary'
        : 'accent';

/** Admin home: headline stats, traffic chart, recent activity, quick links. */
export function DashboardPage() {
  const projects = useList(api.projects);
  const blogs = useList(api.blogPosts);
  const jobs = useList(api.jobOpenings);
  const messages = useList(api.contactMessages);
  const subscribers = useList(api.subscribers);
  const team = useList(api.teamMembers);
  const applications = useList(api.jobApplications);

  const stats: StatDef[] = [
    { label: 'Projects', value: projects.data?.length ?? 0, icon: FolderKanban, to: '/admin/projects' },
    {
      label: 'Published Blogs',
      value: (blogs.data ?? []).filter((post) => post.status === 'published').length,
      icon: PenSquare,
      to: '/admin/blogs',
    },
    {
      label: 'Open Roles',
      value: (jobs.data ?? []).filter((job) => job.active).length,
      icon: Briefcase,
      to: '/admin/careers',
    },
    {
      label: 'Unread Messages',
      value: (messages.data ?? []).filter((message) => !message.read).length,
      icon: Inbox,
      to: '/admin/messages',
    },
    { label: 'Subscribers', value: subscribers.data?.length ?? 0, icon: Mail, to: '/admin/subscribers' },
    { label: 'Team', value: team.data?.length ?? 0, icon: Users, to: '/admin/team' },
  ];

  const recentMessages = [...(messages.data ?? [])]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  const recentApplications = [...(applications.data ?? [])]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  const jobTitle = (jobId: string) =>
    (jobs.data ?? []).find((job) => job.id === jobId)?.title ?? 'Unknown role';

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-heading">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-500">
          A quick look at everything happening across the site.
        </p>
      </header>

      {/* Stat cards */}
      <section aria-label="Key statistics" className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.to} className="block">
            <Card hover className="flex h-full flex-col gap-3 p-5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-brand-gradient-soft text-white">
                <stat.icon size={17} aria-hidden="true" />
              </span>
              <div>
                <p className="text-2xl font-bold text-heading">
                  <AnimatedCounter value={stat.value} />
                </p>
                <p className="mt-0.5 text-xs font-medium text-neutral-400">{stat.label}</p>
              </div>
            </Card>
          </Link>
        ))}
      </section>

      {/* Traffic */}
      <Card hover={false} className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-heading">Traffic (last 30 days)</h2>
          <Badge tone="neutral">Demo data</Badge>
        </div>
        <TrafficChart />
      </Card>

      {/* Recent activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card hover={false} className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-heading">Recent Messages</h2>
            <Link
              to="/admin/messages"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700"
            >
              View all <ArrowRight size={12} aria-hidden="true" />
            </Link>
          </div>
          {recentMessages.length === 0 ? (
            <p className="py-8 text-center text-sm text-neutral-400">No messages yet.</p>
          ) : (
            <ul className="divide-y divide-neutral-50">
              {recentMessages.map((message) => (
                <li key={message.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-heading">{message.name}</p>
                    <p className="truncate text-xs text-neutral-400">
                      {truncate(message.subject, 60)}
                    </p>
                  </div>
                  <time
                    dateTime={message.createdAt}
                    className="shrink-0 text-xs text-neutral-400"
                  >
                    {formatDate(message.createdAt)}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card hover={false} className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-heading">Recent Applications</h2>
            <Link
              to="/admin/applications"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700"
            >
              View all <ArrowRight size={12} aria-hidden="true" />
            </Link>
          </div>
          {recentApplications.length === 0 ? (
            <p className="py-8 text-center text-sm text-neutral-400">No applications yet.</p>
          ) : (
            <ul className="divide-y divide-neutral-50">
              {recentApplications.map((application) => (
                <li key={application.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-heading">
                      {application.name}
                    </p>
                    <p className="truncate text-xs text-neutral-400">
                      {jobTitle(application.jobId)}
                    </p>
                  </div>
                  <Badge tone={applicationTone(application.status)}>{application.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Quick links */}
      <section aria-label="Quick links">
        <h2 className="mb-3 text-base font-bold text-heading">Quick Links</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickLinks.map((link) => (
            <Link
              key={link.to + link.label}
              to={link.to}
              className="flex items-center gap-2.5 rounded-md bg-white px-4 py-3 text-sm font-medium text-heading shadow-card transition-all hover:-translate-y-0.5 hover:text-primary-600 hover:shadow-card-hover"
            >
              <link.icon size={15} className="text-primary-500" aria-hidden="true" />
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
