import SEO from "../models/SEO.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { logger } from "../utils/logger.js";

/**
 * Get SEO settings (singleton)
 */
export const getSEO = async (req, res, next) => {
  try {
    let seo = await SEO.findOne();

    if (!seo) {
      seo = await SEO.create({});
    }

    return res
      .status(200)
      .json(ApiResponse.success("SEO settings retrieved successfully", seo));
  } catch (error) {
    next(error);
  }
};

/**
 * Update SEO settings
 */
export const updateSEO = async (req, res, next) => {
  try {
    const updateData = req.body;

    let seo = await SEO.findOne();

    if (!seo) {
      seo = await SEO.create(updateData);
    } else {
      seo = await SEO.findByIdAndUpdate(seo._id, updateData, {
        new: true,
        runValidators: true,
      });
    }

    logger.info("SEO settings updated");

    return res
      .status(200)
      .json(ApiResponse.success("SEO settings updated successfully", seo));
  } catch (error) {
    next(error);
  }
};
