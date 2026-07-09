import WebsiteSetting from '../models/WebsiteSetting.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { logger } from '../utils/logger.js';

/**
 * Get website settings (singleton)
 */
export const getWebsiteSettings = async (req, res, next) => {
  try {
    let settings = await WebsiteSetting.findOne();

    if (!settings) {
      settings = await WebsiteSetting.create({});
    }

    return res.status(200).json(
      ApiResponse.success('Website settings retrieved successfully', settings)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update website settings
 */
export const updateWebsiteSettings = async (req, res, next) => {
  try {
    const updateData = req.body;

    let settings = await WebsiteSetting.findOne();

    if (!settings) {
      settings = await WebsiteSetting.create(updateData);
    } else {
      settings = await WebsiteSetting.findByIdAndUpdate(
        settings._id,
        updateData,
        { new: true, runValidators: true }
      );
    }

    logger.info('Website settings updated');

    return res.status(200).json(
      ApiResponse.success('Website settings updated successfully', settings)
    );
  } catch (error) {
    next(error);
  }
};
