import FAQ from "../models/FAQ.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { logger } from "../utils/logger.js";

/**
 * Create FAQ
 */
export const createFAQ = async (req, res, next) => {
  try {
    const faqData = req.body;

    const faq = await FAQ.create(faqData);

    logger.info(`FAQ created: ${faq.question}`);

    return res
      .status(201)
      .json(ApiResponse.success("FAQ created successfully", faq));
  } catch (error) {
    next(error);
  }
};

/**
 * Get all FAQs
 */
export const getAllFAQs = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      search,
      sortBy = "displayOrder",
      sortOrder = "asc",
    } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { question: { $regex: search, $options: "i" } },
        { answer: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const [faqs, total] = await Promise.all([
      FAQ.find(query).sort(sortOptions).skip(skip).limit(parseInt(limit)),
      FAQ.countDocuments(query),
    ]);

    return res.status(200).json(
      ApiResponse.success("FAQs retrieved successfully", {
        faqs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      }),
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get FAQ by ID
 */
export const getFAQById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const faq = await FAQ.findById(id);

    if (!faq) {
      throw ApiError.notFound("FAQ not found");
    }

    return res
      .status(200)
      .json(ApiResponse.success("FAQ retrieved successfully", faq));
  } catch (error) {
    next(error);
  }
};

/**
 * Update FAQ
 */
export const updateFAQ = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const faq = await FAQ.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!faq) {
      throw ApiError.notFound("FAQ not found");
    }

    logger.info(`FAQ updated: ${faq.question}`);

    return res
      .status(200)
      .json(ApiResponse.success("FAQ updated successfully", faq));
  } catch (error) {
    next(error);
  }
};

/**
 * Update FAQ status
 */
export const updateFAQStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      throw ApiError.badRequest("Invalid status value");
    }

    const faq = await FAQ.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );

    if (!faq) {
      throw ApiError.notFound("FAQ not found");
    }

    logger.info(`FAQ status updated: ${faq.question} - ${status}`);

    return res
      .status(200)
      .json(ApiResponse.success("FAQ status updated successfully", faq));
  } catch (error) {
    next(error);
  }
};

/**
 * Update FAQ display order
 */
export const updateFAQDisplayOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { displayOrder } = req.body;

    const order = parseInt(displayOrder, 10);

    if (isNaN(order) || order < 0) {
      throw ApiError.badRequest("Display order must be a non-negative number");
    }

    const faq = await FAQ.findByIdAndUpdate(
      id,
      { displayOrder: order },
      { new: true, runValidators: true },
    );

    if (!faq) {
      throw ApiError.notFound("FAQ not found");
    }

    logger.info(`FAQ display order updated: ${faq.question} - ${order}`);

    return res
      .status(200)
      .json(ApiResponse.success("FAQ display order updated successfully", faq));
  } catch (error) {
    next(error);
  }
};

/**
 * Delete FAQ
 */
export const deleteFAQ = async (req, res, next) => {
  try {
    const { id } = req.params;

    const faq = await FAQ.findByIdAndDelete(id);

    if (!faq) {
      throw ApiError.notFound("FAQ not found");
    }

    logger.info(`FAQ deleted: ${faq.question}`);

    return res
      .status(200)
      .json(ApiResponse.success("FAQ deleted successfully"));
  } catch (error) {
    next(error);
  }
};
