const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  label: { type: String, required: true, trim: true },
  value: { type: Number, default: 0 },
  suffix: { type: String, default: '' },
  icon: { type: String, default: '' },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Counter', counterSchema);
