import ApiError from "./ApiError.js";

// Allowed file types
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];
export const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"];
export const ALLOWED_DOCUMENT_TYPES = ["application/pdf"];

export const ALLOWED_IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".svg",
];
export const ALLOWED_VIDEO_EXTENSIONS = [".mp4", ".webm"];
export const ALLOWED_DOCUMENT_EXTENSIONS = [".pdf"];

// File size limits (in bytes)
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
export const MAX_DOCUMENT_SIZE = 50 * 1024 * 1024; // 50MB

/**
 * Validate file type
 */
export const validateFileType = (mimetype, extension) => {
  const allAllowedTypes = [
    ...ALLOWED_IMAGE_TYPES,
    ...ALLOWED_VIDEO_TYPES,
    ...ALLOWED_DOCUMENT_TYPES,
  ];
  const allAllowedExtensions = [
    ...ALLOWED_IMAGE_EXTENSIONS,
    ...ALLOWED_VIDEO_EXTENSIONS,
    ...ALLOWED_DOCUMENT_EXTENSIONS,
  ];

  if (!allAllowedTypes.includes(mimetype)) {
    throw ApiError.badRequest(
      `Invalid file type. Allowed types: ${allAllowedTypes.join(", ")}`,
    );
  }

  if (!allAllowedExtensions.includes(extension.toLowerCase())) {
    throw ApiError.badRequest(
      `Invalid file extension. Allowed extensions: ${allAllowedExtensions.join(", ")}`,
    );
  }
};

/**
 * Validate file size
 */
export const validateFileSize = (size, maxSize, fileType = "file") => {
  if (size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    throw ApiError.badRequest(`${fileType} size exceeds ${maxSizeMB}MB limit`);
  }
};

/**
 * Validate image file
 */
export const validateImageFile = (file) => {
  if (!file) {
    throw ApiError.badRequest("No file provided");
  }

  const extension = getFileExtension(file.originalname);
  validateFileType(file.mimetype, extension);
  validateFileSize(file.size, MAX_IMAGE_SIZE, "Image");
};

/**
 * Validate video file
 */
export const validateVideoFile = (file) => {
  if (!file) {
    throw ApiError.badRequest("No file provided");
  }

  const extension = getFileExtension(file.originalname);
  validateFileType(file.mimetype, extension);
  validateFileSize(file.size, MAX_VIDEO_SIZE, "Video");
};

/**
 * Validate document file
 */
export const validateDocumentFile = (file) => {
  if (!file) {
    throw ApiError.badRequest("No file provided");
  }

  const extension = getFileExtension(file.originalname);
  validateFileType(file.mimetype, extension);
  validateFileSize(file.size, MAX_DOCUMENT_SIZE, "Document");
};

/**
 * Get file extension
 */
export const getFileExtension = (filename) => {
  return filename.slice(filename.lastIndexOf(".")).toLowerCase();
};

/**
 * Generate unique filename
 */
export const generateUniqueFileName = (originalName) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = getFileExtension(originalName);
  const nameWithoutExtension = originalName
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9]/g, "-");
  return `${nameWithoutExtension}-${timestamp}-${random}${extension}`;
};
