const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({ public_id: String, secure_url: String }, { _id: false });

const caseStudySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true, trim: true },
  client: { type: String, default: '' },
  industry: { type: String, default: '' },
  challenge: { type: String, default: '' },
  solution: { type: String, default: '' },
  result: { type: String, default: '' },
  images: { type: [imageSchema], default: [] },
  gallery: { type: [imageSchema], default: [] },
  metaTitle: { type: String, default: '' },
  metaDescription: { type: String, default: '' },
  status: { type: String, enum: ['published', 'draft'], default: 'draft' },
}, { timestamps: true });

module.exports = mongoose.model('CaseStudy', caseStudySchema);
