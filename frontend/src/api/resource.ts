import type { BaseEntity } from '@/types';
import { http, useRemoteApi } from './client';
import { mockDb } from './db';

export interface ResourceApi<T extends BaseEntity> {
  key: string;
  list: () => Promise<T[]>;
  get: (id: string) => Promise<T>;
  getBySlug: (slug: string) => Promise<T>;
  create: (data: Omit<T, keyof BaseEntity>) => Promise<T>;
  update: (id: string, data: Partial<T>) => Promise<T>;
  remove: (id: string) => Promise<void>;
}

// Mock-only resources that do not exist on the backend
const mockOnlyKeys = ['timeline', 'certifications', 'pricing-plans', 'roles', 'process-steps', 'page-seo', 'case-studies'];

/* -------------------------------------------------------------------------- */
/*                               Data Mappers                                 */
/* -------------------------------------------------------------------------- */

function mapBackendSettingsToFrontend(b: any): any {
  if (!b) return null;
  const socialLinksArray: any[] = [];
  if (b.socialLinks) {
    Object.entries(b.socialLinks).forEach(([platform, url]) => {
      if (url) {
        socialLinksArray.push({
          id: platform,
          platform,
          url,
        });
      }
    });
  }
  return {
    id: b._id || b.id || 'settings-id',
    siteName: b.siteName || '',
    tagline: b.tagline || '',
    logoUrl: b.logo || '',
    logoDarkUrl: b.logo || '',
    faviconUrl: b.favicon || '',
    phone: b.phone || '',
    email: b.contactEmail || '',
    address: b.address || '',
    workingHours: 'Mon - Fri: 9:00 AM - 6:00 PM',
    mapEmbedUrl: b.googleMap || '',
    socialLinks: socialLinksArray,
    navLinks: [
      { id: 'nav-1', label: 'Home', path: '/' },
      {
        id: 'nav-2',
        label: 'About',
        path: '/about',
        children: [
          { id: 'nav-2a', label: 'Company', path: '/about' },
          { id: 'nav-2b', label: 'Mission & Vision', path: '/about/mission-vision' },
          { id: 'nav-2c', label: 'Our Journey', path: '/about/journey' },
          { id: 'nav-2d', label: 'Our Team', path: '/about/team' },
          { id: 'nav-2e', label: 'Life at Neosix', path: '/about/life' },
          { id: 'nav-2f', label: 'Certifications', path: '/about/certifications' },
        ],
      },
      { id: 'nav-3', label: 'Services', path: '/services' },
      { id: 'nav-4', label: 'Solutions', path: '/solutions' },
      { id: 'nav-5', label: 'Industries', path: '/industries' },
      { id: 'nav-6', label: 'Technologies', path: '/technologies' },
      { id: 'nav-7', label: 'Portfolio', path: '/portfolio' },
      { id: 'nav-8', label: 'Blog', path: '/blog' },
      { id: 'nav-9', label: 'Careers', path: '/careers' },
      { id: 'nav-10', label: 'Contact', path: '/contact' },
    ],
    footerText: b.footerText || '',
    copyrightText: b.copyright || '',
    primaryColor: '#0f172a',
    accentColor: '#2563eb',
    newsletterEnabled: true,
    topBarEnabled: true,
    createdAt: b.createdAt || '',
    updatedAt: b.updatedAt || '',
  };
}

function mapFrontendSettingsToBackend(f: any): any {
  const socialLinksObj: Record<string, string> = {
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
    github: '',
  };
  if (Array.isArray(f.socialLinks)) {
    f.socialLinks.forEach((item: any) => {
      if (item.platform && item.url) {
        socialLinksObj[item.platform] = item.url;
      }
    });
  }
  return {
    siteName: f.siteName,
    tagline: f.tagline,
    logo: f.logoUrl,
    favicon: f.faviconUrl,
    contactEmail: f.email,
    phone: f.phone,
    address: f.address,
    socialLinks: socialLinksObj,
    googleMap: f.mapEmbedUrl,
    footerText: f.footerText,
    copyright: f.copyrightText,
  };
}

function mapBackendAboutToFrontend(b: any): any {
  if (!b) return null;
  return {
    id: b._id || b.id || 'about-id',
    sectionLabel: 'ABOUT US',
    title: b.companyName || '',
    leadText: b.shortDescription || '',
    description: b.fullDescription || '',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    ctaLabel: 'Learn More',
    ctaLink: '/about',
    mission: b.mission || '',
    vision: b.vision || '',
    values: ['Innovation', 'Excellence', 'Integrity', 'Collaboration'],
    stats: [
      { id: '1', label: 'Years of Experience', value: b.experience || 0, suffix: '+' },
      { id: '2', label: 'Expert Employees', value: b.employees || 0, suffix: '+' },
      { id: '3', label: 'Projects Completed', value: b.projectsCompleted || 0, suffix: '+' },
      { id: '4', label: 'Countries Served', value: b.countriesServed || 0, suffix: '+' },
    ],
    createdAt: b.createdAt || '',
    updatedAt: b.updatedAt || '',
  };
}

function mapFrontendAboutToBackend(f: any): any {
  const experienceStat = f.stats?.find((s: any) => s.label.toLowerCase().includes('experience'))?.value || 0;
  const employeesStat = f.stats?.find((s: any) => s.label.toLowerCase().includes('employee'))?.value || 0;
  const projectsStat = f.stats?.find((s: any) => s.label.toLowerCase().includes('project'))?.value || 0;
  const countriesStat = f.stats?.find((s: any) => s.label.toLowerCase().includes('countries') || s.label.toLowerCase().includes('serve'))?.value || 0;
  return {
    companyName: f.title,
    shortDescription: f.leadText,
    fullDescription: f.description,
    mission: f.mission,
    vision: f.vision,
    journey: f.leadText,
    experience: Number(experienceStat),
    employees: Number(employeesStat),
    projectsCompleted: Number(projectsStat),
    countriesServed: Number(countriesStat),
  };
}

function mapBackendHeroToFrontend(b: any): any {
  if (!b) return null;
  return {
    id: b._id || b.id,
    title: b.title || '',
    subtitle: b.subtitle || '',
    description: b.description || '',
    primaryCtaLabel: b.primaryButtonText || 'Get Started',
    primaryCtaLink: b.primaryButtonLink || '#',
    secondaryCtaLabel: b.secondaryButtonText || 'Learn More',
    secondaryCtaLink: b.secondaryButtonLink || '#',
    imageUrl: b.heroImage || b.backgroundImage || '',
    active: typeof b.isActive === 'boolean' ? b.isActive : true,
    order: 1,
    createdAt: b.createdAt || '',
    updatedAt: b.updatedAt || '',
  };
}

function mapFrontendHeroToBackend(f: any): any {
  return {
    title: f.title,
    subtitle: f.subtitle,
    description: f.description,
    primaryButtonText: f.primaryCtaLabel,
    primaryButtonLink: f.primaryCtaLink,
    secondaryButtonText: f.secondaryCtaLabel || 'Learn More',
    secondaryButtonLink: f.secondaryCtaLink || '#',
    heroImage: f.imageUrl,
    backgroundImage: f.imageUrl,
    isActive: typeof f.active === 'boolean' ? f.active : true,
  };
}

function mapBackendServiceToFrontend(b: any): any {
  if (!b) return null;
  return {
    id: b._id || b.id,
    title: b.title || '',
    slug: b.slug || '',
    icon: b.icon || 'Globe',
    excerpt: b.shortDescription || '',
    description: b.description || '',
    features: b.features || [],
    imageUrl: b.thumbnail || '',
    order: b.displayOrder || 0,
    featured: typeof b.isFeatured === 'boolean' ? b.isFeatured : false,
    seo: {
      metaTitle: b.seo?.metaTitle || '',
      metaDescription: b.seo?.metaDescription || '',
      keywords: Array.isArray(b.seo?.keywords) ? b.seo.keywords.join(', ') : '',
    },
    createdAt: b.createdAt || '',
    updatedAt: b.updatedAt || '',
  };
}

function mapFrontendServiceToBackend(f: any): any {
  const keywords = typeof f.seo?.keywords === 'string' ? f.seo.keywords.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
  return {
    title: f.title,
    slug: f.slug,
    icon: f.icon,
    shortDescription: f.excerpt,
    description: f.description,
    features: f.features,
    thumbnail: f.imageUrl,
    displayOrder: Number(f.order || 0),
    isFeatured: typeof f.featured === 'boolean' ? f.featured : false,
    status: 'published',
    seo: {
      metaTitle: f.seo?.metaTitle || '',
      metaDescription: f.seo?.metaDescription || '',
      keywords,
    },
  };
}

function mapBackendSolutionToFrontend(b: any): any {
  if (!b) return null;
  return {
    id: b._id || b.id,
    title: b.title || '',
    slug: b.slug || '',
    icon: b.icon || 'Boxes',
    // Strip HTML tags for the card teaser preview; keep full HTML for the detail page
    excerpt: (b.shortDescription || b.description || '').replace(/<[^>]*>/g, '').trim(),
    description: b.description || '',
    features: b.features || [],
    imageUrl: b.banner || '',
    order: 0,
    seo: {
      metaTitle: b.seo?.metaTitle || '',
      metaDescription: b.seo?.metaDescription || '',
      keywords: Array.isArray(b.seo?.keywords) ? b.seo.keywords.join(', ') : '',
    },
    createdAt: b.createdAt || '',
    updatedAt: b.updatedAt || '',
  };
}

function mapFrontendSolutionToBackend(f: any): any {
  const keywords = typeof f.seo?.keywords === 'string' ? f.seo.keywords.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
  return {
    title: f.title,
    slug: f.slug,
    icon: f.icon,
    description: f.description,
    features: f.features,
    banner: f.imageUrl,
    seo: {
      metaTitle: f.seo?.metaTitle || '',
      metaDescription: f.seo?.metaDescription || '',
      keywords,
    },
    status: 'published',
  };
}

function mapBackendIndustryToFrontend(b: any): any {
  if (!b) return null;
  return {
    id: b._id || b.id,
    title: b.title || '',
    slug: b.slug || '',
    icon: b.icon || 'Building2',
    excerpt: b.description || '',
    description: b.description || '',
    imageUrl: b.banner || '',
    order: b.displayOrder || 0,
    seo: {
      metaTitle: b.seo?.metaTitle || '',
      metaDescription: b.seo?.metaDescription || '',
      keywords: Array.isArray(b.seo?.keywords) ? b.seo.keywords.join(', ') : '',
    },
    createdAt: b.createdAt || '',
    updatedAt: b.updatedAt || '',
  };
}

function mapFrontendIndustryToBackend(f: any): any {
  const keywords = typeof f.seo?.keywords === 'string' ? f.seo.keywords.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
  return {
    title: f.title,
    slug: f.slug,
    icon: f.icon,
    description: f.description,
    banner: f.imageUrl,
    seo: {
      metaTitle: f.seo?.metaTitle || '',
      metaDescription: f.seo?.metaDescription || '',
      keywords,
    },
    status: 'published',
  };
}

function mapBackendProjectToFrontend(b: any): any {
  if (!b) return null;
  return {
    id: b._id || b.id,
    title: b.title || '',
    slug: b.slug || '',
    category: b.category || 'Development',
    client: b.client || '',
    excerpt: b.shortDescription || '',
    description: b.description || '',
    coverImageUrl: b.banner || b.thumbnail || '',
    gallery: b.gallery || [],
    technologies: Array.isArray(b.technologies) ? b.technologies.map((t: any) => typeof t === 'object' ? (t.name || t.slug || '') : String(t)).filter(Boolean) : [],
    features: b.features || [],
    results: b.results || [],
    timeline: b.duration || '3 months',
    liveUrl: b.liveUrl || '',
    featured: typeof b.featured === 'boolean' ? b.featured : false,
    order: b.displayOrder || 0,
    seo: {
      metaTitle: b.seo?.metaTitle || '',
      metaDescription: b.seo?.metaDescription || '',
      keywords: Array.isArray(b.seo?.keywords) ? b.seo.keywords.join(', ') : '',
    },
    createdAt: b.createdAt || '',
    updatedAt: b.updatedAt || '',
  };
}

function mapFrontendProjectToBackend(f: any): any {
  const keywords = typeof f.seo?.keywords === 'string' ? f.seo.keywords.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
  return {
    title: f.title,
    slug: f.slug,
    client: f.client,
    shortDescription: f.excerpt,
    description: f.description,
    features: f.features,
    gallery: f.gallery,
    banner: f.coverImageUrl,
    thumbnail: f.coverImageUrl,
    liveUrl: f.liveUrl,
    featured: typeof f.featured === 'boolean' ? f.featured : false,
    status: 'published',
    duration: f.timeline,
    seo: {
      metaTitle: f.seo?.metaTitle || '',
      metaDescription: f.seo?.metaDescription || '',
      keywords,
    },
  };
}

function mapBackendBlogToFrontend(b: any): any {
  if (!b) return null;
  return {
    id: b._id || b.id,
    title: b.title || '',
    slug: b.slug || '',
    excerpt: b.excerpt || '',
    content: b.content || '',
    bannerUrl: b.banner || '',
    categoryId: typeof b.category === 'object' && b.category ? (b.category._id || b.category.id || '') : String(b.category || ''),
    authorId: typeof b.author === 'object' && b.author ? (b.author._id || b.author.id || '') : String(b.author || ''),
    tags: b.tags || [],
    status: b.published ? 'published' : 'draft',
    featured: typeof b.featured === 'boolean' ? b.featured : false,
    publishedAt: b.publishedAt || '',
    commentsCount: 0,
    seo: {
      metaTitle: b.seo?.metaTitle || '',
      metaDescription: b.seo?.metaDescription || '',
      keywords: Array.isArray(b.seo?.keywords) ? b.seo.keywords.join(', ') : '',
    },
    createdAt: b.createdAt || '',
    updatedAt: b.updatedAt || '',
  };
}

function mapFrontendBlogToBackend(f: any): any {
  const keywords = typeof f.seo?.keywords === 'string' ? f.seo.keywords.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
  return {
    title: f.title,
    slug: f.slug,
    excerpt: f.excerpt,
    content: f.content,
    banner: f.bannerUrl,
    category: f.categoryId || undefined,
    author: f.authorId || undefined,
    tags: f.tags,
    published: f.status === 'published',
    featured: typeof f.featured === 'boolean' ? f.featured : false,
    publishedAt: f.publishedAt || new Date().toISOString(),
    seo: {
      metaTitle: f.seo?.metaTitle || '',
      metaDescription: f.seo?.metaDescription || '',
      keywords,
    },
  };
}

function mapBackendTeamToFrontend(b: any): any {
  if (!b) return null;
  const socialLinksArray: any[] = [];
  if (b.socialLinks) {
    Object.entries(b.socialLinks).forEach(([platform, url]) => {
      if (url) {
        socialLinksArray.push({
          id: platform,
          platform,
          url,
        });
      }
    });
  }
  return {
    id: b._id || b.id,
    name: b.name || '',
    role: b.designation || '',
    photoUrl: b.photo || '',
    bio: b.bio || '',
    socialLinks: socialLinksArray,
    order: b.displayOrder || 0,
    createdAt: b.createdAt || '',
    updatedAt: b.updatedAt || '',
  };
}

function mapFrontendTeamToBackend(f: any): any {
  const socialLinksObj: Record<string, string> = {
    linkedin: '',
    github: '',
    twitter: '',
  };
  if (Array.isArray(f.socialLinks)) {
    f.socialLinks.forEach((item: any) => {
      if (item.platform && item.url) {
        socialLinksObj[item.platform] = item.url;
      }
    });
  }
  return {
    name: f.name,
    designation: f.role,
    photo: f.photoUrl,
    bio: f.bio,
    socialLinks: socialLinksObj,
    displayOrder: Number(f.order || 0),
    status: 'active',
  };
}

function mapBackendTestimonialToFrontend(b: any): any {
  if (!b) return null;
  return {
    id: b._id || b.id,
    name: b.clientName || '',
    role: b.designation || '',
    company: b.company || '',
    avatarUrl: b.photo || '',
    quote: b.review || '',
    rating: b.rating || 5,
    order: b.displayOrder || 0,
    active: b.status === 'active',
    createdAt: b.createdAt || '',
    updatedAt: b.updatedAt || '',
  };
}

function mapFrontendTestimonialToBackend(f: any): any {
  return {
    clientName: f.name,
    designation: f.role,
    company: f.company,
    photo: f.avatarUrl,
    review: f.quote,
    rating: Number(f.rating || 5),
    displayOrder: Number(f.order || 0),
    status: f.active ? 'active' : 'inactive',
    featured: true,
  };
}

function mapBackendCareerToFrontend(b: any): any {
  if (!b) return null;
  return {
    id: b._id || b.id,
    title: b.title || '',
    slug: b.slug || '',
    department: b.department || '',
    location: b.location || '',
    type: b.employmentType || 'full-time',
    experience: b.experience || 'entry-level',
    description: b.description || '',
    responsibilities: b.responsibilities || [],
    requirements: b.requirements || [],
    active: b.status === 'open',
    createdAt: b.createdAt || '',
    updatedAt: b.updatedAt || '',
  };
}

function mapFrontendCareerToBackend(f: any): any {
  const validDepartments = ['engineering', 'design', 'marketing', 'sales', 'hr', 'finance', 'other'];
  const department = validDepartments.includes(f.department?.toLowerCase()) ? f.department.toLowerCase() : 'other';

  const validExperiences = ['entry-level', '1-2 years', '2-5 years', '5-10 years', '10+ years'];
  const experience = validExperiences.includes(f.experience?.toLowerCase()) ? f.experience.toLowerCase() : 'entry-level';

  return {
    title: f.title,
    slug: f.slug,
    department,
    employmentType: f.type || 'full-time',
    location: f.location,
    experience,
    salary: 'Negotiable',
    description: f.description,
    requirements: f.requirements || [],
    responsibilities: f.responsibilities || [],
    benefits: ['Health Insurance', 'Flexible Hours', 'Learning Stipend'],
    status: f.active ? 'open' : 'closed',
  };
}

function mapBackendJobApplicationToFrontend(b: any): any {
  if (!b) return null;
  return {
    id: b._id || b.id,
    jobId: typeof b.career === 'object' && b.career ? (b.career._id || b.career.id || '') : String(b.career || ''),
    name: b.name || '',
    email: b.email || '',
    phone: b.phone || '',
    resumeUrl: b.resume || '',
    coverLetter: b.coverLetter || '',
    status: b.status === 'pending' ? 'new' : b.status,
    createdAt: b.createdAt || '',
    updatedAt: b.updatedAt || '',
  };
}

function mapFrontendJobApplicationToBackend(f: any): any {
  return {
    career: f.jobId || undefined,
    name: f.name,
    email: f.email,
    phone: f.phone,
    resume: f.resumeUrl,
    coverLetter: f.coverLetter,
    status: f.status === 'new' ? 'pending' : f.status,
  };
}

function mapBackendContactMessageToFrontend(b: any): any {
  if (!b) return null;
  return {
    id: b._id || b.id,
    name: b.name || '',
    email: b.email || '',
    phone: b.phone || '',
    subject: b.subject || '',
    message: b.message || '',
    read: b.status !== 'unread',
    createdAt: b.createdAt || '',
    updatedAt: b.updatedAt || '',
  };
}

function mapFrontendContactMessageToBackend(f: any): any {
  return {
    name: f.name,
    email: f.email,
    phone: f.phone,
    subject: f.subject,
    message: f.message,
    status: f.read ? 'read' : 'unread',
  };
}

function mapBackendNewsletterSubscriberToFrontend(b: any): any {
  if (!b) return null;
  return {
    id: b._id || b.id,
    email: b.email || '',
    active: typeof b.isSubscribed === 'boolean' ? b.isSubscribed : true,
    createdAt: b.createdAt || '',
    updatedAt: b.updatedAt || '',
  };
}

function mapFrontendNewsletterSubscriberToBackend(f: any): any {
  return {
    email: f.email,
    isSubscribed: typeof f.active === 'boolean' ? f.active : true,
  };
}

function mapBackendFAQToFrontend(b: any): any {
  if (!b) return null;
  return {
    id: b._id || b.id,
    question: b.question || '',
    answer: b.answer || '',
    category: b.category || 'general',
    order: b.displayOrder || 0,
    createdAt: b.createdAt || '',
    updatedAt: b.updatedAt || '',
  };
}

function mapFrontendFAQToBackend(f: any): any {
  return {
    question: f.question,
    answer: f.answer,
    category: f.category || 'general',
    displayOrder: Number(f.order || 0),
    status: 'active',
  };
}

function mapBackendMediaToFrontend(m: any): any {
  if (!m) return null;
  let type: 'image' | 'video' | 'pdf' = 'image';
  if (m.mimeType?.startsWith('video/')) type = 'video';
  else if (m.mimeType === 'application/pdf') type = 'pdf';

  return {
    id: m._id || m.id,
    name: m.fileName || m.originalName || 'file',
    url: m.url,
    type,
    folder: m.folder || 'uploads',
    size: m.fileSize || 0,
    createdAt: m.createdAt || '',
    updatedAt: m.updatedAt || '',
  };
}

function mapBackendUserToFrontend(b: any): any {
  if (!b) return null;
  return {
    id: b._id || b.id,
    name: b.name || '',
    email: b.email || '',
    avatarUrl: b.avatar || '',
    active: typeof b.isActive === 'boolean' ? b.isActive : true,
    roleId: '1',
    createdAt: b.createdAt || '',
    updatedAt: b.updatedAt || '',
  };
}

function mapFrontendUserToBackend(f: any): any {
  return {
    name: f.name,
    email: f.email,
    password: 'DefaultPassword123',
    avatar: f.avatarUrl,
    isActive: typeof f.active === 'boolean' ? f.active : true,
  };
}

/* -------------------------------------------------------------------------- */
/*                               Mapping Registry                             */
/* -------------------------------------------------------------------------- */

const mappedKeys: Record<string, {
  adminPath: string;
  publicPath: string;
  isSingleton?: boolean;
  mapToFrontend: (item: any) => any;
  mapToBackend: (item: any) => any;
}> = {
  settings: {
    adminPath: '/admin/website-settings',
    publicPath: '/public/settings',
    isSingleton: true,
    mapToFrontend: mapBackendSettingsToFrontend,
    mapToBackend: mapFrontendSettingsToBackend,
  },
  about: {
    adminPath: '/admin/about',
    publicPath: '/public/about',
    isSingleton: true,
    mapToFrontend: mapBackendAboutToFrontend,
    mapToBackend: mapFrontendAboutToBackend,
  },
  'hero-slides': {
    adminPath: '/admin/hero',
    publicPath: '/public/home',
    mapToFrontend: mapBackendHeroToFrontend,
    mapToBackend: mapFrontendHeroToBackend,
  },
  services: {
    adminPath: '/admin/services',
    publicPath: '/public/services',
    mapToFrontend: mapBackendServiceToFrontend,
    mapToBackend: mapFrontendServiceToBackend,
  },
  solutions: {
    adminPath: '/admin/solutions',
    publicPath: '/public/solutions',
    mapToFrontend: mapBackendSolutionToFrontend,
    mapToBackend: mapFrontendSolutionToBackend,
  },
  industries: {
    adminPath: '/admin/industries',
    publicPath: '/public/industries',
    mapToFrontend: mapBackendIndustryToFrontend,
    mapToBackend: mapFrontendIndustryToBackend,
  },
  technologies: {
    adminPath: '/admin/technologies',
    publicPath: '/public/technologies',
    mapToFrontend: (item: any) => ({
      // Public endpoint omits _id; use slug as a stable unique key fallback
      id: item._id || item.id || item.slug || '',
      name: item.name || '',
      category: item.category || 'frontend',
      icon: item.logo || 'Cpu',
      description: item.description || '',
      order: item.displayOrder || 0,
      createdAt: item.createdAt || '',
      updatedAt: item.updatedAt || '',
    }),
    mapToBackend: (item: any) => ({
      name: item.name,
      category: item.category || 'frontend',
      logo: item.icon || 'Cpu',
      description: item.description,
      displayOrder: Number(item.order || 0),
      status: 'published',
    }),
  },
  projects: {
    adminPath: '/admin/projects',
    publicPath: '/public/projects',
    mapToFrontend: mapBackendProjectToFrontend,
    mapToBackend: mapFrontendProjectToBackend,
  },
  'blog-posts': {
    adminPath: '/admin/blogs',
    publicPath: '/public/blogs',
    mapToFrontend: mapBackendBlogToFrontend,
    mapToBackend: mapFrontendBlogToBackend,
  },
  categories: {
    adminPath: '/admin/blog-categories',
    publicPath: '/public/blog/categories',
    mapToFrontend: (item: any) => ({
      id: item._id || item.id,
      name: item.name || '',
      slug: item.slug || '',
      description: item.description || '',
      createdAt: item.createdAt || '',
      updatedAt: item.updatedAt || '',
    }),
    mapToBackend: (item: any) => ({
      name: item.name,
      slug: item.slug,
      description: item.description,
    }),
  },
  'team-members': {
    adminPath: '/admin/team',
    publicPath: '/public/team',
    mapToFrontend: mapBackendTeamToFrontend,
    mapToBackend: mapFrontendTeamToBackend,
  },
  authors: {
    adminPath: '/admin/team',
    publicPath: '/public/team',
    mapToFrontend: (b: any) => ({
      id: b._id || b.id,
      name: b.name || '',
      role: b.designation || '',
      avatarUrl: b.photo || '',
      bio: b.bio || '',
      createdAt: b.createdAt || '',
      updatedAt: b.updatedAt || '',
    }),
    mapToBackend: (f: any) => ({
      name: f.name,
      designation: f.role,
      photo: f.avatarUrl,
      bio: f.bio,
      status: 'active',
    }),
  },
  testimonials: {
    adminPath: '/admin/testimonials',
    publicPath: '/public/testimonials',
    mapToFrontend: mapBackendTestimonialToFrontend,
    mapToBackend: mapFrontendTestimonialToBackend,
  },
  'job-openings': {
    adminPath: '/admin/careers',
    publicPath: '/public/careers',
    mapToFrontend: mapBackendCareerToFrontend,
    mapToBackend: mapFrontendCareerToBackend,
  },
  'job-applications': {
    adminPath: '/admin/applications',
    publicPath: '/public/careers',
    mapToFrontend: mapBackendJobApplicationToFrontend,
    mapToBackend: mapFrontendJobApplicationToBackend,
  },
  'contact-messages': {
    adminPath: '/admin/messages',
    publicPath: '/public/contact',
    mapToFrontend: mapBackendContactMessageToFrontend,
    mapToBackend: mapFrontendContactMessageToBackend,
  },
  subscribers: {
    adminPath: '/admin/subscribers',
    publicPath: '/public/newsletter/subscribe',
    mapToFrontend: mapBackendNewsletterSubscriberToFrontend,
    mapToBackend: mapFrontendNewsletterSubscriberToBackend,
  },
  faqs: {
    adminPath: '/admin/faqs',
    publicPath: '/public/faqs',
    mapToFrontend: (item: any) => ({
      id: item._id || item.id,
      question: item.question || '',
      answer: item.answer || '',
      category: item.category || 'general',
      order: item.displayOrder || 0,
      createdAt: item.createdAt || '',
      updatedAt: item.updatedAt || '',
    }),
    mapToBackend: (item: any) => ({
      question: item.question,
      answer: item.answer,
      category: item.category || 'general',
      displayOrder: Number(item.order || 0),
      status: 'active',
    }),
  },
  'media-assets': {
    adminPath: '/media',
    publicPath: '',
    mapToFrontend: mapBackendMediaToFrontend,
    mapToBackend: (f: any) => ({
      name: f.name,
      url: f.url,
      type: f.type,
      folder: f.folder,
      size: f.size,
    }),
  },
  'admin-users': {
    adminPath: '/users',
    publicPath: '',
    mapToFrontend: mapBackendUserToFrontend,
    mapToBackend: mapFrontendUserToBackend,
  },
};

/* -------------------------------------------------------------------------- */
/*                               API Factory                                  */
/* -------------------------------------------------------------------------- */

export function createResourceApi<T extends BaseEntity>(key: string): ResourceApi<T> {
  // If it's a mock-only key, route it entirely to mockDb
  if (mockOnlyKeys.includes(key)) {
    return {
      key,
      list: () => mockDb.list<T>(key),
      get: (id) => mockDb.get<T>(key, id),
      getBySlug: (slug) => mockDb.findBy<T>(key, 'slug' as keyof T, slug),
      create: (data) => mockDb.create<T>(key, data),
      update: (id, data) => mockDb.update<T>(key, id, data),
      remove: (id) => mockDb.remove(key, id),
    };
  }

  if (useRemoteApi) {
    const config = mappedKeys[key] || {
      adminPath: `/${key}`,
      publicPath: `/${key}`,
      mapToFrontend: (x: any) => x,
      mapToBackend: (x: any) => x,
    };

    const getIsAdmin = () => window.location.pathname.startsWith('/admin');

    const extractPayload = (res: any) => {
      // Backend returns format: { success: true, message: '...', data: ... }
      return res.data?.data ?? res.data;
    };

    return {
      key,
      list: async () => {
        const isAdmin = getIsAdmin();
        const path = isAdmin ? config.adminPath : config.publicPath;
        if (!path) return [];

        const res = await http.get(path);
        const payload = extractPayload(res);

        // Special handling for public heroSlides aggregation
        if (key === 'hero-slides' && !isAdmin) {
          if (payload && payload.hero) {
            return [mapBackendHeroToFrontend(payload.hero)];
          }
          return [];
        }

        // Special handling for public about aggregation
        if (key === 'about' && !isAdmin) {
          if (payload) {
            return [mapBackendAboutToFrontend(payload)];
          }
          return [];
        }

        if (config.isSingleton) {
          return [config.mapToFrontend(payload)];
        }

        // Parse array of items from standard envelope
        let items: any[] = [];
        if (payload && typeof payload === 'object') {
          if (Array.isArray(payload)) {
            items = payload;
          } else {
            const arrayKey = Object.keys(payload).find((k) => Array.isArray(payload[k]));
            if (arrayKey) {
              items = payload[arrayKey];
            }
          }
        }
        return items.map(config.mapToFrontend);
      },

      get: async (id) => {
        const isAdmin = getIsAdmin();
        const path = isAdmin ? config.adminPath : config.publicPath;
        
        if (config.isSingleton) {
          const res = await http.get(path);
          return config.mapToFrontend(extractPayload(res));
        }

        const res = await http.get(`${path}/${id}`);
        return config.mapToFrontend(extractPayload(res));
      },

      getBySlug: async (slug) => {
        const isAdmin = getIsAdmin();
        const path = isAdmin ? config.adminPath : config.publicPath;
        // Standard path parameter for public vs custom query parameter
        const url = isAdmin ? `${path}/slug/${slug}` : `${path}/${slug}`;
        const res = await http.get(url);
        return config.mapToFrontend(extractPayload(res));
      },

      create: async (data) => {
        const isAdmin = getIsAdmin();
        
        // Special case: public job applications require slug routing
        if (key === 'job-applications' && !isAdmin) {
          const careerPath = `/public/careers/${(data as any).jobId}`;
          const careerRes = await http.get(careerPath);
          const career = extractPayload(careerRes);
          const slug = career.slug;
          
          const payload = config.mapToBackend(data);
          const res = await http.post(`/public/careers/${slug}/apply`, payload);
          return config.mapToFrontend(extractPayload(res));
        }

        const path = isAdmin ? config.adminPath : config.publicPath;
        const payload = config.mapToBackend(data);
        const res = await http.post(path, payload);
        return config.mapToFrontend(extractPayload(res));
      },

      update: async (id, data) => {
        const isAdmin = getIsAdmin();
        const path = isAdmin ? config.adminPath : config.publicPath;
        const payload = config.mapToBackend(data);
        
        if (config.isSingleton) {
          // Singleton update uses PUT without ID
          const res = await http.put(path, payload);
          return config.mapToFrontend(extractPayload(res));
        }

        // Standard update uses PUT
        const res = await http.put(`${path}/${id}`, payload);
        return config.mapToFrontend(extractPayload(res));
      },

      remove: async (id) => {
        const isAdmin = getIsAdmin();
        const path = isAdmin ? config.adminPath : config.publicPath;
        await http.delete(`${path}/${id}`);
      },
    };
  }

  return {
    key,
    list: () => mockDb.list<T>(key),
    get: (id) => mockDb.get<T>(key, id),
    getBySlug: (slug) => mockDb.findBy<T>(key, 'slug' as keyof T, slug),
    create: (data) => mockDb.create<T>(key, data),
    update: (id, data) => mockDb.update<T>(key, id, data),
    remove: (id) => mockDb.remove(key, id),
  };
}
