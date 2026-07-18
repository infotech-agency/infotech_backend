const mongoose = require('mongoose');

const seoSchema = new mongoose.Schema({
  googleAnalytics: { type: String, default: '' },
  googleTagManager: { type: String, default: '' },
  metaPixel: { type: String, default: '' },
  headerScripts: { type: String, default: '' },
    bodyScripts: { type: String, default: '' },  
  footerScripts: { type: String, default: '' },
  customCSS: { type: String, default: '' },
  customJS: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Seo', seoSchema);
