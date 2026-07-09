import { Clock, Eye, MousePointerClick, Users, type LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

/* ------------------------- deterministic demo data ------------------------- */

/** Day index since epoch — the only "seed"; identical within a day, no Math.random. */
const DAY_INDEX = Math.floor(Date.now() / 86400000);

function seeded(offset: number): number {
  const x = Math.sin((DAY_INDEX + offset) * 12.9898) * 43758.5453;
  return x - Math.floor(x); // 0..1
}

interface DayPoint {
  views: number;
  visitors: number;
}

const days: DayPoint[] = Array.from({ length: 30 }, (_, i) => {
  const wave = Math.sin(i * 0.55) * 0.25 + 0.75;
  const views = Math.round((900 + i * 18) * wave + seeded(i) * 260);
  return { views, visitors: Math.round(views * (0.52 + seeded(i + 100) * 0.14)) };
});

const totalViews = days.reduce((sum, day) => sum + day.views, 0);
const totalVisitors = days.reduce((sum, day) => sum + day.visitors, 0);
const avgTimeSeconds = 142 + Math.round(seeded(7) * 60);
const bounceRate = 38 + Math.round(seeded(11) * 10);

const topPages = [
  { path: '/', share: 0.32 },
  { path: '/services', share: 0.21 },
  { path: '/blog', share: 0.16 },
  { path: '/portfolio', share: 0.12 },
  { path: '/contact', share: 0.1 },
  { path: '/careers', share: 0.09 },
].map((page) => ({ ...page, views: Math.round(totalViews * page.share) }));

const sources = [
  { label: 'Organic Search', value: 46, color: '#4c3de4' },
  { label: 'Direct', value: 27, color: '#3d64ff' },
  { label: 'Social', value: 17, color: '#2ab6f1' },
  { label: 'Referral', value: 10, color: '#c5cbff' },
];

/* --------------------------------- charts --------------------------------- */

function AreaChart() {
  const width = 600;
  const height = 200;
  const values = days.map((day) => day.views);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const step = width / (values.length - 1);
  const y = (value: number) => height - 20 - ((value - min) / (max - min)) * (height - 48);
  const line = values
    .map((v, i) => `${i === 0 ? 'M' : 'L'}${(i * step).toFixed(1)},${y(v).toFixed(1)}`)
    .join(' ');

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-52 w-full"
      role="img"
      aria-label="Page views over the last 30 days"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="analytics-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4c3de4" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#4c3de4" stopOpacity="0" />
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
      <path d={`${line} L${width},${height} L0,${height} Z`} fill="url(#analytics-fill)" />
      <path d={line} fill="none" stroke="#4c3de4" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function SourcesDonut() {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-wrap items-center justify-center gap-8">
      <svg
        viewBox="0 0 160 160"
        className="h-40 w-40"
        role="img"
        aria-label="Traffic sources breakdown"
      >
        {sources.map((source) => {
          const length = (source.value / 100) * circumference;
          const circle = (
            <circle
              key={source.label}
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={source.color}
              strokeWidth="22"
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 80 80)"
            />
          );
          offset += length;
          return circle;
        })}
        <text
          x="80"
          y="76"
          textAnchor="middle"
          className="fill-heading text-lg font-bold"
        >
          {sources[0].value}%
        </text>
        <text x="80" y="94" textAnchor="middle" className="fill-neutral-400 text-[10px]">
          organic
        </text>
      </svg>
      <ul className="space-y-2" aria-label="Source legend">
        {sources.map((source) => (
          <li key={source.label} className="flex items-center gap-2.5 text-sm text-neutral-600">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: source.color }}
              aria-hidden="true"
            />
            {source.label}
            <span className="ml-auto pl-6 text-xs font-semibold text-heading">{source.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------------------------- page ---------------------------------- */

interface Kpi {
  label: string;
  value: number;
  suffix: string;
  icon: LucideIcon;
  detail: string;
}

const kpis: Kpi[] = [
  { label: 'Views', value: totalViews, suffix: '', icon: Eye, detail: 'last 30 days' },
  { label: 'Visitors', value: totalVisitors, suffix: '', icon: Users, detail: 'last 30 days' },
  {
    label: 'Avg. time',
    value: avgTimeSeconds,
    suffix: 's',
    icon: Clock,
    detail: 'per session',
  },
  {
    label: 'Bounce',
    value: bounceRate,
    suffix: '%',
    icon: MousePointerClick,
    detail: 'bounce rate',
  },
];

/** Demo analytics dashboard with deterministic pseudo data. */
export function AnalyticsPage() {
  const maxPageViews = Math.max(...topPages.map((page) => page.views));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-heading">Analytics</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Traffic overview for the public site.
          </p>
        </div>
        <Badge tone="warning">Demo data — connect your analytics provider</Badge>
      </header>

      {/* KPI cards */}
      <section aria-label="Key metrics" className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} hover={false} className="flex items-center gap-4 p-5">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-gradient-soft text-white">
              <kpi.icon size={18} aria-hidden="true" />
            </span>
            <div>
              <p className="text-xl font-bold text-heading">
                <AnimatedCounter value={kpi.value} suffix={kpi.suffix} />
              </p>
              <p className="text-xs text-neutral-400">
                {kpi.label} · {kpi.detail}
              </p>
            </div>
          </Card>
        ))}
      </section>

      {/* Area chart */}
      <Card hover={false} className="p-6">
        <h2 className="mb-4 text-base font-bold text-heading">Page Views (last 30 days)</h2>
        <AreaChart />
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top pages */}
        <Card hover={false} className="p-6">
          <h2 className="mb-5 text-base font-bold text-heading">Top Pages</h2>
          <ul className="space-y-4">
            {topPages.map((page) => (
              <li key={page.path}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-heading">{page.path}</span>
                  <span className="text-xs text-neutral-400">
                    {page.views.toLocaleString()} views
                  </span>
                </div>
                <div
                  className="h-2 rounded-full bg-mist-100"
                  role="img"
                  aria-label={`${page.path}: ${page.views.toLocaleString()} views`}
                >
                  <div
                    className="h-2 rounded-full bg-brand-gradient"
                    style={{ width: `${(page.views / maxPageViews) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {/* Traffic sources */}
        <Card hover={false} className="p-6">
          <h2 className="mb-5 text-base font-bold text-heading">Traffic Sources</h2>
          <SourcesDonut />
        </Card>
      </div>
    </div>
  );
}
