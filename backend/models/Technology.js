const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({ public_id: String, secure_url: String }, { _id: false });

const technologySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  logo: { type: imageSchema, default: {} },
  description: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Technology', technologySchema);
