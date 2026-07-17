import getCloudinary from "../config/cloudinary.js";

/**
 * Delete resource from Cloudinary
 */
export const deleteFromCloudinary = async (
  publicId,
  resourceType = "image",
) => {
  try {
    const cloudinaryInstance = getCloudinary();
    const result = await cloudinaryInstance.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    if (result.result === "ok" || result.result === "not found") {
      return { success: true, result };
    }

    return { success: false, result };
  } catch (error) {
    throw new Error(`Cloudinary delete failed: ${error.message}`);
  }
};

/**
 * Delete multiple resources from Cloudinary
 */
export const deleteMultipleFromCloudinary = async (
  publicIds,
  resourceType = "image",
) => {
  try {
    const cloudinaryInstance = getCloudinary();
    const result = await cloudinaryInstance.api.delete_resources(publicIds, {
      resource_type: resourceType,
    });

    return { success: true, result };
  } catch (error) {
    throw new Error(`Cloudinary bulk delete failed: ${error.message}`);
  }
};

/**
 * Delete folder from Cloudinary
 */
export const deleteFolderFromCloudinary = async (folder) => {
  try {
    const cloudinaryInstance = getCloudinary();
    const result = await cloudinaryInstance.api.delete_resources_by_prefix(
      folder,
      {
        resource_type: "image",
      },
    );

    return { success: true, result };
  } catch (error) {
    throw new Error(`Cloudinary folder delete failed: ${error.message}`);
  }
};
