const Team = require('../models/Team');
const sendResponse = require('../utils/sendResponse');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryHelper');

exports.getAllTeam = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const sortField = req.query.sortField || 'displayOrder';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

    const query = {};
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { designation: { $regex: search, $options: 'i' } }];

    const total = await Team.countDocuments(query);
    const docs = await Team.find(query).sort({ [sortField]: sortOrder }).skip(skip).limit(limit);

    sendResponse(res, 200, true, 'Team members fetched', docs, { total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.getTeamById = async (req, res) => {
  try {
    const doc = await Team.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Team member not found');
    sendResponse(res, 200, true, 'Team member fetched', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.createTeamMember = async (req, res) => {
  try {
    const { name, designation, bio, experience, linkedin, instagram, facebook, twitter, email, displayOrder } = req.body;
    const skills = req.body.skills ? (Array.isArray(req.body.skills) ? req.body.skills : JSON.parse(req.body.skills)) : [];

    const data = { name, designation, bio, experience, skills, linkedin, instagram, facebook, twitter, email, displayOrder };

    if (req.file) {
      data.photo = await uploadToCloudinary(req.file.path, 'cms/team');
    }

    const doc = await Team.create(data);
    sendResponse(res, 201, true, 'Team member created', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.updateTeamMember = async (req, res) => {
  try {
    const doc = await Team.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Team member not found');

    const textFields = ['name', 'designation', 'bio', 'experience', 'linkedin', 'instagram', 'facebook', 'twitter', 'email', 'displayOrder'];
    textFields.forEach((f) => { if (req.body[f] !== undefined) doc[f] = req.body[f]; });
    if (req.body.skills) doc.skills = Array.isArray(req.body.skills) ? req.body.skills : JSON.parse(req.body.skills);

    if (req.file) {
      await deleteFromCloudinary(doc.photo && doc.photo.public_id);
      doc.photo = await uploadToCloudinary(req.file.path, 'cms/team');
    }

    await doc.save();
    sendResponse(res, 200, true, 'Team member updated', doc);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.deleteTeamMember = async (req, res) => {
  try {
    const doc = await Team.findById(req.params.id);
    if (!doc) return sendResponse(res, 404, false, 'Team member not found');
    await deleteFromCloudinary(doc.photo && doc.photo.public_id);
    await doc.deleteOne();
    sendResponse(res, 200, true, 'Team member deleted');
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};
