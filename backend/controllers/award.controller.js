const Award = require('../models/Award');
const sendResponse = require('../utils/sendResponse');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryHelper');

exports.getAllAwards = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const query = {};
    if (search) query.$or = [{ title: { $regex: search, $options: 'i' } }, { year: { $regex: search, $options: 'i' } }];

    const total = await Award.countDocuments(query);
    const docs = await Award.find(query).sort({ [sortField]: sortOrder }).skip(skip).limit(limit);

    sendResponse(res, 200, true, 'Awards fetched', docs, { total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.getAwardById = async (req, res) => {
  try {
    const doc = await Award.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Award not found');
    sendResponse(res, 200, true, 'Award fetched', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.createAward = async (req, res) => {
  try {
    const { title, year, description } = req.body;
    const data = { title, year, description };

    if (req.file) {
      data.image = await uploadToCloudinary(req.file.path, 'cms/awards');
    }

    const doc = await Award.create(data);
    sendResponse(res, 201, true, 'Award created', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.updateAward = async (req, res) => {
  try {
    const doc = await Award.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Award not found');

    ['title', 'year', 'description'].forEach((f) => { if (req.body[f] !== undefined) doc[f] = req.body[f]; });

    if (req.file) {
      await deleteFromCloudinary(doc.image && doc.image.public_id);
      doc.image = await uploadToCloudinary(req.file.path, 'cms/awards');
    }

    await doc.save();
    sendResponse(res, 200, true, 'Award updated', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.deleteAward = async (req, res) => {
  try {
    const doc = await Award.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Award not found');
    await deleteFromCloudinary(doc.image && doc.image.public_id);
    await doc.deleteOne();
    sendResponse(res, 200, true, 'Award deleted');
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};
