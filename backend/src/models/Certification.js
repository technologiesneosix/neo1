import mongoose from 'mongoose';

const certificationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    issuer: {
      type: String,
      required: [true, 'Issuer is required'],
      trim: true,
    },
    year: {
      type: String,
      required: [true, 'Year is required'],
      trim: true,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);

certificationSchema.index({ status: 1 });
certificationSchema.index({ displayOrder: 1 });

const Certification = mongoose.model('Certification', certificationSchema);

export default Certification;
