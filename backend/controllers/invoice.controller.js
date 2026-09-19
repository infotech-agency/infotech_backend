const Invoice = require("../models/Invoice");

// Generate Invoice Number
const generateInvoiceNumber = async () => {
  const count = await Invoice.countDocuments();

  return `INV-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`;
};
// helper: services array se subtotal nikalna
const calcSubtotal = (services = []) =>
  services.reduce((sum, s) => sum + Number(s.amount || 0), 0);
// Create Invoice
// exports.createInvoice = async (req, res) => {
//   try {
//     const {
//       customerName,
//       companyName,
//       email,
//       phone,
//       service,
//       amount,
//       billingType,
//     } = req.body;

//     const invoiceNumber = await generateInvoiceNumber();

//     const gstPercentage = billingType === "with_gst" ? 18 : 0;
//     const gstAmount = (Number(amount) * gstPercentage) / 100;
//     const totalAmount = Number(amount) + gstAmount;

//     const invoice = await Invoice.create({
//       invoiceNumber,
//       customerName,
//       companyName,
//       email,
//       phone,
//       service,
//       amount,
//       billingType,
//       gstPercentage,
//       gstAmount,
//       totalAmount,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Invoice created successfully",
//       data: invoice,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
exports.createInvoice = async (req, res) => {
  try {
    const { customerName, companyName, email, phone, services, billingType } = req.body;

    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ success: false, message: "At least one service is required" });
    }

    const invoiceNumber = await generateInvoiceNumber();
    const subtotal = calcSubtotal(services);
    const gstPercentage = billingType === "with_gst" ? 18 : 0;
    const gstAmount = (subtotal * gstPercentage) / 100;
    const totalAmount = subtotal + gstAmount;

    const invoice = await Invoice.create({
      invoiceNumber,
      customerName,
      companyName,
      email,
      phone,
      services,
      amount: subtotal,
      billingType,
      gstPercentage,
      gstAmount,
      totalAmount,
    });

    res.status(201).json({ success: true, message: "Invoice created successfully", data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get All Invoices
exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: invoices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Invoice
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Invoice
// exports.updateInvoice = async (req, res) => {
//   try {
//     const {
//       customerName,
//       companyName,
//       email,
//       phone,
//       service,
//       amount,
//       billingType,
//     } = req.body;

//     const gstPercentage = billingType === "with_gst" ? 18 : 0;
//     const gstAmount = (Number(amount) * gstPercentage) / 100;
//     const totalAmount = Number(amount) + gstAmount;

//     const invoice = await Invoice.findByIdAndUpdate(
//       req.params.id,
//       {
//         customerName,
//         companyName,
//         email,
//         phone,
//         service,
//         amount,
//         billingType,
//         gstPercentage,
//         gstAmount,
//         totalAmount,
//       },
//       { new: true, runValidators: true }
//     );

//     if (!invoice) {
//       return res.status(404).json({
//         success: false,
//         message: "Invoice not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Invoice updated successfully",
//       data: invoice,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

exports.updateInvoice = async (req, res) => {
  try {
    const { customerName, companyName, email, phone, services, billingType } = req.body;

    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ success: false, message: "At least one service is required" });
    }

    const subtotal = calcSubtotal(services);
    const gstPercentage = billingType === "with_gst" ? 18 : 0;
    const gstAmount = (subtotal * gstPercentage) / 100;
    const totalAmount = subtotal + gstAmount;

    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { customerName, companyName, email, phone, services, amount: subtotal, billingType, gstPercentage, gstAmount, totalAmount },
      { new: true, runValidators: true }
    );

    if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });

    res.status(200).json({ success: true, message: "Invoice updated successfully", data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Delete Invoice
exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};