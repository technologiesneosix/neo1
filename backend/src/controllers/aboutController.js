import About from '../models/About.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { logger } from '../utils/logger.js';

/**
 * Get about section (singleton)
 */
export const getAbout = async (req, res, next) => {
  try {
    let about = await About.findOne();

    if (!about) {
      about = await About.create({});
    }

    return res.status(200).json(
      ApiResponse.success('About retrieved successfully', about)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update about section
 */
export const updateAbout = async (req, res, next) => {
  try {
    const updateData = req.body;

    let about = await About.findOne();

    if (!about) {
      about = await About.create(updateData);
    } else {
      about = await About.findByIdAndUpdate(
        about._id,
        updateData,
        { new: true, runValidators: true }
      );
    }

    logger.info('About section updated');

    return res.status(200).json(
      ApiResponse.success('About updated successfully', about)
    );
  } catch (error) {
    next(error);
  }
};
