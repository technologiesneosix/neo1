import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
      maxlength: [500, 'Short description cannot exceed 500 characters'],
    },
    fullDescription: {
      type: String,
      required: [true, 'Full description is required'],
    },
    mission: {
      type: String,
      required: [true, 'Mission is required'],
    },
    vision: {
      type: String,
      required: [true, 'Vision is required'],
    },
    journey: {
      type: String,
      default: null,
    },
    experience: {
      type: Number,
      default: 0,
    },
    employees: {
      type: Number,
      default: 0,
    },
    projectsCompleted: {
      type: Number,
      default: 0,
    },
    countriesServed: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const About = mongoose.model('About', aboutSchema);

export default About;
