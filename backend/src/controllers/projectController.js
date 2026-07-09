import Project from '../models/Project.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { logger } from '../utils/logger.js';

/**
 * Create project
 */
export const createProject = async (req, res, next) => {
  try {
    const projectData = req.body;

    const project = await Project.create(projectData);

    logger.info(`Project created: ${project.title}`);

    return res.status(201).json(
      ApiResponse.success('Project created successfully', project)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all projects
 */
export const getAllProjects = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, featured, industry, technology, service, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    if (industry) {
      query.industry = industry;
    }

    if (technology) {
      query.technologies = technology;
    }

    if (service) {
      query.services = service;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { client: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [projects, total] = await Promise.all([
      Project.find(query)
        .populate('industry', 'title slug')
        .populate('services', 'title slug')
        .populate('technologies', 'name slug logo')
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      Project.countDocuments(query),
    ]);

    return res.status(200).json(
      ApiResponse.success('Projects retrieved successfully', {
        projects,
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
 * Get project by ID
 */
export const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id)
      .populate('industry', 'title slug')
      .populate('services', 'title slug')
      .populate('technologies', 'name slug logo');

    if (!project) {
      throw ApiError.notFound('Project not found');
    }

    return res.status(200).json(
      ApiResponse.success('Project retrieved successfully', project)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get project by slug
 */
export const getProjectBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const project = await Project.findOne({ slug })
      .populate('industry', 'title slug')
      .populate('services', 'title slug')
      .populate('technologies', 'name slug logo');

    if (!project) {
      throw ApiError.notFound('Project not found');
    }

    return res.status(200).json(
      ApiResponse.success('Project retrieved successfully', project)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update project
 */
export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const project = await Project.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('industry', 'title slug')
     .populate('services', 'title slug')
     .populate('technologies', 'name slug logo');

    if (!project) {
      throw ApiError.notFound('Project not found');
    }

    logger.info(`Project updated: ${project.title}`);

    return res.status(200).json(
      ApiResponse.success('Project updated successfully', project)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle project featured status
 */
export const toggleProjectFeatured = async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      throw ApiError.notFound('Project not found');
    }

    project.featured = !project.featured;
    await project.save();

    logger.info(`Project featured toggled: ${project.title} - ${project.featured}`);

    return res.status(200).json(
      ApiResponse.success('Project featured status toggled successfully', project)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update project status
 */
export const updateProjectStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['draft', 'published', 'archived'].includes(status)) {
      throw ApiError.badRequest('Invalid status value');
    }

    const project = await Project.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!project) {
      throw ApiError.notFound('Project not found');
    }

    logger.info(`Project status updated: ${project.title} - ${status}`);

    return res.status(200).json(
      ApiResponse.success('Project status updated successfully', project)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete project
 */
export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      throw ApiError.notFound('Project not found');
    }

    logger.info(`Project deleted: ${project.title}`);

    return res.status(200).json(
      ApiResponse.success('Project deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};
