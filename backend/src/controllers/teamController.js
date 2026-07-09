import Team from '../models/Team.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { logger } from '../utils/logger.js';

/**
 * Create team member
 */
export const createTeamMember = async (req, res, next) => {
  try {
    const teamData = req.body;

    const teamMember = await Team.create(teamData);

    logger.info(`Team member created: ${teamMember.name}`);

    return res.status(201).json(
      ApiResponse.success('Team member created successfully', teamMember)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all team members
 */
export const getAllTeamMembers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, search, sortBy = 'displayOrder', sortOrder = 'asc' } = req.query;

    const query = {};
    
    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [teamMembers, total] = await Promise.all([
      Team.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      Team.countDocuments(query),
    ]);

    return res.status(200).json(
      ApiResponse.success('Team members retrieved successfully', {
        teamMembers,
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
 * Get team member by ID
 */
export const getTeamMemberById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const teamMember = await Team.findById(id);

    if (!teamMember) {
      throw ApiError.notFound('Team member not found');
    }

    return res.status(200).json(
      ApiResponse.success('Team member retrieved successfully', teamMember)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update team member
 */
export const updateTeamMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const teamMember = await Team.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!teamMember) {
      throw ApiError.notFound('Team member not found');
    }

    logger.info(`Team member updated: ${teamMember.name}`);

    return res.status(200).json(
      ApiResponse.success('Team member updated successfully', teamMember)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update team member status
 */
export const updateTeamMemberStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive'].includes(status)) {
      throw ApiError.badRequest('Invalid status value');
    }

    const teamMember = await Team.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!teamMember) {
      throw ApiError.notFound('Team member not found');
    }

    logger.info(`Team member status updated: ${teamMember.name} - ${status}`);

    return res.status(200).json(
      ApiResponse.success('Team member status updated successfully', teamMember)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update team member display order
 */
export const updateTeamMemberDisplayOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { displayOrder } = req.body;

    const order = parseInt(displayOrder, 10);
    
    if (isNaN(order) || order < 0) {
      throw ApiError.badRequest('Display order must be a non-negative number');
    }

    const teamMember = await Team.findByIdAndUpdate(
      id,
      { displayOrder: order },
      { new: true, runValidators: true }
    );

    if (!teamMember) {
      throw ApiError.notFound('Team member not found');
    }

    logger.info(`Team member display order updated: ${teamMember.name} - ${order}`);

    return res.status(200).json(
      ApiResponse.success('Team member display order updated successfully', teamMember)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete team member
 */
export const deleteTeamMember = async (req, res, next) => {
  try {
    const { id } = req.params;

    const teamMember = await Team.findByIdAndDelete(id);

    if (!teamMember) {
      throw ApiError.notFound('Team member not found');
    }

    logger.info(`Team member deleted: ${teamMember.name}`);

    return res.status(200).json(
      ApiResponse.success('Team member deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};
