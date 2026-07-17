import { Router } from "express";
import { asyncHandler, authenticate } from "../../middleware/index.js";
import { validate } from "../../middleware/index.js";
import {
  createFAQValidation,
  updateFAQValidation,
  faqIdValidation,
  getFAQsValidation,
  updateFAQStatusValidation,
  updateFAQDisplayOrderValidation,
} from "../../validations/faqValidation.js";
import {
  createFAQ,
  getAllFAQs,
  getFAQById,
  updateFAQ,
  updateFAQStatus,
  updateFAQDisplayOrder,
  deleteFAQ,
} from "../../controllers/faqController.js";

const router = Router();

/**
 * @route   POST /api/v1/admin/faqs
 * @desc    Create FAQ
 * @access  Private (Admin)
 */
router.post(
  "/",
  authenticate,
  createFAQValidation,
  validate,
  asyncHandler(createFAQ),
);

/**
 * @route   GET /api/v1/admin/faqs
 * @desc    Get all FAQs
 * @access  Private (Admin)
 */
router.get(
  "/",
  authenticate,
  getFAQsValidation,
  validate,
  asyncHandler(getAllFAQs),
);

/**
 * @route   GET /api/v1/admin/faqs/:id
 * @desc    Get FAQ by ID
 * @access  Private (Admin)
 */
router.get(
  "/:id",
  authenticate,
  faqIdValidation,
  validate,
  asyncHandler(getFAQById),
);

/**
 * @route   PUT /api/v1/admin/faqs/:id
 * @desc    Update FAQ
 * @access  Private (Admin)
 */
router.put(
  "/:id",
  authenticate,
  faqIdValidation,
  updateFAQValidation,
  validate,
  asyncHandler(updateFAQ),
);

/**
 * @route   PATCH /api/v1/admin/faqs/:id/status
 * @desc    Update FAQ status
 * @access  Private (Admin)
 */
router.patch(
  "/:id/status",
  authenticate,
  updateFAQStatusValidation,
  validate,
  asyncHandler(updateFAQStatus),
);

/**
 * @route   PATCH /api/v1/admin/faqs/:id/display-order
 * @desc    Update FAQ display order
 * @access  Private (Admin)
 */
router.patch(
  "/:id/display-order",
  authenticate,
  updateFAQDisplayOrderValidation,
  validate,
  asyncHandler(updateFAQDisplayOrder),
);

/**
 * @route   DELETE /api/v1/admin/faqs/:id
 * @desc    Delete FAQ
 * @access  Private (Admin)
 */
router.delete(
  "/:id",
  authenticate,
  faqIdValidation,
  validate,
  asyncHandler(deleteFAQ),
);

export default router;
