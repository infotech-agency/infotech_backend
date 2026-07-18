const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  public_id: { type: String, required: true },
  secure_url: { type: String, required: true },
  originalName: { type: String, default: '' },
  folder: { type: String, default: 'cms' },
  size: { type: Number, default: 0 },
  format: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Media', mediaSchema);
