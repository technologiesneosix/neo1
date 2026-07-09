import { v2 as cloudinary } from 'cloudinary';

let configured = false;

const configureCloudinary = () => {
  if (configured) return;

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  configured = true;
};

// Export a function that ensures config is loaded before use
export const getCloudinary = () => {
  configureCloudinary();
  return cloudinary;
};

export default getCloudinary;
