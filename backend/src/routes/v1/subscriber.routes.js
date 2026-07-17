import { Router } from "express";
import { asyncHandler, authenticate } from "../../middleware/index.js";
import {
  getAllNewsletterSubscribers,
  getNewsletterSubscriberById,
  updateNewsletterSubscriber,
  deleteNewsletterSubscriber,
} from "../../controllers/newsletterController.js";

const router = Router();

/**
 * @route   GET /api/v1/admin/subscribers
 * @desc    Get all newsletter subscribers
 * @access  Private (Admin)
 */
router.get("/", authenticate, asyncHandler(getAllNewsletterSubscribers));

/**
 * @route   GET /api/v1/admin/subscribers/:id
 * @desc    Get newsletter subscriber by ID
 * @access  Private (Admin)
 */
router.get("/:id", authenticate, asyncHandler(getNewsletterSubscriberById));

/**
 * @route   PUT /api/v1/admin/subscribers/:id
 * @desc    Update subscriber status
 * @access  Private (Admin)
 */
router.put("/:id", authenticate, asyncHandler(updateNewsletterSubscriber));

/**
 * @route   DELETE /api/v1/admin/subscribers/:id
 * @desc    Delete subscriber
 * @access  Private (Admin)
 */
router.delete("/:id", authenticate, asyncHandler(deleteNewsletterSubscriber));

export default router;
