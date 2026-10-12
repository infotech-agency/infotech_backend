// const Settings = require('../models/Settings');
// const sendResponse = require('../utils/sendResponse');
// const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryHelper');

// exports.getSettings = async (req, res) => {
//   console.log(req.body);
// console.log(req.body.socialLinks);
// console.log(typeof req.body.socialLinks);
//   try {
//     let settings = await Settings.findOne();
//     if (!settings) settings = await Settings.create({});
//     sendResponse(res, 200, true, 'Settings fetched', settings);
//   } catch (err) {
//     sendResponse(res, 500, false, err.message);
//   }
// };

// exports.updateSettings = async (req, res) => {
//   try {
//     let settings = await Settings.findOne();
//     if (!settings) settings = await Settings.create({});

//     const { websiteName, phone, whatsapp, email, address, socialLinks, footer, googleMap } = req.body;

//     if (websiteName !== undefined) settings.websiteName = websiteName;
//     if (phone !== undefined) settings.phone = phone;
//     if (whatsapp !== undefined) settings.whatsapp = whatsapp;
//     if (email !== undefined) settings.email = email;
//     if (address !== undefined) settings.address = address;
//     if (footer !== undefined) settings.footer = footer;
//     if (googleMap !== undefined) settings.googleMap = googleMap;

//     if (socialLinks) {
//       settings.socialLinks = { ...settings.socialLinks.toObject(), ...socialLinks };
//     }

//     if (req.files) {
//       if (req.files.logo) {
//         await deleteFromCloudinary(settings.logo && settings.logo.public_id);
//         settings.logo = await uploadToCloudinary(req.files.logo[0].path, 'cms/settings');
//       }
//       if (req.files.favicon) {
//         await deleteFromCloudinary(settings.favicon && settings.favicon.public_id);
//         settings.favicon = await uploadToCloudinary(req.files.favicon[0].path, 'cms/settings');
//       }
//     }

//     await settings.save();
//     sendResponse(res, 200, true, 'Settings updated', settings);
//   } catch (err) {
//     sendResponse(res, 500, false, err.message);
//   }
// };


const Settings = require('../models/Settings');
const sendResponse = require('../utils/sendResponse');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryHelper');

exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    sendResponse(res, 200, true, 'Settings fetched', settings);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});

    const body = { ...req.body };

    // multipart/form-data sends arrays as JSON strings → parse them
    const arrayKeys = ['phones', 'whatsapps', 'emails'];
    for (const key of arrayKeys) {
      if (typeof body[key] === 'string') {
        try { body[key] = JSON.parse(body[key]); } catch { body[key] = [body[key]]; }
      }
    }
    if (typeof body.socialLinks === 'string') {
      try { body.socialLinks = JSON.parse(body.socialLinks); } catch {}
    }

    const {
      websiteName, phones, whatsapps, emails,
      address, socialLinks, footer, googleMap,
    } = body;

    if (websiteName !== undefined) settings.websiteName = websiteName;
    if (Array.isArray(phones))    settings.phones    = phones.map(p => p.trim()).filter(Boolean);
    if (Array.isArray(whatsapps)) settings.whatsapps = whatsapps.map(w => w.trim()).filter(Boolean);
    if (Array.isArray(emails))    settings.emails    = emails.map(e => e.trim()).filter(Boolean);

    if (address   !== undefined) settings.address   = address;
    if (footer    !== undefined) settings.footer    = footer;
    if (googleMap !== undefined) settings.googleMap = googleMap;

    if (socialLinks && typeof socialLinks === 'object') {
      settings.socialLinks = { ...settings.socialLinks.toObject(), ...socialLinks };
    }

    if (req.files) {
      if (req.files.logo) {
        await deleteFromCloudinary(settings.logo && settings.logo.public_id);
        settings.logo = await uploadToCloudinary(req.files.logo[0].path, 'cms/settings');
      }
      if (req.files.favicon) {
        await deleteFromCloudinary(settings.favicon && settings.favicon.public_id);
        settings.favicon = await uploadToCloudinary(req.files.favicon[0].path, 'cms/settings');
      }
    }

    await settings.save();
    sendResponse(res, 200, true, 'Settings updated', settings);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};