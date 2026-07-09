import Admin from '../models/Admin.js';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwt.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { logger } from '../utils/logger.js';
import { sendPasswordResetEmail } from '../config/mail.js';
import crypto from 'crypto';

// Login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find admin and include password for comparison
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    if (!admin.isActive) {
      throw ApiError.forbidden('Your account has been deactivated');
    }

    // Compare password
    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate tokens
    const accessToken = generateAccessToken({ id: admin._id, email: admin.email });
    const refreshToken = generateRefreshToken({ id: admin._id });

    // Save refresh token to database
    admin.refreshToken = refreshToken;
    await admin.save();

    // Set refresh token in secure cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    logger.info(`Admin logged in: ${admin.email}`);

    return res.status(200).json(
      ApiResponse.success('Login successful', {
        admin,
        accessToken,
      })
    );
  } catch (error) {
    next(error);
  }
};

// Logout
export const logout = async (req, res, next) => {
  try {
    const adminId = req.user?.id;

    if (adminId) {
      // Remove refresh token from database
      await Admin.findByIdAndUpdate(adminId, { refreshToken: null });
    }

    // Clear refresh token cookie
    res.clearCookie('refreshToken');

    logger.info(`Admin logged out: ${req.user?.email}`);

    return res.status(200).json(ApiResponse.success('Logout successful'));
  } catch (error) {
    next(error);
  }
};

// Refresh Token
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw ApiError.unauthorized('Refresh token not found');
    }

    // Verify refresh token
    const decoded = verifyToken(refreshToken);

    // Find admin with this refresh token
    const admin = await Admin.findById(decoded.id).select('+refreshToken');

    if (!admin || admin.refreshToken !== refreshToken) {
      throw ApiError.unauthorized('Invalid refresh token');
    }

    if (!admin.isActive) {
      throw ApiError.forbidden('Your account has been deactivated');
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken({ id: admin._id, email: admin.email });
    const newRefreshToken = generateRefreshToken({ id: admin._id });

    // Update refresh token in database
    admin.refreshToken = newRefreshToken;
    await admin.save();

    // Set new refresh token in cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    logger.info(`Token refreshed for admin: ${admin.email}`);

    return res.status(200).json(
      ApiResponse.success('Token refreshed successfully', {
        accessToken: newAccessToken,
      })
    );
  } catch (error) {
    next(error);
  }
};

// Get Current Admin
export const getMe = async (req, res, next) => {
  try {
    const adminId = req.user.id;

    const admin = await Admin.findById(adminId);

    if (!admin) {
      throw ApiError.notFound('Admin not found');
    }

    if (!admin.isActive) {
      throw ApiError.forbidden('Your account has been deactivated');
    }

    return res.status(200).json(ApiResponse.success('Admin retrieved successfully', admin));
  } catch (error) {
    next(error);
  }
};

// Forgot Password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      // Don't reveal if email exists for security
      return res.status(200).json(
        ApiResponse.success('If an account exists with this email, a password reset link has been sent')
      );
    }

    if (!admin.isActive) {
      throw ApiError.forbidden('Your account has been deactivated');
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour

    // Save reset token to database (you might want to add these fields to the model)
    admin.resetToken = resetToken;
    admin.resetTokenExpiry = resetTokenExpiry;
    await admin.save();

    // Create reset URL
    const resetUrl = `${process.env.ADMIN_URL}/reset-password?token=${resetToken}`;

    // Send email
    try {
      await sendPasswordResetEmail(admin.email, resetUrl);
      logger.info(`Password reset email sent to: ${admin.email}`);
    } catch (emailError) {
      logger.error('Error sending password reset email:', emailError);
      throw ApiError.internal('Error sending password reset email');
    }

    return res.status(200).json(
      ApiResponse.success('If an account exists with this email, a password reset link has been sent')
    );
  } catch (error) {
    next(error);
  }
};

// Reset Password
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const admin = await Admin.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    }).select('+password');

    if (!admin) {
      throw ApiError.badRequest('Invalid or expired reset token');
    }

    if (!admin.isActive) {
      throw ApiError.forbidden('Your account has been deactivated');
    }

    // Update password
    admin.password = password;
    admin.resetToken = undefined;
    admin.resetTokenExpiry = undefined;
    await admin.save();

    logger.info(`Password reset for admin: ${admin.email}`);

    return res.status(200).json(ApiResponse.success('Password reset successfully'));
  } catch (error) {
    next(error);
  }
};

// Change Password
export const changePassword = async (req, res, next) => {
  try {
    const adminId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const admin = await Admin.findById(adminId).select('+password');

    if (!admin) {
      throw ApiError.notFound('Admin not found');
    }

    if (!admin.isActive) {
      throw ApiError.forbidden('Your account has been deactivated');
    }

    // Verify current password
    const isPasswordValid = await admin.comparePassword(currentPassword);

    if (!isPasswordValid) {
      throw ApiError.unauthorized('Current password is incorrect');
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    logger.info(`Password changed for admin: ${admin.email}`);

    return res.status(200).json(ApiResponse.success('Password changed successfully'));
  } catch (error) {
    next(error);
  }
};
