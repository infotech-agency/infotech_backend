const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true, trim: true },
  answer: { type: String, required: true },
  // category: { type: String, default: 'General' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'FaqCategory', required: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Faq', faqSchema);
