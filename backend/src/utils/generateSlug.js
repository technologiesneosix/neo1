import slugify from 'slugify';

export const generateSlug = (text) => {
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });
};

export const generateUniqueSlug = async (text, checkExistsFn) => {
  let slug = generateSlug(text);
  let counter = 1;
  let uniqueSlug = slug;

  while (await checkExistsFn(uniqueSlug)) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
};
