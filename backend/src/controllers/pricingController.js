import PricingPlan from '../models/PricingPlan.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { logger } from '../utils/logger.js';

/**
 * Create pricing plan
 */
export const createPricingPlan = async (req, res, next) => {
  try {
    const planData = req.body;
    const plan = await PricingPlan.create(planData);
    logger.info(`Pricing Plan created: ${plan.name}`);
    return res.status(201).json(
      ApiResponse.success('Pricing Plan created successfully', plan)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all pricing plans (admin list with search & pagination)
 */
export const getAllPricingPlans = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, sortBy = 'displayOrder', sortOrder = 'asc' } = req.query;

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

    const [plans, total] = await Promise.all([
      PricingPlan.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      PricingPlan.countDocuments(query),
    ]);

    return res.status(200).json(
      ApiResponse.success('Pricing Plans retrieved successfully', {
        plans,
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
 * Get pricing plan by ID
 */
export const getPricingPlanById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const plan = await PricingPlan.findById(id);

    if (!plan) {
      throw ApiError.notFound('Pricing Plan not found');
    }

    return res.status(200).json(
      ApiResponse.success('Pricing Plan retrieved successfully', plan)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update pricing plan
 */
export const updatePricingPlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const plan = await PricingPlan.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!plan) {
      throw ApiError.notFound('Pricing Plan not found');
    }

    logger.info(`Pricing Plan updated: ${plan.name}`);

    return res.status(200).json(
      ApiResponse.success('Pricing Plan updated successfully', plan)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete pricing plan
 */
export const deletePricingPlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const plan = await PricingPlan.findByIdAndDelete(id);

    if (!plan) {
      throw ApiError.notFound('Pricing Plan not found');
    }

    logger.info(`Pricing Plan deleted: ${plan.name}`);

    return res.status(200).json(
      ApiResponse.success('Pricing Plan deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};
