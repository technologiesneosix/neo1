import { Router } from "express";
import { asyncHandler, authenticate } from "../../middleware/index.js";
import { validate } from "../../middleware/index.js";
import {
  uploadValidation,
  deleteMediaValidation,
} from "../../validations/mediaValidation.js";
import {
  uploadSingle,
  uploadMultiple,
  getAll,
  getById,
  deleteById,
  deleteMultiple,
} from "../../controllers/mediaController.js";
import {
  uploadSingleFile,
  uploadMultipleFiles,
} from "../../config/fileUpload.js";
import Media from "../../models/Media.js";
import ApiResponse from "../../utils/ApiResponse.js";

const router = Router();

/**
 * @route   POST /api/v1/media
 * @desc    Register a pre-uploaded media asset (e.g. data URL or direct link)
 * @access  Private (Admin)
 */
router.post(
  "/",
  authenticate,
  asyncHandler(async (req, res) => {
    const { name, url, type, folder, size } = req.body;

    // Create Media in database
    const media = await Media.create({
      fileName: name || `file-${Date.now()}`,
      originalName: name || "file",
      url,
      publicId: `preuploaded-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      mimeType:
        type === "image"
          ? "image/jpeg"
          : type === "video"
            ? "video/mp4"
            : "application/pdf",
      fileSize: size || 0,
      folder: folder || "general",
      uploadedBy: req.user?.id,
    });

    res
      .status(201)
      .json(ApiResponse.success("Media registered successfully", media));
  }),
);

/**
 * @route   POST /api/v1/media/upload
 * @desc    Upload single file
 * @access  Private (Admin)
 */
router.post(
  "/upload",
  uploadSingleFile("file"),
  authenticate,
  asyncHandler(uploadSingle),
);

/**
 * @route   POST /api/v1/media/upload-multiple
 * @desc    Upload multiple files
 * @access  Private (Admin)
 */
router.post(
  "/upload-multiple",
  uploadMultipleFiles("files", 10),
  authenticate,
  asyncHandler(uploadMultiple),
);

/**
 * @route   GET /api/v1/media
 * @desc    Get all media files
 * @access  Private (Admin)
 */
router.get("/", authenticate, asyncHandler(getAll));

/**
 * @route   GET /api/v1/media/:id
 * @desc    Get single media file
 * @access  Private (Admin)
 */
router.get(
  "/:id",
  authenticate,
  deleteMediaValidation,
  validate,
  asyncHandler(getById),
);

/**
 * @route   DELETE /api/v1/media/:id
 * @desc    Delete media file
 * @access  Private (Admin)
 */
router.delete(
  "/:id",
  authenticate,
  deleteMediaValidation,
  validate,
  asyncHandler(deleteById),
);

/**
 * @route   DELETE /api/v1/media/bulk
 * @desc    Delete multiple media files
 * @access  Private (Admin)
 */
router.delete("/bulk", authenticate, asyncHandler(deleteMultiple));

export default router;
