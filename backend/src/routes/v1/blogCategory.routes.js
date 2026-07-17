import { Router } from "express";
import { asyncHandler, authenticate } from "../../middleware/index.js";
import { validate } from "../../middleware/index.js";
import {
  createBlogCategoryValidation,
  updateBlogCategoryValidation,
  blogCategoryIdValidation,
  blogCategorySlugValidation,
  getBlogCategoriesValidation,
} from "../../validations/blogCategoryValidation.js";
import {
  createBlogCategory,
  getAllBlogCategories,
  getBlogCategoryById,
  getBlogCategoryBySlug,
  updateBlogCategory,
  deleteBlogCategory,
} from "../../controllers/blogCategoryController.js";

const router = Router();

/**
 * @route   POST /api/v1/admin/blog-categories
 * @desc    Create blog category
 * @access  Private (Admin)
 */
router.post(
  "/",
  authenticate,
  createBlogCategoryValidation,
  validate,
  asyncHandler(createBlogCategory),
);

/**
 * @route   GET /api/v1/admin/blog-categories
 * @desc    Get all blog categories
 * @access  Private (Admin)
 */
router.get(
  "/",
  authenticate,
  getBlogCategoriesValidation,
  validate,
  asyncHandler(getAllBlogCategories),
);

/**
 * @route   GET /api/v1/admin/blog-categories/slug/:slug
 * @desc    Get blog category by slug
 * @access  Private (Admin)
 */
router.get(
  "/slug/:slug",
  authenticate,
  blogCategorySlugValidation,
  validate,
  asyncHandler(getBlogCategoryBySlug),
);

/**
 * @route   GET /api/v1/admin/blog-categories/:id
 * @desc    Get blog category by ID
 * @access  Private (Admin)
 */
router.get(
  "/:id",
  authenticate,
  blogCategoryIdValidation,
  validate,
  asyncHandler(getBlogCategoryById),
);

/**
 * @route   PUT /api/v1/admin/blog-categories/:id
 * @desc    Update blog category
 * @access  Private (Admin)
 */
router.put(
  "/:id",
  authenticate,
  blogCategoryIdValidation,
  updateBlogCategoryValidation,
  validate,
  asyncHandler(updateBlogCategory),
);

/**
 * @route   DELETE /api/v1/admin/blog-categories/:id
 * @desc    Delete blog category
 * @access  Private (Admin)
 */
router.delete(
  "/:id",
  authenticate,
  blogCategoryIdValidation,
  validate,
  asyncHandler(deleteBlogCategory),
);

export default router;
