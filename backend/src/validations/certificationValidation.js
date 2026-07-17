import { body, param, query } from "express-validator";

export const createCertificationValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 200 })
    .withMessage("Name cannot exceed 200 characters"),
  body("issuer")
    .trim()
    .notEmpty()
    .withMessage("Issuer is required")
    .isLength({ max: 200 })
    .withMessage("Issuer cannot exceed 200 characters"),
  body("year")
    .trim()
    .notEmpty()
    .withMessage("Year is required")
    .isLength({ max: 50 })
    .withMessage("Year cannot exceed 50 characters"),
  body("imageUrl")
    .optional()
    .trim()
    .isString()
    .withMessage("Image URL must be a string"),
  body("displayOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Display order must be a non-negative integer"),
  body("status")
    .optional()
    .isIn(["draft", "published", "archived"])
    .withMessage("Status must be draft, published, or archived"),
];

export const updateCertificationValidation = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isLength({ max: 200 })
    .withMessage("Name cannot exceed 200 characters"),
  body("issuer")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Issuer cannot be empty")
    .isLength({ max: 200 })
    .withMessage("Issuer cannot exceed 200 characters"),
  body("year")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Year cannot be empty")
    .isLength({ max: 50 })
    .withMessage("Year cannot exceed 50 characters"),
  body("imageUrl")
    .optional()
    .trim()
    .isString()
    .withMessage("Image URL must be a string"),
  body("displayOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Display order must be a non-negative integer"),
  body("status")
    .optional()
    .isIn(["draft", "published", "archived"])
    .withMessage("Status must be draft, published, or archived"),
];

export const certificationIdValidation = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Certification ID is required")
    .isMongoId()
    .withMessage("Invalid certification ID"),
];

export const getCertificationsValidation = [
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
  query("sortBy")
    .optional()
    .isIn(["createdAt", "displayOrder", "name", "year"])
    .withMessage("Sort by must be createdAt, displayOrder, name, or year"),
  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Sort order must be asc or desc"),
];
