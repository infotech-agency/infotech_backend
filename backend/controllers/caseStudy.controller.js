const CaseStudy = require('../models/CaseStudy');
const sendResponse = require('../utils/sendResponse');
const { uploadManyToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryHelper');
const { makeUniqueSlug } = require('../utils/slugHelper');

exports.getAllCaseStudies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const status = req.query.status;

    const query = {};
    if (search) query.$or = [{ title: { $regex: search, $options: 'i' } }, { client: { $regex: search, $options: 'i' } }];
    if (status) query.status = status;

    const total = await CaseStudy.countDocuments(query);
    const docs = await CaseStudy.find(query).sort({ [sortField]: sortOrder }).skip(skip).limit(limit);

    sendResponse(res, 200, true, 'Case studies fetched', docs, { total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.getCaseStudyById = async (req, res) => {
  try {
    const doc = await CaseStudy.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Case study not found');
    sendResponse(res, 200, true, 'Case study fetched', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.getCaseStudyBySlug = async (req, res) => {
  try {
    const doc = await CaseStudy.findOne({ slug: req.params.slug });
    if (!doc) return sendResponse(res, 404, false, 'Case study not found');
    sendResponse(res, 200, true, 'Case study fetched', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.createCaseStudy = async (req, res) => {
  try {
    const { title, client, industry, challenge, solution, result, metaTitle, metaDescription, status } = req.body;
    const slug = req.body.slug ? req.body.slug : await makeUniqueSlug(CaseStudy, title);

    const existing = await CaseStudy.findOne({ slug });
    if (existing) return sendResponse(res, 400, false, 'Slug already exists');

    const data = { title, slug, client, industry, challenge, solution, result, metaTitle, metaDescription, status };

    if (req.files && req.files.images) {
      data.images = await uploadManyToCloudinary(req.files.images, 'cms/case-studies');
    }
    if (req.files && req.files.gallery) {
      data.gallery = await uploadManyToCloudinary(req.files.gallery, 'cms/case-studies');
    }

    const doc = await CaseStudy.create(data);
    sendResponse(res, 201, true, 'Case study created', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.updateCaseStudy = async (req, res) => {
  try {
    const doc = await CaseStudy.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Case study not found');

    const textFields = ['title', 'client', 'industry', 'challenge', 'solution', 'result', 'metaTitle', 'metaDescription', 'status'];
    textFields.forEach((f) => { if (req.body[f] !== undefined) doc[f] = req.body[f]; });

    if (req.body.slug && req.body.slug !== doc.slug) {
      const existing = await CaseStudy.findOne({ slug: req.body.slug, _id: { $ne: doc._id } });
      if (existing) return sendResponse(res, 400, false, 'Slug already exists');
      doc.slug = req.body.slug;
    }

    if (req.files && req.files.images) {
      for (const img of doc.images) await deleteFromCloudinary(img.public_id);
      doc.images = await uploadManyToCloudinary(req.files.images, 'cms/case-studies');
    }
    if (req.files && req.files.gallery) {
      for (const img of doc.gallery) await deleteFromCloudinary(img.public_id);
      doc.gallery = await uploadManyToCloudinary(req.files.gallery, 'cms/case-studies');
    }

    await doc.save();
    sendResponse(res, 200, true, 'Case study updated', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.deleteCaseStudy = async (req, res) => {
  try {
    const doc = await CaseStudy.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Case study not found');
    for (const img of doc.images) await deleteFromCloudinary(img.public_id);
    for (const img of doc.gallery) await deleteFromCloudinary(img.public_id);
    await doc.deleteOne();
    sendResponse(res, 200, true, 'Case study deleted');
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};
