import { body, param, query } from 'express-validator';

export const createTeamValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  body('designation')
    .trim()
    .notEmpty()
    .withMessage('Designation is required'),
  body('photo')
    .optional()
    .trim()
    .isString()
    .withMessage('Photo must be a string'),
  body('bio')
    .optional()
    .trim()
    .isString()
    .withMessage('Bio must be a string'),
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  body('experience')
    .optional()
    .trim()
    .isString()
    .withMessage('Experience must be a string'),
  body('socialLinks.linkedin')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('LinkedIn must be a valid URL'),
  body('socialLinks.github')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('GitHub must be a valid URL'),
  body('socialLinks.twitter')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Twitter must be a valid URL'),
  body('displayOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Display order must be a non-negative integer'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be active or inactive'),
];

export const updateTeamValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  body('designation')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Designation cannot be empty'),
  body('photo')
    .optional()
    .trim()
    .isString()
    .withMessage('Photo must be a string'),
  body('bio')
    .optional()
    .trim()
    .isString()
    .withMessage('Bio must be a string'),
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  body('experience')
    .optional()
    .trim()
    .isString()
    .withMessage('Experience must be a string'),
  body('socialLinks.linkedin')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('LinkedIn must be a valid URL'),
  body('socialLinks.github')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('GitHub must be a valid URL'),
  body('socialLinks.twitter')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Twitter must be a valid URL'),
  body('displayOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Display order must be a non-negative integer'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be active or inactive'),
];

export const teamIdValidation = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Team member ID is required')
    .isMongoId()
    .withMessage('Invalid team member ID'),
];

export const getTeamValidation = [
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
  query('search')
    .optional()
    .trim()
    .isString()
    .withMessage('Search must be a string'),
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'displayOrder', 'name'])
    .withMessage('Sort by must be createdAt, displayOrder, or name'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
];

export const updateTeamStatusValidation = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Team member ID is required')
    .isMongoId()
    .withMessage('Invalid team member ID'),
  body('status')
    .trim()
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['active', 'inactive'])
    .withMessage('Status must be active or inactive'),
];

export const updateTeamDisplayOrderValidation = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Team member ID is required')
    .isMongoId()
    .withMessage('Invalid team member ID'),
  body('displayOrder')
    .trim()
    .notEmpty()
    .withMessage('Display order is required')
    .isInt({ min: 0 })
    .withMessage('Display order must be a non-negative integer'),
];
