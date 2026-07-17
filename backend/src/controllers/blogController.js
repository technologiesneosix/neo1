import Blog from "../models/Blog.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { logger } from "../utils/logger.js";

/**
 * Create blog
 */
export const createBlog = async (req, res, next) => {
  try {
    const blogData = req.body;

    const blog = await Blog.create(blogData);

    logger.info(`Blog created: ${blog.title}`);

    return res
      .status(201)
      .json(ApiResponse.success("Blog created successfully", blog));
  } catch (error) {
    next(error);
  }
};

/**
 * Get all blogs
 */
export const getAllBlogs = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      published,
      featured,
      category,
      author,
      tag,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = {};

    if (published !== undefined) {
      query.published = published === "true";
    }

    if (featured !== undefined) {
      query.featured = featured === "true";
    }

    if (category) {
      query.category = category;
    }

    if (author) {
      query.author = author;
    }

    if (tag) {
      query.tags = tag;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .populate("author", "name designation photo")
        .populate("category", "name slug")
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      Blog.countDocuments(query),
    ]);

    return res.status(200).json(
      ApiResponse.success("Blogs retrieved successfully", {
        blogs,
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
 * Get blog by ID
 */
export const getBlogById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id)
      .populate("author", "name designation photo")
      .populate("category", "name slug");

    if (!blog) {
      throw ApiError.notFound("Blog not found");
    }

    return res
      .status(200)
      .json(ApiResponse.success("Blog retrieved successfully", blog));
  } catch (error) {
    next(error);
  }
};

/**
 * Get blog by slug
 */
export const getBlogBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({ slug })
      .populate("author", "name designation photo")
      .populate("category", "name slug");

    if (!blog) {
      throw ApiError.notFound("Blog not found");
    }

    return res
      .status(200)
      .json(ApiResponse.success("Blog retrieved successfully", blog));
  } catch (error) {
    next(error);
  }
};

/**
 * Update blog
 */
export const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const blog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("author", "name designation photo")
      .populate("category", "name slug");

    if (!blog) {
      throw ApiError.notFound("Blog not found");
    }

    logger.info(`Blog updated: ${blog.title}`);

    return res
      .status(200)
      .json(ApiResponse.success("Blog updated successfully", blog));
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle blog featured status
 */
export const toggleBlogFeatured = async (req, res, next) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      throw ApiError.notFound("Blog not found");
    }

    blog.featured = !blog.featured;
    await blog.save();

    logger.info(`Blog featured toggled: ${blog.title} - ${blog.featured}`);

    return res
      .status(200)
      .json(
        ApiResponse.success("Blog featured status toggled successfully", blog),
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Update blog published status
 */
export const updateBlogStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { published } = req.body;

    const blog = await Blog.findByIdAndUpdate(
      id,
      { published, publishedAt: published ? new Date() : null },
      { new: true, runValidators: true },
    );

    if (!blog) {
      throw ApiError.notFound("Blog not found");
    }

    logger.info(`Blog status updated: ${blog.title} - ${published}`);

    return res
      .status(200)
      .json(ApiResponse.success("Blog status updated successfully", blog));
  } catch (error) {
    next(error);
  }
};

/**
 * Delete blog
 */
export const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      throw ApiError.notFound("Blog not found");
    }

    logger.info(`Blog deleted: ${blog.title}`);

    return res
      .status(200)
      .json(ApiResponse.success("Blog deleted successfully"));
  } catch (error) {
    next(error);
  }
};
