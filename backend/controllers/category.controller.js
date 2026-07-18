const Category = require('../models/Category');
const Service = require('../models/Service');
const sendResponse = require('../utils/sendResponse');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryHelper');
const { makeUniqueSlug } = require('../utils/slugHelper');

exports.getAllCategories = async (req, res) => {
  try {
    const search = req.query.search || '';
    const status = req.query.status;

    const query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (status) query.status = status;

    const categories = await Category.find(query).sort({ order: 1, createdAt: -1 });
    sendResponse(res, 200, true, 'Categories fetched', categories);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const doc = await Category.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Category not found');
    sendResponse(res, 200, true, 'Category fetched', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

// Public-facing endpoint: category details + every published service under it.
// e.g. GET /categories/digital-marketing -> category info + all DM services for the landing page.
exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return sendResponse(res, 404, false, 'Category not found');

    const services = await Service.find({ category: category._id, status: 'published' }).sort({
      createdAt: -1,
    });

    sendResponse(res, 200, true, 'Category fetched', { category, services });
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description, metaTitle, metaDescription, canonicalUrl, schemaJson, status, order } = req.body;
    const slug = req.body.slug ? req.body.slug : await makeUniqueSlug(Category, name);

    const existing = await Category.findOne({ slug });
    if (existing) return sendResponse(res, 400, false, 'Slug already exists');

    const data = { name, slug, description, metaTitle, metaDescription, canonicalUrl, schemaJson, status, order };

    if (req.files && req.files.icon) {
      data.icon = await uploadToCloudinary(req.files.icon[0].path, 'cms/categories');
    }

    const doc = await Category.create(data);
    sendResponse(res, 201, true, 'Category created', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};
//service menu
exports.getServicesMenu = async (req, res) => {
  try {
    const categories = await Category.find({
      status: "published"
    }).sort({ order: 1 });

    console.log(this.getServicesMenu);

    const data = await Promise.all(
      categories.map(async (cat) => {
        const services = await Service.find({
          category: cat._id,
          status: "published"
        }).select("title slug");

        return {
          _id: cat._id,
          name: cat.name,
          slug: cat.slug,
          services
        };
      })
    );

    sendResponse(res, 200, true, "Menu fetched", data);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const doc = await Category.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Category not found');

    const textFields = ['name', 'description', 'metaTitle', 'metaDescription', 'canonicalUrl', 'schemaJson', 'status', 'order'];
    textFields.forEach((f) => { if (req.body[f] !== undefined) doc[f] = req.body[f]; });

    if (req.body.slug && req.body.slug !== doc.slug) {
      const existing = await Category.findOne({ slug: req.body.slug, _id: { $ne: doc._id } });
      if (existing) return sendResponse(res, 400, false, 'Slug already exists');
      doc.slug = req.body.slug;
    }

    if (req.files && req.files.icon) {
      await deleteFromCloudinary(doc.icon && doc.icon.public_id);
      doc.icon = await uploadToCloudinary(req.files.icon[0].path, 'cms/categories');
    }

    await doc.save();
    sendResponse(res, 200, true, 'Category updated', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const doc = await Category.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Category not found');

    // Guard rail: don't allow deleting a category that still has services in it,
    // otherwise those services end up with a dangling category reference.
    const servicesUsingCategory = await Service.countDocuments({ category: doc._id });
    if (servicesUsingCategory > 0) {
      return sendResponse(
        res,
        400,
        false,
        `Cannot delete: ${servicesUsingCategory} service(s) are still linked to this category`
      );
    }

    await deleteFromCloudinary(doc.icon && doc.icon.public_id);
    await doc.deleteOne();
    sendResponse(res, 200, true, 'Category deleted');
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};