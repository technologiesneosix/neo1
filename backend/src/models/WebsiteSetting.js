import mongoose from "mongoose";

const websiteSettingSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      required: [true, "Site name is required"],
      trim: true,
    },
    tagline: {
      type: String,
      default: null,
      trim: true,
    },
    logo: {
      type: String,
      default: null,
    },
    favicon: {
      type: String,
      default: null,
    },
    contactEmail: {
      type: String,
      required: [true, "Contact email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    phone: {
      type: String,
      default: null,
      trim: true,
    },
    address: {
      type: String,
      default: null,
      trim: true,
    },
    socialLinks: {
      facebook: {
        type: String,
        default: null,
      },
      twitter: {
        type: String,
        default: null,
      },
      linkedin: {
        type: String,
        default: null,
      },
      instagram: {
        type: String,
        default: null,
      },
      github: {
        type: String,
        default: null,
      },
    },
    googleMap: {
      type: String,
      default: null,
    },
    footerText: {
      type: String,
      default: null,
    },
    copyright: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Only one website settings document should exist
websiteSettingSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const WebsiteSetting = mongoose.model("WebsiteSetting", websiteSettingSchema);

export default WebsiteSetting;
