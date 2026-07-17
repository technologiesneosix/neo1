import { body, param, query } from "express-validator";

export const createHeroValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),
  body("subtitle")
    .trim()
    .notEmpty()
    .withMessage("Subtitle is required")
    .isLength({ max: 300 })
    .withMessage("Subtitle cannot exceed 300 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  body("primaryButtonText")
    .optional()
    .trim()
    .isString()
    .withMessage("Primary button text must be a string"),
  body("primaryButtonLink")
    .optional()
    .trim()
    .isString()
    .withMessage("Primary button link must be a string"),
  body("secondaryButtonText")
    .optional()
    .trim()
    .isString()
    .withMessage("Secondary button text must be a string"),
  body("secondaryButtonLink")
    .optional()
    .trim()
    .isString()
    .withMessage("Secondary button link must be a string"),
  body("backgroundImage")
    .optional()
    .trim()
    .isString()
    .withMessage("Background image must be a string"),
  body("heroImage")
    .optional()
    .trim()
    .isString()
    .withMessage("Hero image must be a string"),
  body("statistics")
    .optional()
    .isArray()
    .withMessage("Statistics must be an array"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

export const updateHeroValidation = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),
  body("subtitle")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Subtitle cannot be empty")
    .isLength({ max: 300 })
    .withMessage("Subtitle cannot exceed 300 characters"),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty")
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  body("primaryButtonText")
    .optional()
    .trim()
    .isString()
    .withMessage("Primary button text must be a string"),
  body("primaryButtonLink")
    .optional()
    .trim()
    .isString()
    .withMessage("Primary button link must be a string"),
  body("secondaryButtonText")
    .optional()
    .trim()
    .isString()
    .withMessage("Secondary button text must be a string"),
  body("secondaryButtonLink")
    .optional()
    .trim()
    .isString()
    .withMessage("Secondary button link must be a string"),
  body("backgroundImage")
    .optional()
    .trim()
    .isString()
    .withMessage("Background image must be a string"),
  body("heroImage")
    .optional()
    .trim()
    .isString()
    .withMessage("Hero image must be a string"),
  body("statistics")
    .optional()
    .isArray()
    .withMessage("Statistics must be an array"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

export const heroIdValidation = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Hero ID is required")
    .isMongoId()
    .withMessage("Invalid hero ID"),
];

export const getHeroesValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("status")
    .optional()
    .isIn(["true", "false"])
    .withMessage("Status must be true or false"),
];
