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

export const seedContent = async () => {
  console.log('Seeding content...');

  // Seed Hero Slides
  const heroExists = await Hero.countDocuments();
  if (heroExists === 0) {
    await Hero.insertMany([
      {
        title: 'Building Digital Excellence',
        subtitle: 'Enterprise software solutions that drive growth and innovation',
        description: 'We partner with organizations to transform their digital landscape through innovative software solutions.',
        primaryButtonText: 'Get Started',
        primaryButtonLink: '/contact',
        secondaryButtonText: 'Learn More',
        secondaryButtonLink: '/services',
        backgroundImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1920',
        isActive: true
      },
      {
        title: 'Transform Your Business',
        subtitle: 'Custom software development for modern enterprises',
        description: 'Our team combines deep technical expertise with business acumen to deliver products that drive real results.',
        primaryButtonText: 'Our Services',
        primaryButtonLink: '/services',
        secondaryButtonText: 'Contact Us',
        secondaryButtonLink: '/contact',
        backgroundImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920',
        isActive: true
      }
    ]);
    console.log('✓ Hero slides seeded');
  }

  // Seed About Page
  const aboutExists = await About.countDocuments();
  if (aboutExists === 0) {
    await About.create({
      companyName: 'Neosix',
      shortDescription: 'Neosix is a team of passionate engineers, designers and strategists building enterprise software since 2014.',
      fullDescription: 'We partner with organizations to transform their digital landscape through innovative software solutions. Our team combines deep technical expertise with business acumen to deliver products that drive real results.',
      mission: 'To empower businesses with cutting-edge technology solutions that drive growth and innovation.',
      vision: 'To be the global leader in enterprise software development, known for excellence and innovation.',
      journey: 'Founded in 2014, Neosix has grown from a small startup to a leading software development company serving clients worldwide.',
      experience: 10,
      employees: 50,
      projectsCompleted: 500,
      countriesServed: 25
    });
    console.log('✓ About page seeded');
  }

  // Seed Services
  const servicesCount = await Service.countDocuments();
  if (servicesCount === 0) {
    await Service.insertMany([
      {
        title: 'Web Development',
        slug: 'web-development',
        shortDescription: 'Custom web applications built with modern technologies',
        description: 'We build scalable, secure, and performant web applications using React, Node.js, and cloud infrastructure.',
        icon: 'Globe',
        order: 1,
        featured: true
      },
      {
        title: 'Mobile Development',
        slug: 'mobile-development',
        shortDescription: 'Native and cross-platform mobile apps',
        description: 'Develop intuitive mobile experiences for iOS and Android using React Native and Flutter.',
        icon: 'Smartphone',
        order: 2,
        featured: true
      },
      {
        title: 'Cloud Solutions',
        slug: 'cloud-solutions',
        shortDescription: 'AWS, Azure, and Google Cloud infrastructure',
        description: 'Design, deploy, and manage cloud infrastructure that scales with your business needs.',
        icon: 'Cloud',
        order: 3,
        featured: true
      },
      {
        title: 'UI/UX Design',
        slug: 'ui-ux-design',
        shortDescription: 'User-centered design that converts',
        description: 'Create beautiful, intuitive interfaces that delight users and drive engagement.',
        icon: 'Palette',
        order: 4,
        featured: false
      }
    ]);
    console.log('✓ Services seeded');
  }

  // Seed Solutions
  const solutionsCount = await Solution.countDocuments();
  if (solutionsCount === 0) {
    await Solution.insertMany([
      {
        title: 'E-Commerce Platform',
        slug: 'e-commerce-platform',
        shortDescription: 'Complete online store solutions',
        description: 'Full-featured e-commerce platforms with payment integration, inventory management, and analytics.',
        icon: 'ShoppingCart',
        order: 1,
        featured: true
      },
      {
        title: 'Enterprise ERP',
        slug: 'enterprise-erp',
        shortDescription: 'Business process automation',
        description: 'Custom ERP solutions to streamline operations and improve efficiency.',
        icon: 'Building2',
        order: 2,
        featured: true
      }
    ]);
    console.log('✓ Solutions seeded');
  }

  // Seed Industries
  const industriesCount = await Industry.countDocuments();
  if (industriesCount === 0) {
    await Industry.insertMany([
      {
        title: 'Healthcare',
        slug: 'healthcare',
        shortDescription: 'Digital health solutions',
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
      }
    ]);
    console.log('✓ Industries seeded');
  }

  // Seed Projects
  const projectsCount = await Project.countDocuments();
  if (projectsCount === 0) {
    await Project.insertMany([
      {
        title: 'E-Commerce Platform',
        slug: 'e-commerce-platform',
        client: 'RetailCo',
        shortDescription: 'Full-featured online store with payment integration',
        description: 'Built a complete e-commerce platform with multi-vendor support, real-time inventory management, and AI-powered recommendations.',
        thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
        banner: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        order: 1,
        featured: true
      },
      {
        title: 'Healthcare Management System',
        slug: 'healthcare-management-system',
        client: 'MedCare',
        shortDescription: 'HIPAA-compliant patient management platform',
        description: 'Developed a comprehensive healthcare management system with appointment scheduling, electronic health records, and telemedicine capabilities.',
        thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
        banner: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920',
        technologies: ['React', 'Python', 'PostgreSQL', 'AWS'],
        order: 2,
        featured: true
      }
    ]);
    console.log('✓ Projects seeded');
  }

  // Seed Blog Categories
  const blogCategoriesCount = await BlogCategory.countDocuments();
  if (blogCategoriesCount === 0) {
    await BlogCategory.insertMany([
      { name: 'Technology', slug: 'technology', order: 1 },
      { name: 'Design', slug: 'design', order: 2 },
      { name: 'Business', slug: 'business', order: 3 }
    ]);
    console.log('✓ Blog categories seeded');
  }

  // Seed Blog Posts
  const blogsCount = await Blog.countDocuments();
  if (blogsCount === 0) {
    const techCategory = await BlogCategory.findOne({ slug: 'technology' });
    await Blog.insertMany([
      {
        title: 'Getting Started with React 18',
        slug: 'getting-started-with-react-18',
        excerpt: 'A comprehensive guide to the latest features in React 18',
        content: 'React 18 introduces new features like concurrent rendering, automatic batching, and new hooks. Learn how to leverage these in your applications.',
        banner: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1920',
        categoryId: techCategory?._id,
        tags: ['react', 'javascript', 'frontend'],
        readingTime: 5,
        status: 'published',
        publishedAt: new Date(),
        order: 1,
        featured: true
      },
      {
        title: 'Building Scalable APIs with Node.js',
        slug: 'building-scalable-apis-with-nodejs',
        excerpt: 'Best practices for building production-ready APIs',
        content: 'Learn how to build scalable, maintainable APIs using Node.js, Express, and modern best practices including authentication, validation, and error handling.',
        banner: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1920',
        categoryId: techCategory?._id,
        tags: ['nodejs', 'api', 'backend'],
        readingTime: 8,
        status: 'published',
        publishedAt: new Date(),
        order: 2,
        featured: false
      }
    ]);
    console.log('✓ Blog posts seeded');
  }

  // Seed Team Members
  const teamCount = await Team.countDocuments();
  if (teamCount === 0) {
    await Team.insertMany([
      {
        name: 'John Smith',
        designation: 'CEO & Founder',
        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
        order: 1
      },
      {
        name: 'Sarah Johnson',
        designation: 'CTO',
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        order: 2
      },
      {
        name: 'Michael Chen',
        designation: 'Lead Developer',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        order: 3
      }
    ]);
    console.log('✓ Team members seeded');
  }

  // Seed Testimonials
  const testimonialsCount = await Testimonial.countDocuments();
  if (testimonialsCount === 0) {
    await Testimonial.insertMany([
      {
        clientName: 'Emily Watson',
        company: 'TechStart',
        designation: 'CEO',
        photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
        rating: 5,
        review: 'Neosix delivered an exceptional e-commerce platform that exceeded our expectations. Their team is professional and responsive.',
        featured: true,
        displayOrder: 1,
        status: 'active'
      },
      {
        clientName: 'David Miller',
        company: 'HealthPlus',
        designation: 'CTO',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
        rating: 5,
        review: 'The healthcare system they built for us is robust, secure, and user-friendly. Highly recommend their services.',
        featured: true,
        displayOrder: 2,
        status: 'active'
      }
    ]);
    console.log('✓ Testimonials seeded');
  }

  // Seed Technologies
  const techCount = await Technology.countDocuments();
  if (techCount === 0) {
    await Technology.deleteMany({});
    await Technology.insertMany([
      { name: 'React', category: 'frontend', displayOrder: 1, status: 'published' },
      { name: 'Node.js', category: 'backend', displayOrder: 2, status: 'published' },
      { name: 'Python', category: 'backend', displayOrder: 3, status: 'published' },
      { name: 'AWS', category: 'devops', displayOrder: 4, status: 'published' },
      { name: 'MongoDB', category: 'database', displayOrder: 5, status: 'published' },
      { name: 'PostgreSQL', category: 'database', displayOrder: 6, status: 'published' },
      { name: 'Docker', category: 'devops', displayOrder: 7, status: 'published' },
      { name: 'Kubernetes', category: 'devops', displayOrder: 8, status: 'published' }
    ]);
    console.log('✓ Technologies seeded');
  }

  // Seed FAQs
  const faqCount = await FAQ.countDocuments();
  if (faqCount === 0) {
    await FAQ.insertMany([
      {
        question: 'What industries do you serve?',
        answer: 'We serve various industries including healthcare, finance, retail, and technology. Our team has experience across multiple domains.',
        category: 'general',
        displayOrder: 1,
        status: 'active'
      },
      {
        question: 'How do you handle project timelines?',
        answer: 'We follow agile methodologies with regular sprints and deliverables. We provide detailed project plans and milestone tracking.',
        category: 'services',
        displayOrder: 2,
        status: 'active'
      },
      {
        question: 'Do you provide ongoing support?',
        answer: 'Yes, we offer maintenance and support packages to ensure your applications run smoothly after launch.',
        category: 'technical',
        displayOrder: 3,
        status: 'active'
      }
    ]);
    console.log('✓ FAQs seeded');
  }

  // Seed Website Settings
  const settingsCount = await WebsiteSetting.countDocuments();
  if (settingsCount === 0) {
    await WebsiteSetting.create({
      siteName: 'Neosix',
      tagline: 'Building Digital Excellence',
      contactEmail: 'contact@neosix.com',
      phone: '+1 (555) 123-4567',
      address: '123 Tech Street\nSan Francisco, CA 94105',
      socialLinks: {
        linkedin: 'https://linkedin.com/company/neosix',
        twitter: 'https://twitter.com/neosix',
        github: 'https://github.com/neosix'
      },
      googleMap: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0!2d-122.4194!3d37.7749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ2JzI5LjYiTiAxMjLCsDI1JzEwLjEiVw!5e0!3m2!1sen!2sus!4v1234567890',
      footerText: 'Neosix is a leading software development company delivering enterprise solutions since 2014.',
      copyright: `© ${new Date().getFullYear()} Neosix. All rights reserved.`
    });
    console.log('✓ Website settings seeded');
  }

  console.log('Content seeding completed successfully');
};
