const Client = require('../models/Client');
const sendResponse = require('../utils/sendResponse');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryHelper');

exports.getAllClients = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const sortField = req.query.sortField || 'sortOrder';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

    const query = {};
    if (search) query.companyName = { $regex: search, $options: 'i' };

    const total = await Client.countDocuments(query);
    const docs = await Client.find(query).sort({ [sortField]: sortOrder }).skip(skip).limit(limit);

    sendResponse(res, 200, true, 'Clients fetched', docs, { total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.getClientById = async (req, res) => {
  try {
    const doc = await Client.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Client not found');
    sendResponse(res, 200, true, 'Client fetched', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.createClient = async (req, res) => {
  try {
    const { companyName, websiteUrl, sortOrder } = req.body;
    const data = { companyName, websiteUrl, sortOrder };

    if (req.file) {
      data.logo = await uploadToCloudinary(req.file.path, 'cms/clients');
    }

    const doc = await Client.create(data);
    sendResponse(res, 201, true, 'Client created', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.updateClient = async (req, res) => {
  try {
    const doc = await Client.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Client not found');

    ['companyName', 'websiteUrl', 'sortOrder'].forEach((f) => { if (req.body[f] !== undefined) doc[f] = req.body[f]; });

    if (req.file) {
      await deleteFromCloudinary(doc.logo && doc.logo.public_id);
      doc.logo = await uploadToCloudinary(req.file.path, 'cms/clients');
    }

    await doc.save();
    sendResponse(res, 200, true, 'Client updated', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const doc = await Client.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Client not found');
    await deleteFromCloudinary(doc.logo && doc.logo.public_id);
    await doc.deleteOne();
    sendResponse(res, 200, true, 'Client deleted');
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};
