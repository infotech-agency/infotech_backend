const JobApplication = require('../models/JobApplication');
const sendResponse = require('../utils/sendResponse');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

exports.getAllApplications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const status = req.query.status;
    const position = req.query.position;

    const query = {};
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
    if (status) query.status = status;
    if (position) query.appliedPosition = { $regex: position, $options: 'i' };

    const total = await JobApplication.countDocuments(query);
    const docs = await JobApplication.find(query).sort({ [sortField]: sortOrder }).skip(skip).limit(limit);

    sendResponse(res, 200, true, 'Applications fetched', docs, { total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.getApplicationById = async (req, res) => {
  try {
    const doc = await JobApplication.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Application not found');
    sendResponse(res, 200, true, 'Application fetched', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.createApplication = async (req, res) => {
  try {
    const { name, email, phone, experience, currentCompany, currentSalary, expectedSalary, noticePeriod, appliedPosition, coverLetter, portfolioUrl, linkedinUrl } = req.body;

    const data = { name, email, phone, experience, currentCompany, currentSalary, expectedSalary, noticePeriod, appliedPosition, coverLetter, portfolioUrl, linkedinUrl };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'cms/resumes',
        resource_type: 'raw',
      });
      fs.unlinkSync(req.file.path);
      data.resume = { public_id: result.public_id, secure_url: result.secure_url };
    }

    const doc = await JobApplication.create(data);
    sendResponse(res, 201, true, 'Application submitted', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const doc = await JobApplication.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Application not found');
    if (req.body.status) doc.status = req.body.status;
    await doc.save();
    sendResponse(res, 200, true, 'Application status updated', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const doc = await JobApplication.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Application not found');
    if (doc.resume && doc.resume.public_id) {
      await cloudinary.uploader.destroy(doc.resume.public_id, { resource_type: 'raw' });
    }
    await doc.deleteOne();
    sendResponse(res, 200, true, 'Application deleted');
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};
