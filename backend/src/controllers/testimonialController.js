import Testimonial from '../models/Testimonial.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { logger } from '../utils/logger.js';

/**
 * Create testimonial
 */
export const createTestimonial = async (req, res, next) => {
  try {
    const testimonialData = req.body;

    const testimonial = await Testimonial.create(testimonialData);

    logger.info(`Testimonial created: ${testimonial.clientName}`);

    return res.status(201).json(
      ApiResponse.success('Testimonial created successfully', testimonial)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all testimonials
 */
export const getAllTestimonials = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, featured, rating, search, sortBy = 'displayOrder', sortOrder = 'asc' } = req.query;

    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    if (rating) {
      query.rating = parseInt(rating);
    }

    if (search) {
      query.$or = [
        { clientName: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { review: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [testimonials, total] = await Promise.all([
      Testimonial.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      Testimonial.countDocuments(query),
    ]);

    return res.status(200).json(
      ApiResponse.success('Testimonials retrieved successfully', {
        testimonials,
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
 * Get testimonial by ID
 */
export const getTestimonialById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      throw ApiError.notFound('Testimonial not found');
    }

    return res.status(200).json(
      ApiResponse.success('Testimonial retrieved successfully', testimonial)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update testimonial
 */
export const updateTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      throw ApiError.notFound('Testimonial not found');
    }

    logger.info(`Testimonial updated: ${testimonial.clientName}`);

    return res.status(200).json(
      ApiResponse.success('Testimonial updated successfully', testimonial)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle testimonial featured status
 */
export const toggleTestimonialFeatured = async (req, res, next) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      throw ApiError.notFound('Testimonial not found');
    }

    testimonial.featured = !testimonial.featured;
    await testimonial.save();

    logger.info(`Testimonial featured toggled: ${testimonial.clientName} - ${testimonial.featured}`);

    return res.status(200).json(
      ApiResponse.success('Testimonial featured status toggled successfully', testimonial)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update testimonial status
 */
export const updateTestimonialStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive'].includes(status)) {
      throw ApiError.badRequest('Invalid status value');
    }

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      throw ApiError.notFound('Testimonial not found');
    }

    logger.info(`Testimonial status updated: ${testimonial.clientName} - ${status}`);

    return res.status(200).json(
      ApiResponse.success('Testimonial status updated successfully', testimonial)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update testimonial display order
 */
export const updateTestimonialDisplayOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { displayOrder } = req.body;

    const order = parseInt(displayOrder, 10);
    
    if (isNaN(order) || order < 0) {
      throw ApiError.badRequest('Display order must be a non-negative number');
    }

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { displayOrder: order },
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      throw ApiError.notFound('Testimonial not found');
    }

    logger.info(`Testimonial display order updated: ${testimonial.clientName} - ${order}`);

    return res.status(200).json(
      ApiResponse.success('Testimonial display order updated successfully', testimonial)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete testimonial
 */
export const deleteTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      throw ApiError.notFound('Testimonial not found');
    }

    logger.info(`Testimonial deleted: ${testimonial.clientName}`);

    return res.status(200).json(
      ApiResponse.success('Testimonial deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};
