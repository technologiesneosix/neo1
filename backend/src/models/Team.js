import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    designation: {
      type: String,
      required: [true, "Designation is required"],
      trim: true,
    },
    photo: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: null,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    experience: {
      type: String,
      default: null,
    },
    socialLinks: {
      linkedin: {
        type: String,
        default: null,
      },
      github: {
        type: String,
        default: null,
      },
      twitter: {
        type: String,
        default: null,
      },
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
teamSchema.index({ status: 1 });
teamSchema.index({ displayOrder: 1 });

const Team = mongoose.model("Team", teamSchema);

export default Team;
