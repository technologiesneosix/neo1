import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    designation: {
      type: String,
      trim: true,
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      default: null,
    },
    status: {
      type: String,
      enum: ["Draft", "Offer Sent", "Accepted", "Rejected", "Joined"],
      default: "Draft",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    offerLetter: {
      path: { type: String, default: null },
      originalName: { type: String, default: null },
      size: { type: Number, default: null },
      mimeType: { type: String, default: null },
      uploadedAt: { type: Date, default: null },
    },
    draft: {
      subject: { type: String, default: "" },
      body: { type: String, default: "" },
      to: { type: String, default: "" },
      cc: { type: String, default: "" },
      bcc: { type: String, default: "" },
      attachments: [
        {
          path: { type: String, required: true },
          originalName: { type: String, required: true },
          size: { type: Number, required: true },
          mimeType: { type: String, required: true },
        },
      ],
    },
  },
  {
    timestamps: true,
  },
);

// Customize JSON output to include 'id' instead of '_id'
candidateSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

// Indexes for fast lookup
candidateSchema.index({ email: 1 });
candidateSchema.index({ status: 1 });
candidateSchema.index({ isDeleted: 1 });
candidateSchema.index({ createdAt: -1 });

const Candidate = mongoose.model("Candidate", candidateSchema);

export default Candidate;
