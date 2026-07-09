import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value,
    }));

    logger.warn('Validation failed:', formattedErrors);
    return next(ApiError.validationError('Validation failed', formattedErrors));
  }

  next();
};
