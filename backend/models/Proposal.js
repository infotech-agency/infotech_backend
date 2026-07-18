const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, default: '' },
  company: { type: String, default: '' },
  selectedService: { type: String, default: '' },
  budget: { type: String, default: '' },
  website: { type: String, default: '' },
  message: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Proposal', proposalSchema);
