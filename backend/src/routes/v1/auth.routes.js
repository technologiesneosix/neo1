import { Router } from 'express';
import express from 'express';
import { asyncHandler, authenticate } from '../../middleware/index.js';
import { validate } from '../../middleware/index.js';
import {
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation,
} from '../../validations/authValidation.js';
import {
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
  getMe,
} from '../../controllers/authController.js';

const router = Router();

// Apply body parsing to auth routes
router.use(express.json({ limit: '10mb' }));
router.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login admin
 * @access  Public
 */
router.post('/login', loginValidation, validate, asyncHandler(login));

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout admin
 * @access  Private
 */
router.post('/logout', authenticate, asyncHandler(logout));

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh-token', asyncHandler(refreshToken));

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current admin
 * @access  Private
 */
router.get('/me', authenticate, asyncHandler(getMe));

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post('/forgot-password', forgotPasswordValidation, validate, asyncHandler(forgotPassword));

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password', resetPasswordValidation, validate, asyncHandler(resetPassword));

/**
 * @route   POST /api/v1/auth/change-password
 * @desc    Change password (authenticated)
 * @access  Private
 */
router.post('/change-password', authenticate, changePasswordValidation, validate, asyncHandler(changePassword));

export default router;
