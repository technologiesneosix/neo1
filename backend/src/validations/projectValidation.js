import { body, param, query } from 'express-validator';

export const createProjectValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('client')
    .trim()
    .notEmpty()
    .withMessage('Client is required'),
  body('shortDescription')
    .trim()
    .notEmpty()
    .withMessage('Short description is required')
    .isLength({ max: 300 })
    .withMessage('Short description cannot exceed 300 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),
  body('industry')
    .optional()
    .isMongoId()
    .withMessage('Industry must be a valid MongoDB ID'),
  body('services')
    .optional()
    .isArray()
    .withMessage('Services must be an array'),
  body('technologies')
    .optional()
    .isArray()
    .withMessage('Technologies must be an array'),
  body('problem')
    .optional()
    .trim()
    .isString()
    .withMessage('Problem must be a string'),
  body('solution')
    .optional()
    .trim()
    .isString()
    .withMessage('Solution must be a string'),
  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array'),
  body('gallery')
    .optional()
    .isArray()
    .withMessage('Gallery must be an array'),
  body('thumbnail')
    .optional()
    .trim()
    .isString()
    .withMessage('Thumbnail must be a string'),
  body('banner')
    .optional()
    .trim()
    .isString()
    .withMessage('Banner must be a string'),
  body('liveUrl')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Live URL must be a valid URL'),
  body('githubUrl')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('GitHub URL must be a valid URL'),
  body('duration')
    .optional()
    .trim()
    .isString()
    .withMessage('Duration must be a string'),
  body('teamSize')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Team size must be a non-negative integer'),
  body('completionDate')
    .optional()
    .isISO8601()
    .withMessage('Completion date must be a valid date'),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Status must be draft, published, or archived'),
];

export const updateProjectValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('client')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Client cannot be empty'),
  body('shortDescription')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Short description cannot be empty')
    .isLength({ max: 300 })
    .withMessage('Short description cannot exceed 300 characters'),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Description cannot be empty'),
  body('industry')
    .optional()
    .isMongoId()
    .withMessage('Industry must be a valid MongoDB ID'),
  body('services')
    .optional()
    .isArray()
    .withMessage('Services must be an array'),
  body('technologies')
    .optional()
    .isArray()
    .withMessage('Technologies must be an array'),
  body('problem')
    .optional()
    .trim()
    .isString()
    .withMessage('Problem must be a string'),
  body('solution')
    .optional()
    .trim()
    .isString()
    .withMessage('Solution must be a string'),
  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array'),
  body('gallery')
    .optional()
    .isArray()
    .withMessage('Gallery must be an array'),
  body('thumbnail')
    .optional()
    .trim()
    .isString()
    .withMessage('Thumbnail must be a string'),
  body('banner')
    .optional()
    .trim()
    .isString()
    .withMessage('Banner must be a string'),
  body('liveUrl')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Live URL must be a valid URL'),
  body('githubUrl')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('GitHub URL must be a valid URL'),
  body('duration')
    .optional()
    .trim()
    .isString()
    .withMessage('Duration must be a string'),
  body('teamSize')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Team size must be a non-negative integer'),
  body('completionDate')
    .optional()
    .isISO8601()
    .withMessage('Completion date must be a valid date'),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Status must be draft, published, or archived'),
];

export const projectIdValidation = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Project ID is required')
    .isMongoId()
    .withMessage('Invalid project ID'),
];

export const projectSlugValidation = [
  param('slug')
    .trim()
    .notEmpty()
    .withMessage('Slug is required')
    .isSlug()
    .withMessage('Invalid slug format'),
];

export const getProjectsValidation = [
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
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Status must be draft, published, or archived'),
  query('featured')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('Featured must be true or false'),
  query('industry')
    .optional()
    .isMongoId()
    .withMessage('Industry must be a valid MongoDB ID'),
  query('technology')
    .optional()
    .isMongoId()
    .withMessage('Technology must be a valid MongoDB ID'),
  query('service')
    .optional()
    .isMongoId()
    .withMessage('Service must be a valid MongoDB ID'),
  query('search')
    .optional()
    .trim()
    .isString()
    .withMessage('Search must be a string'),
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'completionDate', 'title', 'featured'])
    .withMessage('Sort by must be createdAt, completionDate, title, or featured'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
];

export const updateProjectStatusValidation = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Project ID is required')
    .isMongoId()
    .withMessage('Invalid project ID'),
  body('status')
    .trim()
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Status must be draft, published, or archived'),
];

export const toggleProjectFeaturedValidation = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Project ID is required')
    .isMongoId()
    .withMessage('Invalid project ID'),
];
