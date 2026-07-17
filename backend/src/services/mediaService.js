import Media from "../models/Media.js";
import ApiError from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";
import {
  uploadImageToCloudinary,
  uploadMultipleImagesToCloudinary,
  deleteImageFromCloudinary,
  deleteMultipleImagesFromCloudinary,
} from "../utils/imageOptimizer.js";
import {
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
} from "../utils/cloudinaryDelete.js";
import {
  validateImageFile,
  validateVideoFile,
  validateDocumentFile,
  generateUniqueFileName,
  getFileExtension,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  ALLOWED_DOCUMENT_TYPES,
} from "../utils/fileValidator.js";
import { generateFolderPath } from "../utils/folderUtility.js";

/**
 * Upload single file to Cloudinary and save to database
 */
export const uploadSingleFile = async (
  file,
  folder = "general",
  uploadedBy,
) => {
  try {
    // Validate file
    const extension = getFileExtension(file.originalname);

    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      validateImageFile(file);
    } else if (ALLOWED_VIDEO_TYPES.includes(file.mimetype)) {
      validateVideoFile(file);
    } else if (ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
      validateDocumentFile(file);
    } else {
      throw ApiError.badRequest("Unsupported file type");
    }

    // Generate folder path
    const folderPath = generateFolderPath(folder, true);

    // Upload to Cloudinary (using buffer from memory storage)
    const cloudinaryResult = await uploadImageToCloudinary(
      file.buffer,
      file.originalname,
      folderPath,
    );

    // Save to database
    const media = await Media.create({
      fileName: generateUniqueFileName(file.originalname),
      originalName: file.originalname,
      url: cloudinaryResult.secureUrl,
      publicId: cloudinaryResult.publicId,
      mimeType: file.mimetype,
      fileSize: file.size,
      folder: folderPath,
      uploadedBy,
    });

    logger.info(`File uploaded: ${media.fileName} by ${uploadedBy}`);

    return media;
  } catch (error) {
    logger.error("Upload error:", error);
    throw error;
  }
};

/**
 * Upload multiple files to Cloudinary and save to database
 */
export const uploadMultipleFiles = async (
  files,
  folder = "general",
  uploadedBy,
) => {
  try {
    if (!files || files.length === 0) {
      throw ApiError.badRequest("No files provided");
    }

    // Validate all files
    files.forEach((file) => {
      const extension = getFileExtension(file.originalname);

      if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
        validateImageFile(file);
      } else if (ALLOWED_VIDEO_TYPES.includes(file.mimetype)) {
        validateVideoFile(file);
      } else if (ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
        validateDocumentFile(file);
      } else {
        throw ApiError.badRequest(
          `Unsupported file type: ${file.originalname}`,
        );
      }
    });

    // Generate folder path
    const folderPath = generateFolderPath(folder, true);

    // Upload all files to Cloudinary (using buffers from memory storage)
    const cloudinaryResults = await uploadMultipleImagesToCloudinary(
      files.map((f) => ({ buffer: f.buffer, originalName: f.originalname })),
      folderPath,
    );

    // Save all to database
    const mediaDocuments = await Promise.all(
      cloudinaryResults.map((result, index) =>
        Media.create({
          fileName: generateUniqueFileName(files[index].originalname),
          originalName: files[index].originalname,
          url: result.secureUrl,
          publicId: result.publicId,
          mimeType: files[index].mimetype,
          fileSize: files[index].size,
          folder: folderPath,
          uploadedBy,
        }),
      ),
    );

    logger.info(`${mediaDocuments.length} files uploaded by ${uploadedBy}`);

    return mediaDocuments;
  } catch (error) {
    logger.error("Multiple upload error:", error);
    throw error;
  }
};

/**
 * Get all media files
 */
export const getAllMedia = async (filters = {}) => {
  const { folder, page = 1, limit = 20 } = filters;

  const query = {};
  if (folder) {
    query.folder = new RegExp(`^${folder}`, "i");
  }

  const skip = (page - 1) * limit;

  const [media, total] = await Promise.all([
    Media.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Media.countDocuments(query),
  ]);

  return {
    media,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get single media file by ID
 */
export const getMediaById = async (id) => {
  const media = await Media.findById(id);

  if (!media) {
    throw ApiError.notFound("Media not found");
  }

  return media;
};

/**
 * Delete media file from Cloudinary and database
 */
export const deleteMedia = async (id) => {
  try {
    const media = await Media.findById(id);

    if (!media) {
      throw ApiError.notFound("Media not found");
    }

    // Delete from Cloudinary
    const resourceType = media.mimeType.startsWith("video/")
      ? "video"
      : "image";
    await deleteFromCloudinary(media.publicId, resourceType);

    // Delete from database
    await Media.findByIdAndDelete(id);

    logger.info(`Media deleted: ${media.fileName}`);

    return { message: "Media deleted successfully" };
  } catch (error) {
    logger.error("Delete error:", error);
    throw error;
  }
};

/**
 * Delete multiple media files
 */
export const deleteMultipleMedia = async (ids) => {
  try {
    const mediaFiles = await Media.find({ _id: { $in: ids } });

    if (mediaFiles.length === 0) {
      throw ApiError.notFound("No media files found");
    }

    // Delete from Cloudinary
    const publicIds = mediaFiles.map((m) => m.publicId);
    await deleteMultipleFromCloudinary(publicIds);

    // Delete from database
    await Media.deleteMany({ _id: { $in: ids } });

    logger.info(`${mediaFiles.length} media files deleted`);

    return { message: `${mediaFiles.length} media files deleted successfully` };
  } catch (error) {
    logger.error("Multiple delete error:", error);
    throw error;
  }
};

export { ALLOWED_IMAGE_TYPES, ALLOWED_VIDEO_TYPES, ALLOWED_DOCUMENT_TYPES };
