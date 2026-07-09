import type {
  AboutContent,
  AdminUser,
  Author,
  BlogPost,
  CaseStudy,
  Category,
  Certification,
  ContactMessage,
  FaqItem,
  HeroSlide,
  Industry,
  JobApplication,
  JobOpening,
  MediaAsset,
  NewsletterSubscriber,
  PageSeo,
  PricingPlan,
  ProcessStep,
  Project,
  Role,
  Service,
  SiteSettings,
  Solution,
  TeamMember,
  Technology,
  Testimonial,
  TimelineItem,
} from '@/types';
import { createResourceApi } from './resource';

/**
 * Single registry of every CRUD resource in the system. Both the public site
 * and the admin panel consume these — one definition, no duplication.
 */
export const api = {
  settings: createResourceApi<SiteSettings>('settings'),
  heroSlides: createResourceApi<HeroSlide>('hero-slides'),
  about: createResourceApi<AboutContent>('about'),
  timeline: createResourceApi<TimelineItem>('timeline'),
  certifications: createResourceApi<Certification>('certifications'),
  services: createResourceApi<Service>('services'),
  solutions: createResourceApi<Solution>('solutions'),
  industries: createResourceApi<Industry>('industries'),
  technologies: createResourceApi<Technology>('technologies'),
  processSteps: createResourceApi<ProcessStep>('process-steps'),
  projects: createResourceApi<Project>('projects'),
  caseStudies: createResourceApi<CaseStudy>('case-studies'),
  categories: createResourceApi<Category>('categories'),
  authors: createResourceApi<Author>('authors'),
  blogPosts: createResourceApi<BlogPost>('blog-posts'),
  teamMembers: createResourceApi<TeamMember>('team-members'),
  testimonials: createResourceApi<Testimonial>('testimonials'),
  jobOpenings: createResourceApi<JobOpening>('job-openings'),
  jobApplications: createResourceApi<JobApplication>('job-applications'),
  contactMessages: createResourceApi<ContactMessage>('contact-messages'),
  subscribers: createResourceApi<NewsletterSubscriber>('subscribers'),
  faqs: createResourceApi<FaqItem>('faqs'),
  mediaAssets: createResourceApi<MediaAsset>('media-assets'),
  pageSeo: createResourceApi<PageSeo>('page-seo'),
  adminUsers: createResourceApi<AdminUser>('admin-users'),
  roles: createResourceApi<Role>('roles'),
  pricingPlans: createResourceApi<PricingPlan>('pricing-plans'),
} as const;

export type ApiRegistry = typeof api;
export type ResourceName = keyof ApiRegistry;
