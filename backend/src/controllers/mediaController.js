import {
  uploadSingleFile,
  uploadMultipleFiles,
  getAllMedia,
  getMediaById,
  deleteMedia,
  deleteMultipleMedia,
} from "../services/mediaService.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { logger } from "../utils/logger.js";

/**
 * Upload single file
 */
export const uploadSingle = async (req, res, next) => {
  try {
    if (!req.file) {
      throw ApiError.badRequest("No file uploaded");
    }

    const folder = req.body.folder || "general";
    const uploadedBy = req.user?.id;

    const media = await uploadSingleFile(req.file, folder, uploadedBy);

    return res
      .status(201)
      .json(ApiResponse.success("File uploaded successfully", media));
  } catch (error) {
    next(error);
  }
};

/**
 * Upload multiple files
 */
export const uploadMultiple = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw ApiError.badRequest("No files uploaded");
    }

    const folder = req.body.folder || "general";
    const uploadedBy = req.user?.id;

    const mediaFiles = await uploadMultipleFiles(req.files, folder, uploadedBy);

    return res
      .status(201)
      .json(ApiResponse.success("Files uploaded successfully", mediaFiles));
  } catch (error) {
    next(error);
  }
};

/**
 * Get all media files
 */
export const getAll = async (req, res, next) => {
  try {
    const { folder, page = 1, limit = 20 } = req.query;

    const result = await getAllMedia({ folder, page, limit });

    return res
      .status(200)
      .json(ApiResponse.success("Media retrieved successfully", result));
  } catch (error) {
    next(error);
  }
};

/**
 * Get single media file by ID
 */
export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const media = await getMediaById(id);

    return res
      .status(200)
      .json(ApiResponse.success("Media retrieved successfully", media));
  } catch (error) {
    next(error);
  }
};

/**
 * Delete media file
 */
export const deleteById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await deleteMedia(id);

    return res
      .status(200)
      .json(ApiResponse.success("Media deleted successfully", result));
  } catch (error) {
    next(error);
  }
};

/**
 * Delete multiple media files
 */
export const deleteMultiple = async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw ApiError.badRequest("Valid media IDs array is required");
    }

    const result = await deleteMultipleMedia(ids);

    return res
      .status(200)
      .json(ApiResponse.success("Media files deleted successfully", result));
  } catch (error) {
    next(error);
  }
};
