import { Router } from "express";
import { asyncHandler, authenticate } from "../../middleware/index.js";
import { validate } from "../../middleware/index.js";
import {
  createProjectValidation,
  updateProjectValidation,
  projectIdValidation,
  projectSlugValidation,
  getProjectsValidation,
  updateProjectStatusValidation,
  toggleProjectFeaturedValidation,
} from "../../validations/projectValidation.js";
import {
  createProject,
  getAllProjects,
  getProjectById,
  getProjectBySlug,
  updateProject,
  toggleProjectFeatured,
  updateProjectStatus,
  deleteProject,
} from "../../controllers/projectController.js";

const router = Router();

/**
 * @route   POST /api/v1/admin/projects
 * @desc    Create project
 * @access  Private (Admin)
 */
router.post(
  "/",
  authenticate,
  createProjectValidation,
  validate,
  asyncHandler(createProject),
);

/**
 * @route   GET /api/v1/admin/projects
 * @desc    Get all projects
 * @access  Private (Admin)
 */
router.get(
  "/",
  authenticate,
  getProjectsValidation,
  validate,
  asyncHandler(getAllProjects),
);

/**
 * @route   GET /api/v1/admin/projects/slug/:slug
 * @desc    Get project by slug
 * @access  Private (Admin)
 */
router.get(
  "/slug/:slug",
  authenticate,
  projectSlugValidation,
  validate,
  asyncHandler(getProjectBySlug),
);

/**
 * @route   GET /api/v1/admin/projects/:id
 * @desc    Get project by ID
 * @access  Private (Admin)
 */
router.get(
  "/:id",
  authenticate,
  projectIdValidation,
  validate,
  asyncHandler(getProjectById),
);

/**
 * @route   PUT /api/v1/admin/projects/:id
 * @desc    Update project
 * @access  Private (Admin)
 */
router.put(
  "/:id",
  authenticate,
  projectIdValidation,
  updateProjectValidation,
  validate,
  asyncHandler(updateProject),
);

/**
 * @route   PATCH /api/v1/admin/projects/:id/toggle-featured
 * @desc    Toggle project featured status
 * @access  Private (Admin)
 */
router.patch(
  "/:id/toggle-featured",
  authenticate,
  toggleProjectFeaturedValidation,
  validate,
  asyncHandler(toggleProjectFeatured),
);

/**
 * @route   PATCH /api/v1/admin/projects/:id/status
 * @desc    Update project status
 * @access  Private (Admin)
 */
router.patch(
  "/:id/status",
  authenticate,
  updateProjectStatusValidation,
  validate,
  asyncHandler(updateProjectStatus),
);

/**
 * @route   DELETE /api/v1/admin/projects/:id
 * @desc    Delete project
 * @access  Private (Admin)
 */
router.delete(
  "/:id",
  authenticate,
  projectIdValidation,
  validate,
  asyncHandler(deleteProject),
);

export default router;
