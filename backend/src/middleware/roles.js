import ApiError from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('User not authenticated'));
    }

    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      logger.warn(`User ${req.user.id} with role ${userRole} attempted to access protected route`);
      return next(ApiError.forbidden('Insufficient permissions'));
    }

    next();
  };
};

export const isAdmin = authorize('admin');

export const isUser = authorize('user', 'admin');

export const isSelfOrAdmin = (userIdParam = 'id') => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('User not authenticated'));
    }

    const requestedUserId = req.params[userIdParam];
    const currentUserId = req.user.id;

    if (req.user.role === 'admin' || currentUserId === requestedUserId) {
      return next();
    }

    return next(ApiError.forbidden('You can only access your own resources'));
  };
};
