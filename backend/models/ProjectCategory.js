// const mongoose = require('mongoose');

// const imageSchema = new mongoose.Schema({ public_id: String, secure_url: String }, { _id: false });

// const projectCategorySchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, unique: true, trim: true },
//     slug: { type: String, unique: true, lowercase: true, trim: true },
//     description: { type: String, default: '' },
//     icon: { type: imageSchema, default: {} },

//     metaTitle: { type: String, default: '' },
//     metaDescription: { type: String, default: '' },
//     canonicalUrl: { type: String, default: '' },
//     schemaJson: { type: String, default: '' },

//     status: { type: String, enum: ['published', 'draft'], default: 'draft' },
//     order: { type: Number, default: 0 },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model('ProjectCategory', projectCategorySchema);

const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({ public_id: String, secure_url: String }, { _id: false });

const projectCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    description: { type: String, default: '' },
    icon: { type: imageSchema, default: {} },

    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    canonicalUrl: { type: String, default: '' },
    schemaJson: { type: String, default: '' },

    status: { type: String, enum: ['published', 'draft'], default: 'draft' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProjectCategory', projectCategorySchema);