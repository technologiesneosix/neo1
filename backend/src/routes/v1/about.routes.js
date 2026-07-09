import { Router } from 'express';
import { asyncHandler, authenticate } from '../../middleware/index.js';
import { getAbout, updateAbout } from '../../controllers/aboutController.js';

const router = Router();

/**
 * @route   GET /api/v1/admin/about
 * @desc    Get about section settings
 * @access  Private (Admin)
 */
router.get('/', authenticate, asyncHandler(getAbout));

/**
 * @route   PUT /api/v1/admin/about
 * @desc    Update about section settings
 * @access  Private (Admin)
 */
router.put('/', authenticate, asyncHandler(updateAbout));

export default router;
