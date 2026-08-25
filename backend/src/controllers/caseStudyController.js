import CaseStudy from "../models/CaseStudy.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { logger } from "../utils/logger.js";

/**
 * Create case study
 */
export const createCaseStudy = async (req, res, next) => {
  try {
    const caseStudyData = req.body;

    const caseStudy = await CaseStudy.create(caseStudyData);

    logger.info(`Case Study created: ${caseStudy.title}`);

    return res
      .status(201)
      .json(ApiResponse.success("Case Study created successfully", caseStudy));
  } catch (error) {
    next(error);
  }
};

/**
 * Get all case studies
 */
export const getAllCaseStudies = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { client: { $regex: search, $options: "i" } },
        { industry: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const [caseStudies, total] = await Promise.all([
      CaseStudy.find(query)
        .populate("projectId", "title slug")
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      CaseStudy.countDocuments(query),
    ]);

    return res.status(200).json(
      ApiResponse.success("Case studies retrieved successfully", {
        caseStudies,
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
 * Get case study by ID
 */
export const getCaseStudyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const caseStudy = await CaseStudy.findById(id).populate("projectId", "title slug");

    if (!caseStudy) {
      throw ApiError.notFound("Case Study not found");
    }

    return res
      .status(200)
      .json(ApiResponse.success("Case Study retrieved successfully", caseStudy));
  } catch (error) {
    next(error);
  }
};

/**
 * Get case study by slug
 */
export const getCaseStudyBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const caseStudy = await CaseStudy.findOne({ slug }).populate("projectId", "title slug");

    if (!caseStudy) {
      throw ApiError.notFound("Case Study not found");
    }

    return res
      .status(200)
      .json(ApiResponse.success("Case Study retrieved successfully", caseStudy));
  } catch (error) {
    next(error);
  }
};

/**
 * Update case study
 */
export const updateCaseStudy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const caseStudy = await CaseStudy.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("projectId", "title slug");

    if (!caseStudy) {
      throw ApiError.notFound("Case Study not found");
    }

    logger.info(`Case Study updated: ${caseStudy.title}`);

    return res
      .status(200)
      .json(ApiResponse.success("Case Study updated successfully", caseStudy));
  } catch (error) {
    next(error);
  }
};

/**
 * Delete case study
 */
export const deleteCaseStudy = async (req, res, next) => {
  try {
    const { id } = req.params;

    const caseStudy = await CaseStudy.findByIdAndDelete(id);

    if (!caseStudy) {
      throw ApiError.notFound("Case Study not found");
    }

    logger.info(`Case Study deleted: ${caseStudy.title}`);

    return res
      .status(200)
      .json(ApiResponse.success("Case Study deleted successfully"));
  } catch (error) {
    next(error);
  }
};
