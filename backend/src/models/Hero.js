import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    subtitle: {
      type: String,
      required: [true, 'Subtitle is required'],
      trim: true,
      maxlength: [300, 'Subtitle cannot exceed 300 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    primaryButtonText: {
      type: String,
      default: 'Get Started',
      trim: true,
    },
    primaryButtonLink: {
      type: String,
      default: '#',
      trim: true,
    },
    secondaryButtonText: {
      type: String,
      default: 'Learn More',
      trim: true,
    },
    secondaryButtonLink: {
      type: String,
      default: '#',
      trim: true,
    },
    backgroundImage: {
      type: String,
      default: null,
    },
    heroImage: {
      type: String,
      default: null,
    },
    statistics: [
      {
        label: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for active hero
heroSchema.index({ isActive: 1 });

const Hero = mongoose.model('Hero', heroSchema);

export default Hero;
