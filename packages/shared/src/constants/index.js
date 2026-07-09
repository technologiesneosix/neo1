// API constants
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    LOGOUT: '/api/v1/auth/logout',
    REFRESH: '/api/v1/auth/refresh',
    FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
    RESET_PASSWORD: '/api/v1/auth/reset-password',
  },
  USERS: {
    LIST: '/api/v1/users',
    DETAIL: (id) => `/api/v1/users/${id}`,
    UPDATE: (id) => `/api/v1/users/${id}`,
    DELETE: (id) => `/api/v1/users/${id}`,
  },
  PUBLIC: {
    HOME: '/api/v1/public/home',
    SERVICES: '/api/v1/public/services',
    ABOUT: '/api/v1/public/about',
    CONTACT: '/api/v1/public/contact',
  },
  ADMIN: {
    DASHBOARD: '/api/v1/admin/dashboard',
    USERS: '/api/v1/admin/users',
    CONTENT: '/api/v1/admin/content',
    SETTINGS: '/api/v1/admin/settings',
  },
};

// Pagination constants
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

// Error messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation failed',
  INTERNAL_ERROR: 'Internal server error',
  EMAIL_EXISTS: 'Email already exists',
  INVALID_CREDENTIALS: 'Invalid email or password',
  TOKEN_EXPIRED: 'Token has expired',
  INVALID_TOKEN: 'Invalid token',
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful',
  LOGOUT: 'Logout successful',
  REGISTER: 'Registration successful',
  PASSWORD_RESET: 'Password reset successful',
  PROFILE_UPDATED: 'Profile updated successfully',
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
};
