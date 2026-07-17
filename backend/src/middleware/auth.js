import { verifyToken, getTokenFromHeader } from "../utils/jwt.js";
import ApiError from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);

    if (!token) {
      throw ApiError.unauthorized("No token provided");
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error("Authentication error:", error);
    next(error);
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);

    if (token) {
      const decoded = verifyToken(token);
      req.user = decoded;
    }

    next();
  } catch (error) {
    logger.error("Optional authentication error:", error);
    next(error);
  }
};
