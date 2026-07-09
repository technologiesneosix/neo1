import getCloudinary from '../config/cloudinary.js';

/**
 * Upload image to Cloudinary with optimizations (from buffer)
 */
export const uploadImageToCloudinary = async (buffer, originalName, folder = 'general', options = {}) => {
  try {
    const cloudinary = getCloudinary();
    
    const uploadOptions = {
      folder,
      resource_type: 'auto',
      transformation: [
        { quality: 'auto', fetch_format: 'auto' },
        { width: options.width || 1920, crop: 'limit' },
      ],
      public_id: options.publicId,
      ...options,
    };

    // Upload buffer to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return {
      publicId: result.public_id,
      secureUrl: result.secure_url,
      url: result.url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      resourceType: result.resource_type,
    };
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

/**
 * Upload multiple images to Cloudinary
 */
export const uploadMultipleImagesToCloudinary = async (fileObjects, folder = 'general', options = {}) => {
  const uploadPromises = fileObjects.map((fileObj) => 
    uploadImageToCloudinary(fileObj.buffer, fileObj.originalName, folder, options)
  );
  return Promise.all(uploadPromises);
};

/**
 * Generate thumbnail URL
 */
export const generateThumbnailUrl = (publicId, width = 300, height = 300) => {
  const cloudinary = getCloudinary();
  return cloudinary.url(publicId, {
    transformation: [
      { width, height, crop: 'fill' },
      { quality: 'auto', fetch_format: 'auto' },
    ],
  });
};

/**
 * Generate optimized image URL
 */
export const generateOptimizedImageUrl = (publicId, options = {}) => {
  const cloudinary = getCloudinary();
  const { width, height, quality = 'auto', format = 'auto' } = options;
  
  const transformation = [
    { quality, fetch_format: format },
  ];

  if (width) transformation.push({ width, crop: 'limit' });
  if (height) transformation.push({ height, crop: 'limit' });

  return cloudinary.url(publicId, { transformation });
};

/**
 * Delete image from Cloudinary
 */
export const deleteImageFromCloudinary = async (publicId) => {
  try {
    const cloudinary = getCloudinary();
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
    });
    return result;
  } catch (error) {
    throw new Error(`Cloudinary delete failed: ${error.message}`);
  }
};

/**
 * Delete multiple images from Cloudinary
 */
export const deleteMultipleImagesFromCloudinary = async (publicIds) => {
  try {
    const cloudinary = getCloudinary();
    const result = await cloudinary.api.delete_resources(publicIds, {
      resource_type: 'image',
    });
    return result;
  } catch (error) {
    throw new Error(`Cloudinary bulk delete failed: ${error.message}`);
  }
};
