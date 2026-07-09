import { Router } from 'express';
import express from 'express';
import { asyncHandler, validate } from '../../middleware/index.js';
import { uploadDocument } from '../../config/fileUpload.js';
import {
  getHomeContent,
  getAboutContent,
  getServices,
  getServiceBySlug,
  getSolutions,
  getSolutionBySlug,
  getIndustries,
  getIndustryBySlug,
  getTechnologies,
  getProjects,
  getProjectBySlug,
  getBlogs,
  getBlogBySlug,
  getBlogCategories,
  getTeam,
  getTestimonials,
  getCareers,
  getCareerBySlug,
  getFAQs,
  getSettings,
} from '../../controllers/publicController.js';
import { createContactMessage } from '../../controllers/contactController.js';
import { createNewsletterSubscription } from '../../controllers/newsletterController.js';
import { createJobApplication } from '../../controllers/jobApplicationController.js';
import { createContactMessageValidation } from '../../validations/contactValidation.js';
import { createNewsletterSubscriptionValidation } from '../../validations/newsletterValidation.js';
import { createJobApplicationValidation, careerSlugValidation } from '../../validations/jobApplicationValidation.js';

const router = Router();

// Apply body parsing to public routes
router.use(express.json({ limit: '10mb' }));
router.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * @route   GET /api/v1/public/home
 * @desc    Get home page content
 * @access  Public
 */
router.get('/home', asyncHandler(getHomeContent));

/**
 * @route   GET /api/v1/public/about
 * @desc    Get about page content
 * @access  Public
 */
router.get('/about', asyncHandler(getAboutContent));

/**
 * @route   GET /api/v1/public/services
 * @desc    Get all services
 * @access  Public
 */
router.get('/services', asyncHandler(getServices));

/**
 * @route   GET /api/v1/public/services/:slug
 * @desc    Get service by slug
 * @access  Public
 */
router.get('/services/:slug', asyncHandler(getServiceBySlug));

/**
 * @route   GET /api/v1/public/solutions
 * @desc    Get all solutions
 * @access  Public
 */
router.get('/solutions', asyncHandler(getSolutions));

/**
 * @route   GET /api/v1/public/solutions/:slug
 * @desc    Get solution by slug
 * @access  Public
 */
router.get('/solutions/:slug', asyncHandler(getSolutionBySlug));

/**
 * @route   GET /api/v1/public/industries
 * @desc    Get all industries
 * @access  Public
 */
router.get('/industries', asyncHandler(getIndustries));

/**
 * @route   GET /api/v1/public/industries/:slug
 * @desc    Get industry by slug
 * @access  Public
 */
router.get('/industries/:slug', asyncHandler(getIndustryBySlug));

/**
 * @route   GET /api/v1/public/technologies
 * @desc    Get all technologies
 * @access  Public
 */
router.get('/technologies', asyncHandler(getTechnologies));

/**
 * @route   GET /api/v1/public/projects
 * @desc    Get all projects
 * @access  Public
 */
router.get('/projects', asyncHandler(getProjects));

/**
 * @route   GET /api/v1/public/projects/:slug
 * @desc    Get project by slug
 * @access  Public
 */
router.get('/projects/:slug', asyncHandler(getProjectBySlug));

/**
 * @route   GET /api/v1/public/blogs
 * @desc    Get all blogs
 * @access  Public
 */
router.get('/blogs', asyncHandler(getBlogs));

/**
 * @route   GET /api/v1/public/blogs/:slug
 * @desc    Get blog by slug
 * @access  Public
 */
router.get('/blogs/:slug', asyncHandler(getBlogBySlug));

/**
 * @route   GET /api/v1/public/blog/categories
 * @desc    Get all blog categories
 * @access  Public
 */
router.get('/blog/categories', asyncHandler(getBlogCategories));

/**
 * @route   GET /api/v1/public/team
 * @desc    Get team members
 * @access  Public
 */
router.get('/team', asyncHandler(getTeam));

/**
 * @route   GET /api/v1/public/testimonials
 * @desc    Get testimonials
 * @access  Public
 */
router.get('/testimonials', asyncHandler(getTestimonials));

/**
 * @route   GET /api/v1/public/careers
 * @desc    Get all careers
 * @access  Public
 */
router.get('/careers', asyncHandler(getCareers));

/**
 * @route   GET /api/v1/public/careers/:slug
 * @desc    Get career by slug
 * @access  Public
 */
router.get('/careers/:slug', asyncHandler(getCareerBySlug));

/**
 * @route   GET /api/v1/public/faqs
 * @desc    Get FAQs
 * @access  Public
 */
router.get('/faqs', asyncHandler(getFAQs));

/**
 * @route   GET /api/v1/public/settings
 * @desc    Get website settings
 * @access  Public
 */
router.get('/settings', asyncHandler(getSettings));

/**
 * @route   POST /api/v1/public/contact
 * @desc    Submit contact form
 * @access  Public
 */
router.post(
  '/contact',
  createContactMessageValidation,
  validate,
  asyncHandler(createContactMessage)
);

/**
 * @route   POST /api/v1/public/newsletter/subscribe
 * @desc    Subscribe to newsletter
 * @access  Public
 */
router.post(
  '/newsletter/subscribe',
  createNewsletterSubscriptionValidation,
  validate,
  asyncHandler(createNewsletterSubscription)
);

/**
 * @route   POST /api/v1/public/careers/:slug/apply
 * @desc    Submit job application
 * @access  Public
 */
router.post(
  '/careers/:slug/apply',
  careerSlugValidation,
  validate,
  uploadDocument.single('resume'),
  createJobApplicationValidation,
  validate,
  asyncHandler(createJobApplication)
);

export default router;
