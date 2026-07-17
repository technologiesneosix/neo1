import mongoose from "mongoose";

const pricingPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be non-negative"],
    },
    period: {
      type: String,
      default: "per month",
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    features: {
      type: [String],
      default: [],
    },
    highlighted: {
      type: Boolean,
      default: false,
    },
    ctaLabel: {
      type: String,
      default: "Sign Up Now",
      trim: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
pricingPlanSchema.index({ displayOrder: 1 });

const PricingPlan = mongoose.model("PricingPlan", pricingPlanSchema);

export default PricingPlan;
