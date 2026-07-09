import Industry from '../models/Industry.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { logger } from '../utils/logger.js';

/**
 * Create industry
 */
export const createIndustry = async (req, res, next) => {
  try {
    const industryData = req.body;

    const industry = await Industry.create(industryData);

    logger.info(`Industry created: ${industry.title}`);

    return res.status(201).json(
      ApiResponse.success('Industry created successfully', industry)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all industries
 */
export const getAllIndustries = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;

    const query = {};
    
    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [industries, total] = await Promise.all([
      Industry.find(query)
        .populate('services', 'title slug')
        .populate('projects', 'title slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Industry.countDocuments(query),
    ]);

    return res.status(200).json(
      ApiResponse.success('Industries retrieved successfully', {
        industries,
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
 * Get industry by ID
 */
export const getIndustryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const industry = await Industry.findById(id)
      .populate('services', 'title slug')
      .populate('projects', 'title slug');

    if (!industry) {
      throw ApiError.notFound('Industry not found');
    }

    return res.status(200).json(
      ApiResponse.success('Industry retrieved successfully', industry)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get industry by slug
 */
export const getIndustryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const industry = await Industry.findOne({ slug })
      .populate('services', 'title slug')
      .populate('projects', 'title slug');

    if (!industry) {
      throw ApiError.notFound('Industry not found');
    }

    return res.status(200).json(
      ApiResponse.success('Industry retrieved successfully', industry)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update industry
 */
export const updateIndustry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const industry = await Industry.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('services', 'title slug')
     .populate('projects', 'title slug');

    if (!industry) {
      throw ApiError.notFound('Industry not found');
    }

    logger.info(`Industry updated: ${industry.title}`);

    return res.status(200).json(
      ApiResponse.success('Industry updated successfully', industry)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update industry status
 */
export const updateIndustryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['draft', 'published', 'archived'].includes(status)) {
      throw ApiError.badRequest('Invalid status value');
    }

    const industry = await Industry.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!industry) {
      throw ApiError.notFound('Industry not found');
    }

    logger.info(`Industry status updated: ${industry.title} - ${status}`);

    return res.status(200).json(
      ApiResponse.success('Industry status updated successfully', industry)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete industry
 */
export const deleteIndustry = async (req, res, next) => {
  try {
    const { id } = req.params;

    const industry = await Industry.findByIdAndDelete(id);

    if (!industry) {
      throw ApiError.notFound('Industry not found');
    }

    logger.info(`Industry deleted: ${industry.title}`);

    return res.status(200).json(
      ApiResponse.success('Industry deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};
