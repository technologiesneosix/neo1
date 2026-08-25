import { body, param, query } from "express-validator";

export const createCaseStudyValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),
  body("client")
    .trim()
    .notEmpty()
    .withMessage("Client is required"),
  body("industry")
    .trim()
    .notEmpty()
    .withMessage("Industry is required"),
  body("challenge")
    .trim()
    .notEmpty()
    .withMessage("Challenge is required"),
  body("solution")
    .trim()
    .notEmpty()
    .withMessage("Solution is required"),
  body("results")
    .optional()
    .isArray()
    .withMessage("Results must be an array"),
  body("coverImageUrl")
    .optional()
    .trim(),
  body("projectId")
    .optional({ nullable: true, checkFalsy: true })
    .isMongoId()
    .withMessage("Invalid project ID"),
  body("status")
    .optional()
    .isIn(["draft", "published", "archived"])
    .withMessage("Status must be draft, published, or archived"),
];

export const updateCaseStudyValidation = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),
  body("client")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Client cannot be empty"),
  body("industry")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Industry cannot be empty"),
  body("challenge")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Challenge cannot be empty"),
  body("solution")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Solution cannot be empty"),
  body("results")
    .optional()
    .isArray()
    .withMessage("Results must be an array"),
  body("coverImageUrl")
    .optional()
    .trim(),
  body("projectId")
    .optional({ nullable: true, checkFalsy: true })
    .isMongoId()
    .withMessage("Invalid project ID"),
  body("status")
    .optional()
    .isIn(["draft", "published", "archived"])
    .withMessage("Status must be draft, published, or archived"),
];

export const caseStudyIdValidation = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Case Study ID is required")
    .isMongoId()
    .withMessage("Invalid Case Study ID"),
];

export const caseStudySlugValidation = [
  param("slug")
    .trim()
    .notEmpty()
    .withMessage("Case Study slug is required"),
];

export const getCaseStudiesValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("search").optional().trim(),
];
