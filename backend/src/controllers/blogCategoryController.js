import BlogCategory from '../models/BlogCategory.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { logger } from '../utils/logger.js';

/**
 * Create blog category
 */
export const createBlogCategory = async (req, res, next) => {
  try {
    const categoryData = req.body;

    const category = await BlogCategory.create(categoryData);

    logger.info(`Blog category created: ${category.name}`);

    return res.status(201).json(
      ApiResponse.success('Blog category created successfully', category)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all blog categories
 */
export const getAllBlogCategories = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [categories, total] = await Promise.all([
      BlogCategory.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      BlogCategory.countDocuments(query),
    ]);

    return res.status(200).json(
      ApiResponse.success('Blog categories retrieved successfully', {
        categories,
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
 * Get blog category by ID
 */
export const getBlogCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await BlogCategory.findById(id);

    if (!category) {
      throw ApiError.notFound('Blog category not found');
    }

    return res.status(200).json(
      ApiResponse.success('Blog category retrieved successfully', category)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get blog category by slug
 */
export const getBlogCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const category = await BlogCategory.findOne({ slug });

    if (!category) {
      throw ApiError.notFound('Blog category not found');
    }

    return res.status(200).json(
      ApiResponse.success('Blog category retrieved successfully', category)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update blog category
 */
export const updateBlogCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const category = await BlogCategory.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!category) {
      throw ApiError.notFound('Blog category not found');
    }

    logger.info(`Blog category updated: ${category.name}`);

    return res.status(200).json(
      ApiResponse.success('Blog category updated successfully', category)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete blog category
 */
export const deleteBlogCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await BlogCategory.findByIdAndDelete(id);

    if (!category) {
      throw ApiError.notFound('Blog category not found');
    }

    logger.info(`Blog category deleted: ${category.name}`);

    return res.status(200).json(
      ApiResponse.success('Blog category deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};
