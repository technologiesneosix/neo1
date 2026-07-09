import { Router } from 'express';
import { asyncHandler } from '../../middleware/index.js';

const router = Router();

/**
 * @route   GET /api/v1/admin/dashboard
 * @desc    Get admin dashboard data
 * @access  Private (Admin)
 */
router.get(
  '/dashboard',
  asyncHandler(async (_req, res) => {
    res.status(200).json({
      success: true,
      message: 'Admin dashboard endpoint',
    });
  })
);

/**
 * @route   GET /api/v1/admin/users
 * @desc    Get all users (admin view)
 * @access  Private (Admin)
 */
router.get(
  '/users',
  asyncHandler(async (_req, res) => {
    res.status(200).json({
      success: true,
      message: 'Admin users management endpoint',
    });
  })
);

/**
 * @route   GET /api/v1/admin/content
 * @desc    Get content management data
 * @access  Private (Admin)
 */
router.get(
  '/content',
  asyncHandler(async (_req, res) => {
    res.status(200).json({
      success: true,
      message: 'Content management endpoint',
    });
  })
);

/**
 * @route   GET /api/v1/admin/settings
 * @desc    Get admin settings
 * @access  Private (Admin)
 */
router.get(
  '/settings',
  asyncHandler(async (_req, res) => {
    res.status(200).json({
      success: true,
      message: 'Admin settings endpoint',
    });
  })
);

export default router;
