import { body, param, query } from "express-validator";

export const createTechnologyValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters"),
  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isIn([
      "frontend",
      "backend",
      "database",
      "devops",
      "mobile",
      "design",
      "other",
    ])
    .withMessage(
      "Category must be frontend, backend, database, devops, mobile, design, or other",
    ),
  body("logo")
    .optional()
    .trim()
    .isString()
    .withMessage("Logo must be a string"),
  body("description")
    .optional()
    .trim()
    .isString()
    .withMessage("Description must be a string"),
  body("website")
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage("Website must be a valid URL"),
  body("displayOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Display order must be a non-negative integer"),
  body("status")
    .optional()
    .isIn(["draft", "published", "archived"])
    .withMessage("Status must be draft, published, or archived"),
];

export const updateTechnologyValidation = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters"),
  body("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category cannot be empty")
    .isIn([
      "frontend",
      "backend",
      "database",
      "devops",
      "mobile",
      "design",
      "other",
    ])
    .withMessage(
      "Category must be frontend, backend, database, devops, mobile, design, or other",
    ),
  body("logo")
    .optional()
    .trim()
    .isString()
    .withMessage("Logo must be a string"),
  body("description")
    .optional()
    .trim()
    .isString()
    .withMessage("Description must be a string"),
  body("website")
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage("Website must be a valid URL"),
  body("displayOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Display order must be a non-negative integer"),
  body("status")
    .optional()
    .isIn(["draft", "published", "archived"])
    .withMessage("Status must be draft, published, or archived"),
];

export const technologyIdValidation = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Technology ID is required")
    .isMongoId()
    .withMessage("Invalid technology ID"),
];

export const technologySlugValidation = [
  param("slug")
    .trim()
    .notEmpty()
    .withMessage("Slug is required")
    .isSlug()
    .withMessage("Invalid slug format"),
];

export const getTechnologiesValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage("Limit must be between 1 and 1000"),
  query("status")
    .optional()
    .isIn(["draft", "published", "archived"])
    .withMessage("Status must be draft, published, or archived"),
  query("category")
    .optional()
    .isIn([
      "frontend",
      "backend",
      "database",
      "devops",
      "mobile",
      "design",
      "other",
    ])
    .withMessage(
      "Category must be frontend, backend, database, devops, mobile, design, or other",
    ),
  query("search")
    .optional()
    .trim()
    .isString()
    .withMessage("Search must be a string"),
  query("sortBy")
    .optional()
    .isIn(["createdAt", "displayOrder", "name"])
    .withMessage("Sort by must be createdAt, displayOrder, or name"),
  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Sort order must be asc or desc"),
];

export const updateTechnologyStatusValidation = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Technology ID is required")
    .isMongoId()
    .withMessage("Invalid technology ID"),
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["draft", "published", "archived"])
    .withMessage("Status must be draft, published, or archived"),
];

export const updateDisplayOrderValidation = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Technology ID is required")
    .isMongoId()
    .withMessage("Invalid technology ID"),
  body("displayOrder")
    .trim()
    .notEmpty()
    .withMessage("Display order is required")
    .isInt({ min: 0 })
    .withMessage("Display order must be a non-negative integer"),
];
