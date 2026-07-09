import { body, param } from 'express-validator';

export const createJobApplicationValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .toLowerCase(),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone is required')
    .isLength({ min: 7, max: 20 })
    .withMessage('Phone number must be between 7 and 20 characters'),
  body('coverLetter')
    .optional()
    .trim()
    .isLength({ min: 30, max: 5000 })
    .withMessage('Cover letter must be between 30 and 5000 characters'),
];

export const careerSlugValidation = [
  param('slug')
    .trim()
    .notEmpty()
    .withMessage('Career slug is required')
    .isString()
    .withMessage('Career slug must be a string'),
];
