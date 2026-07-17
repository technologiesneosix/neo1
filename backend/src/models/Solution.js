import mongoose from "mongoose";
import { generateSlug } from "../utils/generateSlug.js";

const solutionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    banner: {
      type: String,
      default: null,
    },
    features: [
      {
        type: String,
      },
    ],
    industries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Industry",
      },
    ],
    technologies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Technology",
      },
    ],
    gallery: [
      {
        type: String,
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
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  },
);

// Generate slug before saving
solutionSchema.pre("save", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = generateSlug(this.title);
  }
  next();
});

// Indexes
solutionSchema.index({ status: 1 });

const Solution = mongoose.model("Solution", solutionSchema);

export default Solution;
