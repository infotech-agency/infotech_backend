const cloudinary = require('../config/cloudinary');
const fs = require('fs');

const uploadToCloudinary = async (filePath, folder = 'cms') => {
  const result = await cloudinary.uploader.upload(filePath, { folder });
  fs.unlinkSync(filePath);
  return { public_id: result.public_id, secure_url: result.secure_url };
};

const deleteFromCloudinary = async (public_id) => {
  if (public_id) {
    await cloudinary.uploader.destroy(public_id);
  }
};

const uploadManyToCloudinary = async (files, folder = 'cms') => {
  const results = [];
  for (const file of files) {
    const result = await cloudinary.uploader.upload(file.path, { folder });
    fs.unlinkSync(file.path);
    results.push({ public_id: result.public_id, secure_url: result.secure_url });
  }
  return results;
};

module.exports = { uploadToCloudinary, deleteFromCloudinary, uploadManyToCloudinary };
