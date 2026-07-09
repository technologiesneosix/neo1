import mongoose from 'mongoose';
import { generateSlug } from '../utils/generateSlug.js';

const industrySchema = new mongoose.Schema(
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
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    banner: {
      type: String,
      default: null,
    },
    icon: {
      type: String,
      default: null,
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
      },
    ],
    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
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
industrySchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = generateSlug(this.title);
  }
  next();
});

// Indexes
industrySchema.index({ status: 1 });

const Industry = mongoose.model('Industry', industrySchema);

export default Industry;
