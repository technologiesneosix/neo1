import { Router } from "express";
import { asyncHandler, authenticate, validate } from "../../middleware/index.js";
import {
  createCaseStudyValidation,
  updateCaseStudyValidation,
  caseStudyIdValidation,
  caseStudySlugValidation,
  getCaseStudiesValidation,
} from "../../validations/caseStudyValidation.js";
import {
  createCaseStudy,
  getAllCaseStudies,
  getCaseStudyById,
  getCaseStudyBySlug,
  updateCaseStudy,
  deleteCaseStudy,
} from "../../controllers/caseStudyController.js";

const router = Router();

/**
 * @route   POST /api/v1/admin/case-studies
 * @desc    Create case study
 * @access  Private (Admin)
 */
router.post(
  "/",
  authenticate,
  createCaseStudyValidation,
  validate,
  asyncHandler(createCaseStudy),
);

/**
 * @route   GET /api/v1/admin/case-studies
 * @desc    Get all case studies
 * @access  Private (Admin)
 */
router.get(
  "/",
  authenticate,
  getCaseStudiesValidation,
  validate,
  asyncHandler(getAllCaseStudies),
);

/**
 * @route   GET /api/v1/admin/case-studies/slug/:slug
 * @desc    Get case study by slug
 * @access  Private (Admin)
 */
router.get(
  "/slug/:slug",
  authenticate,
  caseStudySlugValidation,
  validate,
  asyncHandler(getCaseStudyBySlug),
);

/**
 * @route   GET /api/v1/admin/case-studies/:id
 * @desc    Get case study by ID
 * @access  Private (Admin)
 */
router.get(
  "/:id",
  authenticate,
  caseStudyIdValidation,
  validate,
  asyncHandler(getCaseStudyById),
);

/**
 * @route   PUT /api/v1/admin/case-studies/:id
 * @desc    Update case study
 * @access  Private (Admin)
 */
router.put(
  "/:id",
  authenticate,
  caseStudyIdValidation,
  updateCaseStudyValidation,
  validate,
  asyncHandler(updateCaseStudy),
);

/**
 * @route   DELETE /api/v1/admin/case-studies/:id
 * @desc    Delete case study
 * @access  Private (Admin)
 */
router.delete(
  "/:id",
  authenticate,
  caseStudyIdValidation,
  validate,
  asyncHandler(deleteCaseStudy),
);

export default router;
