import mongoose from "mongoose";
import { generateSlug } from "../utils/generateSlug.js";

const caseStudySchema = new mongoose.Schema(
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
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
    client: {
      type: String,
      required: [true, "Client is required"],
      trim: true,
    },
    industry: {
      type: String,
      required: [true, "Industry is required"],
      trim: true,
    },
    challenge: {
      type: String,
      required: [true, "Challenge is required"],
    },
    solution: {
      type: String,
      required: [true, "Solution is required"],
    },
    results: [
      {
        type: String,
      },
    ],
    coverImageUrl: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },
    seo: {
      metaTitle: {
        type: String,
        default: "",
      },
      metaDescription: {
        type: String,
        default: "",
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
  },
);

// Generate slug before saving
caseStudySchema.pre("save", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = generateSlug(this.title);
  }
  next();
});

caseStudySchema.index({ status: 1 });
caseStudySchema.index({ slug: 1 });

const CaseStudy = mongoose.model("CaseStudy", caseStudySchema);

export default CaseStudy;
