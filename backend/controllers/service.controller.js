const Service = require('../models/Service');
const sendResponse = require('../utils/sendResponse');
const { uploadToCloudinary, deleteFromCloudinary, uploadManyToCloudinary } = require('../utils/cloudinaryHelper');
const { makeUniqueSlug } = require('../utils/slugHelper');
//additional added
const Category = require('../models/Category'); // make sure this import exists too
exports.getAllServices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const status = req.query.status;
    const featured = req.query.featured;

    const query = {};
    if (search) query.title = { $regex: search, $options: 'i' };
    if (status) query.status = status;
    if (featured !== undefined) query.featured = featured === 'true';

    const total = await Service.countDocuments(query);
    const services = await Service.find(query).sort({ [sortField]: sortOrder }).skip(skip).limit(limit);

    sendResponse(res, 200, true, 'Services fetched', services, { total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const doc = await Service.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Service not found');
    sendResponse(res, 200, true, 'Service fetched', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.getServiceBySlug = async (req, res) => {
  try {
    const doc = await Service.findOne({ slug: req.params.slug });
    if (!doc) return sendResponse(res, 404, false, 'Service not found');
    sendResponse(res, 200, true, 'Service fetched', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.createService = async (req, res) => {
  try {
    const { title,   category,shortDescription, overview, mainContent, metaTitle, metaDescription, canonicalUrl, schemaJson, status, featured } = req.body;
    const slug = req.body.slug ? req.body.slug : await makeUniqueSlug(Service, title);

    const existing = await Service.findOne({ slug });
    if (existing) return sendResponse(res, 400, false, 'Slug already exists');

    const features = req.body.features ? (Array.isArray(req.body.features) ? req.body.features : JSON.parse(req.body.features)) : [];
    const benefits = req.body.benefits ? (Array.isArray(req.body.benefits) ? req.body.benefits : JSON.parse(req.body.benefits)) : [];
    const process = req.body.process ? (Array.isArray(req.body.process) ? req.body.process : JSON.parse(req.body.process)) : [];
    const faq = req.body.faq ? (Array.isArray(req.body.faq) ? req.body.faq : JSON.parse(req.body.faq)) : [];
    const cta = req.body.cta ? (typeof req.body.cta === 'string' ? JSON.parse(req.body.cta) : req.body.cta) : {};

    const data = { title,   category,slug, shortDescription, overview, mainContent, features, benefits, process, faq, cta, metaTitle, metaDescription, canonicalUrl, schemaJson, status, featured };

    if (req.files && req.files.bannerImage) {
      data.bannerImage = await uploadToCloudinary(req.files.bannerImage[0].path, 'cms/services');
    }
    if (req.files && req.files.thumbnail) {
      data.thumbnail = await uploadToCloudinary(req.files.thumbnail[0].path, 'cms/services');
    }
    if (req.files && req.files.gallery) {
      data.gallery = await uploadManyToCloudinary(req.files.gallery, 'cms/services');
    }

    const doc = await Service.create(data);
    sendResponse(res, 201, true, 'Service created', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.updateService = async (req, res) => {
  try {
    const doc = await Service.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Service not found');

    const textFields = ['title', 'shortDescription', 'overview', 'mainContent', 'metaTitle', 'metaDescription', 'canonicalUrl', 'schemaJson', 'status'];
    textFields.forEach((f) => { if (req.body[f] !== undefined) doc[f] = req.body[f]; });
    if (req.body.featured !== undefined) doc.featured = req.body.featured === 'true' || req.body.featured === true;

    if (req.body.features) doc.features = Array.isArray(req.body.features) ? req.body.features : JSON.parse(req.body.features);
    if (req.body.benefits) doc.benefits = Array.isArray(req.body.benefits) ? req.body.benefits : JSON.parse(req.body.benefits);
    if (req.body.process) doc.process = Array.isArray(req.body.process) ? req.body.process : JSON.parse(req.body.process);
    if (req.body.faq) doc.faq = Array.isArray(req.body.faq) ? req.body.faq : JSON.parse(req.body.faq);
    if (req.body.cta) doc.cta = typeof req.body.cta === 'string' ? JSON.parse(req.body.cta) : req.body.cta;

    if (req.body.slug && req.body.slug !== doc.slug) {
      const existing = await Service.findOne({ slug: req.body.slug, _id: { $ne: doc._id } });
      if (existing) return sendResponse(res, 400, false, 'Slug already exists');
      doc.slug = req.body.slug;
    }

    if (req.files && req.files.bannerImage) {
      await deleteFromCloudinary(doc.bannerImage && doc.bannerImage.public_id);
      doc.bannerImage = await uploadToCloudinary(req.files.bannerImage[0].path, 'cms/services');
    }
    if (req.files && req.files.thumbnail) {
      await deleteFromCloudinary(doc.thumbnail && doc.thumbnail.public_id);
      doc.thumbnail = await uploadToCloudinary(req.files.thumbnail[0].path, 'cms/services');
    }
    if (req.files && req.files.gallery) {
      for (const img of doc.gallery) await deleteFromCloudinary(img.public_id);
      doc.gallery = await uploadManyToCloudinary(req.files.gallery, 'cms/services');
    }

    await doc.save();
    sendResponse(res, 200, true, 'Service updated', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.deleteService = async (req, res) => {
  try {
    const doc = await Service.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Service not found');
    await deleteFromCloudinary(doc.bannerImage && doc.bannerImage.public_id);
    await deleteFromCloudinary(doc.thumbnail && doc.thumbnail.public_id);
    for (const img of doc.gallery) await deleteFromCloudinary(img.public_id);
    await doc.deleteOne();
    sendResponse(res, 200, true, 'Service deleted');
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.getServicesByCategorySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.categorySlug });
    if (!category) return sendResponse(res, 404, false, 'Category not found');

    const services = await Service.find({ category: category._id, status: 'published' }).sort({
      createdAt: -1,
    });

    sendResponse(res, 200, true, 'Services fetched', { category, services });
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};