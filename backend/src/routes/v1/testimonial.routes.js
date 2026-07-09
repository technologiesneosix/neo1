import { Router } from 'express';
import { asyncHandler, authenticate } from '../../middleware/index.js';
import { validate } from '../../middleware/index.js';
import {
  createTestimonialValidation,
  updateTestimonialValidation,
  testimonialIdValidation,
  getTestimonialsValidation,
  updateTestimonialStatusValidation,
  toggleTestimonialFeaturedValidation,
  updateTestimonialDisplayOrderValidation,
} from '../../validations/testimonialValidation.js';
import {
  createTestimonial,
  getAllTestimonials,
  getTestimonialById,
  updateTestimonial,
  toggleTestimonialFeatured,
  updateTestimonialStatus,
  updateTestimonialDisplayOrder,
  deleteTestimonial,
} from '../../controllers/testimonialController.js';

const router = Router();

/**
 * @route   POST /api/v1/admin/testimonials
 * @desc    Create testimonial
 * @access  Private (Admin)
 */
router.post(
  '/',
  authenticate,
  createTestimonialValidation,
  validate,
  asyncHandler(createTestimonial)
);

/**
 * @route   GET /api/v1/admin/testimonials
 * @desc    Get all testimonials
 * @access  Private (Admin)
 */
router.get(
  '/',
  authenticate,
  getTestimonialsValidation,
  validate,
  asyncHandler(getAllTestimonials)
);

/**
 * @route   GET /api/v1/admin/testimonials/:id
 * @desc    Get testimonial by ID
 * @access  Private (Admin)
 */
router.get(
  '/:id',
  authenticate,
  testimonialIdValidation,
  validate,
  asyncHandler(getTestimonialById)
);

/**
 * @route   PUT /api/v1/admin/testimonials/:id
 * @desc    Update testimonial
 * @access  Private (Admin)
 */
router.put(
  '/:id',
  authenticate,
  testimonialIdValidation,
  updateTestimonialValidation,
  validate,
  asyncHandler(updateTestimonial)
);

/**
 * @route   PATCH /api/v1/admin/testimonials/:id/toggle-featured
 * @desc    Toggle testimonial featured status
 * @access  Private (Admin)
 */
router.patch(
  '/:id/toggle-featured',
  authenticate,
  toggleTestimonialFeaturedValidation,
  validate,
  asyncHandler(toggleTestimonialFeatured)
);

/**
 * @route   PATCH /api/v1/admin/testimonials/:id/status
 * @desc    Update testimonial status
 * @access  Private (Admin)
 */
router.patch(
  '/:id/status',
  authenticate,
  updateTestimonialStatusValidation,
  validate,
  asyncHandler(updateTestimonialStatus)
);

/**
 * @route   PATCH /api/v1/admin/testimonials/:id/display-order
 * @desc    Update testimonial display order
 * @access  Private (Admin)
 */
router.patch(
  '/:id/display-order',
  authenticate,
  updateTestimonialDisplayOrderValidation,
  validate,
  asyncHandler(updateTestimonialDisplayOrder)
);

/**
 * @route   DELETE /api/v1/admin/testimonials/:id
 * @desc    Delete testimonial
 * @access  Private (Admin)
 */
router.delete(
  '/:id',
  authenticate,
  testimonialIdValidation,
  validate,
  asyncHandler(deleteTestimonial)
);

export default router;
