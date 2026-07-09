import { Router } from 'express';
import { asyncHandler, authenticate } from '../../middleware/index.js';
import {
  getAllContactMessages,
  getContactMessageById,
  updateContactMessage,
  deleteContactMessage,
} from '../../controllers/contactController.js';

const router = Router();

/**
 * @route   GET /api/v1/admin/messages
 * @desc    Get all contact messages
 * @access  Private (Admin)
 */
router.get('/', authenticate, asyncHandler(getAllContactMessages));

/**
 * @route   GET /api/v1/admin/messages/:id
 * @desc    Get contact message by ID
 * @access  Private (Admin)
 */
router.get('/:id', authenticate, asyncHandler(getContactMessageById));

/**
 * @route   PUT /api/v1/admin/messages/:id
 * @desc    Update contact message (e.g. status)
 * @access  Private (Admin)
 */
router.put('/:id', authenticate, asyncHandler(updateContactMessage));

/**
 * @route   DELETE /api/v1/admin/messages/:id
 * @desc    Delete contact message
 * @access  Private (Admin)
 */
router.delete('/:id', authenticate, asyncHandler(deleteContactMessage));

export default router;
