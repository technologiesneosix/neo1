import { body, param, query } from "express-validator";

export const createServiceValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),
  body("shortDescription")
    .trim()
    .notEmpty()
    .withMessage("Short description is required")
    .isLength({ max: 300 })
    .withMessage("Short description cannot exceed 300 characters"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("icon").optional().trim(),
  body("bannerImage")
    .optional()
    .trim()
    .isString()
    .withMessage("Banner image must be a string"),
  body("thumbnail")
    .optional()
    .trim()
    .isString()
    .withMessage("Thumbnail must be a string"),
  body("features")
    .optional()
    .isArray()
    .withMessage("Features must be an array"),
  body("benefits")
    .optional()
    .isArray()
    .withMessage("Benefits must be an array"),
  body("technologies")
    .optional()
    .isArray()
    .withMessage("Technologies must be an array"),
  body("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("isFeatured must be a boolean"),
  body("displayOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Display order must be a non-negative integer"),
  body("status")
    .optional()
    .isIn(["draft", "published", "archived"])
    .withMessage("Status must be draft, published, or archived"),
];

export const updateServiceValidation = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),
  body("shortDescription")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Short description cannot be empty")
    .isLength({ max: 300 })
    .withMessage("Short description cannot exceed 300 characters"),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty"),
  body("icon").optional().trim(),
  body("bannerImage")
    .optional()
    .trim()
    .isString()
    .withMessage("Banner image must be a string"),
  body("thumbnail")
    .optional()
    .trim()
    .isString()
    .withMessage("Thumbnail must be a string"),
  body("features")
    .optional()
    .isArray()
    .withMessage("Features must be an array"),
  body("benefits")
    .optional()
    .isArray()
    .withMessage("Benefits must be an array"),
  body("technologies")
    .optional()
    .isArray()
    .withMessage("Technologies must be an array"),
  body("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("isFeatured must be a boolean"),
  body("displayOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Display order must be a non-negative integer"),
  body("status")
    .optional()
    .isIn(["draft", "published", "archived"])
    .withMessage("Status must be draft, published, or archived"),
];

export const serviceIdValidation = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Service ID is required")
    .isMongoId()
    .withMessage("Invalid service ID"),
];
