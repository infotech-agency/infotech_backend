const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({ public_id: String, secure_url: String }, { _id: false });

const testimonialSchema = new mongoose.Schema({
  clientName: { type: String, required: true, trim: true },
  company: { type: String, default: '' },
  photo: { type: imageSchema, default: {} },
  review: { type: String, default: '' },
  starRating: { type: Number, min: 1, max: 5, default: 5 },
  videoUrl: { type: String, default: '' },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
