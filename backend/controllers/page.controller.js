const Page = require('../models/Page');
const sendResponse = require('../utils/sendResponse');
const { uploadToCloudinary, deleteFromCloudinary, uploadManyToCloudinary } = require('../utils/cloudinaryHelper');
const { makeUniqueSlug } = require('../utils/slugHelper');

exports.getAllPages = async (req, res) => {
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

    const total = await Page.countDocuments(query);
    const pages = await Page.find(query).sort({ [sortField]: sortOrder }).skip(skip).limit(limit);

    sendResponse(res, 200, true, 'Pages fetched', pages, { total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.getPageById = async (req, res) => {
  try {
    const doc = await Page.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Page not found');
    sendResponse(res, 200, true, 'Page fetched', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.getPageBySlug = async (req, res) => {
  try {
    const doc = await Page.findOne({ slug: req.params.slug });
    if (!doc) return sendResponse(res, 404, false, 'Page not found');
    sendResponse(res, 200, true, 'Page fetched', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.createPage = async (req, res) => {
  try {
    const { title, content, metaTitle, metaDescription, canonicalUrl, schemaJson, status } = req.body;
    const slug = req.body.slug ? req.body.slug : await makeUniqueSlug(Page, title);

    const existing = await Page.findOne({ slug });
    if (existing) return sendResponse(res, 400, false, 'Slug already exists');

    const data = { title, slug, content, metaTitle, metaDescription, canonicalUrl, schemaJson, status };

    if (req.files && req.files.bannerImage) {
      data.bannerImage = await uploadToCloudinary(req.files.bannerImage[0].path, 'cms/pages');
    }
    if (req.files && req.files.gallery) {
      data.gallery = await uploadManyToCloudinary(req.files.gallery, 'cms/pages');
    }

    const doc = await Page.create(data);
    sendResponse(res, 201, true, 'Page created', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.updatePage = async (req, res) => {
  try {
    const doc = await Page.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Page not found');

    const fields = ['title', 'content', 'metaTitle', 'metaDescription', 'canonicalUrl', 'schemaJson', 'status'];
    fields.forEach((f) => { if (req.body[f] !== undefined) doc[f] = req.body[f]; });

    if (req.body.slug && req.body.slug !== doc.slug) {
      const existing = await Page.findOne({ slug: req.body.slug, _id: { $ne: doc._id } });
      if (existing) return sendResponse(res, 400, false, 'Slug already exists');
      doc.slug = req.body.slug;
    }

    if (req.files && req.files.bannerImage) {
      await deleteFromCloudinary(doc.bannerImage && doc.bannerImage.public_id);
      doc.bannerImage = await uploadToCloudinary(req.files.bannerImage[0].path, 'cms/pages');
    }
    if (req.files && req.files.gallery) {
      for (const img of doc.gallery) await deleteFromCloudinary(img.public_id);
      doc.gallery = await uploadManyToCloudinary(req.files.gallery, 'cms/pages');
    }

    await doc.save();
    sendResponse(res, 200, true, 'Page updated', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.deletePage = async (req, res) => {
  try {
    const doc = await Page.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Page not found');
    await deleteFromCloudinary(doc.bannerImage && doc.bannerImage.public_id);
    for (const img of doc.gallery) await deleteFromCloudinary(img.public_id);
    await doc.deleteOne();
    sendResponse(res, 200, true, 'Page deleted');
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};
