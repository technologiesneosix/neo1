import mongoose from 'mongoose';
import { generateSlug } from '../utils/generateSlug.js';

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
      maxlength: [300, 'Short description cannot exceed 300 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    icon: {
      type: String,
      default: null,
    },
    bannerImage: {
      type: String,
      default: null,
    },
    thumbnail: {
      type: String,
      default: null,
    },
    features: [
      {
        type: String,
      },
    ],
    benefits: [
      {
        type: String,
      },
    ],
    technologies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Technology',
      },
    ],
    seo: {
      metaTitle: {
        type: String,
        default: null,
      },
      metaDescription: {
        type: String,
        default: null,
      },
      keywords: [
        {
          type: String,
        },
      ],
    },
    isFeatured: {
      type: Boolean,
      default: false,
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
serviceSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = generateSlug(this.title);
  }
  next();
});

serviceSchema.index({ status: 1 });
serviceSchema.index({ isFeatured: 1 });
serviceSchema.index({ displayOrder: 1 });

const Service = mongoose.model('Service', serviceSchema);

export default Service;
