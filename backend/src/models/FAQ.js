import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, 'Answer is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['general', 'services', 'pricing', 'technical', 'other'],
      default: 'general',
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
faqSchema.index({ category: 1 });
faqSchema.index({ status: 1 });
faqSchema.index({ displayOrder: 1 });

const FAQ = mongoose.model('FAQ', faqSchema);

export default FAQ;
