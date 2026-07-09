import { Router } from 'express';
import { asyncHandler, authenticate } from '../../middleware/index.js';
import { validate } from '../../middleware/index.js';
import {
  createIndustryValidation,
  updateIndustryValidation,
  industryIdValidation,
  industrySlugValidation,
  getIndustriesValidation,
  updateIndustryStatusValidation,
} from '../../validations/industryValidation.js';
import {
  createIndustry,
  getAllIndustries,
  getIndustryById,
  getIndustryBySlug,
  updateIndustry,
  updateIndustryStatus,
  deleteIndustry,
} from '../../controllers/industryController.js';

const router = Router();

/**
 * @route   POST /api/v1/admin/industries
 * @desc    Create industry
 * @access  Private (Admin)
 */
router.post(
  '/',
  authenticate,
  createIndustryValidation,
  validate,
  asyncHandler(createIndustry)
);

/**
 * @route   GET /api/v1/admin/industries
 * @desc    Get all industries
 * @access  Private (Admin)
 */
router.get(
  '/',
  authenticate,
  getIndustriesValidation,
  validate,
  asyncHandler(getAllIndustries)
);

/**
 * @route   GET /api/v1/admin/industries/slug/:slug
 * @desc    Get industry by slug
 * @access  Private (Admin)
 */
router.get(
  '/slug/:slug',
  authenticate,
  industrySlugValidation,
  validate,
  asyncHandler(getIndustryBySlug)
);

/**
 * @route   GET /api/v1/admin/industries/:id
 * @desc    Get industry by ID
 * @access  Private (Admin)
 */
router.get(
  '/:id',
  authenticate,
  industryIdValidation,
  validate,
  asyncHandler(getIndustryById)
);

/**
 * @route   PUT /api/v1/admin/industries/:id
 * @desc    Update industry
 * @access  Private (Admin)
 */
router.put(
  '/:id',
  authenticate,
  industryIdValidation,
  updateIndustryValidation,
  validate,
  asyncHandler(updateIndustry)
);

/**
 * @route   PATCH /api/v1/admin/industries/:id/status
 * @desc    Update industry status
 * @access  Private (Admin)
 */
router.patch(
  '/:id/status',
  authenticate,
  updateIndustryStatusValidation,
  validate,
  asyncHandler(updateIndustryStatus)
);

/**
 * @route   DELETE /api/v1/admin/industries/:id
 * @desc    Delete industry
 * @access  Private (Admin)
 */
router.delete(
  '/:id',
  authenticate,
  industryIdValidation,
  validate,
  asyncHandler(deleteIndustry)
);

export default router;
