const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({ public_id: String, secure_url: String }, { _id: false });

const faqItemSchema = new mongoose.Schema({
  question: { type: String, default: '' },
  answer: { type: String, default: '' },
}, { _id: false });

const ctaSchema = new mongoose.Schema({
  heading: { type: String, default: '' },
  subheading: { type: String, default: '' },
  buttonText: { type: String, default: '' },
  buttonLink: { type: String, default: '' },
}, { _id: false });

const industrySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true, trim: true },
  banner: { type: imageSchema, default: {} },
  overview: { type: String, default: '' },
  content: { type: String, default: '' },
  benefits: { type: [String], default: [] },
  faq: { type: [faqItemSchema], default: [] },
  gallery: { type: [imageSchema], default: [] },
  cta: { type: ctaSchema, default: {} },
  metaTitle: { type: String, default: '' },
  metaDescription: { type: String, default: '' },
  schemaJson: { type: String, default: '' },
  status: { type: String, enum: ['published', 'draft'], default: 'draft' },
}, { timestamps: true });

module.exports = mongoose.model('Industry', industrySchema);
