import { Router } from "express";
import { asyncHandler, authenticate } from "../../middleware/index.js";
import { upload } from "../../config/fileUpload.js";
import { HR_CONFIG } from "../../config/hr.js";
import {
  getAllCandidates,
  getDeletedCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  restoreCandidate,
  hardDeleteCandidate,
  uploadOfferLetter,
  deleteOfferLetter,
  previewOfferLetter,
  downloadOfferLetter,
  saveDraft,
  getDraft,
  uploadDraftAttachment,
  deleteDraftAttachment,
} from "../../controllers/candidateController.js";
import {
  getEmailLogs,
  sendOfferLetterEmail,
  resendEmailLog,
  deleteEmailLog,
} from "../../controllers/emailLogController.js";

const router = Router();

// Apply auth middleware to all HR routes (Only authenticated admin users)
router.use(authenticate);

// Config endpoint
router.get("/config", (req, res) => {
  res.status(200).json({
    success: true,
    message: "HR configuration retrieved successfully",
    data: HR_CONFIG,
  });
});

// Candidates CRUD
router.get("/candidates", asyncHandler(getAllCandidates));
router.post("/candidates", asyncHandler(createCandidate));
router.get("/candidates/deleted", asyncHandler(getDeletedCandidates));
router.get("/candidates/:id", asyncHandler(getCandidateById));
router.put("/candidates/:id", asyncHandler(updateCandidate));
router.delete("/candidates/:id", asyncHandler(deleteCandidate));
router.post("/candidates/:id/restore", asyncHandler(restoreCandidate));
router.delete("/candidates/:id/hard", asyncHandler(hardDeleteCandidate));

// PDF Offer Letter Management
router.post(
  "/candidates/:id/offer-letter",
  upload.single("file"),
  asyncHandler(uploadOfferLetter),
);
router.delete("/candidates/:id/offer-letter", asyncHandler(deleteOfferLetter));
router.get(
  "/candidates/:id/offer-letter/preview",
  asyncHandler(previewOfferLetter),
);
router.get(
  "/candidates/:id/offer-letter/download",
  asyncHandler(downloadOfferLetter),
);

// Draft email composer
router.post("/candidates/:id/draft", asyncHandler(saveDraft));
router.get("/candidates/:id/draft", asyncHandler(getDraft));

// Draft attachments
router.post(
  "/candidates/:id/attachments",
  upload.single("file"),
  asyncHandler(uploadDraftAttachment),
);
router.delete(
  "/candidates/:id/attachments/:attachmentIndex",
  asyncHandler(deleteDraftAttachment),
);

// Email services
router.post("/candidates/:id/send-offer", asyncHandler(sendOfferLetterEmail));
router.get("/email-logs", asyncHandler(getEmailLogs));
router.post("/email-logs/resend/:logId", asyncHandler(resendEmailLog));
router.delete("/email-logs/:id", asyncHandler(deleteEmailLog));

export default router;
