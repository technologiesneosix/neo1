import mongoose from 'mongoose';
import { generateSlug } from '../utils/generateSlug.js';

const technologySchema = new mongoose.Schema(
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
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['frontend', 'backend', 'database', 'devops', 'mobile', 'design', 'other'],
    },
    logo: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    website: {
      type: String,
      default: null,
      trim: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug before saving
technologySchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = generateSlug(this.name);
  }
  next();
});

// Indexes
technologySchema.index({ category: 1 });
technologySchema.index({ status: 1 });
technologySchema.index({ displayOrder: 1 });

const Technology = mongoose.model('Technology', technologySchema);

export default Technology;
