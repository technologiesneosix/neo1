import Certification from '../models/Certification.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { logger } from '../utils/logger.js';

/**
 * Create certification
 */
export const createCertification = async (req, res, next) => {
  try {
    const certificationData = req.body;
    const certification = await Certification.create(certificationData);
    logger.info(`Certification created: ${certification.name}`);
    return res.status(201).json(
      ApiResponse.success('Certification created successfully', certification)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all certifications (admin)
 */
export const getAllCertifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, status, sortBy = 'displayOrder', sortOrder = 'asc' } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { issuer: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [certifications, total] = await Promise.all([
      Certification.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      Certification.countDocuments(query),
    ]);

    return res.status(200).json(
      ApiResponse.success('Certifications retrieved successfully', {
        certifications,
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
 * Get certification by ID
 */
export const getCertificationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const certification = await Certification.findById(id);

    if (!certification) {
      throw ApiError.notFound('Certification not found');
    }

    return res.status(200).json(
      ApiResponse.success('Certification retrieved successfully', certification)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update certification
 */
export const updateCertification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const certification = await Certification.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!certification) {
      throw ApiError.notFound('Certification not found');
    }

    logger.info(`Certification updated: ${certification.name}`);

    return res.status(200).json(
      ApiResponse.success('Certification updated successfully', certification)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete certification
 */
export const deleteCertification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const certification = await Certification.findByIdAndDelete(id);

    if (!certification) {
      throw ApiError.notFound('Certification not found');
    }

    logger.info(`Certification deleted: ${certification.name}`);

    return res.status(200).json(
      ApiResponse.success('Certification deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};
