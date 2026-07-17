import fs from "fs";
import path from "path";
import fetch from "node-fetch"; // In Node.js 18+ fetch is global, but using fetch if global is preferred, or standard import if needed. Since node-fetch is not in package.json, we will check if fetch is global (which is standard in modern node.js environment like Node 18/20/22). Let's use the global fetch.
import { HR_CONFIG } from "../config/hr.js";
import Candidate from "../models/Candidate.js";
import EmailLog from "../models/EmailLog.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { logger } from "../utils/logger.js";
import { sanitizeHtml } from "../utils/htmlSanitizer.js";

/**
 * Retrieve all email logs (optionally filtered by candidate)
 */
export const getEmailLogs = async (req, res, next) => {
  try {
    const { candidateId } = req.query;
    const query = {};

    if (candidateId) {
      query.candidate = candidateId;
    }

    const logs = await EmailLog.find(query)
      .populate("candidate", "fullName email designation")
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json(ApiResponse.success("Email logs retrieved successfully", logs));
  } catch (error) {
    next(error);
  }
};

/**
 * Send Offer Letter Email
 */
export const sendOfferLetterEmail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      to,
      cc,
      bcc,
      subject,
      body,
      attachOfferLetter,
      additionalAttachments,
    } = req.body;

    const candidate = await Candidate.findById(id);
    if (!candidate || candidate.isDeleted) {
      throw ApiError.notFound("Candidate not found");
    }

    if (!to || !subject || !body) {
      throw ApiError.badRequest(
        "Recipient, subject, and email body are required",
      );
    }

    // 1. Gather all attachments
    const resendAttachments = [];
    let totalSize = 0;

    // Attach main offer letter if enabled and present
    if (
      attachOfferLetter &&
      candidate.offerLetter &&
      candidate.offerLetter.path
    ) {
      const mainPath = path.resolve(candidate.offerLetter.path);
      if (fs.existsSync(mainPath)) {
        const fileBuffer = fs.readFileSync(mainPath);
        const fileSize = candidate.offerLetter.size || fileBuffer.length;
        totalSize += fileSize;
        resendAttachments.push({
          content: fileBuffer.toString("base64"),
          filename: candidate.offerLetter.originalName || "Offer-Letter.pdf",
        });
      }
    }

    // Attach additional attachments from candidate draft/attachments list
    if (additionalAttachments && Array.isArray(additionalAttachments)) {
      for (const att of additionalAttachments) {
        if (att.path) {
          const attPath = path.resolve(att.path);
          if (fs.existsSync(attPath)) {
            const fileBuffer = fs.readFileSync(attPath);
            const fileSize = att.size || fileBuffer.length;
            totalSize += fileSize;
            resendAttachments.push({
              content: fileBuffer.toString("base64"),
              filename: att.originalName,
            });
          }
        }
      }
    }

    // 2. Validate attachment size limit (Resend supports up to 10MB total)
    const RESEND_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB
    if (totalSize > RESEND_SIZE_LIMIT) {
      throw ApiError.badRequest(
        `Total attachment size (${(totalSize / (1024 * 1024)).toFixed(2)}MB) exceeds Resend's 10MB limit`,
      );
    }

    // 3. Sanitize HTML body
    const sanitizedBody = sanitizeHtml(body);

    // 4. Formulate email payload
    const fromField = `${HR_CONFIG.senderName} <${HR_CONFIG.senderEmail}>`;
    const toList = to
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean);
    const ccList = cc
      ? cc
          .split(",")
          .map((email) => email.trim())
          .filter(Boolean)
      : [];
    const bccList = bcc
      ? bcc
          .split(",")
          .map((email) => email.trim())
          .filter(Boolean)
      : [];

    let emailSentSuccessfully = false;
    let resendEmailId = null;
    let errorMessage = null;

    try {
      if (!process.env.RESEND_API_KEY) {
        throw new Error(
          "RESEND_API_KEY is not configured in backend .env file",
        );
      }

      const payload = {
        from: fromField,
        to: toList,
        subject,
        html: sanitizedBody,
        reply_to: HR_CONFIG.replyTo,
      };

      if (ccList.length > 0) payload.cc = ccList;
      if (bccList.length > 0) payload.bcc = bccList;
      if (resendAttachments.length > 0) payload.attachments = resendAttachments;

      const response = await globalThis.fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || `Resend API error (${response.status})`,
        );
      }

      resendEmailId = data.id;
      emailSentSuccessfully = true;
      logger.info(
        `Offer letter email sent successfully to ${to} (Resend ID: ${resendEmailId})`,
      );
    } catch (err) {
      errorMessage = err.message || "Unknown sending error";
      logger.error(
        `Failed to send offer letter email to ${to}: ${errorMessage}`,
        err,
      );
    }

    // 5. Create Email Log
    const emailLog = await EmailLog.create({
      candidate: candidate._id,
      subject,
      recipient: to,
      cc: cc || "",
      bcc: bcc || "",
      sentBy: fromField,
      deliveryStatus: emailSentSuccessfully ? "success" : "failed",
      resendEmailId,
      errorMessage,
      body: sanitizedBody,
      attachments: resendAttachments.map((att) => ({
        path: "Stored",
        originalName: att.filename,
        size: Math.round(att.content.length * 0.75), // base64 is ~33% larger
        mimeType: "application/pdf",
      })),
    });

    if (emailSentSuccessfully) {
      // Update candidate status
      candidate.status = "Offer Sent";
      // clear draft
      candidate.draft = {
        subject: "",
        body: "",
        to: "",
        cc: "",
        bcc: "",
        attachments: [],
      };
      await candidate.save();

      return res
        .status(200)
        .json(
          ApiResponse.success("Offer letter email sent successfully", {
            candidate,
            emailLog,
          }),
        );
    } else {
      // Return error, do not lose the draft (it remains saved in state)
      return res
        .status(500)
        .json(
          ApiResponse.error(`Failed to send email: ${errorMessage}`, {
            emailLog,
          }),
        );
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Resend a previously sent email log
 */
export const resendEmailLog = async (req, res, next) => {
  try {
    const { logId } = req.params;

    const log = await EmailLog.findById(logId);
    if (!log) {
      throw ApiError.notFound("Email log not found");
    }

    const candidate = await Candidate.findById(log.candidate);
    if (!candidate || candidate.isDeleted) {
      throw ApiError.notFound("Associated candidate not found or deleted");
    }

    // Attempt resending payload
    const fromField = `${HR_CONFIG.senderName} <${HR_CONFIG.senderEmail}>`;
    const toList = log.recipient
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean);
    const ccList = log.cc
      ? log.cc
          .split(",")
          .map((email) => email.trim())
          .filter(Boolean)
      : [];
    const bccList = log.bcc
      ? log.bcc
          .split(",")
          .map((email) => email.trim())
          .filter(Boolean)
      : [];

    let emailSentSuccessfully = false;
    let resendEmailId = null;
    let errorMessage = null;

    // Retrieve the attachments from candidate's physical folder if they matched by filename
    const resendAttachments = [];
    if (log.attachments && log.attachments.length > 0) {
      for (const att of log.attachments) {
        // First try to look up candidate's main offerLetter
        if (
          candidate.offerLetter &&
          candidate.offerLetter.originalName === att.originalName &&
          candidate.offerLetter.path
        ) {
          const mainPath = path.resolve(candidate.offerLetter.path);
          if (fs.existsSync(mainPath)) {
            resendAttachments.push({
              content: fs.readFileSync(mainPath).toString("base64"),
              filename: att.originalName,
            });
            continue;
          }
        }
        // Next look at the candidate draft attachments
        if (candidate.draft && candidate.draft.attachments) {
          const match = candidate.draft.attachments.find(
            (a) => a.originalName === att.originalName,
          );
          if (match && match.path) {
            const attPath = path.resolve(match.path);
            if (fs.existsSync(attPath)) {
              resendAttachments.push({
                content: fs.readFileSync(attPath).toString("base64"),
                filename: att.originalName,
              });
            }
          }
        }
      }
    }

    try {
      if (!process.env.RESEND_API_KEY) {
        throw new Error(
          "RESEND_API_KEY is not configured in backend .env file",
        );
      }

      const payload = {
        from: fromField,
        to: toList,
        subject: log.subject,
        html: log.body,
        reply_to: HR_CONFIG.replyTo,
      };

      if (ccList.length > 0) payload.cc = ccList;
      if (bccList.length > 0) payload.bcc = bccList;
      if (resendAttachments.length > 0) payload.attachments = resendAttachments;

      const response = await globalThis.fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || `Resend API error (${response.status})`,
        );
      }

      resendEmailId = data.id;
      emailSentSuccessfully = true;
      logger.info(
        `Resent email successfully (New Resend ID: ${resendEmailId})`,
      );
    } catch (err) {
      errorMessage = err.message || "Unknown sending error";
      logger.error(`Failed to resend email: ${errorMessage}`, err);
    }

    // Create a new log entry for the resending activity
    const newLog = await EmailLog.create({
      candidate: log.candidate,
      subject: `[Resent] ${log.subject}`,
      recipient: log.recipient,
      cc: log.cc || "",
      bcc: log.bcc || "",
      sentBy: fromField,
      deliveryStatus: emailSentSuccessfully ? "success" : "failed",
      resendEmailId,
      errorMessage,
      body: log.body,
      attachments: log.attachments,
    });

    if (emailSentSuccessfully) {
      candidate.status = "Offer Sent";
      await candidate.save();
      return res
        .status(200)
        .json(
          ApiResponse.success("Email resent successfully", {
            emailLog: newLog,
          }),
        );
    } else {
      return res
        .status(500)
        .json(
          ApiResponse.error(`Failed to resend email: ${errorMessage}`, {
            emailLog: newLog,
          }),
        );
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a specific email log
 */
export const deleteEmailLog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const log = await EmailLog.findById(id);
    if (!log) {
      throw ApiError.notFound("Email log not found");
    }

    await EmailLog.findByIdAndDelete(id);
    logger.info(`Email log deleted: ${id}`);

    return res
      .status(200)
      .json(ApiResponse.success("Email log deleted successfully"));
  } catch (error) {
    next(error);
  }
};
