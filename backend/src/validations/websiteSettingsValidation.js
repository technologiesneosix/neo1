import { body } from 'express-validator';

export const updateWebsiteSettingsValidation = [
  body('siteName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Site name cannot be empty'),
  body('tagline')
    .optional()
    .trim()
    .isString()
    .withMessage('Tagline must be a string'),
  body('logo')
    .optional({ checkFalsy: true })
    .trim()
    .isString()
    .withMessage('Logo must be a string'),
  body('favicon')
    .optional({ checkFalsy: true })
    .trim()
    .isString()
    .withMessage('Favicon must be a string'),
  body('contactEmail')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Contact email cannot be empty')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .optional()
    .trim()
    .isString()
    .withMessage('Phone must be a string'),
  body('address')
    .optional()
    .trim()
    .isString()
    .withMessage('Address must be a string'),
  body('socialLinks.facebook')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Facebook must be a valid URL'),
  body('socialLinks.twitter')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Twitter must be a valid URL'),
  body('socialLinks.linkedin')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('LinkedIn must be a valid URL'),
  body('socialLinks.instagram')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Instagram must be a valid URL'),
  body('socialLinks.github')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('GitHub must be a valid URL'),
  body('googleMap')
    .optional()
    .trim()
    .isString()
    .withMessage('Google map must be a string'),
  body('footerText')
    .optional()
    .trim()
    .isString()
    .withMessage('Footer text must be a string'),
  body('copyright')
    .optional()
    .trim()
    .isString()
    .withMessage('Copyright must be a string'),
];
