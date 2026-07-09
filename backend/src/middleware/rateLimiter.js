import rateLimit from 'express-rate-limit';
import { logger } from '../utils/logger.js';

export const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100, message = 'Too many requests') => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message,
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn(`Rate limit exceeded for IP: ${req.ip} | ${req.method} ${req.originalUrl}`);
      res.status(429).json({
        success: false,
        message,
      });
    },
  });
};

// Strict: 5 attempts per 15 min — for login/auth routes
export const authRateLimiter = createRateLimiter(15 * 60 * 1000, 5, 'Too many authentication attempts, please try again later');

// General: 200 requests per 15 min — for admin API routes
export const generalRateLimiter = createRateLimiter(15 * 60 * 1000, 200, 'Too many requests, please try again later');

// Public: 1000 requests per 15 min — for public content GET endpoints
// A normal homepage loads 12+ API calls simultaneously; this allows legitimate browsing.
export const publicRateLimiter = createRateLimiter(15 * 60 * 1000, 1000, 'Too many requests, please try again later');

export const strictRateLimiter = createRateLimiter(60 * 1000, 10, 'Too many requests, please slow down');
