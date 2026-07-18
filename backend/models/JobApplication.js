const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, default: '' },
  experience: { type: String, default: '' },
  currentCompany: { type: String, default: '' },
  currentSalary: { type: String, default: '' },
  expectedSalary: { type: String, default: '' },
  noticePeriod: { type: String, default: '' },
  appliedPosition: { type: String, default: '' },
  resume: {
    public_id: { type: String, default: '' },
    secure_url: { type: String, default: '' },
  },
  coverLetter: { type: String, default: '' },
  portfolioUrl: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  status: { type: String, enum: ['new', 'reviewed', 'shortlisted', 'rejected', 'hired'], default: 'new' },
}, { timestamps: true });

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
