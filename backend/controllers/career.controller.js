const Career = require('../models/Career');
const sendResponse = require('../utils/sendResponse');
const { makeUniqueSlug } = require('../utils/slugHelper');

exports.getAllCareers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const status = req.query.status;
    const department = req.query.department;

    const query = {};
    if (search) query.$or = [{ jobTitle: { $regex: search, $options: 'i' } }, { department: { $regex: search, $options: 'i' } }];
    if (status) query.status = status;
    if (department) query.department = department;

    const total = await Career.countDocuments(query);
    const docs = await Career.find(query).sort({ [sortField]: sortOrder }).skip(skip).limit(limit);

    sendResponse(res, 200, true, 'Careers fetched', docs, { total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.getCareerById = async (req, res) => {
  try {
    const doc = await Career.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Career not found');
    sendResponse(res, 200, true, 'Career fetched', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.getCareerBySlug = async (req, res) => {
  try {
    const doc = await Career.findOne({ slug: req.params.slug });
    if (!doc) return sendResponse(res, 404, false, 'Career not found');
    sendResponse(res, 200, true, 'Career fetched', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.createCareer = async (req, res) => {
  try {
    const { jobTitle, department, experience, employmentType, salary, location, description, vacancies, deadline, status } = req.body;
    const slug = req.body.slug ? req.body.slug : await makeUniqueSlug(Career, jobTitle);

    const existing = await Career.findOne({ slug });
    if (existing) return sendResponse(res, 400, false, 'Slug already exists');

    const responsibilities = req.body.responsibilities ? (Array.isArray(req.body.responsibilities) ? req.body.responsibilities : JSON.parse(req.body.responsibilities)) : [];
    const requirements = req.body.requirements ? (Array.isArray(req.body.requirements) ? req.body.requirements : JSON.parse(req.body.requirements)) : [];
    const benefits = req.body.benefits ? (Array.isArray(req.body.benefits) ? req.body.benefits : JSON.parse(req.body.benefits)) : [];

    const doc = await Career.create({ jobTitle, slug, department, experience, employmentType, salary, location, description, responsibilities, requirements, benefits, vacancies, deadline, status });
    sendResponse(res, 201, true, 'Career created', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.updateCareer = async (req, res) => {
  try {
    const doc = await Career.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Career not found');

    const textFields = ['jobTitle', 'department', 'experience', 'employmentType', 'salary', 'location', 'description', 'vacancies', 'deadline', 'status'];
    textFields.forEach((f) => { if (req.body[f] !== undefined) doc[f] = req.body[f]; });

    if (req.body.responsibilities) doc.responsibilities = Array.isArray(req.body.responsibilities) ? req.body.responsibilities : JSON.parse(req.body.responsibilities);
    if (req.body.requirements) doc.requirements = Array.isArray(req.body.requirements) ? req.body.requirements : JSON.parse(req.body.requirements);
    if (req.body.benefits) doc.benefits = Array.isArray(req.body.benefits) ? req.body.benefits : JSON.parse(req.body.benefits);

    if (req.body.slug && req.body.slug !== doc.slug) {
      const existing = await Career.findOne({ slug: req.body.slug, _id: { $ne: doc._id } });
      if (existing) return sendResponse(res, 400, false, 'Slug already exists');
      doc.slug = req.body.slug;
    }

    await doc.save();
    sendResponse(res, 200, true, 'Career updated', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.deleteCareer = async (req, res) => {
  try {
    const doc = await Career.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Career not found');
    await doc.deleteOne();
    sendResponse(res, 200, true, 'Career deleted');
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};
