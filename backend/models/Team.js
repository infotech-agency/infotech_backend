const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({ public_id: String, secure_url: String }, { _id: false });

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  photo: { type: imageSchema, default: {} },
  designation: { type: String, default: '' },
  bio: { type: String, default: '' },
  experience: { type: String, default: '' },
  skills: { type: [String], default: [] },
  linkedin: { type: String, default: '' },
  instagram: { type: String, default: '' },
  facebook: { type: String, default: '' },
  twitter: { type: String, default: '' },
  email: { type: String, default: '' },
  displayOrder: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
