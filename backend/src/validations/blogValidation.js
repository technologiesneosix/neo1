import { body, param, query } from "express-validator";

export const createBlogValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),
  body("excerpt")
    .trim()
    .notEmpty()
    .withMessage("Excerpt is required")
    .isLength({ max: 500 })
    .withMessage("Excerpt cannot exceed 500 characters"),
  body("content").trim().notEmpty().withMessage("Content is required"),
  body("author").isMongoId().withMessage("Author must be a valid MongoDB ID"),
  body("category")
    .isMongoId()
    .withMessage("Category must be a valid MongoDB ID"),
  body("banner")
    .optional()
    .trim()
    .isString()
    .withMessage("Banner must be a string"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("readingTime")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Reading time must be a positive integer"),
  body("featured")
    .optional()
    .isBoolean()
    .withMessage("Featured must be a boolean"),
  body("published")
    .optional()
    .isBoolean()
    .withMessage("Published must be a boolean"),
  body("publishedAt")
    .optional()
    .isISO8601()
    .withMessage("Published date must be a valid date"),
];

export const updateBlogValidation = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),
  body("excerpt")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Excerpt cannot be empty")
    .isLength({ max: 500 })
    .withMessage("Excerpt cannot exceed 500 characters"),
  body("content")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Content cannot be empty"),
  body("author")
    .optional()
    .isMongoId()
    .withMessage("Author must be a valid MongoDB ID"),
  body("category")
    .optional()
    .isMongoId()
    .withMessage("Category must be a valid MongoDB ID"),
  body("banner")
    .optional()
    .trim()
    .isString()
    .withMessage("Banner must be a string"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("readingTime")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Reading time must be a positive integer"),
  body("featured")
    .optional()
    .isBoolean()
    .withMessage("Featured must be a boolean"),
  body("published")
    .optional()
    .isBoolean()
    .withMessage("Published must be a boolean"),
  body("publishedAt")
    .optional()
    .isISO8601()
    .withMessage("Published date must be a valid date"),
];

export const blogIdValidation = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Blog ID is required")
    .isMongoId()
    .withMessage("Invalid blog ID"),
];

export const blogSlugValidation = [
  param("slug")
    .trim()
    .notEmpty()
    .withMessage("Slug is required")
    .isSlug()
    .withMessage("Invalid slug format"),
];

export const getBlogsValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("published")
    .optional()
    .isIn(["true", "false"])
    .withMessage("Published must be true or false"),
  query("featured")
    .optional()
    .isIn(["true", "false"])
    .withMessage("Featured must be true or false"),
  query("category")
    .optional()
    .isMongoId()
    .withMessage("Category must be a valid MongoDB ID"),
  query("author")
    .optional()
    .isMongoId()
    .withMessage("Author must be a valid MongoDB ID"),
  query("tag").optional().trim().isString().withMessage("Tag must be a string"),
  query("search")
    .optional()
    .trim()
    .isString()
    .withMessage("Search must be a string"),
  query("sortBy")
    .optional()
    .isIn(["createdAt", "publishedAt", "title", "views"])
    .withMessage("Sort by must be createdAt, publishedAt, title, or views"),
  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Sort order must be asc or desc"),
];

export const updateBlogStatusValidation = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Blog ID is required")
    .isMongoId()
    .withMessage("Invalid blog ID"),
  body("published").isBoolean().withMessage("Published must be a boolean"),
];

export const toggleBlogFeaturedValidation = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Blog ID is required")
    .isMongoId()
    .withMessage("Invalid blog ID"),
];
