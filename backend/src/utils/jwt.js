import jwt from "jsonwebtoken";
import ApiError from "./ApiError.js";

const getJwtSecret = () => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return JWT_SECRET;
};

const getJwtAccessExpire = () => {
  return process.env.JWT_ACCESS_EXPIRE || "15m";
};

const getJwtRefreshExpire = () => {
  return process.env.JWT_REFRESH_EXPIRE || "7d";
};

export const generateToken = (payload, expiresIn) => {
  try {
    return jwt.sign(payload, getJwtSecret(), { expiresIn });
  } catch (error) {
    throw new Error("Error generating token");
  }
};

export const generateAccessToken = (payload) => {
  return generateToken(payload, getJwtAccessExpire());
};

export const generateRefreshToken = (payload) => {
  return generateToken(payload, getJwtRefreshExpire());
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, getJwtSecret());
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw ApiError.unauthorized("Token has expired");
    }
    if (error.name === "JsonWebTokenError") {
      throw ApiError.unauthorized("Invalid token");
    }
    throw ApiError.unauthorized("Token verification failed");
  }
};

export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    throw new Error("Error decoding token");
  }
};

export const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return null;
  }

  if (authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  return null;
};
