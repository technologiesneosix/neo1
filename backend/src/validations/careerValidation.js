import { body, param, query } from "express-validator";

export const createCareerValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),
  body("department")
    .trim()
    .notEmpty()
    .withMessage("Department is required")
    .isIn([
      "engineering",
      "design",
      "marketing",
      "sales",
      "hr",
      "finance",
      "other",
    ])
    .withMessage("Invalid department"),
  body("employmentType")
    .trim()
    .notEmpty()
    .withMessage("Employment type is required")
    .isIn(["full-time", "part-time", "contract", "internship"])
    .withMessage("Invalid employment type"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("experience")
    .trim()
    .notEmpty()
    .withMessage("Experience is required")
    .isIn(["entry-level", "1-2 years", "2-5 years", "5-10 years", "10+ years"])
    .withMessage("Invalid experience level"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("salary")
    .optional()
    .trim()
    .isString()
    .withMessage("Salary must be a string"),
  body("requirements")
    .optional()
    .isArray()
    .withMessage("Requirements must be an array"),
  body("responsibilities")
    .optional()
    .isArray()
    .withMessage("Responsibilities must be an array"),
  body("benefits")
    .optional()
    .isArray()
    .withMessage("Benefits must be an array"),
  body("deadline")
    .optional()
    .isISO8601()
    .withMessage("Deadline must be a valid date"),
  body("status")
    .optional()
    .isIn(["open", "closed", "on-hold"])
    .withMessage("Status must be open, closed, or on-hold"),
];

export const updateCareerValidation = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),
  body("department")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Department cannot be empty")
    .isIn([
      "engineering",
      "design",
      "marketing",
      "sales",
      "hr",
      "finance",
      "other",
    ])
    .withMessage("Invalid department"),
  body("employmentType")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Employment type cannot be empty")
    .isIn(["full-time", "part-time", "contract", "internship"])
    .withMessage("Invalid employment type"),
  body("location")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Location cannot be empty"),
  body("experience")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Experience cannot be empty")
    .isIn(["entry-level", "1-2 years", "2-5 years", "5-10 years", "10+ years"])
    .withMessage("Invalid experience level"),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty"),
  body("salary")
    .optional()
    .trim()
    .isString()
    .withMessage("Salary must be a string"),
  body("requirements")
    .optional()
    .isArray()
    .withMessage("Requirements must be an array"),
  body("responsibilities")
    .optional()
    .isArray()
    .withMessage("Responsibilities must be an array"),
  body("benefits")
    .optional()
    .isArray()
    .withMessage("Benefits must be an array"),
  body("deadline")
    .optional()
    .isISO8601()
    .withMessage("Deadline must be a valid date"),
  body("status")
    .optional()
    .isIn(["open", "closed", "on-hold"])
    .withMessage("Status must be open, closed, or on-hold"),
];

export const careerIdValidation = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Career ID is required")
    .isMongoId()
    .withMessage("Invalid career ID"),
];

export const getCareersValidation = [
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
    .isIn(["open", "closed", "on-hold"])
    .withMessage("Status must be open, closed, or on-hold"),
  query("department")
    .optional()
    .isIn([
      "engineering",
      "design",
      "marketing",
      "sales",
      "hr",
      "finance",
      "other",
    ])
    .withMessage("Invalid department"),
  query("employmentType")
    .optional()
    .isIn(["full-time", "part-time", "contract", "internship"])
    .withMessage("Invalid employment type"),
  query("experience")
    .optional()
    .isIn(["entry-level", "1-2 years", "2-5 years", "5-10 years", "10+ years"])
    .withMessage("Invalid experience level"),
  query("search")
    .optional()
    .trim()
    .isString()
    .withMessage("Search must be a string"),
  query("sortBy")
    .optional()
    .isIn(["createdAt", "deadline", "title"])
    .withMessage("Sort by must be createdAt, deadline, or title"),
  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Sort order must be asc or desc"),
];

export const updateCareerStatusValidation = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Career ID is required")
    .isMongoId()
    .withMessage("Invalid career ID"),
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["open", "closed", "on-hold"])
    .withMessage("Status must be open, closed, or on-hold"),
];
