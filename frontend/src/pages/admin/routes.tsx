import { lazy, type ReactNode } from 'react';

const DashboardPage = lazy(() => import('./DashboardPage').then((m) => ({ default: m.DashboardPage })));
const HeroManagerPage = lazy(() => import('./HeroManagerPage').then((m) => ({ default: m.HeroManagerPage })));
const AboutManagerPage = lazy(() => import('./AboutManagerPage').then((m) => ({ default: m.AboutManagerPage })));
const ResourceCrudPage = lazy(() => import('./ResourceCrudPage').then((m) => ({ default: m.ResourceCrudPage })));
const MediaLibraryPage = lazy(() => import('./MediaLibraryPage').then((m) => ({ default: m.MediaLibraryPage })));
const SeoManagerPage = lazy(() => import('./SeoManagerPage').then((m) => ({ default: m.SeoManagerPage })));
const SettingsPage = lazy(() => import('./SettingsPage').then((m) => ({ default: m.SettingsPage })));
const AnalyticsPage = lazy(() => import('./AnalyticsPage').then((m) => ({ default: m.AnalyticsPage })));

export interface AdminRoute {
  path?: string;
  index?: boolean;
  element: ReactNode;
}

/**
 * All CRUD modules share ResourceCrudPage, which reads its config from the
 * route's resource key (see src/features/admin/resourceConfigs.tsx).
 */
const crudModules = [
  'services',
  'solutions',
  'industries',
  'technologies',
  'process-steps',
  'projects',
  'case-studies',
  'blogs',
  'categories',
  'authors',
  'testimonials',
  'team',
  'timeline',
  'certifications',
  'careers',
  'applications',
  'messages',
  'subscribers',
  'faqs',
  'pricing',
  'users',
  'roles',
];

export const adminRoutes: AdminRoute[] = [
  { index: true, element: <DashboardPage /> },
  { path: 'hero', element: <HeroManagerPage /> },
  { path: 'about', element: <AboutManagerPage /> },
  ...crudModules.map((module) => ({
    path: module,
    element: <ResourceCrudPage moduleKey={module} />,
  })),
  { path: 'media', element: <MediaLibraryPage /> },
  { path: 'seo', element: <SeoManagerPage /> },
  { path: 'settings', element: <SettingsPage /> },
  { path: 'analytics', element: <AnalyticsPage /> },
];
