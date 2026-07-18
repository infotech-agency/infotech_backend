const Proposal = require('../models/Proposal');
const sendResponse = require('../utils/sendResponse');

exports.getAllProposals = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const query = {};
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }, { company: { $regex: search, $options: 'i' } }];

    const total = await Proposal.countDocuments(query);
    const docs = await Proposal.find(query).sort({ [sortField]: sortOrder }).skip(skip).limit(limit);

    sendResponse(res, 200, true, 'Proposals fetched', docs, { total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.getProposalById = async (req, res) => {
  try {
    const doc = await Proposal.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Proposal not found');
    sendResponse(res, 200, true, 'Proposal fetched', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.createProposal = async (req, res) => {
  try {
    const { name, email, phone, company, selectedService, budget, website, message } = req.body;
    const doc = await Proposal.create({ name, email, phone, company, selectedService, budget, website, message });
    sendResponse(res, 201, true, 'Proposal submitted', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.deleteProposal = async (req, res) => {
  try {
    const doc = await Proposal.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Proposal not found');
    await doc.deleteOne();
    sendResponse(res, 200, true, 'Proposal deleted');
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};
