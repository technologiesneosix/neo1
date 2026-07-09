import mongoose from 'mongoose';

const seoSchema = new mongoose.Schema(
  {
    metaTitle: {
      type: String,
      default: null,
      trim: true,
    },
    metaDescription: {
      type: String,
      default: null,
      trim: true,
    },
    keywords: [
      {
        type: String,
        trim: true,
      },
    ],
    canonical: {
      type: String,
      default: null,
      trim: true,
    },
    ogImage: {
      type: String,
      default: null,
    },
    robots: {
      type: String,
      default: 'index,follow',
    },
    schema: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const SEO = mongoose.model('SEO', seoSchema);

export default SEO;
