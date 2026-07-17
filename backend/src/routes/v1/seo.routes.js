import { Router } from "express";
import { asyncHandler, authenticate } from "../../middleware/index.js";
import { validate } from "../../middleware/index.js";
import { updateSEOValidation } from "../../validations/seoValidation.js";
import { getSEO, updateSEO } from "../../controllers/seoController.js";

const router = Router();

/**
 * @route   GET /api/v1/admin/seo
 * @desc    Get SEO settings
 * @access  Private (Admin)
 */
router.get("/", authenticate, asyncHandler(getSEO));

/**
 * @route   PUT /api/v1/admin/seo
 * @desc    Update SEO settings
 * @access  Private (Admin)
 */
router.put(
  "/",
  authenticate,
  updateSEOValidation,
  validate,
  asyncHandler(updateSEO),
);

export default router;
