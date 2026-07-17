import { Router } from "express";
import {
  asyncHandler,
  authenticate,
  validate,
} from "../../middleware/index.js";
import {
  createCertificationValidation,
  updateCertificationValidation,
  certificationIdValidation,
  getCertificationsValidation,
} from "../../validations/certificationValidation.js";
import {
  createCertification,
  getAllCertifications,
  getCertificationById,
  updateCertification,
  deleteCertification,
} from "../../controllers/certificationController.js";

const router = Router();

// Get all certifications (admin view)
router.get(
  "/",
  authenticate,
  getCertificationsValidation,
  validate,
  asyncHandler(getAllCertifications),
);

// Get a single certification by ID (admin view)
router.get(
  "/:id",
  authenticate,
  certificationIdValidation,
  validate,
  asyncHandler(getCertificationById),
);

// Create a certification (admin view)
router.post(
  "/",
  authenticate,
  createCertificationValidation,
  validate,
  asyncHandler(createCertification),
);

// Update a certification by ID (admin view)
router.put(
  "/:id",
  authenticate,
  certificationIdValidation,
  updateCertificationValidation,
  validate,
  asyncHandler(updateCertification),
);

// Delete a certification by ID (admin view)
router.delete(
  "/:id",
  authenticate,
  certificationIdValidation,
  validate,
  asyncHandler(deleteCertification),
);

export default router;
