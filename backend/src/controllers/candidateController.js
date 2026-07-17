import fs from "fs";
import path from "path";
import crypto from "crypto";
import Candidate from "../models/Candidate.js";
import EmailLog from "../models/EmailLog.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { logger } from "../utils/logger.js";

// Ensure the local uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads", "hr", "offer-letters");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Get all active candidates (excluding soft-deleted)
 */
export const getAllCandidates = async (req, res, next) => {
  try {
    const { status, search } = req.query;

    const query = { isDeleted: false };

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { designation: { $regex: search, $options: "i" } },
      ];
    }

    const candidates = await Candidate.find(query).sort({ createdAt: -1 });

    return res
      .status(200)
      .json(
        ApiResponse.success("Candidates retrieved successfully", candidates),
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all soft-deleted candidates (the Trash bin)
 */
export const getDeletedCandidates = async (req, res, next) => {
  try {
    const candidates = await Candidate.find({ isDeleted: true }).sort({
      deletedAt: -1,
    });
    return res
      .status(200)
      .json(
        ApiResponse.success(
          "Deleted candidates retrieved successfully",
          candidates,
        ),
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Get candidate by ID
 */
export const getCandidateById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findById(id);

    if (!candidate || candidate.isDeleted) {
      throw ApiError.notFound("Candidate not found");
    }

    return res
      .status(200)
      .json(ApiResponse.success("Candidate retrieved successfully", candidate));
  } catch (error) {
    next(error);
  }
};

/**
 * Create a candidate
 */
export const createCandidate = async (req, res, next) => {
  try {
    const { fullName, email, phone, designation, notes, status } = req.body;

    if (!fullName || !email) {
      throw ApiError.badRequest("Full name and email are required");
    }

    const candidate = await Candidate.create({
      fullName,
      email,
      phone: phone || null,
      designation: designation || null,
      notes: notes || null,
      status: status || "Draft",
    });

    logger.info(`Candidate created: ${email}`);

    return res
      .status(201)
      .json(ApiResponse.success("Candidate created successfully", candidate));
  } catch (error) {
    next(error);
  }
};

/**
 * Update candidate
 */
export const updateCandidate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fullName, email, phone, designation, notes, status } = req.body;

    const candidate = await Candidate.findById(id);
    if (!candidate || candidate.isDeleted) {
      throw ApiError.notFound("Candidate not found");
    }

    candidate.fullName = fullName !== undefined ? fullName : candidate.fullName;
    candidate.email = email !== undefined ? email : candidate.email;
    candidate.phone = phone !== undefined ? phone : candidate.phone;
    candidate.designation =
      designation !== undefined ? designation : candidate.designation;
    candidate.notes = notes !== undefined ? notes : candidate.notes;
    candidate.status = status !== undefined ? status : candidate.status;

    await candidate.save();

    logger.info(`Candidate updated: ${candidate.email}`);

    return res
      .status(200)
      .json(ApiResponse.success("Candidate updated successfully", candidate));
  } catch (error) {
    next(error);
  }
};

/**
 * Soft delete candidate
 */
export const deleteCandidate = async (req, res, next) => {
  try {
    const { id } = req.params;

    const candidate = await Candidate.findById(id);
    if (!candidate || candidate.isDeleted) {
      throw ApiError.notFound("Candidate not found");
    }

    candidate.isDeleted = true;
    candidate.deletedAt = new Date();
    await candidate.save();

    logger.info(`Candidate soft deleted: ${candidate.email}`);

    return res
      .status(200)
      .json(
        ApiResponse.success("Candidate deleted successfully (moved to Trash)"),
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Restore soft-deleted candidate
 */
export const restoreCandidate = async (req, res, next) => {
  try {
    const { id } = req.params;

    const candidate = await Candidate.findById(id);
    if (!candidate || !candidate.isDeleted) {
      throw ApiError.notFound("Candidate not found in trash");
    }

    candidate.isDeleted = false;
    candidate.deletedAt = null;
    await candidate.save();

    logger.info(`Candidate restored: ${candidate.email}`);

    return res
      .status(200)
      .json(ApiResponse.success("Candidate restored successfully", candidate));
  } catch (error) {
    next(error);
  }
};

/**
 * Upload or replace Offer Letter PDF
 */
export const uploadOfferLetter = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      throw ApiError.badRequest("No file uploaded");
    }

    if (req.file.mimetype !== "application/pdf") {
      throw ApiError.badRequest("Only PDF files are allowed");
    }

    const candidate = await Candidate.findById(id);
    if (!candidate || candidate.isDeleted) {
      throw ApiError.notFound("Candidate not found");
    }

    // Delete old file if exists
    if (candidate.offerLetter && candidate.offerLetter.path) {
      const oldPath = path.resolve(candidate.offerLetter.path);
      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch (err) {
          logger.error(
            `Failed to delete old offer letter file: ${oldPath}`,
            err,
          );
        }
      }
    }

    // Save new file to local directory
    const uniqueFileName = `${Date.now()}-${crypto.randomUUID()}-${req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    fs.writeFileSync(filePath, req.file.buffer);

    candidate.offerLetter = {
      path: path.relative(process.cwd(), filePath),
      originalName: req.file.originalname,
      size: req.file.size,
      mimeType: req.file.mimetype,
      uploadedAt: new Date(),
    };

    await candidate.save();

    logger.info(`Offer letter uploaded for candidate: ${candidate.email}`);

    return res
      .status(200)
      .json(
        ApiResponse.success("Offer letter uploaded successfully", candidate),
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Offer Letter PDF
 */
export const deleteOfferLetter = async (req, res, next) => {
  try {
    const { id } = req.params;

    const candidate = await Candidate.findById(id);
    if (!candidate || candidate.isDeleted) {
      throw ApiError.notFound("Candidate not found");
    }

    if (!candidate.offerLetter || !candidate.offerLetter.path) {
      throw ApiError.badRequest("No offer letter uploaded for this candidate");
    }

    const filePath = path.resolve(candidate.offerLetter.path);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        logger.error(`Failed to delete offer letter file: ${filePath}`, err);
      }
    }

    candidate.offerLetter = {
      path: null,
      originalName: null,
      size: null,
      mimeType: null,
      uploadedAt: null,
    };

    await candidate.save();

    logger.info(`Offer letter deleted for candidate: ${candidate.email}`);

    return res
      .status(200)
      .json(
        ApiResponse.success("Offer letter deleted successfully", candidate),
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Preview Offer Letter PDF (inline browser streaming)
 */
export const previewOfferLetter = async (req, res, next) => {
  try {
    const { id } = req.params;

    const candidate = await Candidate.findById(id);
    if (!candidate || candidate.isDeleted) {
      throw ApiError.notFound("Candidate not found");
    }

    if (!candidate.offerLetter || !candidate.offerLetter.path) {
      throw ApiError.notFound("Offer letter PDF not found");
    }

    const filePath = path.resolve(candidate.offerLetter.path);
    if (!fs.existsSync(filePath)) {
      throw ApiError.notFound("Physical offer letter file not found on server");
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="Offer-Letter.pdf"');

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Download Offer Letter PDF (file attachment downloading)
 */
export const downloadOfferLetter = async (req, res, next) => {
  try {
    const { id } = req.params;

    const candidate = await Candidate.findById(id);
    if (!candidate || candidate.isDeleted) {
      throw ApiError.notFound("Candidate not found");
    }

    if (!candidate.offerLetter || !candidate.offerLetter.path) {
      throw ApiError.notFound("Offer letter PDF not found");
    }

    const filePath = path.resolve(candidate.offerLetter.path);
    if (!fs.existsSync(filePath)) {
      throw ApiError.notFound("Physical offer letter file not found on server");
    }

    const originalName =
      candidate.offerLetter.originalName || "Offer-Letter.pdf";
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${originalName}"`,
    );

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    next(error);
  }
};

/**
 * Save draft email for composer
 */
export const saveDraft = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { subject, body, to, cc, bcc, attachments } = req.body;

    const candidate = await Candidate.findById(id);
    if (!candidate || candidate.isDeleted) {
      throw ApiError.notFound("Candidate not found");
    }

    candidate.draft = {
      subject: subject || "",
      body: body || "",
      to: to || "",
      cc: cc || "",
      bcc: bcc || "",
      attachments: attachments || [],
    };

    await candidate.save();

    return res
      .status(200)
      .json(ApiResponse.success("Draft email saved successfully", candidate));
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch saved draft email for composer
 */
export const getDraft = async (req, res, next) => {
  try {
    const { id } = req.params;

    const candidate = await Candidate.findById(id);
    if (!candidate || candidate.isDeleted) {
      throw ApiError.notFound("Candidate not found");
    }

    return res
      .status(200)
      .json(
        ApiResponse.success(
          "Draft email retrieved successfully",
          candidate.draft || {},
        ),
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Upload additional attachment for email draft
 */
export const uploadDraftAttachment = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      throw ApiError.badRequest("No file uploaded");
    }

    if (req.file.mimetype !== "application/pdf") {
      throw ApiError.badRequest("Only PDF files are allowed");
    }

    const candidate = await Candidate.findById(id);
    if (!candidate || candidate.isDeleted) {
      throw ApiError.notFound("Candidate not found");
    }

    const uniqueFileName = `${Date.now()}-att-${crypto.randomUUID()}-${req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    fs.writeFileSync(filePath, req.file.buffer);

    const att = {
      path: path.relative(process.cwd(), filePath),
      originalName: req.file.originalname,
      size: req.file.size,
      mimeType: req.file.mimetype,
    };

    candidate.draft.attachments.push(att);
    await candidate.save();

    logger.info(`Draft attachment uploaded for candidate: ${candidate.email}`);

    return res
      .status(200)
      .json(
        ApiResponse.success(
          "Draft attachment uploaded successfully",
          candidate,
        ),
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an additional attachment from draft
 */
export const deleteDraftAttachment = async (req, res, next) => {
  try {
    const { id, attachmentIndex } = req.params;

    const candidate = await Candidate.findById(id);
    if (!candidate || candidate.isDeleted) {
      throw ApiError.notFound("Candidate not found");
    }

    const index = parseInt(attachmentIndex, 10);
    if (
      isNaN(index) ||
      index < 0 ||
      index >= candidate.draft.attachments.length
    ) {
      throw ApiError.badRequest("Invalid attachment index");
    }

    const att = candidate.draft.attachments[index];
    if (att && att.path) {
      const filePath = path.resolve(att.path);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          logger.error(`Failed to delete draft attachment: ${filePath}`, err);
        }
      }
    }

    candidate.draft.attachments.splice(index, 1);
    await candidate.save();

    logger.info(`Draft attachment removed for candidate: ${candidate.email}`);

    return res
      .status(200)
      .json(
        ApiResponse.success("Draft attachment removed successfully", candidate),
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Permanently delete candidate (Hard delete)
 */
export const hardDeleteCandidate = async (req, res, next) => {
  try {
    const { id } = req.params;

    const candidate = await Candidate.findById(id);
    if (!candidate) {
      throw ApiError.notFound("Candidate not found");
    }

    // Clean up uploaded PDF offer letter if it exists on disk
    if (candidate.offerLetter && candidate.offerLetter.path) {
      const filePath = path.resolve(candidate.offerLetter.path);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          logger.info(`Offer letter PDF file deleted on hard delete: ${filePath}`);
        } catch (err) {
          logger.error(`Failed to delete offer letter file: ${filePath}`, err);
        }
      }
    }

    // Clean up draft attachments if any exist on disk
    if (candidate.draft && candidate.draft.attachments) {
      for (const att of candidate.draft.attachments) {
        if (att.path) {
          const filePath = path.resolve(att.path);
          if (fs.existsSync(filePath)) {
            try {
              fs.unlinkSync(filePath);
            } catch (err) {
              logger.error(`Failed to delete draft attachment file: ${filePath}`, err);
            }
          }
        }
      }
    }

    // Delete candidate from DB
    await Candidate.findByIdAndDelete(id);

    // Delete all email logs relating to this candidate
    await EmailLog.deleteMany({ candidate: id });

    logger.info(`Candidate permanently deleted: ${candidate.email}`);

    return res
      .status(200)
      .json(ApiResponse.success("Candidate permanently deleted successfully"));
  } catch (error) {
    next(error);
  }
};
