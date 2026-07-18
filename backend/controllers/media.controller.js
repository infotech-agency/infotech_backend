const Media = require('../models/Media');
const sendResponse = require('../utils/sendResponse');
const { uploadManyToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryHelper');
const cloudinary = require('../config/cloudinary');

exports.uploadMedia = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return sendResponse(res, 400, false, 'No files uploaded');
    }
    const folder = req.body.folder || 'cms/media';
    const uploaded = await uploadManyToCloudinary(req.files, folder);

    const mediaDocs = await Media.insertMany(
      uploaded.map((u, i) => ({
        public_id: u.public_id,
        secure_url: u.secure_url,
        originalName: req.files[i].originalname,
        folder,
        size: req.files[i].size,
        format: u.public_id.split('.').pop(),
      }))
    );

    sendResponse(res, 201, true, 'Files uploaded', mediaDocs);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.getAllMedia = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const query = search ? { originalName: { $regex: search, $options: 'i' } } : {};
    const total = await Media.countDocuments(query);
    const media = await Media.find(query).sort({ [sortField]: sortOrder }).skip(skip).limit(limit);

    sendResponse(res, 200, true, 'Media fetched', media, { total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return sendResponse(res, 404, false, 'Media not found');
    await deleteFromCloudinary(media.public_id);
    await media.deleteOne();
    sendResponse(res, 200, true, 'Media deleted');
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};
