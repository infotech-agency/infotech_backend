// const mongoose = require("mongoose");

// const serviceItemSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true }, // e.g. "SEO", "Website Development"
//     amount: { type: Number, required: true },
//   },
//   { _id: false }
// );

// const invoiceSchema = new mongoose.Schema(
//   {
//     invoiceNumber: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     customerName: { type: String, required: true, trim: true },
//     companyName: { type: String, trim: true, default: "" },
//     email: { type: String, trim: true, lowercase: true, default: "" },
//     phone: { type: String, required: true, trim: true },

//     services: {
//       type: [serviceItemSchema],
//       required: true,
//       validate: (v) => Array.isArray(v) && v.length > 0,
//     },

//     amount: {
//       // subtotal = sum of all services
//       type: Number,
//       required: true,
//     },

//     billingType: {
//       type: String,
//       enum: ["with_gst", "without_gst"],
//       default: "without_gst",
//     },
//     gstPercentage: { type: Number, default: 18 },
//     gstAmount: { type: Number, default: 0 },
//     totalAmount: { type: Number, required: true },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Invoice", invoiceSchema);

const mongoose = require("mongoose");

// GSTIN format: 15 chars, e.g. 22AAAAA0000A1Z5
const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

const gstinField = {
  type: String,
  trim: true,
  uppercase: true,
  default: "",
  validate: {
    validator: (v) => !v || GSTIN_REGEX.test(v), // empty allowed
    message: "Invalid GST number format",
  },
};

const serviceItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },

    // Seller (your) details
    sellerGstNumber: gstinField,

    // Client details
    customerName: { type: String, required: true, trim: true },
    companyName: { type: String, trim: true, default: "" },
    customerGstNumber: gstinField,
    email: { type: String, trim: true, lowercase: true, default: "" },
    phone: { type: String, required: true, trim: true },

    services: {
      type: [serviceItemSchema],
      required: true,
      validate: (v) => Array.isArray(v) && v.length > 0,
    },

    amount: { type: Number, required: true }, // subtotal

    billingType: {
      type: String,
      enum: ["with_gst", "without_gst"],
      default: "without_gst",
    },
    gstPercentage: { type: Number, default: 18 },
    gstAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);