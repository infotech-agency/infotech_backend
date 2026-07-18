// const Seo = require('../models/Seo');
// const sendResponse = require('../utils/sendResponse');

// exports.getSeo = async (req, res) => {
//   try {
//     let seo = await Seo.findOne();
//     if (!seo) seo = await Seo.create({});
//     sendResponse(res, 200, true, 'SEO settings fetched', seo);
//   } catch (err) {
//     sendResponse(res, 500, false, err.message);
//   }
// };

// exports.updateSeo = async (req, res) => {
//   try {
//     let seo = await Seo.findOne();
//     if (!seo) seo = await Seo.create({});

//     const fields = ['googleAnalytics', 'googleTagManager', 'metaPixel', 'headerScripts', 'footerScripts', 'customCSS', 'customJS'];
//     fields.forEach((f) => { if (req.body[f] !== undefined) seo[f] = req.body[f]; });

//     await seo.save();
//     sendResponse(res, 200, true, 'SEO settings updated', seo);
//   } catch (err) {
//     sendResponse(res, 500, false, err.message);
//   }
// };


const Seo = require('../models/Seo');
const sendResponse = require('../utils/sendResponse');

exports.getSeo = async (req, res) => {
  try {
    let seo = await Seo.findOne();
    if (!seo) seo = await Seo.create({});
    sendResponse(res, 200, true, 'SEO settings fetched', seo);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};

exports.updateSeo = async (req, res) => {
  try {
    let seo = await Seo.findOne();
    if (!seo) seo = await Seo.create({});

    const fields = [
      'googleAnalytics',
      'googleTagManager',
      'metaPixel',
      'headerScripts',
      'bodyScripts',   // <-- naya field add kiya
      'footerScripts',
      'customCSS',
      'customJS',
    ];
    fields.forEach((f) => { if (req.body[f] !== undefined) seo[f] = req.body[f]; });

    await seo.save();
    sendResponse(res, 200, true, 'SEO settings updated', seo);
  } catch (err) {
    sendResponse(res, 500, false, err.message);
  }
};