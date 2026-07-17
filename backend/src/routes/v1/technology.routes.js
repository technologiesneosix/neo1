import { Router } from "express";
import { asyncHandler, authenticate } from "../../middleware/index.js";
import { validate } from "../../middleware/index.js";
import {
  createTechnologyValidation,
  updateTechnologyValidation,
  technologyIdValidation,
  technologySlugValidation,
  getTechnologiesValidation,
  updateTechnologyStatusValidation,
  updateDisplayOrderValidation,
} from "../../validations/technologyValidation.js";
import {
  createTechnology,
  getAllTechnologies,
  getTechnologyById,
  getTechnologyBySlug,
  updateTechnology,
  updateTechnologyStatus,
  updateTechnologyDisplayOrder,
  deleteTechnology,
} from "../../controllers/technologyController.js";

const router = Router();

/**
 * @route   POST /api/v1/admin/technologies
 * @desc    Create technology
 * @access  Private (Admin)
 */
router.post(
  "/",
  authenticate,
  createTechnologyValidation,
  validate,
  asyncHandler(createTechnology),
);

/**
 * @route   GET /api/v1/admin/technologies
 * @desc    Get all technologies
 * @access  Private (Admin)
 */
router.get(
  "/",
  authenticate,
  getTechnologiesValidation,
  validate,
  asyncHandler(getAllTechnologies),
);

/**
 * @route   GET /api/v1/admin/technologies/slug/:slug
 * @desc    Get technology by slug
 * @access  Private (Admin)
 */
router.get(
  "/slug/:slug",
  authenticate,
  technologySlugValidation,
  validate,
  asyncHandler(getTechnologyBySlug),
);

/**
 * @route   GET /api/v1/admin/technologies/:id
 * @desc    Get technology by ID
 * @access  Private (Admin)
 */
router.get(
  "/:id",
  authenticate,
  technologyIdValidation,
  validate,
  asyncHandler(getTechnologyById),
);

/**
 * @route   PUT /api/v1/admin/technologies/:id
 * @desc    Update technology
 * @access  Private (Admin)
 */
router.put(
  "/:id",
  authenticate,
  technologyIdValidation,
  updateTechnologyValidation,
  validate,
  asyncHandler(updateTechnology),
);

/**
 * @route   PATCH /api/v1/admin/technologies/:id/status
 * @desc    Update technology status
 * @access  Private (Admin)
 */
router.patch(
  "/:id/status",
  authenticate,
  updateTechnologyStatusValidation,
  validate,
  asyncHandler(updateTechnologyStatus),
);

/**
 * @route   PATCH /api/v1/admin/technologies/:id/display-order
 * @desc    Update technology display order
 * @access  Private (Admin)
 */
router.patch(
  "/:id/display-order",
  authenticate,
  updateDisplayOrderValidation,
  validate,
  asyncHandler(updateTechnologyDisplayOrder),
);

/**
 * @route   DELETE /api/v1/admin/technologies/:id
 * @desc    Delete technology
 * @access  Private (Admin)
 */
router.delete(
  "/:id",
  authenticate,
  technologyIdValidation,
  validate,
  asyncHandler(deleteTechnology),
);

export default router;
