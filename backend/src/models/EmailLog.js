import mongoose from "mongoose";

const emailLogSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: [true, "Candidate is required"],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    recipient: {
      type: String,
      required: [true, "Recipient email is required"],
      trim: true,
    },
    cc: {
      type: String,
      trim: true,
      default: "",
    },
    bcc: {
      type: String,
      trim: true,
      default: "",
    },
    sentBy: {
      type: String,
      required: [true, "Sender is required"],
      trim: true,
    },
    deliveryStatus: {
      type: String,
      enum: ["success", "failed"],
      required: true,
    },
    resendEmailId: {
      type: String,
      default: null,
    },
    errorMessage: {
      type: String,
      default: null,
    },
    body: {
      type: String,
      required: [true, "Email body is required"],
    },
    attachments: [
      {
        path: { type: String, required: true },
        originalName: { type: String, required: true },
        size: { type: Number, required: true },
        mimeType: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Customize JSON output to include 'id' instead of '_id'
emailLogSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

// Indexes
emailLogSchema.index({ candidate: 1 });
emailLogSchema.index({ deliveryStatus: 1 });
emailLogSchema.index({ createdAt: -1 });

const EmailLog = mongoose.model("EmailLog", emailLogSchema);

export default EmailLog;
