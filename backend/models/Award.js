const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({ public_id: String, secure_url: String }, { _id: false });

const awardSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  image: { type: imageSchema, default: {} },
  year: { type: String, default: '' },
  description: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Award', awardSchema);
