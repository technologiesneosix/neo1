import NewsletterSubscriber from "../models/NewsletterSubscriber.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { logger } from "../utils/logger.js";

/**
 * Create a new newsletter subscription
 */
export const createNewsletterSubscription = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check if subscriber already exists
    const existingSubscriber = await NewsletterSubscriber.findOne({ email });

    if (existingSubscriber) {
      // If already subscribed, return success without error
      if (existingSubscriber.isSubscribed) {
        return res.status(200).json(
          ApiResponse.success("Already subscribed to newsletter", {
            message: "You are already subscribed to our newsletter",
          }),
        );
      }

      // If previously unsubscribed, reactivate
      existingSubscriber.isSubscribed = true;
      await existingSubscriber.save();

      logger.info(`Newsletter subscription reactivated for ${email}`);

      return res.status(200).json(
        ApiResponse.success("Subscription reactivated successfully", {
          message: "Your subscription has been reactivated",
        }),
      );
    }

    // Create new subscriber
    const subscriber = await NewsletterSubscriber.create({
      email,
      isSubscribed: true,
    });

    logger.info(`New newsletter subscription for ${email}`);

    return res.status(201).json(
      ApiResponse.success("Successfully subscribed to newsletter", {
        id: subscriber._id,
        message: "You have been successfully subscribed to our newsletter",
      }),
    );
  } catch (error) {
    logger.error("Newsletter subscription error:", error);
    next(error);
  }
};

/**
 * Get all newsletter subscribers (Admin)
 */
export const getAllNewsletterSubscribers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    const query = {};
    if (search) {
      query.email = { $regex: search, $options: "i" };
    }

    const skip = (page - 1) * limit;

    const [subscribers, total] = await Promise.all([
      NewsletterSubscriber.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      NewsletterSubscriber.countDocuments(query),
    ]);

    return res.status(200).json(
      ApiResponse.success("Newsletter subscribers retrieved successfully", {
        subscribers,
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
 * Get newsletter subscriber by ID (Admin)
 */
export const getNewsletterSubscriberById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subscriber = await NewsletterSubscriber.findById(id);

    if (!subscriber) {
      throw ApiError.notFound("Subscriber not found");
    }

    return res
      .status(200)
      .json(
        ApiResponse.success("Subscriber retrieved successfully", subscriber),
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Update newsletter subscriber (Admin)
 */
export const updateNewsletterSubscriber = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const subscriber = await NewsletterSubscriber.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true },
    );

    if (!subscriber) {
      throw ApiError.notFound("Subscriber not found");
    }

    logger.info(`Subscriber updated for ID ${id}`);
    return res
      .status(200)
      .json(ApiResponse.success("Subscriber updated successfully", subscriber));
  } catch (error) {
    next(error);
  }
};

/**
 * Delete newsletter subscriber (Admin)
 */
export const deleteNewsletterSubscriber = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subscriber = await NewsletterSubscriber.findByIdAndDelete(id);

    if (!subscriber) {
      throw ApiError.notFound("Subscriber not found");
    }

    logger.info(`Subscriber deleted for ID ${id}`);
    return res
      .status(200)
      .json(ApiResponse.success("Subscriber deleted successfully"));
  } catch (error) {
    next(error);
  }
};
