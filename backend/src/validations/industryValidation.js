import { body, param, query } from "express-validator";

export const createIndustryValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("banner")
    .optional()
    .trim()
    .isString()
    .withMessage("Banner must be a string"),
  body("icon")
    .optional()
    .trim()
    .isString()
    .withMessage("Icon must be a string"),
  body("services")
    .optional()
    .isArray()
    .withMessage("Services must be an array"),
  body("projects")
    .optional()
    .isArray()
    .withMessage("Projects must be an array"),
  body("seo.metaTitle")
    .optional()
    .trim()
    .isString()
    .withMessage("Meta title must be a string"),
  body("seo.metaDescription")
    .optional()
    .trim()
    .isString()
    .withMessage("Meta description must be a string"),
  body("seo.keywords")
    .optional()
    .isArray()
    .withMessage("Keywords must be an array"),
  body("status")
    .optional()
    .isIn(["draft", "published", "archived"])
    .withMessage("Status must be draft, published, or archived"),
];

export const updateIndustryValidation = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty"),
  body("banner")
    .optional()
    .trim()
    .isString()
    .withMessage("Banner must be a string"),
  body("icon")
    .optional()
    .trim()
    .isString()
    .withMessage("Icon must be a string"),
  body("services")
    .optional()
    .isArray()
    .withMessage("Services must be an array"),
  body("projects")
    .optional()
    .isArray()
    .withMessage("Projects must be an array"),
  body("seo.metaTitle")
    .optional()
    .trim()
    .isString()
    .withMessage("Meta title must be a string"),
  body("seo.metaDescription")
    .optional()
    .trim()
    .isString()
    .withMessage("Meta description must be a string"),
  body("seo.keywords")
    .optional()
    .isArray()
    .withMessage("Keywords must be an array"),
  body("status")
    .optional()
    .isIn(["draft", "published", "archived"])
    .withMessage("Status must be draft, published, or archived"),
];

export const industryIdValidation = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Industry ID is required")
    .isMongoId()
    .withMessage("Invalid industry ID"),
];

export const industrySlugValidation = [
  param("slug")
    .trim()
    .notEmpty()
    .withMessage("Slug is required")
    .isSlug()
    .withMessage("Invalid slug format"),
];

export const getIndustriesValidation = [
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
    .isIn(["draft", "published", "archived"])
    .withMessage("Status must be draft, published, or archived"),
  query("search")
    .optional()
    .trim()
    .isString()
    .withMessage("Search must be a string"),
];

export const updateIndustryStatusValidation = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Industry ID is required")
    .isMongoId()
    .withMessage("Invalid industry ID"),
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["draft", "published", "archived"])
    .withMessage("Status must be draft, published, or archived"),
];
