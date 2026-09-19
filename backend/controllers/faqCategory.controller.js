const FaqCategory = require('../models/FaqCategory');
const Faq = require('../models/Faq');
const sendResponse = require('../utils/sendResponse');

const slugify = (str) => str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

exports.getAllFaqCategories = async (req, res) => {
  try {
    const categories = await FaqCategory.find().sort({ sortOrder: 1, name: 1 });
    sendResponse(res, 200, true, 'FAQ categories fetched', categories);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.createFaqCategory = async (req, res) => {
  try {
    const { name, description, sortOrder } = req.body;
    const slug = slugify(name);
    const doc = await FaqCategory.create({ name, slug, description, sortOrder });
    sendResponse(res, 201, true, 'FAQ category created', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.updateFaqCategory = async (req, res) => {
  try {
    const doc = await FaqCategory.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'FAQ category not found');
    ['name', 'description', 'sortOrder'].forEach((f) => { if (req.body[f] !== undefined) doc[f] = req.body[f]; });
    if (req.body.name) doc.slug = slugify(req.body.name);
    await doc.save();
    sendResponse(res, 200, true, 'FAQ category updated', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.deleteFaqCategory = async (req, res) => {
  try {
    const doc = await FaqCategory.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'FAQ category not found');
    const inUse = await Faq.countDocuments({ category: doc._id });
    if (inUse > 0) return sendResponse(res, 400, false, `Cannot delete — ${inUse} FAQ(s) use this category`);
    await doc.deleteOne();
    sendResponse(res, 200, true, 'FAQ category deleted');
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};