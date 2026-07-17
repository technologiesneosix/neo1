import Solution from "../models/Solution.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { logger } from "../utils/logger.js";

/**
 * Create solution
 */
export const createSolution = async (req, res, next) => {
  try {
    const solutionData = req.body;

    const solution = await Solution.create(solutionData);

    logger.info(`Solution created: ${solution.title}`);

    return res
      .status(201)
      .json(ApiResponse.success("Solution created successfully", solution));
  } catch (error) {
    next(error);
  }
};

/**
 * Get all solutions
 */
export const getAllSolutions = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      industry,
      technology,
    } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (industry) {
      query.industries = industry;
    }

    if (technology) {
      query.technologies = technology;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [solutions, total] = await Promise.all([
      Solution.find(query)
        .populate("industries", "title slug")
        .populate("technologies", "name slug logo")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Solution.countDocuments(query),
    ]);

    return res.status(200).json(
      ApiResponse.success("Solutions retrieved successfully", {
        solutions,
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
 * Get solution by ID
 */
export const getSolutionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const solution = await Solution.findById(id)
      .populate("industries", "title slug")
      .populate("technologies", "name slug logo");

    if (!solution) {
      throw ApiError.notFound("Solution not found");
    }

    return res
      .status(200)
      .json(ApiResponse.success("Solution retrieved successfully", solution));
  } catch (error) {
    next(error);
  }
};

/**
 * Get solution by slug
 */
export const getSolutionBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const solution = await Solution.findOne({ slug })
      .populate("industries", "title slug")
      .populate("technologies", "name slug logo");

    if (!solution) {
      throw ApiError.notFound("Solution not found");
    }

    return res
      .status(200)
      .json(ApiResponse.success("Solution retrieved successfully", solution));
  } catch (error) {
    next(error);
  }
};

/**
 * Update solution
 */
export const updateSolution = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const solution = await Solution.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("industries", "title slug")
      .populate("technologies", "name slug logo");

    if (!solution) {
      throw ApiError.notFound("Solution not found");
    }

    logger.info(`Solution updated: ${solution.title}`);

    return res
      .status(200)
      .json(ApiResponse.success("Solution updated successfully", solution));
  } catch (error) {
    next(error);
  }
};

/**
 * Update solution status
 */
export const updateSolutionStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["draft", "published", "archived"].includes(status)) {
      throw ApiError.badRequest("Invalid status value");
    }

    const solution = await Solution.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );

    if (!solution) {
      throw ApiError.notFound("Solution not found");
    }

    logger.info(`Solution status updated: ${solution.title} - ${status}`);

    return res
      .status(200)
      .json(
        ApiResponse.success("Solution status updated successfully", solution),
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete solution
 */
export const deleteSolution = async (req, res, next) => {
  try {
    const { id } = req.params;

    const solution = await Solution.findByIdAndDelete(id);

    if (!solution) {
      throw ApiError.notFound("Solution not found");
    }

    logger.info(`Solution deleted: ${solution.title}`);

    return res
      .status(200)
      .json(ApiResponse.success("Solution deleted successfully"));
  } catch (error) {
    next(error);
  }
};
