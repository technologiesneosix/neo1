import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { seedDatabase } from '../../../frontend/src/api/seed';

// Import Mongoose models
import Admin from '../models/Admin.js';
import Hero from '../models/Hero.js';
import About from '../models/About.js';
import Service from '../models/Service.js';
import Solution from '../models/Solution.js';
import Industry from '../models/Industry.js';
import Technology from '../models/Technology.js';
import Project from '../models/Project.js';
import BlogCategory from '../models/BlogCategory.js';
import Blog from '../models/Blog.js';
import Team from '../models/Team.js';
import Testimonial from '../models/Testimonial.js';
import Career from '../models/Career.js';
import JobApplication from '../models/JobApplication.js';
import ContactMessage from '../models/ContactMessage.js';
import NewsletterSubscriber from '../models/NewsletterSubscriber.js';
import FAQ from '../models/FAQ.js';
import WebsiteSetting from '../models/WebsiteSetting.js';
import SEO from '../models/SEO.js';
import Media from '../models/Media.js';

const runReseed = async () => {
  try {
    await connectDatabase();
    console.log('Connected to MongoDB. Replicating frontend seed data...');

    const seedData = seedDatabase();

    // 1. Settings (Singleton)
    await WebsiteSetting.deleteMany({});
    const s = seedData.settings[0] as any;
    const socialLinksObj: Record<string, string> = {};
    s.socialLinks?.forEach((item: any) => {
      socialLinksObj[item.platform] = item.url;
    });
    await WebsiteSetting.create({
      siteName: s.siteName,
      tagline: s.tagline,
      logo: s.logoUrl,
      favicon: s.faviconUrl,
      contactEmail: s.email,
      phone: s.phone,
      address: s.address,
      socialLinks: socialLinksObj,
      googleMap: s.mapEmbedUrl,
      footerText: s.footerText,
      copyright: s.copyrightText,
    });
    console.log('✓ Website settings replicated');

    // 2. Hero Slides
    await Hero.deleteMany({});
    const heroes = (seedData['hero-slides'] as any[]).map((slide) => ({
      _id: new mongoose.Types.ObjectId(), // generate standard mongo objectid
      title: slide.title,
      subtitle: slide.subtitle,
      description: slide.description,
      primaryButtonText: slide.primaryCtaLabel,
      primaryButtonLink: slide.primaryCtaLink,
      secondaryButtonText: slide.secondaryCtaLabel || 'Learn More',
      secondaryButtonLink: slide.secondaryCtaLink || '#',
      heroImage: slide.imageUrl,
      backgroundImage: slide.imageUrl,
      isActive: slide.active,
    }));
    await Hero.insertMany(heroes);
    console.log(`✓ Hero slides replicated (${heroes.length})`);

    // 3. About (Singleton)
    await About.deleteMany({});
    const a = seedData.about[0] as any;
    const exp = a.stats.find((item: any) => item.label.toLowerCase().includes('experience'))?.value || 0;
    const emp = a.stats.find((item: any) => item.label.toLowerCase().includes('employee'))?.value || 0;
    const proj = a.stats.find((item: any) => item.label.toLowerCase().includes('project'))?.value || 0;
    const country = a.stats.find((item: any) => item.label.toLowerCase().includes('countries') || item.label.toLowerCase().includes('served'))?.value || 0;
    await About.create({
      companyName: a.title,
      shortDescription: a.leadText,
      fullDescription: a.description,
      mission: a.mission,
      vision: a.vision,
      journey: a.leadText,
      experience: exp,
      employees: emp,
      projectsCompleted: proj,
      countriesServed: country,
    });
    console.log('✓ About page replicated');

    // 4. Services
    await Service.deleteMany({});
    // Map IDs to maintain references if needed
    const serviceMap = new Map();
    const services = (seedData.services as any[]).map((item) => {
      const oid = new mongoose.Types.ObjectId();
      serviceMap.set(item.id, oid);
      return {
        _id: oid,
        title: item.title,
        slug: item.slug,
        shortDescription: item.excerpt,
        description: item.description,
        icon: item.icon,
        thumbnail: item.imageUrl,
        displayOrder: item.order,
        isFeatured: item.featured,
        features: item.features,
        status: 'published',
        seo: {
          metaTitle: item.seo?.metaTitle || '',
          metaDescription: item.seo?.metaDescription || '',
          keywords: typeof item.seo?.keywords === 'string' ? item.seo.keywords.split(',').map((x: string) => x.trim()) : [],
        },
      };
    });
    await Service.insertMany(services);
    console.log(`✓ Services replicated (${services.length})`);

    // 5. Solutions
    await Solution.deleteMany({});
    const solutions = (seedData.solutions as any[]).map((item) => ({
      _id: new mongoose.Types.ObjectId(),
      title: item.title,
      slug: item.slug,
      description: item.description,
      banner: item.imageUrl,
      features: item.features,
      status: 'published',
      seo: {
        metaTitle: item.seo?.metaTitle || '',
        metaDescription: item.seo?.metaDescription || '',
        keywords: typeof item.seo?.keywords === 'string' ? item.seo.keywords.split(',').map((x: string) => x.trim()) : [],
      },
    }));
    await Solution.insertMany(solutions);
    console.log(`✓ Solutions replicated (${solutions.length})`);

    // 6. Industries
    await Industry.deleteMany({});
    const industryMap = new Map();
    const industries = (seedData.industries as any[]).map((item) => {
      const oid = new mongoose.Types.ObjectId();
      industryMap.set(item.id, oid);
      return {
        _id: oid,
        title: item.title,
        slug: item.slug,
        description: item.description,
        banner: item.imageUrl,
        icon: item.icon,
        status: 'published',
        seo: {
          metaTitle: item.seo?.metaTitle || '',
          metaDescription: item.seo?.metaDescription || '',
          keywords: typeof item.seo?.keywords === 'string' ? item.seo.keywords.split(',').map((x: string) => x.trim()) : [],
        },
      };
    });
    await Industry.insertMany(industries);
    console.log(`✓ Industries replicated (${industries.length})`);

    // 7. Technologies
    await Technology.deleteMany({});
    const techMap = new Map();
    const technologies = (seedData.technologies as any[]).map((item) => {
      const oid = new mongoose.Types.ObjectId();
      techMap.set(item.id, oid);
      const mappedCategory = item.category === 'cloud' ? 'devops' : item.category === 'ai' ? 'backend' : item.category;
      return {
        _id: oid,
        name: item.name,
        slug: item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        category: mappedCategory,
        logo: item.icon,
        description: item.description,
        displayOrder: item.order,
        status: 'published',
      };
    });
    await Technology.insertMany(technologies);
    console.log(`✓ Technologies replicated (${technologies.length})`);

    // 8. Projects
    await Project.deleteMany({});
    const projectMap = new Map();
    const projects = (seedData.projects as any[]).map((item) => {
      const oid = new mongoose.Types.ObjectId();
      projectMap.set(item.id, oid);
      
      // Try to find matching technology IDs
      const techIds: mongoose.Types.ObjectId[] = [];
      item.technologies?.forEach((tname: string) => {
        const foundTech = Array.from(techMap.entries()).find(([_, v]) => (v as any).name === tname);
        if (foundTech) {
          techIds.push(foundTech[1]);
        }
      });

      return {
        _id: oid,
        title: item.title,
        slug: item.slug,
        client: item.client,
        shortDescription: item.excerpt,
        description: item.description,
        features: item.features,
        gallery: item.gallery,
        banner: item.coverImageUrl,
        thumbnail: item.coverImageUrl,
        liveUrl: item.liveUrl,
        featured: item.featured,
        status: 'published',
        technologies: techIds,
        seo: {
          metaTitle: item.seo?.metaTitle || '',
          metaDescription: item.seo?.metaDescription || '',
          keywords: typeof item.seo?.keywords === 'string' ? item.seo.keywords.split(',').map((x: string) => x.trim()) : [],
        },
      };
    });
    await Project.insertMany(projects);
    console.log(`✓ Projects replicated (${projects.length})`);

    // 9. Blog Categories
    await BlogCategory.deleteMany({});
    const categoryMap = new Map();
    const blogCategories = (seedData.categories as any[]).map((item) => {
      const oid = new mongoose.Types.ObjectId();
      categoryMap.set(item.id, oid);
      return {
        _id: oid,
        name: item.name,
        slug: item.slug,
        description: item.description,
      };
    });
    await BlogCategory.insertMany(blogCategories);
    console.log(`✓ Blog categories replicated (${blogCategories.length})`);

    // 10. Team (Merge authors and team-members)
    await Team.deleteMany({});
    const teamMap = new Map();
    const teamItems: any[] = [];
    
    // Process team members (founders)
    (seedData['team-members'] as any[]).forEach((item) => {
      const oid = new mongoose.Types.ObjectId();
      teamMap.set(item.id, oid);
      const socialLinksObj: Record<string, string> = {};
      item.socialLinks?.forEach((s: any) => {
        socialLinksObj[s.platform] = s.url;
      });
      teamItems.push({
        _id: oid,
        name: item.name,
        designation: item.role,
        photo: item.photoUrl,
        bio: item.bio,
        socialLinks: socialLinksObj,
        displayOrder: item.order || 0,
        status: 'active',
      });
    });

    // Process blog authors
    (seedData.authors as any[]).forEach((item) => {
      const oid = new mongoose.Types.ObjectId();
      teamMap.set(item.id, oid);
      teamItems.push({
        _id: oid,
        name: item.name,
        designation: item.role,
        photo: item.avatarUrl,
        bio: item.bio,
        socialLinks: {},
        displayOrder: 100, // lower priority
        status: 'active',
      });
    });
    await Team.insertMany(teamItems);
    console.log(`✓ Team members & authors replicated (${teamItems.length})`);

    // 11. Blog Posts
    await Blog.deleteMany({});
    const blogPosts = (seedData['blog-posts'] as any[]).map((item) => {
      const backendCategoryId = categoryMap.get(item.categoryId);
      const backendAuthorId = teamMap.get(item.authorId);
      return {
        _id: new mongoose.Types.ObjectId(),
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        content: item.content,
        banner: item.bannerUrl,
        category: backendCategoryId || undefined,
        author: backendAuthorId || undefined,
        tags: item.tags,
        published: item.status === 'published',
        featured: item.featured,
        publishedAt: item.publishedAt,
        seo: {
          metaTitle: item.seo?.metaTitle || '',
          metaDescription: item.seo?.metaDescription || '',
          keywords: typeof item.seo?.keywords === 'string' ? item.seo.keywords.split(',').map((x: string) => x.trim()) : [],
        },
      };
    });
    await Blog.insertMany(blogPosts);
    console.log(`✓ Blog posts replicated (${blogPosts.length})`);

    // 12. Testimonials
    await Testimonial.deleteMany({});
    const testimonials = (seedData.testimonials as any[]).map((item) => ({
      _id: new mongoose.Types.ObjectId(),
      clientName: item.name,
      company: item.company,
      designation: item.role,
      photo: item.avatarUrl,
      rating: item.rating,
      review: item.quote,
      featured: true,
      displayOrder: item.order,
      status: item.active ? 'active' : 'inactive',
    }));
    await Testimonial.insertMany(testimonials);
    console.log(`✓ Testimonials replicated (${testimonials.length})`);

    // 13. Careers (Job Openings)
    await Career.deleteMany({});
    const careerMap = new Map();
    const careers = (seedData['job-openings'] as any[]).map((item) => {
      const oid = new mongoose.Types.ObjectId();
      careerMap.set(item.id, oid);
      
      const validDepartments = ['engineering', 'design', 'marketing', 'sales', 'hr', 'finance', 'other'];
      const department = validDepartments.includes(item.department?.toLowerCase()) ? item.department.toLowerCase() : 'other';

      let experience = 'entry-level';
      const expLower = item.experience?.toLowerCase() || '';
      if (expLower.includes('5+') || expLower.includes('5-10')) {
        experience = '5-10 years';
      } else if (expLower.includes('4+') || expLower.includes('3+') || expLower.includes('2-5')) {
        experience = '2-5 years';
      } else if (expLower.includes('1-2') || expLower.includes('1+')) {
        experience = '1-2 years';
      } else if (expLower.includes('10+')) {
        experience = '10+ years';
      }

      return {
        _id: oid,
        title: item.title,
        slug: item.slug,
        department,
        employmentType: item.type,
        location: item.location,
        experience,
        salary: 'Negotiable',
        description: item.description,
        requirements: item.requirements,
        responsibilities: item.responsibilities,
        benefits: ['Health Insurance', 'Flexible Hours', 'Learning Stipend'],
        status: item.active ? 'open' : 'closed',
      };
    });
    await Career.insertMany(careers);
    console.log(`✓ Careers replicated (${careers.length})`);

    // 14. FAQs
    await FAQ.deleteMany({});
    const faqs = (seedData.faqs as any[]).map((item) => {
      let category = 'general';
      const catLower = item.category?.toLowerCase() || '';
      if (catLower.includes('process')) {
        category = 'general';
      } else if (catLower.includes('legal')) {
        category = 'other';
      } else if (catLower.includes('engineering') || catLower.includes('technical')) {
        category = 'technical';
      } else if (catLower.includes('support') || catLower.includes('services')) {
        category = 'services';
      } else if (catLower.includes('pricing')) {
        category = 'pricing';
      }
      
      return {
        _id: new mongoose.Types.ObjectId(),
        question: item.question,
        answer: item.answer,
        category,
        displayOrder: item.order,
        status: 'active',
      };
    });
    await FAQ.insertMany(faqs);
    console.log(`✓ FAQs replicated (${faqs.length})`);

    // 15. Media
    await Media.deleteMany({});
    const media = (seedData['media-assets'] as any[]).map((item) => ({
      _id: new mongoose.Types.ObjectId(),
      fileName: item.name,
      originalName: item.name,
      url: item.url,
      publicId: `seed-${item.id}`,
      mimeType: item.type === 'image' ? 'image/jpeg' : item.type === 'video' ? 'video/mp4' : 'application/pdf',
      fileSize: item.size,
      folder: item.folder,
    }));
    await Media.insertMany(media);
    console.log(`✓ Media assets replicated (${media.length})`);

    // 16. SEO (Singleton)
    await SEO.deleteMany({});
    const homeSeo = (seedData['page-seo'] as any[]).find((p) => p.page === '/');
    if (homeSeo) {
      await SEO.create({
        metaTitle: homeSeo.seo.metaTitle,
        metaDescription: homeSeo.seo.metaDescription,
        keywords: typeof homeSeo.seo.keywords === 'string' ? homeSeo.seo.keywords.split(',').map((x: string) => x.trim()) : [],
        robots: homeSeo.seo.robots,
      });
      console.log('✓ SEO settings replicated');
    }

    // 17. Subscribers
    await NewsletterSubscriber.deleteMany({});
    const subscribers = (seedData.subscribers as any[]).map((item) => ({
      _id: new mongoose.Types.ObjectId(),
      email: item.email,
      isSubscribed: item.active,
    }));
    await NewsletterSubscriber.insertMany(subscribers);
    console.log(`✓ Subscribers replicated (${subscribers.length})`);

    // 18. Job Applications
    await JobApplication.deleteMany({});
    const jobApplications = (seedData['job-applications'] as any[]).map((item) => {
      const backendCareerId = careerMap.get(item.jobId);
      return {
        _id: new mongoose.Types.ObjectId(),
        career: backendCareerId,
        name: item.name,
        email: item.email,
        phone: item.phone,
        resume: item.resumeUrl || 'https://example.com/resume.pdf',
        coverLetter: item.coverLetter,
        status: item.status === 'new' ? 'pending' : item.status,
      };
    });
    await JobApplication.insertMany(jobApplications);
    console.log(`✓ Job applications replicated (${jobApplications.length})`);

    // 19. Contact Messages
    await ContactMessage.deleteMany({});
    const contactMessages = (seedData['contact-messages'] as any[]).map((item) => ({
      _id: new mongoose.Types.ObjectId(),
      name: item.name,
      email: item.email,
      phone: item.phone,
      subject: item.subject || 'Inquiry',
      message: item.message,
      status: item.read ? 'read' : 'unread',
    }));
    await ContactMessage.insertMany(contactMessages);
    console.log(`✓ Contact messages replicated (${contactMessages.length})`);

    // Seed admin accounts properly
    // Ensure we keep the Admin seed email technologiesneosix@gmail.com with standard password NeoSix@12
    const adminCount = await Admin.countDocuments({ email: 'technologiesneosix@gmail.com' });
    if (adminCount === 0) {
      await Admin.create({
        name: 'Super Admin',
        email: 'technologiesneosix@gmail.com',
        password: 'NeoSix@12',
        isActive: true,
      });
      console.log('✓ Admin account created (technologiesneosix@gmail.com / NeoSix@12)');
    }

    console.log('Database replication completed successfully');
    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    console.error('Error replicating database:', error);
    await disconnectDatabase();
    process.exit(1);
  }
};

runReseed();
