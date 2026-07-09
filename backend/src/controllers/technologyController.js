import Technology from '../models/Technology.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { logger } from '../utils/logger.js';

/**
 * Create technology
 */
export const createTechnology = async (req, res, next) => {
  try {
    const technologyData = req.body;

    const technology = await Technology.create(technologyData);

    logger.info(`Technology created: ${technology.name}`);

    return res.status(201).json(
      ApiResponse.success('Technology created successfully', technology)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all technologies
 */
export const getAllTechnologies = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, category, search, sortBy = 'displayOrder', sortOrder = 'asc' } = req.query;

    const query = {};
    
    if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [technologies, total] = await Promise.all([
      Technology.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      Technology.countDocuments(query),
    ]);

    return res.status(200).json(
      ApiResponse.success('Technologies retrieved successfully', {
        technologies,
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
 * Get technology by ID
 */
export const getTechnologyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const technology = await Technology.findById(id);

    if (!technology) {
      throw ApiError.notFound('Technology not found');
    }

    return res.status(200).json(
      ApiResponse.success('Technology retrieved successfully', technology)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get technology by slug
 */
export const getTechnologyBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const technology = await Technology.findOne({ slug });

    if (!technology) {
      throw ApiError.notFound('Technology not found');
    }

    return res.status(200).json(
      ApiResponse.success('Technology retrieved successfully', technology)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update technology
 */
export const updateTechnology = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const technology = await Technology.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!technology) {
      throw ApiError.notFound('Technology not found');
    }

    logger.info(`Technology updated: ${technology.name}`);

    return res.status(200).json(
      ApiResponse.success('Technology updated successfully', technology)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update technology status
 */
export const updateTechnologyStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['draft', 'published', 'archived'].includes(status)) {
      throw ApiError.badRequest('Invalid status value');
    }

    const technology = await Technology.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!technology) {
      throw ApiError.notFound('Technology not found');
    }

    logger.info(`Technology status updated: ${technology.name} - ${status}`);

    return res.status(200).json(
      ApiResponse.success('Technology status updated successfully', technology)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update technology display order
 */
export const updateTechnologyDisplayOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { displayOrder } = req.body;

    const order = parseInt(displayOrder, 10);
    
    if (isNaN(order) || order < 0) {
      throw ApiError.badRequest('Display order must be a non-negative number');
    }

    const technology = await Technology.findByIdAndUpdate(
      id,
      { displayOrder: order },
      { new: true, runValidators: true }
    );

    if (!technology) {
      throw ApiError.notFound('Technology not found');
    }

    logger.info(`Technology display order updated: ${technology.name} - ${order}`);

    return res.status(200).json(
      ApiResponse.success('Technology display order updated successfully', technology)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete technology
 */
export const deleteTechnology = async (req, res, next) => {
  try {
    const { id } = req.params;

    const technology = await Technology.findByIdAndDelete(id);

    if (!technology) {
      throw ApiError.notFound('Technology not found');
    }

    logger.info(`Technology deleted: ${technology.name}`);

    return res.status(200).json(
      ApiResponse.success('Technology deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};
