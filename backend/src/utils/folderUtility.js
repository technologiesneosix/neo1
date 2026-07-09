/**
 * Allowed folder names
 */
export const ALLOWED_FOLDERS = [
  'general',
  'services',
  'solutions',
  'projects',
  'blogs',
  'team',
  'testimonials',
  'careers',
  'about',
  'hero',
  'logos',
  'documents',
  'videos',
  'thumbnails',
  'uploads',
];

/**
 * Validate folder name
 */
export const validateFolder = (folder) => {
  if (!folder) {
    return 'general'; // Default folder
  }

  const normalizedFolder = folder.toLowerCase().trim();

  if (!ALLOWED_FOLDERS.includes(normalizedFolder)) {
    return 'general'; // Unrecognized folder → fall back to 'general'
  }

  return normalizedFolder;
};

/**
 * Generate folder path with date
 */
export const generateFolderPath = (folder, includeDate = false) => {
  const validatedFolder = validateFolder(folder);

  if (includeDate) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${validatedFolder}/${year}/${month}`;
  }

  return validatedFolder;
};

/**
 * Sanitize folder name
 */
export const sanitizeFolderName = (folder) => {
  return folder
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};
