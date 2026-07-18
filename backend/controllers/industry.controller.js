const Industry = require('../models/Industry');
const sendResponse = require('../utils/sendResponse');
const { uploadToCloudinary, deleteFromCloudinary, uploadManyToCloudinary } = require('../utils/cloudinaryHelper');
const { makeUniqueSlug } = require('../utils/slugHelper');

exports.getAllIndustries = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const status = req.query.status;

    const query = {};
    if (search) query.title = { $regex: search, $options: 'i' };
    if (status) query.status = status;

    const total = await Industry.countDocuments(query);
    const industries = await Industry.find(query).sort({ [sortField]: sortOrder }).skip(skip).limit(limit);

    sendResponse(res, 200, true, 'Industries fetched', industries, { total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.getIndustryById = async (req, res) => {
  try {
    const doc = await Industry.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Industry not found');
    sendResponse(res, 200, true, 'Industry fetched', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.getIndustryBySlug = async (req, res) => {
  try {
    const doc = await Industry.findOne({ slug: req.params.slug });
    if (!doc) return sendResponse(res, 404, false, 'Industry not found');
    sendResponse(res, 200, true, 'Industry fetched', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.createIndustry = async (req, res) => {
  try {
    const { title, overview, content, metaTitle, metaDescription, schemaJson, status } = req.body;
    const slug = req.body.slug ? req.body.slug : await makeUniqueSlug(Industry, title);

    const existing = await Industry.findOne({ slug });
    if (existing) return sendResponse(res, 400, false, 'Slug already exists');

    const benefits = req.body.benefits ? (Array.isArray(req.body.benefits) ? req.body.benefits : JSON.parse(req.body.benefits)) : [];
    const faq = req.body.faq ? (Array.isArray(req.body.faq) ? req.body.faq : JSON.parse(req.body.faq)) : [];
    const cta = req.body.cta ? (typeof req.body.cta === 'string' ? JSON.parse(req.body.cta) : req.body.cta) : {};

    const data = { title, slug, overview, content, benefits, faq, cta, metaTitle, metaDescription, schemaJson, status };

    if (req.files && req.files.banner) {
      data.banner = await uploadToCloudinary(req.files.banner[0].path, 'cms/industries');
    }
    if (req.files && req.files.gallery) {
      data.gallery = await uploadManyToCloudinary(req.files.gallery, 'cms/industries');
    }

    const doc = await Industry.create(data);
    sendResponse(res, 201, true, 'Industry created', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.updateIndustry = async (req, res) => {
  try {
    const doc = await Industry.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Industry not found');

    const textFields = ['title', 'overview', 'content', 'metaTitle', 'metaDescription', 'schemaJson', 'status'];
    textFields.forEach((f) => { if (req.body[f] !== undefined) doc[f] = req.body[f]; });

    if (req.body.benefits) doc.benefits = Array.isArray(req.body.benefits) ? req.body.benefits : JSON.parse(req.body.benefits);
    if (req.body.faq) doc.faq = Array.isArray(req.body.faq) ? req.body.faq : JSON.parse(req.body.faq);
    if (req.body.cta) doc.cta = typeof req.body.cta === 'string' ? JSON.parse(req.body.cta) : req.body.cta;

    if (req.body.slug && req.body.slug !== doc.slug) {
      const existing = await Industry.findOne({ slug: req.body.slug, _id: { $ne: doc._id } });
      if (existing) return sendResponse(res, 400, false, 'Slug already exists');
      doc.slug = req.body.slug;
    }

    if (req.files && req.files.banner) {
      await deleteFromCloudinary(doc.banner && doc.banner.public_id);
      doc.banner = await uploadToCloudinary(req.files.banner[0].path, 'cms/industries');
    }
    if (req.files && req.files.gallery) {
      for (const img of doc.gallery) await deleteFromCloudinary(img.public_id);
      doc.gallery = await uploadManyToCloudinary(req.files.gallery, 'cms/industries');
    }

    await doc.save();
    sendResponse(res, 200, true, 'Industry updated', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.deleteIndustry = async (req, res) => {
  try {
    const doc = await Industry.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Industry not found');
    await deleteFromCloudinary(doc.banner && doc.banner.public_id);
    for (const img of doc.gallery) await deleteFromCloudinary(img.public_id);
    await doc.deleteOne();
    sendResponse(res, 200, true, 'Industry deleted');
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};
