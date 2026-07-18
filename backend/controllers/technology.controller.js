const Technology = require('../models/Technology');
const sendResponse = require('../utils/sendResponse');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryHelper');

exports.getAllTechnologies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const query = {};
    if (search) query.name = { $regex: search, $options: 'i' };

    const total = await Technology.countDocuments(query);
    const docs = await Technology.find(query).sort({ [sortField]: sortOrder }).skip(skip).limit(limit);

    sendResponse(res, 200, true, 'Technologies fetched', docs, { total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.getTechnologyById = async (req, res) => {
  try {
    const doc = await Technology.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Technology not found');
    sendResponse(res, 200, true, 'Technology fetched', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.createTechnology = async (req, res) => {
  try {
    const { name, description } = req.body;
    const data = { name, description };

    if (req.file) {
      data.logo = await uploadToCloudinary(req.file.path, 'cms/technologies');
    }

    const doc = await Technology.create(data);
    sendResponse(res, 201, true, 'Technology created', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.updateTechnology = async (req, res) => {
  try {
    const doc = await Technology.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Technology not found');

    ['name', 'description'].forEach((f) => { if (req.body[f] !== undefined) doc[f] = req.body[f]; });

    if (req.file) {
      await deleteFromCloudinary(doc.logo && doc.logo.public_id);
      doc.logo = await uploadToCloudinary(req.file.path, 'cms/technologies');
    }

    await doc.save();
    sendResponse(res, 200, true, 'Technology updated', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.deleteTechnology = async (req, res) => {
  try {
    const doc = await Technology.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Technology not found');
    await deleteFromCloudinary(doc.logo && doc.logo.public_id);
    await doc.deleteOne();
    sendResponse(res, 200, true, 'Technology deleted');
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};
