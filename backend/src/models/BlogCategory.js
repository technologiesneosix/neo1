import mongoose from 'mongoose';
import { generateSlug } from '../utils/generateSlug.js';

const blogCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug before saving
blogCategorySchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = generateSlug(this.name);
  }
  next();
});

const BlogCategory = mongoose.model('BlogCategory', blogCategorySchema);

export default BlogCategory;
