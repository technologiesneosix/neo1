import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { logger } from "./utils/logger.js";
import { errorHandler } from "./middleware/index.js";
import { notFoundHandler } from "./middleware/notFound.js";
import { sanitizeInput } from "./middleware/sanitize.js";

import { uploadSingleFile, uploadMultipleFiles } from "./config/fileUpload.js";
import v1Routes from "./routes/v1/index.js";

const app = express();

// Enable proxy IP detection for rate limiter
app.set("trust proxy", 1);

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
);

app.use(
  cors({
    origin: process.env.FRONTEND_URL?.split(",") || ["http://localhost:5173"],
    credentials: true,
  }),
);

// Cookie parser with security options
app.use(
  cookieParser({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  }),
);

// Compression middleware
app.use(compression());

if (process.env.NODE_ENV !== "test") {
  const stream = {
    write: (message) => logger.info(message.trim()),
  };
  app.use(morgan("combined", { stream }));
}

// Input sanitization
app.use(sanitizeInput);

// Body parsing middleware - skip for upload endpoints
app.use((req, res, next) => {
  const url = (req.url || req.originalUrl || "").toLowerCase();
  const contentType = (req.headers["content-type"] || "").toLowerCase();

  // Skip body parsing for upload endpoints (more reliable than content-type check)
  if (url.includes("/upload")) {
    return next();
  }

  // Also skip for multipart content
  if (contentType.startsWith("multipart") || contentType.includes("boundary")) {
    return next();
  }

  // For other content types, parse normally
  express.json({ limit: "10mb" })(req, res, (err) => {
    if (err) return next(err);
    express.urlencoded({ extended: true, limit: "10mb" })(req, res, next);
  });
});

// Health check route (must be before routes to avoid conflicts)
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// API v1 routes — each route group applies its own rate limiter (see routes/v1/index.js)
app.use("/api/v1", v1Routes);

// Health check under API v1
app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// 404 handler
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
