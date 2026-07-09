/** Shared entity base — every CRUD resource extends this. */
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface SeoMeta {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  canonicalUrl?: string;
  ogImage?: string;
  robots?: string;
}

/* ---------------------------------- Site ---------------------------------- */

export interface NavLink {
  id: string;
  label: string;
  path: string;
  children?: NavLink[];
}

export interface SocialLink {
  id: string;
  platform: 'twitter' | 'linkedin' | 'instagram' | 'youtube' | 'github';
  url: string;
}

export interface SiteSettings extends BaseEntity {
  siteName: string;
  tagline: string;
  logoUrl: string;
  logoDarkUrl: string;
  faviconUrl: string;
  phone: string;
  email: string;
  address: string;
  workingHours: string;
  mapEmbedUrl: string;
  socialLinks: SocialLink[];
  navLinks: NavLink[];
  footerText: string;
  copyrightText: string;
  primaryColor: string;
  accentColor: string;
  newsletterEnabled: boolean;
  topBarEnabled: boolean;
}

export interface HeroSlide extends BaseEntity {
  title: string;
  subtitle: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaLink: string;
  secondaryCtaLabel?: string;
  secondaryCtaLink?: string;
  imageUrl: string;
  order: number;
  active: boolean;
}

export interface AboutContent extends BaseEntity {
  sectionLabel: string;
  title: string;
  leadText: string;
  description: string;
  imageUrl: string;
  ctaLabel: string;
  ctaLink: string;
  mission: string;
  vision: string;
  values: string[];
  stats: { id: string; label: string; value: number; suffix: string }[];
}

export interface TimelineItem extends BaseEntity {
  year: string;
  title: string;
  description: string;
  order: number;
}

export interface Certification extends BaseEntity {
  name: string;
  issuer: string;
  imageUrl: string;
  year: string;
}

/* -------------------------------- Catalog --------------------------------- */

export interface Service extends BaseEntity {
  title: string;
  slug: string;
  icon: string; // lucide icon name
  excerpt: string;
  description: string;
  features: string[];
  imageUrl: string;
  order: number;
  featured: boolean;
  seo: SeoMeta;
}

export interface Solution extends BaseEntity {
  title: string;
  slug: string;
  icon: string;
  excerpt: string;
  description: string;
  features: string[];
  imageUrl: string;
  order: number;
  seo: SeoMeta;
}

export interface Industry extends BaseEntity {
  title: string;
  slug: string;
  icon: string;
  excerpt: string;
  description: string;
  imageUrl: string;
  order: number;
  seo: SeoMeta;
}

export type TechnologyCategory =
  | 'frontend'
  | 'backend'
  | 'mobile'
  | 'database'
  | 'cloud'
  | 'devops'
  | 'ai'
  | 'design'
  | 'other';

export interface Technology extends BaseEntity {
  name: string;
  category: TechnologyCategory;
  icon: string;
  description: string;
  order: number;
}

export interface ProcessStep extends BaseEntity {
  title: string;
  description: string;
  icon: string;
  order: number;
}

/* ------------------------------- Portfolio -------------------------------- */

export interface Project extends BaseEntity {
  title: string;
  slug: string;
  category: string;
  client: string;
  excerpt: string;
  description: string;
  coverImageUrl: string;
  gallery: string[];
  technologies: string[];
  features: string[];
  results: string[];
  timeline: string;
  liveUrl?: string;
  featured: boolean;
  order: number;
  seo: SeoMeta;
}

export interface CaseStudy extends BaseEntity {
  title: string;
  slug: string;
  projectId?: string;
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string[];
  coverImageUrl: string;
  seo: SeoMeta;
}

/* ---------------------------------- Blog ---------------------------------- */

export interface Category extends BaseEntity {
  name: string;
  slug: string;
  description: string;
}

export interface Author extends BaseEntity {
  name: string;
  role: string;
  avatarUrl: string;
  bio: string;
}

export interface BlogPost extends BaseEntity {
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML from rich text editor
  bannerUrl: string;
  categoryId: string;
  authorId: string;
  tags: string[];
  status: 'draft' | 'published';
  featured: boolean;
  publishedAt: string;
  commentsCount: number;
  seo: SeoMeta;
}

/* --------------------------------- People --------------------------------- */

export interface TeamMember extends BaseEntity {
  name: string;
  role: string;
  photoUrl: string;
  bio: string;
  socialLinks: SocialLink[];
  order: number;
}

export interface Testimonial extends BaseEntity {
  name: string;
  role: string;
  company: string;
  avatarUrl: string;
  quote: string;
  rating: number;
  order: number;
  active: boolean;
}

/* -------------------------------- Careers --------------------------------- */

export interface JobOpening extends BaseEntity {
  title: string;
  slug: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  active: boolean;
}

export interface JobApplication extends BaseEntity {
  jobId: string;
  name: string;
  email: string;
  phone: string;
  resumeUrl: string;
  coverLetter: string;
  status: 'new' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
}

/* ------------------------------ Communication ----------------------------- */

export interface ContactMessage extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  read: boolean;
}

export interface NewsletterSubscriber extends BaseEntity {
  email: string;
  active: boolean;
}

export interface FaqItem extends BaseEntity {
  question: string;
  answer: string;
  category: string;
  order: number;
}

/* --------------------------------- Admin ---------------------------------- */

export interface MediaAsset extends BaseEntity {
  name: string;
  url: string;
  type: 'image' | 'video' | 'pdf';
  folder: string;
  size: number; // bytes
}

export interface PageSeo extends BaseEntity {
  page: string; // route path, e.g. "/about"
  seo: SeoMeta;
}

export interface AdminUser extends BaseEntity {
  name: string;
  email: string;
  roleId: string;
  avatarUrl: string;
  active: boolean;
}

export interface Role extends BaseEntity {
  name: string;
  description: string;
  permissions: string[];
}

export interface PricingPlan extends BaseEntity {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  ctaLabel: string;
  order: number;
}

/** Simple page-view analytics snapshot used by the admin dashboard. */
export interface AnalyticsPoint {
  date: string;
  views: number;
  visitors: number;
}
