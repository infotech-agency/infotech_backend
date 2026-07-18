const Newsletter = require('../models/Newsletter');
const sendResponse = require('../utils/sendResponse');

exports.getAllSubscribers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const query = {};
    if (search) query.email = { $regex: search, $options: 'i' };

    const total = await Newsletter.countDocuments(query);
    const docs = await Newsletter.find(query).sort({ [sortField]: sortOrder }).skip(skip).limit(limit);

    sendResponse(res, 200, true, 'Subscribers fetched', docs, { total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return sendResponse(res, 400, false, 'Email is required');
    const existing = await Newsletter.findOne({ email });
    if (existing) return sendResponse(res, 400, false, 'Email already subscribed');
    const doc = await Newsletter.create({ email });
    sendResponse(res, 201, true, 'Subscribed successfully', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.unsubscribe = async (req, res) => {
  try {
    const doc = await Newsletter.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Subscriber not found');
    await doc.deleteOne();
    sendResponse(res, 200, true, 'Unsubscribed successfully');
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};
