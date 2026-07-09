import { Router } from 'express';
import { asyncHandler, authenticate } from '../../middleware/index.js';
import { validate } from '../../middleware/index.js';
import {
  createCareerValidation,
  updateCareerValidation,
  careerIdValidation,
  getCareersValidation,
  updateCareerStatusValidation,
} from '../../validations/careerValidation.js';
import {
  createCareer,
  getAllCareers,
  getCareerById,
  updateCareer,
  updateCareerStatus,
  deleteCareer,
} from '../../controllers/careerController.js';

const router = Router();

/**
 * @route   POST /api/v1/admin/careers
 * @desc    Create career
 * @access  Private (Admin)
 */
router.post(
  '/',
  authenticate,
  createCareerValidation,
  validate,
  asyncHandler(createCareer)
);

/**
 * @route   GET /api/v1/admin/careers
 * @desc    Get all careers
 * @access  Private (Admin)
 */
router.get(
  '/',
  authenticate,
  getCareersValidation,
  validate,
  asyncHandler(getAllCareers)
);

/**
 * @route   GET /api/v1/admin/careers/:id
 * @desc    Get career by ID
 * @access  Private (Admin)
 */
router.get(
  '/:id',
  authenticate,
  careerIdValidation,
  validate,
  asyncHandler(getCareerById)
);

/**
 * @route   PUT /api/v1/admin/careers/:id
 * @desc    Update career
 * @access  Private (Admin)
 */
router.put(
  '/:id',
  authenticate,
  careerIdValidation,
  updateCareerValidation,
  validate,
  asyncHandler(updateCareer)
);

/**
 * @route   PATCH /api/v1/admin/careers/:id/status
 * @desc    Update career status
 * @access  Private (Admin)
 */
router.patch(
  '/:id/status',
  authenticate,
  updateCareerStatusValidation,
  validate,
  asyncHandler(updateCareerStatus)
);

/**
 * @route   DELETE /api/v1/admin/careers/:id
 * @desc    Delete career
 * @access  Private (Admin)
 */
router.delete(
  '/:id',
  authenticate,
  careerIdValidation,
  validate,
  asyncHandler(deleteCareer)
);

export default router;
