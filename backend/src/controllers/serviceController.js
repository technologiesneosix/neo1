import Service from "../models/Service.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { logger } from "../utils/logger.js";

/**
 * Create service
 */
export const createService = async (req, res, next) => {
  try {
    const serviceData = req.body;
    const service = await Service.create(serviceData);
    logger.info(`Service created: ${service.title}`);
    return res
      .status(201)
      .json(ApiResponse.success("Service created successfully", service));
  } catch (error) {
    next(error);
  }
};

/**
 * Get all services
 */
export const getAllServices = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, search, featured } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    }
    if (featured !== undefined) {
      query.isFeatured = featured === "true";
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [services, total] = await Promise.all([
      Service.find(query)
        .populate("technologies", "name slug logo")
        .sort({ displayOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Service.countDocuments(query),
    ]);

    return res.status(200).json(
      ApiResponse.success("Services retrieved successfully", {
        services,
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
 * Get service by ID
 */
export const getServiceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id).populate(
      "technologies",
      "name slug logo",
    );

    if (!service) {
      throw ApiError.notFound("Service not found");
    }

    return res
      .status(200)
      .json(ApiResponse.success("Service retrieved successfully", service));
  } catch (error) {
    next(error);
  }
};

/**
 * Update service
 */
export const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const service = await Service.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("technologies", "name slug logo");

    if (!service) {
      throw ApiError.notFound("Service not found");
    }

    logger.info(`Service updated: ${service.title}`);
    return res
      .status(200)
      .json(ApiResponse.success("Service updated successfully", service));
  } catch (error) {
    next(error);
  }
};

/**
 * Delete service
 */
export const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      throw ApiError.notFound("Service not found");
    }

    logger.info(`Service deleted: ${service.title}`);
    return res
      .status(200)
      .json(ApiResponse.success("Service deleted successfully"));
  } catch (error) {
    next(error);
  }
};
