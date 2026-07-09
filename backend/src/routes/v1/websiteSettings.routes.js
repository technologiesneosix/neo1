import { Router } from 'express';
import { asyncHandler, authenticate } from '../../middleware/index.js';
import { validate } from '../../middleware/index.js';
import { updateWebsiteSettingsValidation } from '../../validations/websiteSettingsValidation.js';
import {
  getWebsiteSettings,
  updateWebsiteSettings,
} from '../../controllers/websiteSettingsController.js';

const router = Router();

/**
 * @route   GET /api/v1/admin/website-settings
 * @desc    Get website settings
 * @access  Private (Admin)
 */
router.get(
  '/',
  authenticate,
  asyncHandler(getWebsiteSettings)
);

/**
 * @route   PUT /api/v1/admin/website-settings
 * @desc    Update website settings
 * @access  Private (Admin)
 */
router.put(
  '/',
  authenticate,
  updateWebsiteSettingsValidation,
  validate,
  asyncHandler(updateWebsiteSettings)
);

export default router;
