const Counter = require('../models/Counter');
const sendResponse = require('../utils/sendResponse');

exports.getAllCounters = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    const sortField = req.query.sortField || 'sortOrder';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

    const total = await Counter.countDocuments();
    const docs = await Counter.find().sort({ [sortField]: sortOrder }).skip(skip).limit(limit);

    sendResponse(res, 200, true, 'Counters fetched', docs, { total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.getCounterById = async (req, res) => {
  try {
    const doc = await Counter.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Counter not found');
    sendResponse(res, 200, true, 'Counter fetched', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.createCounter = async (req, res) => {
  try {
    const { label, value, suffix, icon, sortOrder } = req.body;
    const doc = await Counter.create({ label, value, suffix, icon, sortOrder });
    sendResponse(res, 201, true, 'Counter created', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.updateCounter = async (req, res) => {
  try {
    const doc = await Counter.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Counter not found');
    ['label', 'value', 'suffix', 'icon', 'sortOrder'].forEach((f) => { if (req.body[f] !== undefined) doc[f] = req.body[f]; });
    await doc.save();
    sendResponse(res, 200, true, 'Counter updated', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.deleteCounter = async (req, res) => {
  try {
    const doc = await Counter.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Counter not found');
    await doc.deleteOne();
    sendResponse(res, 200, true, 'Counter deleted');
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};
