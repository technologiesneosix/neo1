import { body, param } from "express-validator";

export const uploadValidation = [
  body("folder")
    .optional()
    .trim()
    .isIn([
      "general",
      "services",
      "solutions",
      "projects",
      "blogs",
      "team",
      "testimonials",
      "careers",
      "about",
      "hero",
      "logos",
      "documents",
      "videos",
      "thumbnails",
    ])
    .withMessage("Invalid folder name"),
];

export const deleteMediaValidation = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Media ID is required")
    .isMongoId()
    .withMessage("Invalid media ID"),
];
