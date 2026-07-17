import { Router } from "express";
import express from "express";
import { asyncHandler, authenticate } from "../../middleware/index.js";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../../controllers/userController.js";

const router = Router();

// Apply body parsing to user routes
router.use(express.json({ limit: "10mb" }));
router.use(express.urlencoded({ extended: true, limit: "10mb" }));

/**
 * @route   POST /api/v1/users
 * @desc    Create a user
 * @access  Private (Admin)
 */
router.post("/", authenticate, asyncHandler(createUser));

/**
 * @route   GET /api/v1/users
 * @desc    Get all users with pagination
 * @access  Private (Admin)
 */
router.get("/", authenticate, asyncHandler(getAllUsers));

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get user by ID
 * @access  Private (Admin)
 */
router.get("/:id", authenticate, asyncHandler(getUserById));

/**
 * @route   PUT /api/v1/users/:id
 * @desc    Update user
 * @access  Private (Admin)
 */
router.put("/:id", authenticate, asyncHandler(updateUser));

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Delete user
 * @access  Private (Admin)
 */
router.delete("/:id", authenticate, asyncHandler(deleteUser));

export default router;
