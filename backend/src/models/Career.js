import mongoose from 'mongoose';
import { generateSlug } from '../utils/generateSlug.js';

const careerSchema = new mongoose.Schema(
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
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: ['engineering', 'design', 'marketing', 'sales', 'hr', 'finance', 'other'],
    },
    employmentType: {
      type: String,
      required: [true, 'Employment type is required'],
      enum: ['full-time', 'part-time', 'contract', 'internship'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    experience: {
      type: String,
      required: [true, 'Experience is required'],
      enum: ['entry-level', '1-2 years', '2-5 years', '5-10 years', '10+ years'],
    },
    salary: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    requirements: [
      {
        type: String,
      },
    ],
    responsibilities: [
      {
        type: String,
      },
    ],
    benefits: [
      {
        type: String,
      },
    ],
    deadline: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'on-hold'],
      default: 'open',
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug before saving
careerSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = generateSlug(this.title);
  }
  next();
});

// Indexes
careerSchema.index({ status: 1 });
careerSchema.index({ department: 1 });
careerSchema.index({ employmentType: 1 });
careerSchema.index({ deadline: 1 });

const Career = mongoose.model('Career', careerSchema);

export default Career;
