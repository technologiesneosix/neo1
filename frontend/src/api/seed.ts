/**
 * Seed content for the local mock database. All copy is original Neosix
 * content; images are neutral placeholders swappable from the Media Library.
 */
export const SEED_VERSION = 6;

let seq = 0;
function base(daysAgo = 30) {
  seq += 1;
  const created = new Date(Date.now() - daysAgo * 86400000 - seq * 3600000).toISOString();
  return { id: `seed-${seq}`, createdAt: created, updatedAt: created };
}

const img = (name: string, w = 900, h = 640) => `https://picsum.photos/seed/${name}/${w}/${h}`;

const seo = (title: string, description: string, keywords = 'neosix, software, enterprise') => ({
  metaTitle: `${title} | Neosix`,
  metaDescription: description,
  keywords,
  robots: 'index,follow',
});

export function seedDatabase(): Record<string, unknown[]> {
  seq = 0;

  const settings = [
    {
      ...base(120),
      siteName: 'Neosix',
      tagline: 'Enterprise Software Solutions',
      logoUrl: '',
      logoDarkUrl: '',
      faviconUrl: '/favicon.svg',
      phone: '+91 91153 70316, +91 88813 54465',
      email: 'technologiesneosix@gmail.com',
      address: '9A, 62, MMRDA Colony, J.V.L.R Road,\nAndheri (E), Mumbai, Maharashtra - 400060',
      workingHours: 'Mon – Sun / 9:00AM – 8:00PM',
      mapEmbedUrl:
        'https://www.openstreetmap.org/export/embed.html?bbox=72.8580%2C19.1020%2C72.8900%2C19.1320&layer=mapnik&marker=19.1175%2C72.8742',
      socialLinks: [
        { id: 'so-1', platform: 'instagram', url: 'https://www.instagram.com/neosixtechnologies' },
        { id: 'so-2', platform: 'twitter', url: 'https://x.com/neosix' },
        { id: 'so-3', platform: 'linkedin', url: 'https://www.linkedin.com/in/neosix-technologies-4a8699420' },
      ],
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
      footerText:
        'Neosix builds enterprise-grade digital products — from custom software and SaaS platforms to AI and cloud solutions — for companies that want to move faster.',
      copyrightText: `Neosix © ${new Date().getFullYear()}. All Rights Reserved.`,
      primaryColor: '#4c3de4',
      accentColor: '#0088cc',
      newsletterEnabled: true,
      topBarEnabled: false,
    },
  ];

  const heroSlides = [
    {
      ...base(90),
      title: 'We Are Digital Experts',
      subtitle: 'Digital experts based in Mumbai and Noida',
      description: 'Product engineering for companies that ship with confidence.',
      primaryCtaLabel: 'Get Started',
      primaryCtaLink: '/contact',
      secondaryCtaLabel: 'Our Work',
      secondaryCtaLink: '/portfolio',
      imageUrl: img('neosix-hero', 800, 800),
      order: 1,
      active: true,
    },
    {
      ...base(90),
      title: 'We Build Software That Scales',
      subtitle: 'Web, Mobile, Cloud & AI',
      description: 'From first commit to global rollout, one accountable team.',
      primaryCtaLabel: 'Explore Services',
      primaryCtaLink: '/services',
      secondaryCtaLabel: 'Talk to Us',
      secondaryCtaLink: '/contact',
      imageUrl: img('neosix-hero-2', 800, 800),
      order: 2,
      active: true,
    },
  ];

  const about = [
    {
      ...base(90),
      sectionLabel: 'ABOUT US',
      title: 'We Create Digital Solutions, Products and Services.',
      leadText:
        'Neosix is an enterprise software company helping ambitious teams design, build and operate the products their businesses run on.',
      description:
        'For over a decade we have delivered web platforms, mobile apps, SaaS products and AI systems for startups and Fortune 500s alike. Our engineers, designers and strategists work as one embedded team — owning outcomes, not just tickets.',
      imageUrl: img('neosix-about', 820, 760),
      ctaLabel: 'Contact Us',
      ctaLink: '/contact',
      mission:
        'To turn complex business problems into elegant, reliable software that people love to use.',
      vision:
        'A world where every organization — regardless of size — has access to enterprise-grade engineering.',
      values: ['Ownership', 'Craftsmanship', 'Transparency', 'Long-term thinking'],
      stats: [
        { id: 'st-1', label: 'Projects Delivered', value: 320, suffix: '+' },
        { id: 'st-2', label: 'Team Members', value: 85, suffix: '+' },
        { id: 'st-3', label: 'Countries Served', value: 24, suffix: '' },
        { id: 'st-4', label: 'Client Retention', value: 96, suffix: '%' },
      ],
    },
  ];

  const timeline = [
    {
      ...base(80),
      year: 'July 2026',
      title: 'Founded in July 2026',
      description: 'Founded in Mumbai',
      order: 1,
    },
    {
      ...base(80),
      year: 'August 2026',
      title: 'First client in August',
      description: 'Started serving our clients',
      order: 2,
    },
    {
      ...base(80),
      year: 'Now',
      title: 'Growing everyday',
      description: '',
      order: 3,
    },
  ];

  const certifications = [
    { ...base(70), name: 'ISO 27001', issuer: 'International Organization for Standardization', imageUrl: img('cert-iso', 400, 300), year: '2020' },
    { ...base(70), name: 'SOC 2 Type II', issuer: 'AICPA', imageUrl: img('cert-soc2', 400, 300), year: '2021' },
    { ...base(70), name: 'AWS Advanced Partner', issuer: 'Amazon Web Services', imageUrl: img('cert-aws', 400, 300), year: '2022' },
    { ...base(70), name: 'Microsoft Gold Partner', issuer: 'Microsoft', imageUrl: img('cert-ms', 400, 300), year: '2022' },
  ];

  const services = [
    { icon: 'Globe', title: 'Web Development', excerpt: 'High-performance web platforms built on modern frameworks and clean architecture.' },
    { icon: 'Smartphone', title: 'Mobile App Development', excerpt: 'Native and cross-platform apps that feel fast, polished and reliable.' },
    { icon: 'Code2', title: 'Custom Software Development', excerpt: 'Bespoke systems shaped precisely around your operations and workflows.' },
    { icon: 'Layers', title: 'SaaS Development', excerpt: 'Multi-tenant products with billing, analytics and scale designed in from day one.' },
    { icon: 'PenTool', title: 'UI/UX Design', excerpt: 'Research-driven interfaces that convert, retain and delight.' },
    { icon: 'Brain', title: 'AI Solutions', excerpt: 'LLM apps, ML pipelines and intelligent automation in production, not slides.' },
    { icon: 'Cloud', title: 'Cloud Solutions', excerpt: 'Architecture, migration and cost optimization on AWS, Azure and GCP.' },
    { icon: 'Plug', title: 'API Development', excerpt: 'Secure, documented, versioned APIs your partners will enjoy integrating.' },
    { icon: 'Workflow', title: 'DevOps', excerpt: 'CI/CD, infrastructure as code and observability for boring, safe releases.' },
    { icon: 'LifeBuoy', title: 'Maintenance & Support', excerpt: 'SLA-backed monitoring, patching and improvement of live systems.' },
  ].map((s, i) => ({
    ...base(60),
    ...s,
    slug: s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    description:
      `<p>Our ${s.title.toLowerCase()} practice pairs senior engineers with proven delivery playbooks. We start with a short discovery to map goals, constraints and success metrics, then move into iterative delivery with demos every sprint.</p><p>You get transparent estimates, weekly reporting and a codebase your own team can maintain — documented, tested and deployed through automated pipelines.</p>`,
    features: [
      'Dedicated senior team',
      'Fixed or agile engagement models',
      'Code audits & documentation',
      'Automated testing & CI/CD',
      'Post-launch support',
    ],
    imageUrl: img(`service-${i}`, 900, 600),
    order: i + 1,
    featured: i < 6,
    seo: seo(s.title, s.excerpt),
  }));

  const solutions = [
    { icon: 'Hotel', title: 'Hotel Management System', excerpt: 'Front desk, housekeeping, channel and revenue management in one platform.' },
    { icon: 'Users', title: 'CRM Software', excerpt: 'Pipeline, automation and analytics tailored to how your team actually sells.' },
    { icon: 'Factory', title: 'ERP', excerpt: 'Finance, procurement, inventory and production on a single source of truth.' },
    { icon: 'BadgeCheck', title: 'HRMS', excerpt: 'Hiring to payroll — the complete employee lifecycle, automated.' },
    { icon: 'Boxes', title: 'Inventory Management', excerpt: 'Real-time stock visibility across warehouses, channels and locations.' },
    { icon: 'CreditCard', title: 'POS', excerpt: 'Fast, offline-capable point of sale for retail and hospitality.' },
    { icon: 'GraduationCap', title: 'Learning Management System', excerpt: 'Courses, cohorts, assessments and certification at any scale.' },
    { icon: 'CalendarCheck', title: 'Booking System', excerpt: 'Scheduling, payments and reminders for service businesses.' },
    { icon: 'Building2', title: 'Custom Enterprise Software', excerpt: 'When off-the-shelf stops fitting, we build exactly what your operation needs.' },
  ].map((s, i) => ({
    ...base(55),
    ...s,
    slug: s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    description:
      `<p>${s.title} by Neosix is delivered as a tailored product, not a rigid template. We configure the core platform to your workflows, integrate with your existing stack and train your team for a smooth rollout.</p><p>Modular licensing means you pay for what you use, and our support team keeps everything patched, monitored and improving after launch.</p>`,
    features: ['Role-based access control', 'Analytics dashboard', 'Third-party integrations', 'Cloud or on-premise', 'White-label options'],
    imageUrl: img(`solution-${i}`, 900, 600),
    order: i + 1,
    seo: seo(s.title, s.excerpt),
  }));

  const industries = [
    { icon: 'HeartPulse', title: 'Healthcare', excerpt: 'HIPAA-ready patient platforms, telehealth and clinical workflow tools.' },
    { icon: 'BookOpen', title: 'Education', excerpt: 'Learning platforms and campus systems for schools and edtech companies.' },
    { icon: 'ConciergeBell', title: 'Hospitality', excerpt: 'Guest experience, booking and property management technology.' },
    { icon: 'Landmark', title: 'Finance', excerpt: 'Secure fintech products, payment systems and compliance tooling.' },
    { icon: 'Home', title: 'Real Estate', excerpt: 'Listing portals, CRM and property management platforms.' },
    { icon: 'ShoppingBag', title: 'Retail', excerpt: 'E-commerce, omnichannel POS and inventory intelligence.' },
    { icon: 'Cog', title: 'Manufacturing', excerpt: 'MES, quality control and IoT dashboards for the shop floor.' },
    { icon: 'Truck', title: 'Logistics', excerpt: 'Fleet tracking, route optimization and warehouse systems.' },
  ].map((s, i) => ({
    ...base(50),
    ...s,
    slug: s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description:
      `<p>Neosix has shipped production systems for the ${s.title.toLowerCase()} sector, so we arrive knowing the regulations, integrations and edge cases that matter. ${s.excerpt}</p><p>Engagements begin with a domain-focused discovery and end with software your operators rely on daily.</p>`,
    imageUrl: img(`industry-${i}`, 900, 600),
    order: i + 1,
    seo: seo(`${s.title} Software Development`, s.excerpt),
  }));

  const technologies = [
    ['frontend', ['React', 'Next.js', 'Vue', 'Angular', 'TypeScript']],
    ['backend', ['Node.js', 'Python', 'Go', '.NET', 'Java']],
    ['mobile', ['React Native', 'Flutter', 'Swift', 'Kotlin']],
    ['database', ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis']],
    ['cloud', ['AWS', 'Azure', 'Google Cloud', 'Cloudflare']],
    ['devops', ['Docker', 'Kubernetes', 'Terraform', 'GitHub Actions']],
    ['ai', ['OpenAI', 'Claude', 'TensorFlow', 'PyTorch', 'LangChain']],
  ].flatMap(([category, names], ci) =>
    (names as string[]).map((name, i) => ({
      ...base(45),
      name,
      category: category as string,
      icon: 'Cpu',
      description: `${name} — part of our production ${category} toolkit.`,
      order: ci * 10 + i,
    })),
  );

  const processSteps = [
    { icon: 'Search', title: 'Discovery', description: 'We map goals, users, constraints and success metrics in focused workshops.' },
    { icon: 'PenTool', title: 'Design', description: 'Wireframes to polished UI, validated with real users before a line of code.' },
    { icon: 'Code2', title: 'Development', description: 'Iterative sprints with demos, tests and CI/CD from the first week.' },
    { icon: 'ShieldCheck', title: 'QA & Security', description: 'Automated and manual testing, performance and security audits.' },
    { icon: 'Rocket', title: 'Launch & Scale', description: 'Zero-downtime releases, monitoring and a roadmap for what is next.' },
  ].map((s, i) => ({ ...base(40), ...s, order: i + 1 }));

  const projects = [
    { title: 'Atlas Freight Platform', category: 'Logistics', client: 'Atlas Freight Co.' },
    { title: 'MediBook Telehealth', category: 'Healthcare', client: 'MediBook Inc.' },
    { title: 'Lumen Retail POS', category: 'Retail', client: 'Lumen Stores' },
    { title: 'Cascade LMS', category: 'Education', client: 'Cascade Academy' },
    { title: 'Harbor Hotel Suite', category: 'Hospitality', client: 'Harbor Hotels' },
    { title: 'Vertex Analytics', category: 'SaaS', client: 'Vertex Data' },
  ].map((p, i) => ({
    ...base(35),
    ...p,
    slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    excerpt: `A ${p.category.toLowerCase()} product designed, built and scaled by Neosix for ${p.client}.`,
    description:
      `<p>${p.client} needed a modern ${p.category.toLowerCase()} platform to replace aging internal tools. Neosix delivered a full product — discovery, design, engineering and rollout — in under nine months.</p><p>The system now serves thousands of daily users with 99.9% uptime and has become the backbone of the client's operations.</p>`,
    coverImageUrl: img(`project-${i}`, 1000, 700),
    gallery: [img(`project-${i}-a`, 1000, 700), img(`project-${i}-b`, 1000, 700), img(`project-${i}-c`, 1000, 700)],
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'],
    features: ['Real-time dashboard', 'Role-based access', 'Mobile companion app', 'Automated reporting'],
    results: ['40% faster operations', '99.9% uptime since launch', '3× user adoption in year one'],
    timeline: '9 months',
    featured: i < 4,
    order: i + 1,
    seo: seo(p.title, `Case study: ${p.title} for ${p.client}.`),
  }));

  const caseStudies = projects.slice(0, 3).map((p, i) => ({
    ...base(30),
    title: `How ${p.client} modernized ${p.category.toLowerCase()} with Neosix`,
    slug: `${p.slug}-case-study`,
    projectId: p.id,
    client: p.client,
    industry: p.category,
    challenge:
      'Legacy tooling, manual processes and no single source of truth were slowing the business and frustrating customers.',
    solution:
      'Neosix designed and shipped a cloud-native platform with real-time data, automation of the heaviest workflows and a UX the whole team adopted willingly.',
    results: ['40% reduction in processing time', 'Payback in under 12 months', 'NPS up 22 points'],
    coverImageUrl: img(`case-${i}`, 1000, 600),
    seo: seo(`${p.client} Case Study`, `How ${p.client} transformed operations with Neosix.`),
  }));

  const categories = ['Development', 'AI', 'Cloud', 'Security', 'UI/UX'].map((name) => ({
    ...base(60),
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: `Articles about ${name.toLowerCase()} from the Neosix engineering team.`,
  }));

  const authors = [
    { name: 'Maya Chen', role: 'Principal Engineer' },
    { name: 'Daniel Reyes', role: 'Head of Design' },
    { name: 'Priya Nair', role: 'Cloud Architect' },
  ].map((a, i) => ({
    ...base(60),
    ...a,
    avatarUrl: img(`author-${i}`, 200, 200),
    bio: `${a.name} writes about building software that lasts.`,
  }));

  const blogPosts = [
    { title: 'Designing APIs your partners will love', cat: 0, tags: ['api', 'architecture'] },
    { title: 'Shipping LLM features without the hype', cat: 1, tags: ['ai', 'llm'] },
    { title: 'A pragmatic guide to cloud cost control', cat: 2, tags: ['cloud', 'finops'] },
    { title: 'Zero-trust basics for product teams', cat: 3, tags: ['security'] },
    { title: 'Design systems that survive rebrands', cat: 4, tags: ['design-systems'] },
    { title: 'Monorepos at scale: what actually works', cat: 0, tags: ['tooling', 'dx'] },
  ].map((p, i) => ({
    ...base(25 - i),
    title: p.title,
    slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    excerpt:
      'Practical lessons from production systems — what worked, what failed, and the checklist we use on every engagement.',
    content:
      `<p>Every engineering team eventually faces this problem, and most solve it the hard way. In this article we share the approach we use at Neosix across dozens of client engagements.</p><h2>Start with constraints</h2><p>Before choosing tools, write down the constraints that cannot move: compliance, latency budgets, team skills, deadlines. Decisions get easier when the walls are visible.</p><h2>Make it boring</h2><p>Reliable systems are boring systems. Prefer proven patterns, automate releases, and measure everything that matters to users.</p><blockquote>The best architecture is the one your team can operate at 3am.</blockquote><h2>Checklist</h2><ul><li>Document the golden path</li><li>Automate the release train</li><li>Budget for observability</li><li>Review quarterly, refactor continuously</li></ul><p>Adopt what fits, discard what does not — and ship.</p>`,
    bannerUrl: img(`blog-${i}`, 1200, 630),
    categoryId: categories[p.cat].id,
    authorId: authors[i % authors.length].id,
    tags: p.tags,
    status: 'published',
    featured: i === 0,
    publishedAt: new Date(Date.now() - (i + 2) * 6 * 86400000).toISOString(),
    commentsCount: 3 + i,
    seo: seo(p.title, 'Engineering insights from the Neosix team.'),
  }));

  const teamMembers = [
    {
      name: 'Aditya Singh',
      role: 'Co-Founder & CEO',
      image: '/images/founders/aditya-singh.webp',
      bio: "Leading NeoSix's vision, strategy, and business growth.",
      linkedin: 'https://www.linkedin.com/in/neosix-technologies-4a8699420',
    },
    {
      name: 'Shubham Modanwal',
      role: 'Co-Founder, COO & CPO',
      image: '/images/founders/shubham-modanwal.webp',
      bio: 'Driving product development, operations, and user experience.',
      linkedin: 'https://www.linkedin.com/in/neosix-technologies-4a8699420',
    },
    {
      name: 'Pranjal Singh',
      role: 'Co-Founder & CFO',
      image: '/images/founders/pranjal-singh.webp',
      bio: 'Managing financial strategy and business operations.',
      linkedin: 'https://www.linkedin.com/in/neosix-technologies-4a8699420',
    },
    {
      name: 'Bhavya Agrawal',
      role: 'Co-Founder & CTO',
      image: '/images/founders/bhavya-agrawal.webp',
      bio: 'Leading technology, engineering, and technical innovation.',
      linkedin: 'https://www.linkedin.com/in/neosix-technologies-4a8699420',
    },
  ].map((m, i) => ({
    ...base(60),
    name: m.name,
    role: m.role,
    photoUrl: m.image,
    bio: m.bio,
    socialLinks: [
      {
        id: `tm-${i}-li`,
        platform: 'linkedin',
        url: m.linkedin,
      },
    ],
    order: i + 1,
  }));

  const testimonials = [
    { name: 'Rachel Kim', role: 'COO', company: 'Atlas Freight Co.', quote: 'Neosix replaced three legacy systems with one platform our whole team actually enjoys using. Delivery was on time, communication was flawless.' },
    { name: 'Tom Oliveira', role: 'CEO', company: 'MediBook Inc.', quote: 'They understood healthcare compliance better than vendors who only do healthcare. Our telehealth launch went off without a hitch.' },
    { name: 'Grace Liu', role: 'CTO', company: 'Vertex Data', quote: 'The engineering quality is exceptional — clean code, real tests, honest estimates. Neosix works like an extension of our own team.' },
    { name: 'Omar Haddad', role: 'Founder', company: 'Cascade Academy', quote: 'From first call to launch in five months. Enrollment doubled the semester after our new platform shipped.' },
    { name: 'Nina Rossi', role: 'VP Operations', company: 'Harbor Hotels', quote: 'Support is the difference. Issues get fixed before our staff notices them. That is what a real partner looks like.' },
  ].map((t, i) => ({
    ...base(40),
    ...t,
    avatarUrl: img(`testimonial-${i}`, 160, 160),
    rating: 5,
    order: i + 1,
    active: true,
  }));

  const jobOpenings = [
    { title: 'Senior React Developer', department: 'Engineering', type: 'full-time', experience: '5+ years' },
    { title: 'Backend Engineer (Node.js)', department: 'Engineering', type: 'full-time', experience: '4+ years' },
    { title: 'Product Designer', department: 'Design', type: 'full-time', experience: '3+ years' },
    { title: 'DevOps Engineer', department: 'Platform', type: 'full-time', experience: '4+ years' },
    { title: 'Software Engineering Intern', department: 'Engineering', type: 'internship', experience: 'Student / New grad' },
  ].map((j, i) => ({
    ...base(20),
    ...j,
    slug: j.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    location: i % 2 === 0 ? 'Mumbai / Noida (Hybrid)' : 'Remote (India)',
    description:
      '<p>Join a senior team shipping enterprise products for global clients. You will own features end-to-end, work directly with clients and mentor peers.</p>',
    responsibilities: ['Own features from design to production', 'Write tested, documented code', 'Participate in architecture reviews', 'Mentor teammates'],
    requirements: [`${j.experience} of relevant experience`, 'Strong TypeScript fundamentals', 'Experience with cloud platforms', 'Excellent written communication'],
    active: true,
  }));

  const faqs = [
    { question: 'How do engagements with Neosix start?', answer: 'Every project starts with a free discovery call, followed by a short paid discovery sprint that produces a scoped plan, estimate and timeline you can take anywhere.', category: 'Process' },
    { question: 'What engagement models do you offer?', answer: 'Fixed-scope projects, dedicated teams and staff augmentation. Most clients start fixed-scope and move to a dedicated team as the product grows.', category: 'Process' },
    { question: 'Who owns the code and IP?', answer: 'You do — fully and unambiguously. All work is delivered under a work-for-hire agreement with source code in your repositories from week one.', category: 'Legal' },
    { question: 'How do you handle time zones?', answer: 'Teams are staffed for at least four hours of overlap with your working day, with async updates and weekly demos keeping everyone aligned.', category: 'Process' },
    { question: 'Can you take over an existing codebase?', answer: 'Yes. We begin with a technical audit covering architecture, security and delivery pipelines, then propose a stabilization and improvement roadmap.', category: 'Engineering' },
    { question: 'What does support look like after launch?', answer: 'SLA-backed plans include monitoring, security patching, bug fixes and a monthly improvement budget — with response times as fast as one hour.', category: 'Support' },
    { question: 'Do you sign NDAs?', answer: 'Of course. We are happy to sign your NDA before any detailed conversation about your product.', category: 'Legal' },
    { question: 'How are estimates and billing handled?', answer: 'Transparent, milestone-based billing. You see progress in a live dashboard and approve each milestone before payment.', category: 'Process' },
  ].map((f, i) => ({ ...base(30), ...f, order: i + 1 }));

  const pricingPlans = [
    { name: 'Basic Plan', price: 12, period: 'per month', description: 'For small teams validating an idea.', features: ['1 project', 'Email support', 'Weekly reports', 'Basic analytics'], highlighted: false, ctaLabel: 'Sign Up Now' },
    { name: 'Plus Plan', price: 29, period: 'per month', description: 'For growing products and teams.', features: ['3 projects', 'Priority support', 'Weekly reports', 'Advanced analytics'], highlighted: false, ctaLabel: 'Sign Up Now' },
    { name: 'Advanced Plan', price: 59, period: 'per month', description: 'Our most popular plan.', features: ['10 projects', 'Dedicated manager', 'Daily reports', 'Full analytics suite'], highlighted: true, ctaLabel: 'Sign Up Now' },
    { name: 'Enterprise Plan', price: 99, period: 'per month', description: 'For organizations at scale.', features: ['Unlimited projects', '24/7 support', 'Custom SLAs', 'White-glove onboarding'], highlighted: false, ctaLabel: 'Contact Sales' },
  ].map((p, i) => ({ ...base(30), ...p, order: i + 1 }));

  const mediaAssets = [
    ...['neosix-hero', 'neosix-about', 'project-0', 'project-1', 'blog-0', 'blog-1'].map((name, i) => ({
      ...base(15),
      name: `${name}.jpg`,
      url: img(name, 1000, 700),
      type: 'image',
      folder: i < 2 ? 'site' : name.startsWith('project') ? 'portfolio' : 'blog',
      size: 240000 + i * 18000,
    })),
  ];

  const pageSeo = [
    { page: '/', title: 'Neosix — Enterprise Software Solutions', description: 'Neosix designs and builds enterprise software: web, mobile, SaaS, AI and cloud solutions for ambitious companies.' },
    { page: '/about', title: 'About Neosix', description: 'Meet the team building enterprise-grade software since 2014.' },
    { page: '/services', title: 'Services', description: 'Web, mobile, custom software, SaaS, AI, cloud, API, DevOps and support services.' },
    { page: '/solutions', title: 'Solutions', description: 'Ready-to-tailor platforms: CRM, ERP, HRMS, POS, LMS and more.' },
    { page: '/industries', title: 'Industries', description: 'Domain expertise across healthcare, finance, retail, logistics and more.' },
    { page: '/technologies', title: 'Technologies', description: 'The production stack behind Neosix products.' },
    { page: '/portfolio', title: 'Portfolio', description: 'Selected projects and case studies.' },
    { page: '/blog', title: 'Blog', description: 'Engineering insights from the Neosix team.' },
    { page: '/careers', title: 'Careers', description: 'Build enterprise products with a senior, kind, ambitious team.' },
    { page: '/contact', title: 'Contact', description: 'Start a conversation about your next product.' },
  ].map((p) => ({ ...base(90), page: p.page, seo: seo(p.title.replace(' | Neosix', ''), p.description) }));

  const roles = [
    { ...base(100), name: 'Administrator', description: 'Full access to every module.', permissions: ['*'] },
    { ...base(100), name: 'Editor', description: 'Manage content: blogs, portfolio, pages.', permissions: ['content.read', 'content.write'] },
    { ...base(100), name: 'Viewer', description: 'Read-only access to the dashboard.', permissions: ['content.read'] },
  ];

  const adminUsers = [
    { ...base(100), name: 'Admin', email: 'technologiesneosix@gmail.com', roleId: roles[0].id, avatarUrl: img('admin-user', 120, 120), active: true },
    { ...base(100), name: 'Content Editor', email: 'technologiesneosix@gmail.com', roleId: roles[1].id, avatarUrl: img('editor-user', 120, 120), active: true },
  ];

  const contactMessages = [
    { ...base(3), name: 'Laura Bennett', email: 'laura@finchcapital.com', phone: '+1 555 210 8890', subject: 'Fintech platform inquiry', message: 'We are exploring a rebuild of our client portal and would like to discuss scope and timelines.', read: false },
    { ...base(6), name: 'Kenji Watanabe', email: 'kenji@harborlogistics.jp', subject: 'Logistics dashboard', message: 'Interested in your Atlas Freight case study. Can we schedule a call next week?', read: true },
  ];

  const subscribers = [
    { ...base(10), email: 'newsletter-fan@example.com', active: true },
    { ...base(12), email: 'cto@vertexdata.com', active: true },
  ];

  const jobApplications = [
    { ...base(4), jobId: jobOpenings[0].id, name: 'Sam Rivera', email: 'sam.rivera@example.com', phone: '+1 555 887 2231', resumeUrl: '', coverLetter: 'I have led React teams for 6 years and would love to contribute to Neosix client work.', status: 'new' },
  ];

  return {
    settings,
    'hero-slides': heroSlides,
    about,
    timeline,
    certifications,
    services,
    solutions,
    industries,
    technologies,
    'process-steps': processSteps,
    projects,
    'case-studies': caseStudies,
    categories,
    authors,
    'blog-posts': blogPosts,
    'team-members': teamMembers,
    testimonials,
    'job-openings': jobOpenings,
    'job-applications': jobApplications,
    'contact-messages': contactMessages,
    subscribers,
    faqs,
    'media-assets': mediaAssets,
    'page-seo': pageSeo,
    'admin-users': adminUsers,
    roles,
    'pricing-plans': pricingPlans,
  };
}
