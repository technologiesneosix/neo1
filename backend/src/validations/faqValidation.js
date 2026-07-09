import { body, param, query } from 'express-validator';

export const createFAQValidation = [
  body('question')
    .trim()
    .notEmpty()
    .withMessage('Question is required'),
  body('answer')
    .trim()
    .notEmpty()
    .withMessage('Answer is required'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['general', 'services', 'pricing', 'technical', 'other'])
    .withMessage('Invalid category'),
  body('displayOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Display order must be a non-negative integer'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be active or inactive'),
];

export const updateFAQValidation = [
  body('question')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Question cannot be empty'),
  body('answer')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Answer cannot be empty'),
  body('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category cannot be empty')
    .isIn(['general', 'services', 'pricing', 'technical', 'other'])
    .withMessage('Invalid category'),
  body('displayOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Display order must be a non-negative integer'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be active or inactive'),
];

export const faqIdValidation = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('FAQ ID is required')
    .isMongoId()
    .withMessage('Invalid FAQ ID'),
];

export const getFAQsValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be active or inactive'),
  query('category')
    .optional()
    .isIn(['general', 'services', 'pricing', 'technical', 'other'])
    .withMessage('Invalid category'),
  query('search')
    .optional()
    .trim()
    .isString()
    .withMessage('Search must be a string'),
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'displayOrder', 'question'])
    .withMessage('Sort by must be createdAt, displayOrder, or question'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
];

export const updateFAQStatusValidation = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('FAQ ID is required')
    .isMongoId()
    .withMessage('Invalid FAQ ID'),
  body('status')
    .trim()
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['active', 'inactive'])
    .withMessage('Status must be active or inactive'),
];

export const updateFAQDisplayOrderValidation = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('FAQ ID is required')
    .isMongoId()
    .withMessage('Invalid FAQ ID'),
  body('displayOrder')
    .trim()
    .notEmpty()
    .withMessage('Display order is required')
    .isInt({ min: 0 })
    .withMessage('Display order must be a non-negative integer'),
];
