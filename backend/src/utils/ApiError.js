class ApiError extends Error {
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
    this.timestamp = new Date().toISOString();

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = "Bad Request", errors = null) {
    return new ApiError(message, 400, errors);
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiError(message, 401);
  }

  static forbidden(message = "Forbidden") {
    return new ApiError(message, 403);
  }

  static notFound(message = "Resource not found") {
    return new ApiError(message, 404);
  }

  static conflict(message = "Conflict") {
    return new ApiError(message, 409);
  }

  static validationError(message = "Validation failed", errors = null) {
    return new ApiError(message, 422, errors);
  }

  static tooManyRequests(message = "Too many requests") {
    return new ApiError(message, 429);
  }

  static internal(message = "Internal server error") {
    return new ApiError(message, 500);
  }

  static serviceUnavailable(message = "Service unavailable") {
    return new ApiError(message, 503);
  }

  toJSON() {
    return {
      message: this.message,
      statusCode: this.statusCode,
      errors: this.errors,
      timestamp: this.timestamp,
      ...(process.env.NODE_ENV === "development" && { stack: this.stack }),
    };
  }
}

export default ApiError;
