const Contact = require('../models/Contact');
const sendResponse = require('../utils/sendResponse');

exports.getAllContacts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const query = {};
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }, { company: { $regex: search, $options: 'i' } }];

    const total = await Contact.countDocuments(query);
    const docs = await Contact.find(query).sort({ [sortField]: sortOrder }).skip(skip).limit(limit);

    sendResponse(res, 200, true, 'Contacts fetched', docs, { total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.getContactById = async (req, res) => {
  try {
    const doc = await Contact.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Contact not found');
    sendResponse(res, 200, true, 'Contact fetched', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.createContact = async (req, res) => {
  try {
    const { name, email, phone, company, selectedService, message } = req.body;
    const doc = await Contact.create({ name, email, phone, company, selectedService, message });
    sendResponse(res, 201, true, 'Contact form submitted', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const doc = await Contact.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Contact not found');
    await doc.deleteOne();
    sendResponse(res, 200, true, 'Contact deleted');
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};
