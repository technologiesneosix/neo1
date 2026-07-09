import { Router } from 'express';
import { asyncHandler, authenticate } from '../../middleware/index.js';
import {
  getAllJobApplications,
  getJobApplicationById,
  updateJobApplication,
  deleteJobApplication,
} from '../../controllers/jobApplicationController.js';

const router = Router();

/**
 * @route   GET /api/v1/admin/applications
 * @desc    Get all job applications
 * @access  Private (Admin)
 */
router.get('/', authenticate, asyncHandler(getAllJobApplications));

/**
 * @route   GET /api/v1/admin/applications/:id
 * @desc    Get job application by ID
 * @access  Private (Admin)
 */
router.get('/:id', authenticate, asyncHandler(getJobApplicationById));

/**
 * @route   PUT /api/v1/admin/applications/:id
 * @desc    Update job application (e.g. status)
 * @access  Private (Admin)
 */
router.put('/:id', authenticate, asyncHandler(updateJobApplication));

/**
 * @route   DELETE /api/v1/admin/applications/:id
 * @desc    Delete job application
 * @access  Private (Admin)
 */
router.delete('/:id', authenticate, asyncHandler(deleteJobApplication));

export default router;
