const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({ public_id: String, secure_url: String }, { _id: false });

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true, trim: true },
  clientName: { type: String, default: '' },
  websiteUrl: { type: String, default: '' },
  technology: { type: [String], default: [] },
  description: { type: String, default: '' },
  gallery: { type: [imageSchema], default: [] },
  thumbnail: { type: imageSchema, default: {} },
  completionDate: { type: Date },
  featured: { type: Boolean, default: false },
  metaTitle: { type: String, default: '' },
  metaDescription: { type: String, default: '' },
  status: { type: String, enum: ['published', 'draft'], default: 'draft' },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
