const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  public_id: String,
  secure_url: String,
}, { _id: false });

const settingsSchema = new mongoose.Schema({
  websiteName: { type: String, default: '' },
  logo: { type: imageSchema, default: {} },
  favicon: { type: imageSchema, default: {} },
  phone: { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  email: { type: String, default: '' },
  address: { type: String, default: '' },
  socialLinks: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    youtube: { type: String, default: '' },
    pinterest: { type: String, default: '' },
  },
  footer: { type: String, default: '' },
  googleMap: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
