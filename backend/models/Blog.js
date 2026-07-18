const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({ public_id: String, secure_url: String }, { _id: false });

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true, trim: true },
  featuredImage: { type: imageSchema, default: {} },
  gallery: { type: [imageSchema], default: [] },
  category: { type: String, default: '' },
  tags: { type: [String], default: [] },
  excerpt: { type: String, default: '' },
  content: { type: String, default: '' },
  author: { type: String, default: '' },
  views: { type: Number, default: 0 },
  publishedDate: { type: Date, default: Date.now },
  metaTitle: { type: String, default: '' },
  metaDescription: { type: String, default: '' },
  canonicalUrl: { type: String, default: '' },
  schemaJson: { type: String, default: '' },
  status: { type: String, enum: ['published', 'draft'], default: 'draft' },
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
