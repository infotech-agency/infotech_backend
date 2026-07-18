// const mongoose = require('mongoose');

// const imageSchema = new mongoose.Schema({ public_id: String, secure_url: String }, { _id: false });

// const faqItemSchema = new mongoose.Schema({
//   question: { type: String, default: '' },
//   answer: { type: String, default: '' },
// }, { _id: false });

// const ctaSchema = new mongoose.Schema({
//   heading: { type: String, default: '' },
//   subheading: { type: String, default: '' },
//   buttonText: { type: String, default: '' },
//   buttonLink: { type: String, default: '' },
// }, { _id: false });

// const serviceSchema = new mongoose.Schema({
//   title: { type: String, required: true, trim: true },
//   slug: { type: String, unique: true, lowercase: true, trim: true },
//   bannerImage: { type: imageSchema, default: {} },
//   thumbnail: { type: imageSchema, default: {} },
//   shortDescription: { type: String, default: '' },
//   overview: { type: String, default: '' },
//   mainContent: { type: String, default: '' },
//   features: { type: [String], default: [] },
//   benefits: { type: [String], default: [] },
//   process: { type: [String], default: [] },
//   faq: { type: [faqItemSchema], default: [] },
//   gallery: { type: [imageSchema], default: [] },
//   cta: { type: ctaSchema, default: {} },
//   metaTitle: { type: String, default: '' },
//   metaDescription: { type: String, default: '' },
//   canonicalUrl: { type: String, default: '' },
//   schemaJson: { type: String, default: '' },
//   featured: { type: Boolean, default: false },
//   status: { type: String, enum: ['published', 'draft'], default: 'draft' },
// }, { timestamps: true });

// module.exports = mongoose.model('Service', serviceSchema);

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

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true, trim: true },

  // NEW: every service belongs to one SEO category (e.g. "Digital Marketing", "Web Development").
  // Populating this lets you build category landing pages that auto-list every related service.
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },

  bannerImage: { type: imageSchema, default: {} },
  thumbnail: { type: imageSchema, default: {} },
  shortDescription: { type: String, default: '' },
  overview: { type: String, default: '' },
  mainContent: { type: String, default: '' },
  features: { type: [String], default: [] },
  benefits: { type: [String], default: [] },
  process: { type: [String], default: [] },
  faq: { type: [faqItemSchema], default: [] },
  gallery: { type: [imageSchema], default: [] },
  cta: { type: ctaSchema, default: {} },
  metaTitle: { type: String, default: '' },
  metaDescription: { type: String, default: '' },
  canonicalUrl: { type: String, default: '' },
  schemaJson: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ['published', 'draft'], default: 'draft' },
}, { timestamps: true });

// Speeds up "get all services in category X" queries, which is now a common lookup.
serviceSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model('Service', serviceSchema);