const Testimonial = require('../models/Testimonial');
const sendResponse = require('../utils/sendResponse');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryHelper');

exports.getAllTestimonials = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const featured = req.query.featured;

    const query = {};
    if (search) query.$or = [{ clientName: { $regex: search, $options: 'i' } }, { company: { $regex: search, $options: 'i' } }];
    if (featured !== undefined) query.featured = featured === 'true';

    const total = await Testimonial.countDocuments(query);
    const docs = await Testimonial.find(query).sort({ [sortField]: sortOrder }).skip(skip).limit(limit);

    sendResponse(res, 200, true, 'Testimonials fetched', docs, { total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.getTestimonialById = async (req, res) => {
  try {
    const doc = await Testimonial.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Testimonial not found');
    sendResponse(res, 200, true, 'Testimonial fetched', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.createTestimonial = async (req, res) => {
  try {
    const { clientName, company, review, starRating, videoUrl } = req.body;
    const featured = req.body.featured === 'true' || req.body.featured === true;
    const data = { clientName, company, review, starRating, videoUrl, featured };

    if (req.file) {
      data.photo = await uploadToCloudinary(req.file.path, 'cms/testimonials');
    }

    const doc = await Testimonial.create(data);
    sendResponse(res, 201, true, 'Testimonial created', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.updateTestimonial = async (req, res) => {
  try {
    const doc = await Testimonial.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Testimonial not found');

    const textFields = ['clientName', 'company', 'review', 'starRating', 'videoUrl'];
    textFields.forEach((f) => { if (req.body[f] !== undefined) doc[f] = req.body[f]; });
    if (req.body.featured !== undefined) doc.featured = req.body.featured === 'true' || req.body.featured === true;

    if (req.file) {
      await deleteFromCloudinary(doc.photo && doc.photo.public_id);
      doc.photo = await uploadToCloudinary(req.file.path, 'cms/testimonials');
    }

    await doc.save();
    sendResponse(res, 200, true, 'Testimonial updated', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.deleteTestimonial = async (req, res) => {
  try {
    const doc = await Testimonial.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Testimonial not found');
    await deleteFromCloudinary(doc.photo && doc.photo.public_id);
    await doc.deleteOne();
    sendResponse(res, 200, true, 'Testimonial deleted');
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};
