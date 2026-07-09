import mongoose from 'mongoose';
import { generateSlug } from '../utils/generateSlug.js';

const blogSchema = new mongoose.Schema(
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
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      trim: true,
      maxlength: [500, 'Excerpt cannot exceed 500 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    banner: {
      type: String,
      default: null,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: [true, 'Author is required'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BlogCategory',
      required: [true, 'Category is required'],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    readingTime: {
      type: Number,
      default: 5,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    published: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    views: {
      type: Number,
      default: 0,
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
blogSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = generateSlug(this.title);
  }
  next();
});

// Indexes
blogSchema.index({ category: 1 });
blogSchema.index({ author: 1 });
blogSchema.index({ published: 1 });
blogSchema.index({ publishedAt: -1 });
blogSchema.index({ featured: 1 });
blogSchema.index({ tags: 1 });

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
