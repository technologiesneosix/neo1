import Admin from '../models/Admin.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { logger } from '../utils/logger.js';

/**
 * Create a new user (Admin)
 */
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, avatar, isActive } = req.body;

    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      throw ApiError.badRequest('User with this email already exists');
    }

    const user = await Admin.create({
      name,
      email,
      password,
      phone: phone || null,
      avatar: avatar || null,
      isActive: isActive !== undefined ? isActive : true,
    });

    logger.info(`Admin user created: ${email}`);

    return res.status(201).json(
      ApiResponse.success('User created successfully', user)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all users
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      Admin.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Admin.countDocuments(query),
    ]);

    return res.status(200).json(
      ApiResponse.success('Users retrieved successfully', {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await Admin.findById(id);

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    return res.status(200).json(
      ApiResponse.success('User retrieved successfully', user)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update user
 */
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // If password is blank, don't update it
    if (updateData.password === '' || updateData.password === undefined) {
      delete updateData.password;
    }

    const user = await Admin.findById(id);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    // Apply updates
    Object.assign(user, updateData);
    await user.save();

    logger.info(`User updated: ${user.email}`);

    return res.status(200).json(
      ApiResponse.success('User updated successfully', user)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check count: Do not delete the last user
    const totalUsers = await Admin.countDocuments();
    if (totalUsers <= 1) {
      throw ApiError.badRequest('Cannot delete the last admin user');
    }

    const user = await Admin.findByIdAndDelete(id);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    logger.info(`User deleted: ${user.email}`);

    return res.status(200).json(
      ApiResponse.success('User deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};
