const Blog = require('../models/Blog');
const sendResponse = require('../utils/sendResponse');
const { uploadToCloudinary, deleteFromCloudinary, uploadManyToCloudinary } = require('../utils/cloudinaryHelper');
const { makeUniqueSlug } = require('../utils/slugHelper');

exports.getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const status = req.query.status;
    const category = req.query.category;

    const query = {};
    if (search) query.$or = [{ title: { $regex: search, $options: 'i' } }, { excerpt: { $regex: search, $options: 'i' } }];
    if (status) query.status = status;
    if (category) query.category = category;

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query).sort({ [sortField]: sortOrder }).skip(skip).limit(limit);

    sendResponse(res, 200, true, 'Blogs fetched', blogs, { total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const doc = await Blog.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Blog not found');
    sendResponse(res, 200, true, 'Blog fetched', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.getBlogBySlug = async (req, res) => {
  try {
    const doc = await Blog.findOneAndUpdate({ slug: req.params.slug }, { $inc: { views: 1 } }, { new: true });
    if (!doc) return sendResponse(res, 404, false, 'Blog not found');
    sendResponse(res, 200, true, 'Blog fetched', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.createBlog = async (req, res) => {
  try {
    const { title, category, excerpt, content, author, metaTitle, metaDescription, canonicalUrl, schemaJson, status, publishedDate } = req.body;
    const slug = req.body.slug ? req.body.slug : await makeUniqueSlug(Blog, title);

    const existing = await Blog.findOne({ slug });
    if (existing) return sendResponse(res, 400, false, 'Slug already exists');

    const tags = req.body.tags ? (Array.isArray(req.body.tags) ? req.body.tags : JSON.parse(req.body.tags)) : [];

    const data = { title, slug, category, tags, excerpt, content, author, metaTitle, metaDescription, canonicalUrl, schemaJson, status, publishedDate };

    if (req.files && req.files.featuredImage) {
      data.featuredImage = await uploadToCloudinary(req.files.featuredImage[0].path, 'cms/blogs');
    }
    if (req.files && req.files.gallery) {
      data.gallery = await uploadManyToCloudinary(req.files.gallery, 'cms/blogs');
    }

    const doc = await Blog.create(data);
    sendResponse(res, 201, true, 'Blog created', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const doc = await Blog.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Blog not found');

    const textFields = ['title', 'category', 'excerpt', 'content', 'author', 'metaTitle', 'metaDescription', 'canonicalUrl', 'schemaJson', 'status', 'publishedDate'];
    textFields.forEach((f) => { if (req.body[f] !== undefined) doc[f] = req.body[f]; });

    if (req.body.tags) doc.tags = Array.isArray(req.body.tags) ? req.body.tags : JSON.parse(req.body.tags);

    if (req.body.slug && req.body.slug !== doc.slug) {
      const existing = await Blog.findOne({ slug: req.body.slug, _id: { $ne: doc._id } });
      if (existing) return sendResponse(res, 400, false, 'Slug already exists');
      doc.slug = req.body.slug;
    }

    if (req.files && req.files.featuredImage) {
      await deleteFromCloudinary(doc.featuredImage && doc.featuredImage.public_id);
      doc.featuredImage = await uploadToCloudinary(req.files.featuredImage[0].path, 'cms/blogs');
    }
    if (req.files && req.files.gallery) {
      for (const img of doc.gallery) await deleteFromCloudinary(img.public_id);
      doc.gallery = await uploadManyToCloudinary(req.files.gallery, 'cms/blogs');
    }

    await doc.save();
    sendResponse(res, 200, true, 'Blog updated', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const doc = await Blog.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Blog not found');
    await deleteFromCloudinary(doc.featuredImage && doc.featuredImage.public_id);
    for (const img of doc.gallery) await deleteFromCloudinary(img.public_id);
    await doc.deleteOne();
    sendResponse(res, 200, true, 'Blog deleted');
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};
