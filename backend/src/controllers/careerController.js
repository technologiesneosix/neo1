import Career from '../models/Career.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { logger } from '../utils/logger.js';

/**
 * Create career
 */
export const createCareer = async (req, res, next) => {
  try {
    const careerData = req.body;

    const career = await Career.create(careerData);

    logger.info(`Career created: ${career.title}`);

    return res.status(201).json(
      ApiResponse.success('Career created successfully', career)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all careers
 */
export const getAllCareers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, department, employmentType, experience, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const query = {};
    
    if (status) {
      query.status = status;
    }

    if (department) {
      query.department = department;
    }

    if (employmentType) {
      query.employmentType = employmentType;
    }

    if (experience) {
      query.experience = experience;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [careers, total] = await Promise.all([
      Career.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      Career.countDocuments(query),
    ]);

    return res.status(200).json(
      ApiResponse.success('Careers retrieved successfully', {
        careers,
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
 * Get career by ID
 */
export const getCareerById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const career = await Career.findById(id);

    if (!career) {
      throw ApiError.notFound('Career not found');
    }

    return res.status(200).json(
      ApiResponse.success('Career retrieved successfully', career)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update career
 */
export const updateCareer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const career = await Career.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!career) {
      throw ApiError.notFound('Career not found');
    }

    logger.info(`Career updated: ${career.title}`);

    return res.status(200).json(
      ApiResponse.success('Career updated successfully', career)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update career status
 */
export const updateCareerStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['open', 'closed', 'on-hold'].includes(status)) {
      throw ApiError.badRequest('Invalid status value');
    }

    const career = await Career.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!career) {
      throw ApiError.notFound('Career not found');
    }

    logger.info(`Career status updated: ${career.title} - ${status}`);

    return res.status(200).json(
      ApiResponse.success('Career status updated successfully', career)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete career
 */
export const deleteCareer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const career = await Career.findByIdAndDelete(id);

    if (!career) {
      throw ApiError.notFound('Career not found');
    }

    logger.info(`Career deleted: ${career.title}`);

    return res.status(200).json(
      ApiResponse.success('Career deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};
