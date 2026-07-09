import { body } from 'express-validator';

export const updateSEOValidation = [
  body('metaTitle')
    .optional()
    .trim()
    .isString()
    .withMessage('Meta title must be a string'),
  body('metaDescription')
    .optional()
    .trim()
    .isString()
    .withMessage('Meta description must be a string'),
  body('keywords')
    .optional()
    .isArray()
    .withMessage('Keywords must be an array'),
  body('canonical')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Canonical must be a valid URL'),
  body('ogImage')
    .optional()
    .trim()
    .isString()
    .withMessage('OG image must be a string'),
  body('robots')
    .optional()
    .trim()
    .isString()
    .withMessage('Robots must be a string'),
  body('schema')
    .optional()
    .isObject()
    .withMessage('Schema must be an object'),
];
