import { Router } from "express";
import { asyncHandler, authenticate } from "../../middleware/index.js";
import { validate } from "../../middleware/index.js";
import {
  createTeamValidation,
  updateTeamValidation,
  teamIdValidation,
  getTeamValidation,
  updateTeamStatusValidation,
  updateTeamDisplayOrderValidation,
} from "../../validations/teamValidation.js";
import {
  createTeamMember,
  getAllTeamMembers,
  getTeamMemberById,
  updateTeamMember,
  updateTeamMemberStatus,
  updateTeamMemberDisplayOrder,
  deleteTeamMember,
} from "../../controllers/teamController.js";

const router = Router();

/**
 * @route   POST /api/v1/admin/team
 * @desc    Create team member
 * @access  Private (Admin)
 */
router.post(
  "/",
  authenticate,
  createTeamValidation,
  validate,
  asyncHandler(createTeamMember),
);

/**
 * @route   GET /api/v1/admin/team
 * @desc    Get all team members
 * @access  Private (Admin)
 */
router.get(
  "/",
  authenticate,
  getTeamValidation,
  validate,
  asyncHandler(getAllTeamMembers),
);

/**
 * @route   GET /api/v1/admin/team/:id
 * @desc    Get team member by ID
 * @access  Private (Admin)
 */
router.get(
  "/:id",
  authenticate,
  teamIdValidation,
  validate,
  asyncHandler(getTeamMemberById),
);

/**
 * @route   PUT /api/v1/admin/team/:id
 * @desc    Update team member
 * @access  Private (Admin)
 */
router.put(
  "/:id",
  authenticate,
  teamIdValidation,
  updateTeamValidation,
  validate,
  asyncHandler(updateTeamMember),
);

/**
 * @route   PATCH /api/v1/admin/team/:id/status
 * @desc    Update team member status
 * @access  Private (Admin)
 */
router.patch(
  "/:id/status",
  authenticate,
  updateTeamStatusValidation,
  validate,
  asyncHandler(updateTeamMemberStatus),
);

/**
 * @route   PATCH /api/v1/admin/team/:id/display-order
 * @desc    Update team member display order
 * @access  Private (Admin)
 */
router.patch(
  "/:id/display-order",
  authenticate,
  updateTeamDisplayOrderValidation,
  validate,
  asyncHandler(updateTeamMemberDisplayOrder),
);

/**
 * @route   DELETE /api/v1/admin/team/:id
 * @desc    Delete team member
 * @access  Private (Admin)
 */
router.delete(
  "/:id",
  authenticate,
  teamIdValidation,
  validate,
  asyncHandler(deleteTeamMember),
);

export default router;
