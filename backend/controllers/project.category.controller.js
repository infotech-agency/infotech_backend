const ProjectCategory = require('../models/ProjectCategory');
const Project = require('../models/Project');
const sendResponse = require('../utils/sendResponse');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryHelper');
const { makeUniqueSlug } = require('../utils/slugHelper');
const mongoose = require('mongoose');
// const ProjectCategory = require('../models/ProjectCategory');
const getIconFile = (req) => (req.files && req.files.icon && req.files.icon[0]) || req.file || null;

const validateSchemaJson = (str) => {
  if (!str) return true;
  try { JSON.parse(str); return true; } catch { return false; }
};

exports.getAllProjectCategories = async (req, res) => {
  try {
    
    const query = {};
    if (req.query.status) query.status = req.query.status;
    const list = await ProjectCategory.find(query).sort({ order: 1, name: 1 });
    sendResponse(res, 200, true, 'Categories fetched', list);
  } catch (err) { sendResponse(res, 500, false, err.message); }
};

exports.getProjectCategoryById = async (req, res) => {
  try {
    const doc = await ProjectCategory.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Category not found');
    sendResponse(res, 200, true, 'Category fetched', doc);
  } catch (err) { sendResponse(res, 500, false, err.message); }
};

exports.getProjectCategoryBySlug = async (req, res) => {
  try {
    const doc = await ProjectCategory.findOne({ slug: req.params.slug, status: 'published' });
    if (!doc) return sendResponse(res, 404, false, 'Category not found');
    sendResponse(res, 200, true, 'Category fetched', doc);
  } catch (err) { sendResponse(res, 500, false, err.message); }
};

exports.createProjectCategory = async (req, res) => {
  try {
    const { name, description, metaTitle, metaDescription, canonicalUrl, schemaJson, status, order } = req.body;
    if (!name) return sendResponse(res, 400, false, 'Name is required');
    if (!validateSchemaJson(schemaJson)) return sendResponse(res, 400, false, 'Schema JSON valid nahi hai');

    const nameExists = await ProjectCategory.findOne({ name: { $regex: `^${name.trim()}$`, $options: 'i' } });
    if (nameExists) return sendResponse(res, 400, false, 'Category already exists');

    const slug = req.body.slug ? req.body.slug : await makeUniqueSlug(ProjectCategory, name);
    const slugExists = await ProjectCategory.findOne({ slug });
    if (slugExists) return sendResponse(res, 400, false, 'Slug already exists');

    const data = { name, slug, description, metaTitle, metaDescription, canonicalUrl, schemaJson, status, order };
    const file = getIconFile(req);
    if (file) data.icon = await uploadToCloudinary(file.path, 'cms/project-categories');

    const doc = await ProjectCategory.create(data);
    sendResponse(res, 201, true, 'Category created', doc);
  } catch (err) { sendResponse(res, 500, false, err.message); }
};

exports.updateProjectCategory = async (req, res) => {
  try {
    const doc = await ProjectCategory.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Category not found');

    if (req.body.schemaJson !== undefined && !validateSchemaJson(req.body.schemaJson))
      return sendResponse(res, 400, false, 'Schema JSON valid nahi hai');

    const fields = ['name', 'description', 'metaTitle', 'metaDescription', 'canonicalUrl', 'schemaJson', 'status', 'order'];
    fields.forEach((f) => { if (req.body[f] !== undefined) doc[f] = req.body[f]; });

    if (req.body.slug && req.body.slug !== doc.slug) {
      const existing = await ProjectCategory.findOne({ slug: req.body.slug, _id: { $ne: doc._id } });
      if (existing) return sendResponse(res, 400, false, 'Slug already exists');
      doc.slug = req.body.slug;
    }

    const file = getIconFile(req);
    if (file) {
      await deleteFromCloudinary(doc.icon && doc.icon.public_id);
      doc.icon = await uploadToCloudinary(file.path, 'cms/project-categories');
    }

    await doc.save();
    sendResponse(res, 200, true, 'Category updated', doc);
  } catch (err) { sendResponse(res, 500, false, err.message); }
};

exports.deleteProjectCategory = async (req, res) => {
  try {
    const doc = await ProjectCategory.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Category not found');

    const used = await Project.countDocuments({ category: doc._id });
    if (used > 0) return sendResponse(res, 400, false, `${used} project(s) is category me hain, pehle unhe shift karo`);

    await deleteFromCloudinary(doc.icon && doc.icon.public_id);
    await doc.deleteOne();
    sendResponse(res, 200, true, 'Category deleted');
  } catch (err) { sendResponse(res, 500, false, err.message); }
};