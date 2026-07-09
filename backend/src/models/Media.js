import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: [true, 'File name is required'],
      trim: true,
    },
    originalName: {
      type: String,
      required: [true, 'Original name is required'],
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
      trim: true,
    },
    publicId: {
      type: String,
      required: [true, 'Public ID is required'],
      trim: true,
      unique: true,
    },
    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
    },
    fileSize: {
      type: Number,
      required: [true, 'File size is required'],
    },
    folder: {
      type: String,
      default: 'general',
      trim: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
mediaSchema.index({ folder: 1 });
mediaSchema.index({ uploadedBy: 1 });
mediaSchema.index({ createdAt: -1 });

const Media = mongoose.model('Media', mediaSchema);

export default Media;
