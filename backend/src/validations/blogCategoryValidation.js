import { body, param, query } from 'express-validator';

export const createBlogCategoryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .isString()
    .withMessage('Description must be a string'),
];

export const updateBlogCategoryValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .isString()
    .withMessage('Description must be a string'),
];

export const blogCategoryIdValidation = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Blog category ID is required')
    .isMongoId()
    .withMessage('Invalid blog category ID'),
];

export const blogCategorySlugValidation = [
  param('slug')
    .trim()
    .notEmpty()
    .withMessage('Slug is required')
    .isSlug()
    .withMessage('Invalid slug format'),
];

export const getBlogCategoriesValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('search')
    .optional()
    .trim()
    .isString()
    .withMessage('Search must be a string'),
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'name'])
    .withMessage('Sort by must be createdAt or name'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
];
