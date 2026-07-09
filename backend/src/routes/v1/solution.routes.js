import { Router } from 'express';
import { asyncHandler, authenticate } from '../../middleware/index.js';
import { validate } from '../../middleware/index.js';
import {
  createSolutionValidation,
  updateSolutionValidation,
  solutionIdValidation,
  solutionSlugValidation,
  getSolutionsValidation,
  updateSolutionStatusValidation,
} from '../../validations/solutionValidation.js';
import {
  createSolution,
  getAllSolutions,
  getSolutionById,
  getSolutionBySlug,
  updateSolution,
  updateSolutionStatus,
  deleteSolution,
} from '../../controllers/solutionController.js';

const router = Router();

/**
 * @route   POST /api/v1/admin/solutions
 * @desc    Create solution
 * @access  Private (Admin)
 */
router.post(
  '/',
  authenticate,
  createSolutionValidation,
  validate,
  asyncHandler(createSolution)
);

/**
 * @route   GET /api/v1/admin/solutions
 * @desc    Get all solutions
 * @access  Private (Admin)
 */
router.get(
  '/',
  authenticate,
  getSolutionsValidation,
  validate,
  asyncHandler(getAllSolutions)
);

/**
 * @route   GET /api/v1/admin/solutions/slug/:slug
 * @desc    Get solution by slug
 * @access  Private (Admin)
 */
router.get(
  '/slug/:slug',
  authenticate,
  solutionSlugValidation,
  validate,
  asyncHandler(getSolutionBySlug)
);

/**
 * @route   GET /api/v1/admin/solutions/:id
 * @desc    Get solution by ID
 * @access  Private (Admin)
 */
router.get(
  '/:id',
  authenticate,
  solutionIdValidation,
  validate,
  asyncHandler(getSolutionById)
);

/**
 * @route   PUT /api/v1/admin/solutions/:id
 * @desc    Update solution
 * @access  Private (Admin)
 */
router.put(
  '/:id',
  authenticate,
  solutionIdValidation,
  updateSolutionValidation,
  validate,
  asyncHandler(updateSolution)
);

/**
 * @route   PATCH /api/v1/admin/solutions/:id/status
 * @desc    Update solution status
 * @access  Private (Admin)
 */
router.patch(
  '/:id/status',
  authenticate,
  updateSolutionStatusValidation,
  validate,
  asyncHandler(updateSolutionStatus)
);

/**
 * @route   DELETE /api/v1/admin/solutions/:id
 * @desc    Delete solution
 * @access  Private (Admin)
 */
router.delete(
  '/:id',
  authenticate,
  solutionIdValidation,
  validate,
  asyncHandler(deleteSolution)
);

export default router;
