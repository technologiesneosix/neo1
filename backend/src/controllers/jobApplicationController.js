import JobApplication from "../models/JobApplication.js";
import Career from "../models/Career.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { logger } from "../utils/logger.js";
import { uploadSingleFile } from "../services/mediaService.js";
import {
  sendJobApplicationNotificationEmail,
  sendJobApplicationConfirmationEmail,
} from "../config/mail.js";

/**
 * Create a new job application
 */
export const createJobApplication = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { name, email, phone, coverLetter } = req.body;

    // Find career by slug
    const career = await Career.findOne({ slug, status: "open" });

    if (!career) {
      throw ApiError.notFound("Career not found or not accepting applications");
    }

    // Handle resume upload
    let resumeUrl = null;
    if (req.file) {
      try {
        const media = await uploadSingleFile(req.file, "resumes", null);
        resumeUrl = media.url;
        logger.info(`Resume uploaded for ${email} to career ${career.title}`);
      } catch (uploadError) {
        logger.error("Resume upload error:", uploadError);
        throw ApiError.badRequest("Failed to upload resume");
      }
    } else if (req.body.resumeUrl) {
      // If frontend sends resumeUrl (for mock mode or external URL), use it
      resumeUrl = req.body.resumeUrl;
    } else {
      throw ApiError.badRequest("Resume is required");
    }

    // Map frontend status to backend status if provided
    const status =
      req.body.status === "new" ? "pending" : req.body.status || "pending";

    // Create job application
    const jobApplication = await JobApplication.create({
      career: career._id,
      name,
      email,
      phone,
      resume: resumeUrl,
      coverLetter: coverLetter || null,
      status,
    });

    logger.info(
      `Job application created for ${email} to career ${career.title}`,
    );

    // Send email notifications asynchronously (non-blocking)
    const adminEmail =
      process.env.ADMIN_EMAIL || "technologiesneosix@gmail.com";
    sendJobApplicationNotificationEmail(adminEmail, {
      name,
      email,
      phone,
      careerTitle: career.title,
      resumeUrl,
      coverLetter,
    }).catch((err) => {
      logger.error(
        "Failed to send job application notification email to admin: " +
          (err?.message || err),
        err,
      );
    });

    sendJobApplicationConfirmationEmail(email, {
      name,
      careerTitle: career.title,
    }).catch((err) => {
      logger.error(
        "Failed to send job application confirmation email to candidate: " +
          (err?.message || err),
        err,
      );
    });

    return res.status(201).json(
      ApiResponse.success("Application submitted successfully", {
        id: jobApplication._id,
        message: "Your application has been submitted successfully",
      }),
    );
  } catch (error) {
    logger.error("Job application creation error:", error);
    next(error);
  }
};

/**
 * Get all job applications (Admin)
 */
export const getAllJobApplications = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      JobApplication.find(query)
        .populate("career", "title department location")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      JobApplication.countDocuments(query),
    ]);

    return res.status(200).json(
      ApiResponse.success("Job applications retrieved successfully", {
        applications,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      }),
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get job application by ID (Admin)
 */
export const getJobApplicationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const application = await JobApplication.findById(id).populate(
      "career",
      "title department location",
    );

    if (!application) {
      throw ApiError.notFound("Job application not found");
    }

    return res
      .status(200)
      .json(
        ApiResponse.success(
          "Job application retrieved successfully",
          application,
        ),
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Update job application status (Admin)
 */
export const updateJobApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const application = await JobApplication.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("career", "title department location");

    if (!application) {
      throw ApiError.notFound("Job application not found");
    }

    logger.info(`Job application status updated for ID ${id}`);
    return res
      .status(200)
      .json(
        ApiResponse.success(
          "Job application updated successfully",
          application,
        ),
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete job application (Admin)
 */
export const deleteJobApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const application = await JobApplication.findByIdAndDelete(id);

    if (!application) {
      throw ApiError.notFound("Job application not found");
    }

    logger.info(`Job application deleted for ID ${id}`);
    return res
      .status(200)
      .json(ApiResponse.success("Job application deleted successfully"));
  } catch (error) {
    next(error);
  }
};
