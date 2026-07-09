import { Router } from 'express';
import { asyncHandler, authenticate, validate } from '../../middleware/index.js';
import {
  createServiceValidation,
  updateServiceValidation,
  serviceIdValidation,
} from '../../validations/serviceValidation.js';
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} from '../../controllers/serviceController.js';

const router = Router();

/**
 * @route   POST /api/v1/admin/services
 * @desc    Create service
 * @access  Private (Admin)
 */
router.post(
  '/',
  authenticate,
  createServiceValidation,
  validate,
  asyncHandler(createService)
);

/**
 * @route   GET /api/v1/admin/services
 * @desc    Get all services
 * @access  Private (Admin)
 */
router.get(
  '/',
  authenticate,
  asyncHandler(getAllServices)
);

/**
 * @route   GET /api/v1/admin/services/:id
 * @desc    Get service by ID
 * @access  Private (Admin)
 */
router.get(
  '/:id',
  authenticate,
  serviceIdValidation,
  validate,
  asyncHandler(getServiceById)
);

/**
 * @route   PUT /api/v1/admin/services/:id
 * @desc    Update service
 * @access  Private (Admin)
 */
router.put(
  '/:id',
  authenticate,
  serviceIdValidation,
  updateServiceValidation,
  validate,
  asyncHandler(updateService)
);

/**
 * @route   DELETE /api/v1/admin/services/:id
 * @desc    Delete service
 * @access  Private (Admin)
 */
router.delete(
  '/:id',
  authenticate,
  serviceIdValidation,
  validate,
  asyncHandler(deleteService)
);

export default router;
