const express = require("express");
const router = express.Router();

const {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} = require("../controllers/invoice.controller");

// Create Invoice
router.post("/", createInvoice);

// Get All Invoices
router.get("/", getInvoices);

// Get Single Invoice
router.get("/:id", getInvoiceById);

// Update Invoice
router.put("/:id", updateInvoice);

// Delete Invoice
router.delete("/:id", deleteInvoice);

module.exports = router;