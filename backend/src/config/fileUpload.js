import multer from "multer";
import ApiError from "../utils/ApiError.js";
import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  ALLOWED_DOCUMENT_TYPES,
  MAX_FILE_SIZE,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
  MAX_DOCUMENT_SIZE,
} from "../utils/fileValidator.js";
import { logger } from "../utils/logger.js";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    ...ALLOWED_IMAGE_TYPES,
    ...ALLOWED_VIDEO_TYPES,
    ...ALLOWED_DOCUMENT_TYPES,
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type: ${file.mimetype}. Allowed types: ${allowedTypes.join(", ")}`,
      ),
      false,
    );
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter,
});

export const uploadSingleFile = (fieldName) => upload.single(fieldName);

export const uploadMultipleFiles = (fieldName, maxCount = 10) =>
  upload.array(fieldName, maxCount);

export const uploadFields = (fields) => upload.fields(fields);

// Specialized uploaders for different file types
export const uploadImage = multer({
  storage,
  limits: {
    fileSize: MAX_IMAGE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid image type. Allowed: ${ALLOWED_IMAGE_TYPES.join(", ")}`,
        ),
        false,
      );
    }
  },
});

export const uploadVideo = multer({
  storage,
  limits: {
    fileSize: MAX_VIDEO_SIZE,
  },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_VIDEO_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid video type. Allowed: ${ALLOWED_VIDEO_TYPES.join(", ")}`,
        ),
        false,
      );
    }
  },
});

export const uploadDocument = multer({
  storage,
  limits: {
    fileSize: MAX_DOCUMENT_SIZE,
  },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid document type. Allowed: ${ALLOWED_DOCUMENT_TYPES.join(", ")}`,
        ),
        false,
      );
    }
  },
});
