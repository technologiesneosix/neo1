import { Router } from 'express';
import { asyncHandler, authenticate } from '../../middleware/index.js';
import { validate } from '../../middleware/index.js';
import {
  createBlogValidation,
  updateBlogValidation,
  blogIdValidation,
  blogSlugValidation,
  getBlogsValidation,
  updateBlogStatusValidation,
  toggleBlogFeaturedValidation,
} from '../../validations/blogValidation.js';
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  updateBlog,
  toggleBlogFeatured,
  updateBlogStatus,
  deleteBlog,
} from '../../controllers/blogController.js';

const router = Router();

/**
 * @route   POST /api/v1/admin/blogs
 * @desc    Create blog
 * @access  Private (Admin)
 */
router.post(
  '/',
  authenticate,
  createBlogValidation,
  validate,
  asyncHandler(createBlog)
);

/**
 * @route   GET /api/v1/admin/blogs
 * @desc    Get all blogs
 * @access  Private (Admin)
 */
router.get(
  '/',
  authenticate,
  getBlogsValidation,
  validate,
  asyncHandler(getAllBlogs)
);

/**
 * @route   GET /api/v1/admin/blogs/slug/:slug
 * @desc    Get blog by slug
 * @access  Private (Admin)
 */
router.get(
  '/slug/:slug',
  authenticate,
  blogSlugValidation,
  validate,
  asyncHandler(getBlogBySlug)
);

/**
 * @route   GET /api/v1/admin/blogs/:id
 * @desc    Get blog by ID
 * @access  Private (Admin)
 */
router.get(
  '/:id',
  authenticate,
  blogIdValidation,
  validate,
  asyncHandler(getBlogById)
);

/**
 * @route   PUT /api/v1/admin/blogs/:id
 * @desc    Update blog
 * @access  Private (Admin)
 */
router.put(
  '/:id',
  authenticate,
  blogIdValidation,
  updateBlogValidation,
  validate,
  asyncHandler(updateBlog)
);

/**
 * @route   PATCH /api/v1/admin/blogs/:id/toggle-featured
 * @desc    Toggle blog featured status
 * @access  Private (Admin)
 */
router.patch(
  '/:id/toggle-featured',
  authenticate,
  toggleBlogFeaturedValidation,
  validate,
  asyncHandler(toggleBlogFeatured)
);

/**
 * @route   PATCH /api/v1/admin/blogs/:id/status
 * @desc    Update blog published status
 * @access  Private (Admin)
 */
router.patch(
  '/:id/status',
  authenticate,
  updateBlogStatusValidation,
  validate,
  asyncHandler(updateBlogStatus)
);

/**
 * @route   DELETE /api/v1/admin/blogs/:id
 * @desc    Delete blog
 * @access  Private (Admin)
 */
router.delete(
  '/:id',
  authenticate,
  blogIdValidation,
  validate,
  asyncHandler(deleteBlog)
);

export default router;
