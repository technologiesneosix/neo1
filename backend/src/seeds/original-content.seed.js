import Hero from '../models/Hero.js';
import About from '../models/About.js';
import Service from '../models/Service.js';
import Solution from '../models/Solution.js';
import Industry from '../models/Industry.js';
import Project from '../models/Project.js';
import Blog from '../models/Blog.js';
import BlogCategory from '../models/BlogCategory.js';
import Team from '../models/Team.js';
import Testimonial from '../models/Testimonial.js';
import Technology from '../models/Technology.js';
import FAQ from '../models/FAQ.js';
import WebsiteSetting from '../models/WebsiteSetting.js';
import Career from '../models/Career.js';
import Certification from '../models/Certification.js';

// Helper function to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Helper function for image URLs (using placeholder service)
const img = (name, width, height) => `https://placehold.co/${width}x${height}?text=${name}`;

export const seedOriginalContent = async () => {
  console.log('Seeding original content from zip...');

  // Original data from the zip file
  const settingsData = {
    siteName: 'Neosix',
    tagline: 'Digital experts based in Mumbai and Noida',
    contactEmail: 'technologiesneosix@gmail.com',
    phone: '+91 98765 43210',
    address: 'Mumbai / Noida (Hybrid)',
    socialLinks: {
      instagram: 'https://www.instagram.com/neosixtechnologies',
      twitter: 'https://x.com/neosix',
      linkedin: 'https://www.linkedin.com/in/neosix-technologies-4a8699420',
    },
    googleMap: null,
    footerText: 'Neosix builds enterprise-grade digital products — from custom software and SaaS platforms to AI and cloud solutions — for companies that want to move faster.',
    copyright: `Neosix © ${new Date().getFullYear()}. All Rights Reserved.`
  };

  const heroSlidesData = [
    {
      title: 'We Are Digital Experts',
      subtitle: 'Digital experts based in Mumbai and Noida',
      description: 'Product engineering for companies that ship with confidence.',
      primaryButtonText: 'Get Started',
      primaryButtonLink: '/contact',
      secondaryButtonText: 'Our Work',
      secondaryButtonLink: '/portfolio',
      backgroundImage: img('neosix-hero', 1920, 1080),
      isActive: true
    },
    {
      title: 'We Build Software That Scales',
      subtitle: 'Web, Mobile, Cloud & AI',
      description: 'From first commit to global rollout, one accountable team.',
      primaryButtonText: 'Explore Services',
      primaryButtonLink: '/services',
      secondaryButtonText: 'Talk to Us',
      secondaryButtonLink: '/contact',
      backgroundImage: img('neosix-hero-2', 1920, 1080),
      isActive: true
    }
  ];

  const aboutData = {
    companyName: 'Neosix',
    shortDescription: 'Neosix is an enterprise software company helping ambitious teams design, build and operate the products their businesses run on.',
    fullDescription: 'For over a decade we have delivered web platforms, mobile apps, SaaS products and AI systems for startups and Fortune 500s alike. Our engineers, designers and strategists work as one embedded team — owning outcomes, not just tickets.',
    mission: 'To turn complex business problems into elegant, reliable software that people love to use.',
    vision: 'A world where every organization — regardless of size — has access to enterprise-grade engineering.',
    journey: 'Founded in Mumbai, serving clients globally since 2014.',
    experience: 10,
    employees: 85,
    projectsCompleted: 320,
    countriesServed: 24
  };

  const servicesData = [
    {
      title: 'Web Development',
      slug: 'web-development',
      shortDescription: 'High-performance web platforms built on modern frameworks and clean architecture.',
      description: 'Our web development practice pairs senior engineers with proven delivery playbooks. We start with a short discovery to map goals, constraints and success metrics, then move into iterative delivery with demos every sprint.',
      icon: 'Globe',
      order: 1,
      featured: true
    },
    {
      title: 'Mobile App Development',
      slug: 'mobile-app-development',
      shortDescription: 'Native and cross-platform apps that feel fast, polished and reliable.',
      description: 'Native and cross-platform apps that feel fast, polished and reliable.',
      icon: 'Smartphone',
      order: 2,
      featured: true
    },
    {
      title: 'Custom Software Development',
      slug: 'custom-software-development',
      shortDescription: 'Bespoke systems shaped precisely around your operations and workflows.',
      description: 'Bespoke systems shaped precisely around your operations and workflows.',
      icon: 'Code2',
      order: 3,
      featured: true
    },
    {
      title: 'SaaS Development',
      slug: 'saas-development',
      shortDescription: 'Multi-tenant products with billing, analytics and scale designed in from day one.',
      description: 'Multi-tenant products with billing, analytics and scale designed in from day one.',
      icon: 'Layers',
      order: 4,
      featured: true
    },
    {
      title: 'UI/UX Design',
      slug: 'ui-ux-design',
      shortDescription: 'Research-driven interfaces that convert, retain and delight.',
      description: 'Research-driven interfaces that convert, retain and delight.',
      icon: 'PenTool',
      order: 5,
      featured: true
    },
    {
      title: 'AI Solutions',
      slug: 'ai-solutions',
      shortDescription: 'LLM apps, ML pipelines and intelligent automation in production, not slides.',
      description: 'LLM apps, ML pipelines and intelligent automation in production, not slides.',
      icon: 'Brain',
      order: 6,
      featured: true
    },
    {
      title: 'Cloud Solutions',
      slug: 'cloud-solutions',
      shortDescription: 'Architecture, migration and cost optimization on AWS, Azure and GCP.',
      description: 'Architecture, migration and cost optimization on AWS, Azure and GCP.',
      icon: 'Cloud',
      order: 7,
      featured: false
    },
    {
      title: 'API Development',
      slug: 'api-development',
      shortDescription: 'Secure, documented, versioned APIs your partners will enjoy integrating.',
      description: 'Secure, documented, versioned APIs your partners will enjoy integrating.',
      icon: 'Plug',
      order: 8,
      featured: false
    },
    {
      title: 'DevOps',
      slug: 'devops',
      shortDescription: 'CI/CD, infrastructure as code and observability for boring, safe releases.',
      description: 'CI/CD, infrastructure as code and observability for boring, safe releases.',
      icon: 'Workflow',
      order: 9,
      featured: false
    },
    {
      title: 'Maintenance & Support',
      slug: 'maintenance-support',
      shortDescription: 'SLA-backed monitoring, patching and improvement of live systems.',
      description: 'SLA-backed monitoring, patching and improvement of live systems.',
      icon: 'LifeBuoy',
      order: 10,
      featured: false
    }
  ];

  const solutionsData = [
    {
      title: 'Hotel Management System',
      slug: 'hotel-management-system',
      shortDescription: 'Front desk, housekeeping, channel and revenue management in one platform.',
      description: 'Front desk, housekeeping, channel and revenue management in one platform.',
      icon: 'Hotel',
      order: 1,
      featured: true
    },
    {
      title: 'CRM Software',
      slug: 'crm-software',
      shortDescription: 'Pipeline, automation and analytics tailored to how your team actually sells.',
      description: 'Pipeline, automation and analytics tailored to how your team actually sells.',
      icon: 'Users',
      order: 2,
      featured: true
    },
    {
      title: 'ERP',
      slug: 'erp',
      shortDescription: 'Finance, procurement, inventory and production on a single source of truth.',
      description: 'Finance, procurement, inventory and production on a single source of truth.',
      icon: 'Factory',
      order: 3,
      featured: true
    }
  ];

  const industriesData = [
    {
      title: 'Healthcare',
      slug: 'healthcare',
      shortDescription: 'HIPAA-compliant healthcare applications',
      description: 'HIPAA-compliant healthcare applications and systems.',
      icon: 'HeartPulse',
      order: 1
    },
    {
      title: 'Finance',
      slug: 'finance',
      shortDescription: 'Fintech solutions',
      description: 'Secure financial technology solutions for banking and payments.',
      icon: 'DollarSign',
      order: 2
    },
    {
      title: 'Retail',
      slug: 'retail',
      shortDescription: 'Retail technology',
      description: 'Omnichannel retail solutions and customer experience platforms.',
      icon: 'Store',
      order: 3
    },
    {
      title: 'Logistics',
      slug: 'logistics',
      shortDescription: 'Supply chain solutions',
      description: 'End-to-end logistics and supply chain management systems.',
      icon: 'Truck',
      order: 4
    }
  ];

  const technologiesData = [
    { name: 'React', slug: 'react', category: 'frontend', displayOrder: 1, status: 'published' },
    { name: 'Vue.js', slug: 'vuejs', category: 'frontend', displayOrder: 2, status: 'published' },
    { name: 'Node.js', slug: 'nodejs', category: 'backend', displayOrder: 3, status: 'published' },
    { name: 'Python', slug: 'python', category: 'backend', displayOrder: 4, status: 'published' },
    { name: 'TypeScript', slug: 'typescript', category: 'backend', displayOrder: 5, status: 'published' },
    { name: 'AWS', slug: 'aws', category: 'devops', displayOrder: 6, status: 'published' },
    { name: 'Docker', slug: 'docker', category: 'devops', displayOrder: 7, status: 'published' },
    { name: 'Kubernetes', slug: 'kubernetes', category: 'devops', displayOrder: 8, status: 'published' },
    { name: 'MongoDB', slug: 'mongodb', category: 'database', displayOrder: 9, status: 'published' },
    { name: 'PostgreSQL', slug: 'postgresql', category: 'database', displayOrder: 10, status: 'published' },
    { name: 'Redis', slug: 'redis', category: 'database', displayOrder: 11, status: 'published' },
    { name: 'GraphQL', slug: 'graphql', category: 'backend', displayOrder: 12, status: 'published' }
  ];

  const projectsData = [
    {
      title: 'Atlas Freight',
      slug: 'atlas-freight',
      client: 'Harbor Logistics',
      shortDescription: 'Real-time logistics dashboard with route optimization',
      description: 'Built a comprehensive logistics management system with real-time tracking, route optimization, and automated dispatch.',
      thumbnail: img('project-0', 800, 600),
      banner: img('project-0', 1920, 1080),
      order: 1,
      featured: true,
      status: 'published'
    },
    {
      title: 'Finch Capital',
      slug: 'finch-capital',
      client: 'Finch Capital',
      shortDescription: 'Fintech client portal with real-time analytics',
      description: 'Developed a secure client portal for a fintech company with real-time portfolio analytics, reporting, and compliance features.',
      thumbnail: img('project-1', 800, 600),
      banner: img('project-1', 1920, 1080),
      order: 2,
      featured: true,
      status: 'published'
    }
  ];

  const blogCategoriesData = [
    { name: 'Technology', slug: 'technology', order: 1 },
    { name: 'Design', slug: 'design', order: 2 },
    { name: 'Business', slug: 'business', order: 3 }
  ];

  const blogPostsData = [
    {
      title: 'Building Scalable React Applications',
      slug: 'building-scalable-react-applications',
      excerpt: 'Best practices for building production-ready React applications that scale.',
      content: 'Learn how to build scalable React applications with proper state management, performance optimization, and testing strategies.',
      banner: img('blog-0', 1920, 1080),
      tags: ['react', 'javascript', 'frontend'],
      readingTime: 8,
      status: 'published',
      publishedAt: new Date(),
      order: 1,
      featured: true
    },
    {
      title: 'The Future of Cloud Architecture',
      slug: 'future-of-cloud-architecture',
      excerpt: 'Emerging trends in cloud computing and infrastructure.',
      content: 'Explore the latest trends in cloud computing including serverless, edge computing, and multi-cloud strategies.',
      banner: img('blog-1', 1920, 1080),
      tags: ['cloud', 'aws', 'infrastructure'],
      readingTime: 6,
      status: 'published',
      publishedAt: new Date(),
      order: 2,
      featured: false
    }
  ];

  const teamMembersData = [
    {
      name: 'Admin',
      designation: 'CEO & Founder',
      photo: img('admin-user', 400, 400),
      order: 1
    },
    {
      name: 'Content Editor',
      designation: 'CTO',
      photo: img('editor-user', 400, 400),
      order: 2
    },
    {
      name: 'Senior Developer',
      designation: 'Lead Developer',
      photo: img('team-1', 400, 400),
      order: 3
    }
  ];

  const testimonialsData = [
    {
      clientName: 'Nina Rossi',
      company: 'Harbor Hotels',
      designation: 'VP Operations',
      photo: img('testimonial-0', 400, 400),
      rating: 5,
      review: 'Support is the difference. Issues get fixed before our staff notices them. That is what a real partner looks like.',
      featured: true,
      displayOrder: 1,
      status: 'active'
    },
    {
      clientName: 'Kenji Watanabe',
      company: 'Harbor Logistics',
      designation: 'CTO',
      photo: img('testimonial-1', 400, 400),
      rating: 5,
      review: 'The Atlas Freight system transformed our operations. Real-time visibility across our entire fleet.',
      featured: true,
      displayOrder: 2,
      status: 'active'
    }
  ];

  const careersData = [
    {
      title: 'Senior React Developer',
      slug: 'senior-react-developer',
      department: 'engineering',
      employmentType: 'full-time',
      experience: '5-10 years',
      location: 'Mumbai / Noida (Hybrid)',
      description: 'Join a senior team shipping enterprise products for global clients. You will own features end-to-end, work directly with clients and mentor peers.',
      responsibilities: ['Own features from design to production', 'Write tested, documented code', 'Participate in architecture reviews', 'Mentor teammates'],
      requirements: ['5+ years of relevant experience', 'Strong TypeScript fundamentals', 'Experience with cloud platforms', 'Excellent written communication'],
      status: 'open'
    },
    {
      title: 'Backend Engineer (Node.js)',
      slug: 'backend-engineer-nodejs',
      department: 'engineering',
      employmentType: 'full-time',
      experience: '2-5 years',
      location: 'Remote (India)',
      description: 'Join a senior team shipping enterprise products for global clients.',
      responsibilities: ['Build scalable backend APIs', 'Design database schemas', 'Implement authentication and security', 'Optimize performance'],
      requirements: ['4+ years of relevant experience', 'Strong Node.js fundamentals', 'Experience with MongoDB/PostgreSQL', 'Knowledge of cloud platforms'],
      status: 'open'
    },
    {
      title: 'Product Designer',
      slug: 'product-designer',
      department: 'design',
      employmentType: 'full-time',
      experience: '2-5 years',
      location: 'Mumbai / Noida (Hybrid)',
      description: 'Create beautiful, intuitive interfaces that delight users.',
      responsibilities: ['Design user interfaces', 'Create design systems', 'Conduct user research', 'Collaborate with developers'],
      requirements: ['3+ years of relevant experience', 'Strong portfolio', 'Experience with Figma', 'Understanding of UX principles'],
      status: 'open'
    },
    {
      title: 'DevOps Engineer',
      slug: 'devops-engineer',
      department: 'engineering',
      employmentType: 'full-time',
      experience: '2-5 years',
      location: 'Remote (India)',
      description: 'Build and maintain cloud infrastructure and CI/CD pipelines.',
      responsibilities: ['Manage cloud infrastructure', 'Build CI/CD pipelines', 'Implement monitoring and alerting', 'Ensure security compliance'],
      requirements: ['4+ years of relevant experience', 'Experience with AWS/Azure/GCP', 'Knowledge of Docker and Kubernetes', 'Understanding of security best practices'],
      status: 'open'
    },
    {
      title: 'Software Engineering Intern',
      slug: 'software-engineering-intern',
      department: 'engineering',
      employmentType: 'internship',
      experience: 'entry-level',
      location: 'Mumbai / Noida (Hybrid)',
      description: 'Learn from senior engineers while working on real projects.',
      responsibilities: ['Assist with feature development', 'Write clean, tested code', 'Participate in code reviews', 'Learn best practices'],
      requirements: ['Currently pursuing CS degree', 'Strong fundamentals in programming', 'Eagerness to learn', 'Good communication skills'],
      status: 'open'
    }
  ];

  const faqsData = [
    {
      question: 'How do engagements with Neosix start?',
      answer: 'Every project starts with a free discovery call, followed by a short paid discovery sprint that produces a scoped plan, estimate and timeline you can take anywhere.',
      category: 'general',
      displayOrder: 1,
      status: 'active'
    },
    {
      question: 'What engagement models do you offer?',
      answer: 'Fixed-scope projects, dedicated teams and staff augmentation. Most clients start fixed-scope and move to a dedicated team as the product grows.',
      category: 'services',
      displayOrder: 2,
      status: 'active'
    },
    {
      question: 'Who owns the code and IP?',
      answer: 'You do — fully and unambiguously. All work is delivered under a work-for-hire agreement with source code in your repositories from week one.',
      category: 'technical',
      displayOrder: 3,
      status: 'active'
    },
    {
      question: 'How do you handle time zones?',
      answer: 'Teams are staffed for at least four hours of overlap with your working day, with async updates and weekly demos keeping everyone aligned.',
      category: 'technical',
      displayOrder: 4,
      status: 'active'
    },
    {
      question: 'Can you take over an existing codebase?',
      answer: 'Yes. We begin with a technical audit covering architecture, security and delivery pipelines, then propose a stabilization and improvement roadmap.',
      category: 'technical',
      displayOrder: 5,
      status: 'active'
    },
    {
      question: 'What does support look like after launch?',
      answer: 'SLA-backed plans include monitoring, security patching, bug fixes and a monthly improvement budget — with response times as fast as one hour.',
      category: 'services',
      displayOrder: 6,
      status: 'active'
    },
    {
      question: 'Do you sign NDAs?',
      answer: 'Of course. We are happy to sign your NDA before any detailed conversation about your product.',
      category: 'general',
      displayOrder: 7,
      status: 'active'
    },
    {
      question: 'How are estimates and billing handled?',
      answer: 'Transparent, milestone-based billing. You see progress in a live dashboard and approve each milestone before payment.',
      category: 'services',
      displayOrder: 8,
      status: 'active'
    }
  ];

  // Clear existing data
  await Hero.deleteMany({});
  await About.deleteMany({});
  await Service.deleteMany({});
  await Solution.deleteMany({});
  await Industry.deleteMany({});
  await Project.deleteMany({});
  await BlogCategory.deleteMany({});
  await Blog.deleteMany({});
  await Team.deleteMany({});
  await Testimonial.deleteMany({});
  await Technology.deleteMany({});
  await Career.deleteMany({});
  await FAQ.deleteMany({});
  await WebsiteSetting.deleteMany({});
  await Certification.deleteMany({});

  // Seed data
  await WebsiteSetting.create(settingsData);

  const certificationsData = [
    {
      name: 'ISO 27001',
      issuer: 'International Organization for Standardization',
      imageUrl: img('cert-iso', 400, 300),
      year: '2020',
      displayOrder: 1,
      status: 'published'
    },
    {
      name: 'SOC 2 Type II',
      issuer: 'AICPA',
      imageUrl: img('cert-soc2', 400, 300),
      year: '2021',
      displayOrder: 2,
      status: 'published'
    },
    {
      name: 'AWS Advanced Partner',
      issuer: 'Amazon Web Services',
      imageUrl: img('cert-aws', 400, 300),
      year: '2022',
      displayOrder: 3,
      status: 'published'
    },
    {
      name: 'Microsoft Gold Partner',
      issuer: 'Microsoft',
      imageUrl: img('cert-ms', 400, 300),
      year: '2022',
      displayOrder: 4,
      status: 'published'
    }
  ];
  await Certification.insertMany(certificationsData);
  console.log('✓ Certifications seeded');
  console.log('✓ Website settings seeded');

  await Hero.insertMany(heroSlidesData);
  console.log('✓ Hero slides seeded');

  await About.create(aboutData);
  console.log('✓ About page seeded');

  await Service.insertMany(servicesData.map(item => ({ ...item, status: 'published' })));
  console.log('✓ Services seeded');

  await Solution.insertMany(solutionsData.map(item => ({ ...item, status: 'published' })));
  console.log('✓ Solutions seeded');

  await Industry.insertMany(industriesData.map(item => ({ ...item, status: 'published' })));
  console.log('✓ Industries seeded');

  await Technology.deleteMany({});
  await Technology.insertMany(technologiesData.map(item => ({ ...item, status: 'published' })));
  console.log('✓ Technologies seeded');

  await Project.insertMany(projectsData.map(item => ({ ...item, status: 'published' })));
  console.log('✓ Projects seeded');

  await Team.insertMany(teamMembersData);
  console.log('✓ Team members seeded');

  await BlogCategory.insertMany(blogCategoriesData);
  console.log('✓ Blog categories seeded');

  const techCategory = await BlogCategory.findOne({ slug: 'technology' });
  const author = await Team.findOne({ name: 'Admin' });
  
  await Blog.insertMany(blogPostsData.map(post => ({
    ...post,
    published: true,
    category: techCategory?._id,
    author: author?._id
  })));
  console.log('✓ Blog posts seeded');

  await Testimonial.insertMany(testimonialsData);
  console.log('✓ Testimonials seeded');

  await Career.insertMany(careersData);
  console.log('✓ Careers seeded');

  await FAQ.insertMany(faqsData);
  console.log('✓ FAQs seeded');

  console.log('Original content seeding completed successfully');
};
