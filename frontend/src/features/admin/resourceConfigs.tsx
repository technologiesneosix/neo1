import { Badge } from '@/components/ui/Badge';
import { api } from '@/api/services';
import { formatDate } from '@/lib/utils';
import type { FieldDef, ModuleConfig } from './types';

/* ------------------------------ shared pieces ----------------------------- */

const seoFields: FieldDef[] = [
  { name: 'seo.metaTitle', label: 'Meta Title', type: 'text' },
  { name: 'seo.metaDescription', label: 'Meta Description', type: 'textarea' },
  { name: 'seo.keywords', label: 'Keywords', type: 'text', hint: 'Comma-separated keywords.' },
];

const emptySeo = { metaTitle: '', metaDescription: '', keywords: '', robots: 'index,follow' };

const slugField: FieldDef = {
  name: 'slug',
  label: 'Slug',
  type: 'text',
  required: true,
  hint: 'URL-friendly identifier, e.g. "web-development". Changing it breaks existing links.',
};

const orderField: FieldDef = { name: 'order', label: 'Order', type: 'number' };

function statusBadge(status: unknown) {
  const value = String(status ?? '');
  const tone =
    value === 'published' || value === 'hired'
      ? 'success'
      : value === 'rejected'
        ? 'danger'
        : value === 'shortlisted' || value === 'reviewed'
          ? 'accent'
          : value === 'draft'
            ? 'neutral'
            : 'primary';
  return <Badge tone={tone}>{value || '—'}</Badge>;
}

/* --------------------------------- configs -------------------------------- */

export const resourceConfigs: Record<string, ModuleConfig> = {
  services: {
    key: 'services',
    title: 'Services',
    singular: 'Service',
    resource: api.services,
    columns: [
      { key: 'imageUrl', label: 'Image' },
      { key: 'title', label: 'Title' },
      { key: 'slug', label: 'Slug' },
      { key: 'order', label: 'Order' },
      { key: 'featured', label: 'Featured' },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      slugField,
      { name: 'icon', label: 'Icon', type: 'icon', required: true },
      { name: 'excerpt', label: 'Excerpt', type: 'textarea', required: true },
      { name: 'description', label: 'Description', type: 'richtext', required: true },
      { name: 'features', label: 'Features', type: 'list' },
      { name: 'imageUrl', label: 'Image', type: 'image' },
      orderField,
      { name: 'featured', label: 'Featured', type: 'toggle' },
      ...seoFields,
    ],
    defaults: {
      title: '',
      slug: '',
      icon: 'Globe',
      excerpt: '',
      description: '',
      features: [],
      imageUrl: '',
      order: 0,
      featured: false,
      seo: { ...emptySeo },
    },
    searchKeys: ['title', 'slug', 'excerpt'],
  },

  solutions: {
    key: 'solutions',
    title: 'Solutions',
    singular: 'Solution',
    resource: api.solutions,
    columns: [
      { key: 'imageUrl', label: 'Image' },
      { key: 'title', label: 'Title' },
      { key: 'slug', label: 'Slug' },
      { key: 'order', label: 'Order' },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      slugField,
      { name: 'icon', label: 'Icon', type: 'icon', required: true },
      { name: 'excerpt', label: 'Excerpt', type: 'textarea', required: true },
      { name: 'description', label: 'Description', type: 'richtext', required: true },
      { name: 'features', label: 'Features', type: 'list' },
      { name: 'imageUrl', label: 'Image', type: 'image' },
      orderField,
      ...seoFields,
    ],
    defaults: {
      title: '',
      slug: '',
      icon: 'Boxes',
      excerpt: '',
      description: '',
      features: [],
      imageUrl: '',
      order: 0,
      seo: { ...emptySeo },
    },
    searchKeys: ['title', 'slug', 'excerpt'],
  },

  industries: {
    key: 'industries',
    title: 'Industries',
    singular: 'Industry',
    resource: api.industries,
    columns: [
      { key: 'imageUrl', label: 'Image' },
      { key: 'title', label: 'Title' },
      { key: 'slug', label: 'Slug' },
      { key: 'order', label: 'Order' },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      slugField,
      { name: 'icon', label: 'Icon', type: 'icon', required: true },
      { name: 'excerpt', label: 'Excerpt', type: 'textarea', required: true },
      { name: 'description', label: 'Description', type: 'richtext', required: true },
      { name: 'imageUrl', label: 'Image', type: 'image' },
      orderField,
      ...seoFields,
    ],
    defaults: {
      title: '',
      slug: '',
      icon: 'Building2',
      excerpt: '',
      description: '',
      imageUrl: '',
      order: 0,
      seo: { ...emptySeo },
    },
    searchKeys: ['title', 'slug', 'excerpt'],
  },

  technologies: {
    key: 'technologies',
    title: 'Technologies',
    singular: 'Technology',
    resource: api.technologies,
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'category', label: 'Category' },
      { key: 'description', label: 'Description' },
      { key: 'order', label: 'Order' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      {
        name: 'category',
        label: 'Category',
        type: 'select',
        required: true,
        options: ['frontend', 'backend', 'mobile', 'database', 'cloud', 'devops', 'ai'].map(
          (value) => ({ value, label: value }),
        ),
      },
      { name: 'icon', label: 'Icon', type: 'icon', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      orderField,
    ],
    defaults: { name: '', category: 'frontend', icon: 'Cpu', description: '', order: 0 },
    searchKeys: ['name', 'category'],
  },

  'process-steps': {
    key: 'process-steps',
    title: 'Process Steps',
    singular: 'Process Step',
    resource: api.processSteps,
    columns: [
      { key: 'order', label: 'Order' },
      { key: 'title', label: 'Title' },
      { key: 'description', label: 'Description' },
      { key: 'icon', label: 'Icon' },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'icon', label: 'Icon', type: 'icon', required: true },
      orderField,
    ],
    defaults: { title: '', description: '', icon: 'Search', order: 0 },
    searchKeys: ['title', 'description'],
  },

  projects: {
    key: 'projects',
    title: 'Projects',
    singular: 'Project',
    resource: api.projects,
    columns: [
      { key: 'coverImageUrl', label: 'Cover' },
      { key: 'title', label: 'Title' },
      { key: 'client', label: 'Client' },
      { key: 'category', label: 'Category' },
      { key: 'featured', label: 'Featured' },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      slugField,
      { name: 'category', label: 'Category', type: 'text', required: true },
      { name: 'client', label: 'Client', type: 'text', required: true },
      { name: 'excerpt', label: 'Excerpt', type: 'textarea', required: true },
      { name: 'description', label: 'Description', type: 'richtext', required: true },
      { name: 'coverImageUrl', label: 'Cover Image', type: 'image' },
      { name: 'gallery', label: 'Gallery Images', type: 'imagelist' },

      { name: 'technologies', label: 'Technologies', type: 'tags' },
      { name: 'features', label: 'Features', type: 'list' },
      { name: 'results', label: 'Results', type: 'list' },
      { name: 'timeline', label: 'Timeline', type: 'text', hint: 'e.g. "9 months".' },
      { name: 'liveUrl', label: 'Live URL', type: 'text' },
      { name: 'featured', label: 'Featured', type: 'toggle' },
      orderField,
      ...seoFields,
    ],
    defaults: {
      title: '',
      slug: '',
      category: '',
      client: '',
      excerpt: '',
      description: '',
      coverImageUrl: '',
      gallery: [],
      technologies: [],
      features: [],
      results: [],
      timeline: '',
      liveUrl: '',
      featured: false,
      order: 0,
      seo: { ...emptySeo },
    },
    searchKeys: ['title', 'slug', 'client', 'category'],
  },

  'case-studies': {
    key: 'case-studies',
    title: 'Case Studies',
    singular: 'Case Study',
    resource: api.caseStudies,
    columns: [
      { key: 'coverImageUrl', label: 'Cover' },
      { key: 'title', label: 'Title' },
      { key: 'client', label: 'Client' },
      { key: 'industry', label: 'Industry' },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      slugField,
      { name: 'projectId', label: 'Linked Project', type: 'select', optionsResource: 'projects' },
      { name: 'client', label: 'Client', type: 'text', required: true },
      { name: 'industry', label: 'Industry', type: 'text', required: true },
      { name: 'challenge', label: 'Challenge', type: 'textarea', required: true },
      { name: 'solution', label: 'Solution', type: 'textarea', required: true },
      { name: 'results', label: 'Results', type: 'list' },
      { name: 'coverImageUrl', label: 'Cover Image', type: 'image' },
      ...seoFields,
    ],
    defaults: {
      title: '',
      slug: '',
      projectId: '',
      client: '',
      industry: '',
      challenge: '',
      solution: '',
      results: [],
      coverImageUrl: '',
      seo: { ...emptySeo },
    },
    searchKeys: ['title', 'slug', 'client', 'industry'],
  },

  blogs: {
    key: 'blogs',
    title: 'Blog Posts',
    singular: 'Blog Post',
    resource: api.blogPosts,
    columns: [
      { key: 'bannerUrl', label: 'Banner' },
      { key: 'title', label: 'Title' },
      { key: 'status', label: 'Status', render: (row) => statusBadge(row.status) },
      { key: 'featured', label: 'Featured' },
      {
        key: 'publishedAt',
        label: 'Published',
        render: (row) =>
          typeof row.publishedAt === 'string' && row.publishedAt
            ? formatDate(row.publishedAt)
            : '—',
      },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      slugField,
      { name: 'excerpt', label: 'Excerpt', type: 'textarea', required: true },
      { name: 'content', label: 'Content', type: 'richtext', required: true },
      { name: 'bannerUrl', label: 'Banner Image', type: 'image' },
      {
        name: 'categoryId',
        label: 'Category',
        type: 'select',
        required: true,
        optionsResource: 'categories',
      },
      { name: 'authorId', label: 'Author', type: 'select', required: true, optionsResource: 'authors' },
      { name: 'tags', label: 'Tags', type: 'tags' },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        required: true,
        options: [
          { value: 'draft', label: 'Draft' },
          { value: 'published', label: 'Published' },
        ],
      },
      { name: 'featured', label: 'Featured', type: 'toggle' },
      { name: 'publishedAt', label: 'Publish Date', type: 'date' },
      { name: 'commentsCount', label: 'Comments Count', type: 'number' },
      ...seoFields,
    ],
    defaults: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      bannerUrl: '',
      categoryId: '',
      authorId: '',
      tags: [],
      status: 'draft',
      featured: false,
      publishedAt: '',
      commentsCount: 0,
      seo: { ...emptySeo },
    },
    searchKeys: ['title', 'slug', 'excerpt', 'status'],
  },

  categories: {
    key: 'categories',
    title: 'Categories',
    singular: 'Category',
    resource: api.categories,
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'slug', label: 'Slug' },
      { key: 'description', label: 'Description' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      slugField,
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
    defaults: { name: '', slug: '', description: '' },
    searchKeys: ['name', 'slug'],
  },

  authors: {
    key: 'authors',
    title: 'Authors',
    singular: 'Author',
    resource: api.authors,
    columns: [
      { key: 'avatarUrl', label: 'Avatar' },
      { key: 'name', label: 'Name' },
      { key: 'role', label: 'Role' },
      { key: 'bio', label: 'Bio' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'role', label: 'Role', type: 'text', required: true },
      { name: 'avatarUrl', label: 'Avatar', type: 'image' },
      { name: 'bio', label: 'Bio', type: 'textarea' },
    ],
    defaults: { name: '', role: '', avatarUrl: '', bio: '' },
    searchKeys: ['name', 'role'],
  },

  testimonials: {
    key: 'testimonials',
    title: 'Testimonials',
    singular: 'Testimonial',
    resource: api.testimonials,
    columns: [
      { key: 'avatarUrl', label: 'Avatar' },
      { key: 'name', label: 'Name' },
      { key: 'company', label: 'Company' },
      { key: 'rating', label: 'Rating' },
      { key: 'active', label: 'Active' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'role', label: 'Role', type: 'text', required: true },
      { name: 'company', label: 'Company', type: 'text', required: true },
      { name: 'avatarUrl', label: 'Avatar', type: 'image' },
      { name: 'quote', label: 'Quote', type: 'textarea', required: true },
      { name: 'rating', label: 'Rating (1–5)', type: 'number' },
      orderField,
      { name: 'active', label: 'Active', type: 'toggle' },
    ],
    defaults: {
      name: '',
      role: '',
      company: '',
      avatarUrl: '',
      quote: '',
      rating: 5,
      order: 0,
      active: true,
    },
    searchKeys: ['name', 'company', 'quote'],
  },

  team: {
    key: 'team',
    title: 'Team Members',
    singular: 'Team Member',
    resource: api.teamMembers,
    columns: [
      { key: 'photoUrl', label: 'Photo' },
      { key: 'name', label: 'Name' },
      { key: 'role', label: 'Role' },
      { key: 'order', label: 'Order' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'role', label: 'Role', type: 'text', required: true },
      { name: 'photoUrl', label: 'Photo', type: 'image' },
      { name: 'bio', label: 'Bio', type: 'textarea' },
      orderField,
    ],
    defaults: { name: '', role: '', photoUrl: '', bio: '', socialLinks: [], order: 0 },
    searchKeys: ['name', 'role'],
  },

  timeline: {
    key: 'timeline',
    title: 'Timeline',
    singular: 'Timeline Item',
    resource: api.timeline,
    columns: [
      { key: 'order', label: 'Order' },
      { key: 'year', label: 'Year' },
      { key: 'title', label: 'Title' },
      { key: 'description', label: 'Description' },
    ],
    fields: [
      { name: 'year', label: 'Year', type: 'text', required: true },
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      orderField,
    ],
    defaults: { year: '', title: '', description: '', order: 0 },
    searchKeys: ['year', 'title'],
  },

  certifications: {
    key: 'certifications',
    title: 'Certifications',
    singular: 'Certification',
    resource: api.certifications,
    columns: [
      { key: 'imageUrl', label: 'Image' },
      { key: 'name', label: 'Name' },
      { key: 'issuer', label: 'Issuer' },
      { key: 'year', label: 'Year' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'issuer', label: 'Issuer', type: 'text', required: true },
      { name: 'imageUrl', label: 'Image', type: 'image' },
      { name: 'year', label: 'Year', type: 'text' },
    ],
    defaults: { name: '', issuer: '', imageUrl: '', year: '' },
    searchKeys: ['name', 'issuer'],
  },

  careers: {
    key: 'careers',
    title: 'Job Openings',
    singular: 'Job Opening',
    resource: api.jobOpenings,
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'department', label: 'Department' },
      { key: 'location', label: 'Location' },
      { key: 'type', label: 'Type' },
      { key: 'active', label: 'Active' },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      slugField,
      { name: 'department', label: 'Department', type: 'text', required: true },
      { name: 'location', label: 'Location', type: 'text', required: true },
      {
        name: 'type',
        label: 'Type',
        type: 'select',
        required: true,
        options: [
          { value: 'full-time', label: 'Full-time' },
          { value: 'part-time', label: 'Part-time' },
          { value: 'contract', label: 'Contract' },
          { value: 'internship', label: 'Internship' },
        ],
      },
      { name: 'experience', label: 'Experience', type: 'text', hint: 'e.g. "5+ years".' },
      { name: 'description', label: 'Description', type: 'richtext', required: true },
      { name: 'responsibilities', label: 'Responsibilities', type: 'list' },
      { name: 'requirements', label: 'Requirements', type: 'list' },
      { name: 'active', label: 'Active', type: 'toggle' },
    ],
    defaults: {
      title: '',
      slug: '',
      department: '',
      location: '',
      type: 'full-time',
      experience: '',
      description: '',
      responsibilities: [],
      requirements: [],
      active: true,
    },
    searchKeys: ['title', 'slug', 'department', 'location'],
  },

  applications: {
    key: 'applications',
    title: 'Job Applications',
    singular: 'Application',
    resource: api.jobApplications,
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'status', label: 'Status', render: (row) => statusBadge(row.status) },
      {
        key: 'createdAt',
        label: 'Applied',
        render: (row) => formatDate(String(row.createdAt)),
      },
    ],
    fields: [
      { name: 'jobId', label: 'Job Opening', type: 'select', required: true, optionsResource: 'job-openings' },
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'text', required: true },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'resumeUrl', label: 'Resume URL', type: 'text' },
      { name: 'coverLetter', label: 'Cover Letter / Notes', type: 'textarea' },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        required: true,
        options: ['new', 'reviewed', 'shortlisted', 'rejected', 'hired'].map((value) => ({
          value,
          label: value,
        })),
      },
    ],
    defaults: {
      jobId: '',
      name: '',
      email: '',
      phone: '',
      resumeUrl: '',
      coverLetter: '',
      status: 'new',
    },
    searchKeys: ['name', 'email'],
  },

  messages: {
    key: 'messages',
    title: 'Messages',
    singular: 'Message',
    resource: api.contactMessages,
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'subject', label: 'Subject' },
      {
        key: 'read',
        label: 'Read',
        render: (row) => (
          <Badge tone={row.read ? 'neutral' : 'warning'}>{row.read ? 'Read' : 'Unread'}</Badge>
        ),
      },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'text', required: true },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'subject', label: 'Subject', type: 'text', required: true },
      { name: 'message', label: 'Message', type: 'textarea', required: true },
      { name: 'read', label: 'Mark as read', type: 'toggle' },
    ],
    defaults: { name: '', email: '', phone: '', subject: '', message: '', read: false },
    searchKeys: ['name', 'email', 'subject'],
  },

  subscribers: {
    key: 'subscribers',
    title: 'Subscribers',
    singular: 'Subscriber',
    resource: api.subscribers,
    columns: [
      { key: 'email', label: 'Email' },
      { key: 'active', label: 'Active' },
      {
        key: 'createdAt',
        label: 'Subscribed',
        render: (row) => formatDate(String(row.createdAt)),
      },
    ],
    fields: [
      { name: 'email', label: 'Email', type: 'text', required: true },
      { name: 'active', label: 'Active', type: 'toggle' },
    ],
    defaults: { email: '', active: true },
    searchKeys: ['email'],
  },

  faqs: {
    key: 'faqs',
    title: 'FAQ',
    singular: 'FAQ Item',
    resource: api.faqs,
    columns: [
      { key: 'order', label: 'Order' },
      { key: 'question', label: 'Question' },
      { key: 'category', label: 'Category' },
    ],
    fields: [
      { name: 'question', label: 'Question', type: 'text', required: true },
      { name: 'answer', label: 'Answer', type: 'textarea', required: true },
      { name: 'category', label: 'Category', type: 'text' },
      orderField,
    ],
    defaults: { question: '', answer: '', category: 'General', order: 0 },
    searchKeys: ['question', 'answer', 'category'],
  },

  pricing: {
    key: 'pricing',
    title: 'Pricing Plans',
    singular: 'Pricing Plan',
    resource: api.pricingPlans,
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'price', label: 'Price', render: (row) => `$${String(row.price)}` },
      { key: 'period', label: 'Period' },
      { key: 'highlighted', label: 'Highlighted' },
      { key: 'order', label: 'Order' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'price', label: 'Price (USD)', type: 'number', required: true },
      { name: 'period', label: 'Period', type: 'text', hint: 'e.g. "per month".' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'features', label: 'Features', type: 'list' },
      { name: 'highlighted', label: 'Highlighted', type: 'toggle' },
      { name: 'ctaLabel', label: 'CTA Label', type: 'text' },
      orderField,
    ],
    defaults: {
      name: '',
      price: 0,
      period: 'per month',
      description: '',
      features: [],
      highlighted: false,
      ctaLabel: 'Sign Up Now',
      order: 0,
    },
    searchKeys: ['name', 'description'],
  },

  users: {
    key: 'users',
    title: 'Admin Users',
    singular: 'User',
    resource: api.adminUsers,
    columns: [
      { key: 'avatarUrl', label: 'Avatar' },
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'active', label: 'Active' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'text', required: true },
      { name: 'roleId', label: 'Role', type: 'select', required: true, optionsResource: 'roles' },
      { name: 'avatarUrl', label: 'Avatar', type: 'image' },
      { name: 'active', label: 'Active', type: 'toggle' },
    ],
    defaults: { name: '', email: '', roleId: '', avatarUrl: '', active: true },
    searchKeys: ['name', 'email'],
  },

  roles: {
    key: 'roles',
    title: 'Roles',
    singular: 'Role',
    resource: api.roles,
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'description', label: 'Description' },
      { key: 'permissions', label: 'Permissions' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      {
        name: 'permissions',
        label: 'Permissions',
        type: 'list',
        hint: 'One permission key per line, e.g. "content.write". Use "*" for full access.',
      },
    ],
    defaults: { name: '', description: '', permissions: [] },
    searchKeys: ['name', 'description'],
  },
};
