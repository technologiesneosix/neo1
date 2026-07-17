import { Router } from "express";
import { asyncHandler, authenticate } from "../../middleware/index.js";
import { validate } from "../../middleware/index.js";
import {
  createHeroValidation,
  updateHeroValidation,
  heroIdValidation,
  getHeroesValidation,
} from "../../validations/heroValidation.js";
import {
  createHero,
  getAllHeroes,
  getHeroById,
  updateHero,
  toggleHeroStatus,
  deleteHero,
} from "../../controllers/heroController.js";

const router = Router();

/**
 * @route   POST /api/v1/admin/hero
 * @desc    Create hero section
 * @access  Private (Admin)
 */
router.post(
  "/",
  authenticate,
  createHeroValidation,
  validate,
  asyncHandler(createHero),
);

/**
 * @route   GET /api/v1/admin/hero
 * @desc    Get all hero sections
 * @access  Private (Admin)
 */
router.get(
  "/",
  authenticate,
  getHeroesValidation,
  validate,
  asyncHandler(getAllHeroes),
);

/**
 * @route   GET /api/v1/admin/hero/:id
 * @desc    Get hero by ID
 * @access  Private (Admin)
 */
router.get(
  "/:id",
  authenticate,
  heroIdValidation,
  validate,
  asyncHandler(getHeroById),
);

/**
 * @route   PUT /api/v1/admin/hero/:id
 * @desc    Update hero
 * @access  Private (Admin)
 */
router.put(
  "/:id",
  authenticate,
  heroIdValidation,
  updateHeroValidation,
  validate,
  asyncHandler(updateHero),
);

/**
 * @route   PATCH /api/v1/admin/hero/:id/toggle-status
 * @desc    Toggle hero active status
 * @access  Private (Admin)
 */
router.patch(
  "/:id/toggle-status",
  authenticate,
  heroIdValidation,
  validate,
  asyncHandler(toggleHeroStatus),
);

/**
 * @route   DELETE /api/v1/admin/hero/:id
 * @desc    Delete hero
 * @access  Private (Admin)
 */
router.delete(
  "/:id",
  authenticate,
  heroIdValidation,
  validate,
  asyncHandler(deleteHero),
);

export default router;
