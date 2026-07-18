// const express = require('express');
// const router = express.Router();
// const categoryController = require('../controllers/categoryController');
// const upload = require('../middlewares/upload'); // adjust to your existing multer middleware
// const { protect, isAdmin } = require('../middlewares/auth'); // adjust to your existing auth middleware

// // Public
// router.get('/', categoryController.getAllCategories);
// router.get('/slug/:slug', categoryController.getCategoryBySlug); // e.g. /categories/slug/digital-marketing
// router.get('/:id', categoryController.getCategoryById);

// // Admin only
// router.post('/', protect, isAdmin, upload.fields([{ name: 'icon', maxCount: 1 }]), categoryController.createCategory);
// router.put('/:id', protect, isAdmin, upload.fields([{ name: 'icon', maxCount: 1 }]), categoryController.updateCategory);
// router.delete('/:id', protect, isAdmin, categoryController.deleteCategory);

// module.exports = router;

const router = require('express').Router();
const ctrl = require('../controllers/category.controller');
const upload = require('../middlewares/upload');

const fields = upload.fields([{ name: 'icon', maxCount: 1 }]);

router.get('/', ctrl.getAllCategories);
router.get('/slug/:slug', ctrl.getCategoryBySlug); // e.g. /categories/slug/web-development
router.get('/:id', ctrl.getCategoryById);
router.post('/', fields, ctrl.createCategory);
router.put('/:id', fields, ctrl.updateCategory);
router.delete('/:id', ctrl.deleteCategory);

module.exports = router;