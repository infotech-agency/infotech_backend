const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({ public_id: String, secure_url: String }, { _id: false });

const pageSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true, trim: true },
  bannerImage: { type: imageSchema, default: {} },
  content: { type: String, default: '' },
  gallery: { type: [imageSchema], default: [] },
  metaTitle: { type: String, default: '' },
  metaDescription: { type: String, default: '' },
  canonicalUrl: { type: String, default: '' },
  // schemaJson: { type: String, default: '' },
  schemaJson: {
    type: [
      mongoose.Schema.Types.Mixed
    ],
    default: []
  },
  status: { type: String, enum: ['published', 'draft'], default: 'draft' },
}, { timestamps: true });

module.exports = mongoose.model('Page', pageSchema);
