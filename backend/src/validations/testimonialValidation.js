import { body, param, query } from "express-validator";

export const createTestimonialValidation = [
  body("clientName")
    .trim()
    .notEmpty()
    .withMessage("Client name is required")
    .isLength({ max: 100 })
    .withMessage("Client name cannot exceed 100 characters"),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("review").trim().notEmpty().withMessage("Review is required"),
  body("company")
    .optional()
    .trim()
    .isString()
    .withMessage("Company must be a string"),
  body("designation")
    .optional()
    .trim()
    .isString()
    .withMessage("Designation must be a string"),
  body("photo")
    .optional()
    .trim()
    .isString()
    .withMessage("Photo must be a string"),
  body("featured")
    .optional()
    .isBoolean()
    .withMessage("Featured must be a boolean"),
  body("displayOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Display order must be a non-negative integer"),
  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be active or inactive"),
];

export const updateTestimonialValidation = [
  body("clientName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Client name cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Client name cannot exceed 100 characters"),
  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("review")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Review cannot be empty"),
  body("company")
    .optional()
    .trim()
    .isString()
    .withMessage("Company must be a string"),
  body("designation")
    .optional()
    .trim()
    .isString()
    .withMessage("Designation must be a string"),
  body("photo")
    .optional()
    .trim()
    .isString()
    .withMessage("Photo must be a string"),
  body("featured")
    .optional()
    .isBoolean()
    .withMessage("Featured must be a boolean"),
  body("displayOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Display order must be a non-negative integer"),
  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be active or inactive"),
];

export const testimonialIdValidation = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Testimonial ID is required")
    .isMongoId()
    .withMessage("Invalid testimonial ID"),
];

export const getTestimonialsValidation = [
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
    .isIn(["active", "inactive"])
    .withMessage("Status must be active or inactive"),
  query("featured")
    .optional()
    .isIn(["true", "false"])
    .withMessage("Featured must be true or false"),
  query("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  query("search")
    .optional()
    .trim()
    .isString()
    .withMessage("Search must be a string"),
  query("sortBy")
    .optional()
    .isIn(["createdAt", "displayOrder", "rating", "clientName"])
    .withMessage(
      "Sort by must be createdAt, displayOrder, rating, or clientName",
    ),
  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Sort order must be asc or desc"),
];

export const updateTestimonialStatusValidation = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Testimonial ID is required")
    .isMongoId()
    .withMessage("Invalid testimonial ID"),
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["active", "inactive"])
    .withMessage("Status must be active or inactive"),
];

export const toggleTestimonialFeaturedValidation = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Testimonial ID is required")
    .isMongoId()
    .withMessage("Invalid testimonial ID"),
];

export const updateTestimonialDisplayOrderValidation = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Testimonial ID is required")
    .isMongoId()
    .withMessage("Invalid testimonial ID"),
  body("displayOrder")
    .trim()
    .notEmpty()
    .withMessage("Display order is required")
    .isInt({ min: 0 })
    .withMessage("Display order must be a non-negative integer"),
];
