import Hero from "../models/Hero.js";
import About from "../models/About.js";
import Service from "../models/Service.js";
import Solution from "../models/Solution.js";
import Industry from "../models/Industry.js";
import Technology from "../models/Technology.js";
import Project from "../models/Project.js";
import Blog from "../models/Blog.js";
import BlogCategory from "../models/BlogCategory.js";
import Team from "../models/Team.js";
import Testimonial from "../models/Testimonial.js";
import Career from "../models/Career.js";
import FAQ from "../models/FAQ.js";
import WebsiteSetting from "../models/WebsiteSetting.js";
import Certification from "../models/Certification.js";
import PricingPlan from "../models/PricingPlan.js";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

/**
 * Get home page content (aggregated response)
 */
export const getHomeContent = async (req, res, next) => {
  try {
    const [
      hero,
      about,
      featuredServices,
      featuredSolutions,
      industries,
      technologies,
      featuredProjects,
      testimonials,
      latestBlogs,
      faqs,
      settings,
    ] = await Promise.all([
      Hero.find({ isActive: true }).select(
        "-_id title subtitle description primaryButtonText primaryButtonLink secondaryButtonText secondaryButtonLink backgroundImage heroImage statistics",
      ),
      About.findOne().select(
        "-_id companyName shortDescription fullDescription mission vision journey experience employees projectsCompleted countriesServed",
      ),
      Service.find({ status: "published", isFeatured: true })
        .select("-_id title slug shortDescription icon thumbnail displayOrder")
        .sort({ displayOrder: 1 })
        .limit(6),
      Solution.find({ status: "published" })
        .select("-_id title slug description banner displayOrder")
        .sort({ createdAt: -1 })
        .limit(6),
      Industry.find({ status: "published" })
        .select("-_id title slug icon banner displayOrder")
        .sort({ displayOrder: 1 })
        .limit(6),
      Technology.find({ status: "published" })
        .select("-_id name slug logo category displayOrder")
        .sort({ displayOrder: 1 })
        .limit(8),
      Project.find({ status: "published", featured: true })
        .select(
          "-_id title slug client shortDescription thumbnail banner displayOrder",
        )
        .sort({ displayOrder: 1 })
        .limit(6),
      Testimonial.find({ status: "active", featured: true })
        .select(
          "-_id clientName company designation photo rating review displayOrder",
        )
        .sort({ displayOrder: 1 })
        .limit(6),
      Blog.find({ published: true })
        .select(
          "title slug excerpt banner author category tags readingTime publishedAt published featured",
        )
        .populate("author", "name designation photo")
        .populate("category", "name slug")
        .sort({ publishedAt: -1 })
        .limit(3),

      FAQ.find({ status: "active" })
        .select("question answer category displayOrder")
        .sort({ displayOrder: 1 })
        .limit(6),
      WebsiteSetting.findOne().select(
        "-_id siteName tagline logo favicon contactEmail phone address socialLinks footerText copyright",
      ),
    ]);

    return res.status(200).json(
      ApiResponse.success("Home content retrieved successfully", {
        hero,
        about,
        featuredServices,
        featuredSolutions,
        industries,
        technologies,
        featuredProjects,
        testimonials,
        latestBlogs,
        faqs,
        settings,
      }),
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get about page content
 */
export const getAboutContent = async (req, res, next) => {
  try {
    const about = await About.findOne();

    if (!about) {
      throw ApiError.notFound("About content not found");
    }

    return res
      .status(200)
      .json(ApiResponse.success("About content retrieved successfully", about));
  } catch (error) {
    next(error);
  }
};

/**
 * Get all services
 */
export const getServices = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      featured,
      sortBy = "displayOrder",
      sortOrder = "asc",
    } = req.query;

    const query = { status: "published" };

    if (featured === "true") {
      query.isFeatured = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const [services, total] = await Promise.all([
      Service.find(query)
        .select(
          "-_id title slug shortDescription icon thumbnail features displayOrder",
        )
        .sort(sortOptions)
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
 * Get service by slug
 */
export const getServiceBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const service = await Service.findOne({ slug, status: "published" })
      .select("-_id -__v")
      .populate("technologies", "name slug logo");

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
 * Get all solutions
 */
export const getSolutions = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = { status: "published" };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const [solutions, total] = await Promise.all([
      Solution.find(query)
        .select("-_id title slug description banner")
        .sort(sortOptions)
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
 * Get solution by slug
 */
export const getSolutionBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const solution = await Solution.findOne({ slug, status: "published" })
      .select("-_id -__v")
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
 * Get all industries
 */
export const getIndustries = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = "displayOrder",
      sortOrder = "asc",
    } = req.query;

    const query = { status: "published" };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const [industries, total] = await Promise.all([
      Industry.find(query)
        .select("-_id title slug icon banner displayOrder")
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      Industry.countDocuments(query),
    ]);

    return res.status(200).json(
      ApiResponse.success("Industries retrieved successfully", {
        industries,
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
 * Get industry by slug
 */
export const getIndustryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const industry = await Industry.findOne({
      slug,
      status: "published",
    }).select("-_id -__v");

    if (!industry) {
      throw ApiError.notFound("Industry not found");
    }

    return res
      .status(200)
      .json(ApiResponse.success("Industry retrieved successfully", industry));
  } catch (error) {
    next(error);
  }
};

/**
 * Get all technologies
 */
export const getTechnologies = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 100,
      search,
      category,
      sortBy = "displayOrder",
      sortOrder = "asc",
    } = req.query;

    const query = { status: "published" };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const [technologies, total] = await Promise.all([
      Technology.find(query)
        .select("-_id name slug logo category displayOrder")
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      Technology.countDocuments(query),
    ]);

    return res.status(200).json(
      ApiResponse.success("Technologies retrieved successfully", {
        technologies,
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
 * Get all projects
 */
export const getProjects = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      featured,
      industry,
      technology,
      sortBy = "displayOrder",
      sortOrder = "asc",
    } = req.query;

    const query = { status: "published" };

    if (featured === "true") {
      query.featured = true;
    }

    if (industry) {
      query.industry = industry;
    }

    if (technology) {
      query.technologies = technology;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
        { client: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const [projects, total] = await Promise.all([
      Project.find(query)
        .select(
          "-_id title slug client shortDescription thumbnail banner displayOrder",
        )
        .populate("industry", "title slug")
        .populate("technologies", "name slug logo")
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      Project.countDocuments(query),
    ]);

    return res.status(200).json(
      ApiResponse.success("Projects retrieved successfully", {
        projects,
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
 * Get project by slug
 */
export const getProjectBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const project = await Project.findOne({ slug, status: "published" })
      .select("-_id -__v")
      .populate("industry", "title slug")
      .populate("services", "title slug")
      .populate("technologies", "name slug logo");

    if (!project) {
      throw ApiError.notFound("Project not found");
    }

    return res
      .status(200)
      .json(ApiResponse.success("Project retrieved successfully", project));
  } catch (error) {
    next(error);
  }
};

/**
 * Get all blogs
 */
export const getBlogs = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      featured,
      category,
      tag,
      sortBy = "publishedAt",
      sortOrder = "desc",
    } = req.query;

    const query = { published: true };

    if (featured === "true") {
      query.featured = true;
    }

    if (category) {
      query.category = category;
    }

    if (tag) {
      query.tags = tag;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .select(
          "title slug excerpt banner author category tags readingTime publishedAt published featured",
        )
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
 * Get blog by slug
 */
export const getBlogBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({ slug, published: true })
      .select("-_id -__v")
      .populate("author", "name designation photo")
      .populate("category", "name slug");

    if (!blog) {
      throw ApiError.notFound("Blog not found");
    }

    // Increment view count
    await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });

    return res
      .status(200)
      .json(ApiResponse.success("Blog retrieved successfully", blog));
  } catch (error) {
    next(error);
  }
};

/**
 * Get all blog categories
 */
export const getBlogCategories = async (req, res, next) => {
  try {
    const categories = await BlogCategory.find()
      .select("-_id name slug description")
      .sort({ name: 1 });

    return res
      .status(200)
      .json(
        ApiResponse.success("Blog categories retrieved successfully", {
          categories,
        }),
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Get team members
 */
export const getTeam = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = "displayOrder",
      sortOrder = "asc",
    } = req.query;

    const query = { status: "active" };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { designation: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const [team, total] = await Promise.all([
      Team.find(query)
        .select(
          "-_id name designation photo bio skills experience displayOrder",
        )
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      Team.countDocuments(query),
    ]);

    return res.status(200).json(
      ApiResponse.success("Team members retrieved successfully", {
        team,
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
 * Get testimonials
 */
export const getTestimonials = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      featured,
      rating,
      sortBy = "displayOrder",
      sortOrder = "asc",
    } = req.query;

    const query = { status: "active" };

    if (featured === "true") {
      query.featured = true;
    }

    if (rating) {
      query.rating = parseInt(rating);
    }

    const skip = (page - 1) * limit;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const [testimonials, total] = await Promise.all([
      Testimonial.find(query)
        .select(
          "-_id clientName company designation photo rating review displayOrder",
        )
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      Testimonial.countDocuments(query),
    ]);

    return res.status(200).json(
      ApiResponse.success("Testimonials retrieved successfully", {
        testimonials,
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
 * Get all careers
 */
export const getCareers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      department,
      employmentType,
      experience,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = { status: "open" };

    if (department) {
      query.department = department;
    }

    if (employmentType) {
      query.employmentType = employmentType;
    }

    if (experience) {
      query.experience = experience;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const [careers, total] = await Promise.all([
      Career.find(query)
        .select(
          "-_id title department employmentType location experience salary description requirements responsibilities benefits deadline",
        )
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      Career.countDocuments(query),
    ]);

    return res.status(200).json(
      ApiResponse.success("Careers retrieved successfully", {
        careers,
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
 * Get career by slug
 */
export const getCareerBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const career = await Career.findOne({ slug, status: "open" }).select(
      "-_id -__v",
    );

    if (!career) {
      throw ApiError.notFound("Career not found");
    }

    return res
      .status(200)
      .json(ApiResponse.success("Career retrieved successfully", career));
  } catch (error) {
    next(error);
  }
};

/**
 * Get FAQs
 */
export const getFAQs = async (req, res, next) => {
  try {
    const {
      category,
      search,
      sortBy = "displayOrder",
      sortOrder = "asc",
    } = req.query;

    const query = { status: "active" };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { question: { $regex: search, $options: "i" } },
        { answer: { $regex: search, $options: "i" } },
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const faqs = await FAQ.find(query)
      .select("question answer category displayOrder")
      .sort(sortOptions);

    return res
      .status(200)
      .json(ApiResponse.success("FAQs retrieved successfully", { faqs }));
  } catch (error) {
    next(error);
  }
};

/**
 * Get website settings
 */
export const getSettings = async (req, res, next) => {
  try {
    const settings = await WebsiteSetting.findOne().select(
      "-_id siteName tagline logo favicon contactEmail phone address socialLinks footerText copyright",
    );

    if (!settings) {
      throw ApiError.notFound("Settings not found");
    }

    return res
      .status(200)
      .json(ApiResponse.success("Settings retrieved successfully", settings));
  } catch (error) {
    next(error);
  }
};

/**
 * Get all published certifications ordered by displayOrder
 */
export const getPublicCertifications = async (req, res, next) => {
  try {
    const certifications = await Certification.find({
      status: "published",
    }).sort({ displayOrder: 1 });

    return res
      .status(200)
      .json(
        ApiResponse.success("Certifications retrieved successfully", {
          certifications,
        }),
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all pricing plans ordered by displayOrder
 */
export const getPricingPlans = async (req, res, next) => {
  try {
    const pricingPlans = await PricingPlan.find().sort({ displayOrder: 1 });

    return res
      .status(200)
      .json(
        ApiResponse.success("Pricing Plans retrieved successfully", {
          pricingPlans,
        }),
      );
  } catch (error) {
    next(error);
  }
};
