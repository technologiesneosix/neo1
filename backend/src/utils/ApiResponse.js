class ApiResponse {
  constructor(success = true, message = '', data = null, errors = null) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.errors = errors;
  }

  static success(message = 'Success', data = null) {
    return new ApiResponse(true, message, data, null);
  }

  static error(message = 'Error', errors = null) {
    return new ApiResponse(false, message, null, errors);
  }

  static created(message = 'Resource created successfully', data = null) {
    return new ApiResponse(true, message, data, null);
  }

  static updated(message = 'Resource updated successfully', data = null) {
    return new ApiResponse(true, message, data, null);
  }

  static deleted(message = 'Resource deleted successfully') {
    return new ApiResponse(true, message, null, null);
  }

  static notFound(message = 'Resource not found') {
    return new ApiResponse(false, message, null, null);
  }

  static validationError(message = 'Validation failed', errors = null) {
    return new ApiResponse(false, message, null, errors);
  }

  static unauthorized(message = 'Unauthorized access') {
    return new ApiResponse(false, message, null, null);
  }

  static forbidden(message = 'Access forbidden') {
    return new ApiResponse(false, message, null, null);
  }

  static serverError(message = 'Internal server error') {
    return new ApiResponse(false, message, null, null);
  }

  toJSON() {
    return {
      success: this.success,
      message: this.message,
      data: this.data,
      errors: this.errors,
    };
  }
}

export default ApiResponse;
