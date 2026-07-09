import ContactMessage from '../models/ContactMessage.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { logger } from '../utils/logger.js';

/**
 * Create a new contact message
 */
export const createContactMessage = async (req, res, next) => {
  try {
    const { name, email, phone, company, subject, message } = req.body;

    // Map frontend 'read' field to backend 'status' if provided
    const status = req.body.read === true ? 'read' : 'unread';

    const contactMessage = await ContactMessage.create({
      name,
      email,
      phone: phone || null,
      company: company || null,
      subject,
      message,
      status,
    });

    logger.info(`Contact message created from ${email}`);

    return res.status(201).json(
      ApiResponse.success('Message sent successfully', {
        id: contactMessage._id,
        message: 'Message sent successfully',
      })
    );
  } catch (error) {
    logger.error('Contact message creation error:', error);
    next(error);
  }
};

/**
 * Get all contact messages (Admin)
 */
export const getAllContactMessages = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      ContactMessage.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      ContactMessage.countDocuments(query),
    ]);

    return res.status(200).json(
      ApiResponse.success('Contact messages retrieved successfully', {
        messages,
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
 * Get contact message by ID (Admin)
 */
export const getContactMessageById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await ContactMessage.findById(id);

    if (!message) {
      throw ApiError.notFound('Contact message not found');
    }

    return res.status(200).json(
      ApiResponse.success('Contact message retrieved successfully', message)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update contact message status (Admin)
 */
export const updateContactMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const message = await ContactMessage.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!message) {
      throw ApiError.notFound('Contact message not found');
    }

    logger.info(`Contact message updated for ID ${id}`);
    return res.status(200).json(
      ApiResponse.success('Contact message updated successfully', message)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete contact message (Admin)
 */
export const deleteContactMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await ContactMessage.findByIdAndDelete(id);

    if (!message) {
      throw ApiError.notFound('Contact message not found');
    }

    logger.info(`Contact message deleted for ID ${id}`);
    return res.status(200).json(
      ApiResponse.success('Contact message deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};
