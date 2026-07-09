import { lazy, type ReactNode } from 'react';

const HomePage = lazy(() => import('./HomePage').then((m) => ({ default: m.HomePage })));
const AboutCompanyPage = lazy(() => import('./about/AboutCompanyPage').then((m) => ({ default: m.AboutCompanyPage })));
const MissionVisionPage = lazy(() => import('./about/MissionVisionPage').then((m) => ({ default: m.MissionVisionPage })));
const JourneyPage = lazy(() => import('./about/JourneyPage').then((m) => ({ default: m.JourneyPage })));
const TeamPage = lazy(() => import('./about/TeamPage').then((m) => ({ default: m.TeamPage })));
const LifePage = lazy(() => import('./about/LifePage').then((m) => ({ default: m.LifePage })));
const CertificationsPage = lazy(() => import('./about/CertificationsPage').then((m) => ({ default: m.CertificationsPage })));
const ServicesPage = lazy(() => import('./services/ServicesPage').then((m) => ({ default: m.ServicesPage })));
const ServiceDetailPage = lazy(() => import('./services/ServiceDetailPage').then((m) => ({ default: m.ServiceDetailPage })));
const SolutionsPage = lazy(() => import('./solutions/SolutionsPage').then((m) => ({ default: m.SolutionsPage })));
const SolutionDetailPage = lazy(() => import('./solutions/SolutionDetailPage').then((m) => ({ default: m.SolutionDetailPage })));
const IndustriesPage = lazy(() => import('./industries/IndustriesPage').then((m) => ({ default: m.IndustriesPage })));
const IndustryDetailPage = lazy(() => import('./industries/IndustryDetailPage').then((m) => ({ default: m.IndustryDetailPage })));
const TechnologiesPage = lazy(() => import('./TechnologiesPage').then((m) => ({ default: m.TechnologiesPage })));
const PortfolioPage = lazy(() => import('./portfolio/PortfolioPage').then((m) => ({ default: m.PortfolioPage })));
const CaseStudiesPage = lazy(() => import('./portfolio/CaseStudiesPage').then((m) => ({ default: m.CaseStudiesPage })));
const ProjectDetailPage = lazy(() => import('./portfolio/ProjectDetailPage').then((m) => ({ default: m.ProjectDetailPage })));
const BlogPage = lazy(() => import('./blog/BlogPage').then((m) => ({ default: m.BlogPage })));
const BlogPostPage = lazy(() => import('./blog/BlogPostPage').then((m) => ({ default: m.BlogPostPage })));
const CareersPage = lazy(() => import('./careers/CareersPage').then((m) => ({ default: m.CareersPage })));
const InternshipsPage = lazy(() => import('./careers/InternshipsPage').then((m) => ({ default: m.InternshipsPage })));
const HiringProcessPage = lazy(() => import('./careers/HiringProcessPage').then((m) => ({ default: m.HiringProcessPage })));
const JobDetailPage = lazy(() => import('./careers/JobDetailPage').then((m) => ({ default: m.JobDetailPage })));
const ContactPage = lazy(() => import('./ContactPage').then((m) => ({ default: m.ContactPage })));
const FaqPage = lazy(() => import('./FaqPage').then((m) => ({ default: m.FaqPage })));
const PrivacyPolicyPage = lazy(() => import('./PrivacyPolicyPage').then((m) => ({ default: m.PrivacyPolicyPage })));
const TermsPage = lazy(() => import('./TermsPage').then((m) => ({ default: m.TermsPage })));
const NotFoundPage = lazy(() => import('./NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

export interface PublicRoute {
  path: string;
  element: ReactNode;
}

export const publicRoutes: PublicRoute[] = [
  { path: '/', element: <HomePage /> },
  { path: '/about', element: <AboutCompanyPage /> },
  { path: '/about/mission-vision', element: <MissionVisionPage /> },
  { path: '/about/journey', element: <JourneyPage /> },
  { path: '/about/team', element: <TeamPage /> },
  { path: '/about/life', element: <LifePage /> },
  { path: '/about/certifications', element: <CertificationsPage /> },
  { path: '/services', element: <ServicesPage /> },
  { path: '/services/:slug', element: <ServiceDetailPage /> },
  { path: '/solutions', element: <SolutionsPage /> },
  { path: '/solutions/:slug', element: <SolutionDetailPage /> },
  { path: '/industries', element: <IndustriesPage /> },
  { path: '/industries/:slug', element: <IndustryDetailPage /> },
  { path: '/technologies', element: <TechnologiesPage /> },
  { path: '/portfolio', element: <PortfolioPage /> },
  { path: '/portfolio/case-studies', element: <CaseStudiesPage /> },
  { path: '/portfolio/:slug', element: <ProjectDetailPage /> },
  { path: '/blog', element: <BlogPage /> },
  { path: '/blog/:slug', element: <BlogPostPage /> },
  { path: '/careers', element: <CareersPage /> },
  { path: '/careers/internships', element: <InternshipsPage /> },
  { path: '/careers/hiring-process', element: <HiringProcessPage /> },
  { path: '/careers/:slug', element: <JobDetailPage /> },
  { path: '/contact', element: <ContactPage /> },
  { path: '/faq', element: <FaqPage /> },
  { path: '/privacy-policy', element: <PrivacyPolicyPage /> },
  { path: '/terms', element: <TermsPage /> },
  { path: '*', element: <NotFoundPage /> },
];
