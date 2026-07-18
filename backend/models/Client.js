const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({ public_id: String, secure_url: String }, { _id: false });

const clientSchema = new mongoose.Schema({
  companyName: { type: String, required: true, trim: true },
  logo: { type: imageSchema, default: {} },
  websiteUrl: { type: String, default: '' },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);
