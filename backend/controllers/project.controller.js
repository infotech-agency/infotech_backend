const Project = require('../models/Project');
const sendResponse = require('../utils/sendResponse');
const { uploadToCloudinary, deleteFromCloudinary, uploadManyToCloudinary } = require('../utils/cloudinaryHelper');
const { makeUniqueSlug } = require('../utils/slugHelper');

exports.getAllProjects = async (req, res) => {
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
    if (search) query.$or = [{ title: { $regex: search, $options: 'i' } }, { clientName: { $regex: search, $options: 'i' } }];
    if (status) query.status = status;
    if (featured !== undefined) query.featured = featured === 'true';

    const total = await Project.countDocuments(query);
    const projects = await Project.find(query).sort({ [sortField]: sortOrder }).skip(skip).limit(limit);

    sendResponse(res, 200, true, 'Projects fetched', projects, { total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const doc = await Project.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Project not found');
    sendResponse(res, 200, true, 'Project fetched', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.getProjectBySlug = async (req, res) => {
  try {
    const doc = await Project.findOne({ slug: req.params.slug });
    if (!doc) return sendResponse(res, 404, false, 'Project not found');
    sendResponse(res, 200, true, 'Project fetched', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.createProject = async (req, res) => {
  try {
    const { title, clientName, websiteUrl, description, completionDate, metaTitle, metaDescription, status } = req.body;
    const slug = req.body.slug ? req.body.slug : await makeUniqueSlug(Project, title);

    const existing = await Project.findOne({ slug });
    if (existing) return sendResponse(res, 400, false, 'Slug already exists');

    const technology = req.body.technology ? (Array.isArray(req.body.technology) ? req.body.technology : JSON.parse(req.body.technology)) : [];

    const data = { title, slug, clientName, websiteUrl, technology, description, completionDate, metaTitle, metaDescription, status };
    if (req.body.featured !== undefined) data.featured = req.body.featured === 'true' || req.body.featured === true;

    if (req.files && req.files.thumbnail) {
      data.thumbnail = await uploadToCloudinary(req.files.thumbnail[0].path, 'cms/projects');
    }
    if (req.files && req.files.gallery) {
      data.gallery = await uploadManyToCloudinary(req.files.gallery, 'cms/projects');
    }

    const doc = await Project.create(data);
    sendResponse(res, 201, true, 'Project created', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.updateProject = async (req, res) => {
  try {
    const doc = await Project.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Project not found');

    const textFields = ['title', 'clientName', 'websiteUrl', 'description', 'completionDate', 'metaTitle', 'metaDescription', 'status'];
    textFields.forEach((f) => { if (req.body[f] !== undefined) doc[f] = req.body[f]; });
    if (req.body.featured !== undefined) doc.featured = req.body.featured === 'true' || req.body.featured === true;
    if (req.body.technology) doc.technology = Array.isArray(req.body.technology) ? req.body.technology : JSON.parse(req.body.technology);

    if (req.body.slug && req.body.slug !== doc.slug) {
      const existing = await Project.findOne({ slug: req.body.slug, _id: { $ne: doc._id } });
      if (existing) return sendResponse(res, 400, false, 'Slug already exists');
      doc.slug = req.body.slug;
    }

    if (req.files && req.files.thumbnail) {
      await deleteFromCloudinary(doc.thumbnail && doc.thumbnail.public_id);
      doc.thumbnail = await uploadToCloudinary(req.files.thumbnail[0].path, 'cms/projects');
    }
    if (req.files && req.files.gallery) {
      for (const img of doc.gallery) await deleteFromCloudinary(img.public_id);
      doc.gallery = await uploadManyToCloudinary(req.files.gallery, 'cms/projects');
    }

    await doc.save();
    sendResponse(res, 200, true, 'Project updated', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const doc = await Project.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Project not found');
    await deleteFromCloudinary(doc.thumbnail && doc.thumbnail.public_id);
    for (const img of doc.gallery) await deleteFromCloudinary(img.public_id);
    await doc.deleteOne();
    sendResponse(res, 200, true, 'Project deleted');
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};
