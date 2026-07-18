const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true, trim: true },
  department: { type: String, default: '' },
  experience: { type: String, default: '' },
  employmentType: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'], default: 'full-time' },
  salary: { type: String, default: '' },
  location: { type: String, default: '' },
  description: { type: String, default: '' },
  responsibilities: { type: [String], default: [] },
  requirements: { type: [String], default: [] },
  benefits: { type: [String], default: [] },
  vacancies: { type: Number, default: 1 },
  deadline: { type: Date },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
}, { timestamps: true });

module.exports = mongoose.model('Career', careerSchema);
