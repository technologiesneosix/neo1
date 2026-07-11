import { body, param, query } from 'express-validator';

export const createPricingPlanValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
  body('period')
    .optional()
    .trim()
    .isString()
    .withMessage('Period must be a string'),
  body('description')
    .optional()
    .trim()
    .isString()
    .withMessage('Description must be a string'),
  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array of strings'),
  body('highlighted')
    .optional()
    .isBoolean()
    .withMessage('Highlighted must be a boolean'),
  body('ctaLabel')
    .optional()
    .trim()
    .isString()
    .withMessage('CTA label must be a string'),
  body('displayOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Display order must be a non-negative integer'),
];

export const updatePricingPlanValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
  body('period')
    .optional()
    .trim()
    .isString()
    .withMessage('Period must be a string'),
  body('description')
    .optional()
    .trim()
    .isString()
    .withMessage('Description must be a string'),
  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array of strings'),
  body('highlighted')
    .optional()
    .isBoolean()
    .withMessage('Highlighted must be a boolean'),
  body('ctaLabel')
    .optional()
    .trim()
    .isString()
    .withMessage('CTA label must be a string'),
  body('displayOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Display order must be a non-negative integer'),
];

export const pricingPlanIdValidation = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Pricing Plan ID is required')
    .isMongoId()
    .withMessage('Invalid Pricing Plan ID'),
];

export const getPricingPlansValidation = [
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
    .isIn(['createdAt', 'displayOrder', 'name', 'price'])
    .withMessage('Sort by must be createdAt, displayOrder, name, or price'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
];
