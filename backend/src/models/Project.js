import mongoose from 'mongoose';
import { generateSlug } from '../utils/generateSlug.js';

const projectSchema = new mongoose.Schema(
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
    client: {
      type: String,
      required: [true, 'Client is required'],
      trim: true,
    },
    industry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Industry',
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
      },
    ],
    technologies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Technology',
      },
    ],
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
    problem: {
      type: String,
      default: null,
    },
    solution: {
      type: String,
      default: null,
    },
    features: [
      {
        type: String,
      },
    ],
    gallery: [
      {
        type: String,
      },
    ],
    thumbnail: {
      type: String,
      default: null,
    },
    banner: {
      type: String,
      default: null,
    },
    liveUrl: {
      type: String,
      default: null,
      trim: true,
    },
    githubUrl: {
      type: String,
      default: null,
      trim: true,
    },
    duration: {
      type: String,
      default: null,
    },
    teamSize: {
      type: Number,
      default: null,
    },
    completionDate: {
      type: Date,
      default: null,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
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
  },
  {
    timestamps: true,
  }
);

// Generate slug before saving
projectSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = generateSlug(this.title);
  }
  next();
});

// Indexes
projectSchema.index({ status: 1 });
projectSchema.index({ featured: 1 });
projectSchema.index({ industry: 1 });
projectSchema.index({ technologies: 1 });
projectSchema.index({ services: 1 });

const Project = mongoose.model('Project', projectSchema);

export default Project;
