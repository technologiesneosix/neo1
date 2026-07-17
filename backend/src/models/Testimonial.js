import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
      maxlength: [100, "Client name cannot exceed 100 characters"],
    },
    company: {
      type: String,
      default: null,
      trim: true,
    },
    designation: {
      type: String,
      default: null,
      trim: true,
    },
    photo: {
      type: String,
      default: null,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
      default: 5,
    },
    review: {
      type: String,
      required: [true, "Review is required"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
testimonialSchema.index({ status: 1 });
testimonialSchema.index({ featured: 1 });
testimonialSchema.index({ displayOrder: 1 });
testimonialSchema.index({ rating: 1 });

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

export default Testimonial;
