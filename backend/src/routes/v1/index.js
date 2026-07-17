import { Router } from "express";
import authRoutes from "./auth.routes.js";
import mediaRoutes from "./media.routes.js";
import publicRoutes from "./public.routes.js";
import adminRoutes from "./admin.routes.js";
import userRoutes from "./user.routes.js";
import { publicRateLimiter } from "../../middleware/rateLimiter.js";
import heroRoutes from "./hero.routes.js";
import solutionRoutes from "./solution.routes.js";
import industryRoutes from "./industry.routes.js";
import technologyRoutes from "./technology.routes.js";
import projectRoutes from "./project.routes.js";
import blogCategoryRoutes from "./blogCategory.routes.js";
import blogRoutes from "./blog.routes.js";
import teamRoutes from "./team.routes.js";
import testimonialRoutes from "./testimonial.routes.js";
import careerRoutes from "./career.routes.js";
import faqRoutes from "./faq.routes.js";
import websiteSettingsRoutes from "./websiteSettings.routes.js";
import seoRoutes from "./seo.routes.js";
import aboutRoutes from "./about.routes.js";
import serviceRoutes from "./service.routes.js";
import jobApplicationRoutes from "./jobApplication.routes.js";
import contactRoutes from "./contact.routes.js";
import subscriberRoutes from "./subscriber.routes.js";
import certificationRoutes from "./certification.routes.js";
import pricingRoutes from "./pricing.routes.js";
import hrRoutes from "./hr.routes.js";

const router = Router();

// Mount versioned routes
// Public content routes get a high-limit rate limiter (1000/15min)
// because the homepage alone makes 12+ simultaneous API calls.
router.use("/public", publicRateLimiter, publicRoutes);
router.use("/auth", authRoutes);
router.use("/media", mediaRoutes);
router.use("/admin", adminRoutes);
router.use("/users", userRoutes);
router.use("/admin/hero", heroRoutes);
router.use("/admin/solutions", solutionRoutes);
router.use("/admin/industries", industryRoutes);
router.use("/admin/technologies", technologyRoutes);
router.use("/admin/projects", projectRoutes);
router.use("/admin/blog-categories", blogCategoryRoutes);
router.use("/admin/blogs", blogRoutes);
router.use("/admin/team", teamRoutes);
router.use("/admin/testimonials", testimonialRoutes);
router.use("/admin/careers", careerRoutes);
router.use("/admin/faqs", faqRoutes);
router.use("/admin/website-settings", websiteSettingsRoutes);
router.use("/admin/seo", seoRoutes);
router.use("/admin/about", aboutRoutes);
router.use("/admin/services", serviceRoutes);
router.use("/admin/applications", jobApplicationRoutes);
router.use("/admin/messages", contactRoutes);
router.use("/admin/subscribers", subscriberRoutes);
router.use("/admin/certifications", certificationRoutes);
router.use("/admin/pricing", pricingRoutes);
router.use("/admin/hr", hrRoutes);

export default router;
