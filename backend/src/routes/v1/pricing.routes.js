import { Router } from 'express';
import { asyncHandler, authenticate } from '../../middleware/index.js';
import { validate } from '../../middleware/index.js';
import {
  createPricingPlanValidation,
  updatePricingPlanValidation,
  pricingPlanIdValidation,
  getPricingPlansValidation,
} from '../../validations/pricingValidation.js';
import {
  createPricingPlan,
  getAllPricingPlans,
  getPricingPlanById,
  updatePricingPlan,
  deletePricingPlan,
} from '../../controllers/pricingController.js';

const router = Router();

/**
 * @route   POST /api/v1/admin/pricing
 * @desc    Create pricing plan
 * @access  Private (Admin)
 */
router.post(
  '/',
  authenticate,
  createPricingPlanValidation,
  validate,
  asyncHandler(createPricingPlan)
);

/**
 * @route   GET /api/v1/admin/pricing
 * @desc    Get all pricing plans (admin list)
 * @access  Private (Admin)
 */
router.get(
  '/',
  authenticate,
  getPricingPlansValidation,
  validate,
  asyncHandler(getAllPricingPlans)
);

/**
 * @route   GET /api/v1/admin/pricing/:id
 * @desc    Get pricing plan by ID
 * @access  Private (Admin)
 */
router.get(
  '/:id',
  authenticate,
  pricingPlanIdValidation,
  validate,
  asyncHandler(getPricingPlanById)
);

/**
 * @route   PUT /api/v1/admin/pricing/:id
 * @desc    Update pricing plan
 * @access  Private (Admin)
 */
router.put(
  '/:id',
  authenticate,
  pricingPlanIdValidation,
  updatePricingPlanValidation,
  validate,
  asyncHandler(updatePricingPlan)
);

/**
 * @route   DELETE /api/v1/admin/pricing/:id
 * @desc    Delete pricing plan
 * @access  Private (Admin)
 */
router.delete(
  '/:id',
  authenticate,
  pricingPlanIdValidation,
  validate,
  asyncHandler(deletePricingPlan)
);

export default router;
