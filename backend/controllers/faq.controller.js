// const Faq = require('../models/Faq');
// const sendResponse = require('../utils/sendResponse');

// exports.getAllFaqs = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;
//     const search = req.query.search || '';
//     const sortField = req.query.sortField || 'sortOrder';
//     const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
//     const category = req.query.category;

//     const query = {};
//     if (search) query.$or = [{ question: { $regex: search, $options: 'i' } }, { answer: { $regex: search, $options: 'i' } }];
//     if (category) query.category = category;

//     const total = await Faq.countDocuments(query);
//     const docs = await Faq.find(query).sort({ [sortField]: sortOrder }).skip(skip).limit(limit);

//     sendResponse(res, 200, true, 'FAQs fetched', docs, { total, page, limit, pages: Math.ceil(total / limit) });
//   } catch (err) {
//     sendResponse(res, 500, false, err.message);
//   }
// };

// exports.getFaqById = async (req, res) => {
//   try {
//     const doc = await Faq.findById(req.params.id);
//     if (!doc) return sendResponse(res, 404, false, 'FAQ not found');
//     sendResponse(res, 200, true, 'FAQ fetched', doc);
//   } catch (err) {
//     sendResponse(res, 500, false, err.message);
//   }
// };

// exports.createFaq = async (req, res) => {
//   try {
//     const { question, answer, category, sortOrder } = req.body;
//     const doc = await Faq.create({ question, answer, category, sortOrder });
//     sendResponse(res, 201, true, 'FAQ created', doc);
//   } catch (err) {
//     sendResponse(res, 500, false, err.message);
//   }
// };

// exports.updateFaq = async (req, res) => {
//   try {
//     const doc = await Faq.findById(req.params.id);
//     if (!doc) return sendResponse(res, 404, false, 'FAQ not found');
//     ['question', 'answer', 'category', 'sortOrder'].forEach((f) => { if (req.body[f] !== undefined) doc[f] = req.body[f]; });
//     await doc.save();
//     sendResponse(res, 200, true, 'FAQ updated', doc);
//   } catch (err) {
//     sendResponse(res, 500, false, err.message);
//   }
// };

// exports.deleteFaq = async (req, res) => {
//   try {
//     const doc = await Faq.findById(req.params.id);
//     if (!doc) return sendResponse(res, 404, false, 'FAQ not found');
//     await doc.deleteOne();
//     sendResponse(res, 200, true, 'FAQ deleted');
//   } catch (err) {
//     sendResponse(res, 500, false, err.message);
//   }
// };

const Faq = require('../models/Faq');
const FaqCategory = require('../models/FaqCategory');
const sendResponse = require('../utils/sendResponse');

exports.getAllFaqs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const sortField = req.query.sortField || 'sortOrder';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
    const category = req.query.category;

    const query = {};
    if (search) query.$or = [{ question: { $regex: search, $options: 'i' } }, { answer: { $regex: search, $options: 'i' } }];
    if (category) query.category = category; // category _id frontend se aayega

    const total = await Faq.countDocuments(query);
    const docs = await Faq.find(query)
      .populate('category', 'name slug')   // <-- naya
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);

    sendResponse(res, 200, true, 'FAQs fetched', docs, { total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.getFaqById = async (req, res) => {
  try {
    const doc = await Faq.findById(req.params.id).populate('category', 'name slug'); // <-- naya
    if (!doc) return sendResponse(res, 404, false, 'FAQ not found');
    sendResponse(res, 200, true, 'FAQ fetched', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.createFaq = async (req, res) => {
  try {
    const { question, answer, category, sortOrder } = req.body;
    const doc = await Faq.create({ question, answer, category, sortOrder });
    sendResponse(res, 201, true, 'FAQ created', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.updateFaq = async (req, res) => {
  try {
    const doc = await Faq.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'FAQ not found');
    ['question', 'answer', 'category', 'sortOrder'].forEach((f) => { if (req.body[f] !== undefined) doc[f] = req.body[f]; });
    await doc.save();
    sendResponse(res, 200, true, 'FAQ updated', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.deleteFaq = async (req, res) => {
  try {
    const doc = await Faq.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'FAQ not found');
    await doc.deleteOne();
    sendResponse(res, 200, true, 'FAQ deleted');
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

// naya — category-wise grouped FAQs (public FAQ page ke liye, jahan sabhi categories aur unke FAQs ek saath chahiye)
exports.getFaqsGroupedByCategory = async (req, res) => {
  try {
    const categories = await FaqCategory.find().sort({ sortOrder: 1, name: 1 });
    const result = await Promise.all(
      categories.map(async (cat) => ({
        category: cat,
        faqs: await Faq.find({ category: cat._id }).sort({ sortOrder: 1 }),
      }))
    );
    sendResponse(res, 200, true, 'Grouped FAQs fetched', result);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};