import Hero from '../models/Hero.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { logger } from '../utils/logger.js';

/**
 * Create hero section
 */
export const createHero = async (req, res, next) => {
  try {
    const heroData = req.body;

    const hero = await Hero.create(heroData);

    logger.info(`Hero created: ${hero.title}`);

    return res.status(201).json(
      ApiResponse.success('Hero created successfully', hero)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all hero sections
 */
export const getAllHeroes = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = {};
    if (status !== undefined) {
      query.isActive = status === 'true';
    }

    const skip = (page - 1) * limit;

    const [heroes, total] = await Promise.all([
      Hero.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Hero.countDocuments(query),
    ]);

    return res.status(200).json(
      ApiResponse.success('Heroes retrieved successfully', {
        heroes,
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
 * Get hero by ID
 */
export const getHeroById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const hero = await Hero.findById(id);

    if (!hero) {
      throw ApiError.notFound('Hero not found');
    }

    return res.status(200).json(
      ApiResponse.success('Hero retrieved successfully', hero)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update hero
 */
export const updateHero = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const hero = await Hero.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!hero) {
      throw ApiError.notFound('Hero not found');
    }

    logger.info(`Hero updated: ${hero.title}`);

    return res.status(200).json(
      ApiResponse.success('Hero updated successfully', hero)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle hero active status
 */
export const toggleHeroStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const hero = await Hero.findById(id);

    if (!hero) {
      throw ApiError.notFound('Hero not found');
    }

    hero.isActive = !hero.isActive;
    await hero.save();

    logger.info(`Hero status toggled: ${hero.title} - ${hero.isActive}`);

    return res.status(200).json(
      ApiResponse.success('Hero status toggled successfully', hero)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete hero
 */
export const deleteHero = async (req, res, next) => {
  try {
    const { id } = req.params;

    const hero = await Hero.findByIdAndDelete(id);

    if (!hero) {
      throw ApiError.notFound('Hero not found');
    }

    logger.info(`Hero deleted: ${hero.title}`);

    return res.status(200).json(
      ApiResponse.success('Hero deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};
