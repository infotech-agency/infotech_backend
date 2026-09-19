// routes/categoryRoutes.js
const router = require('express').Router();

const ctrl = require('../controllers/faqCategory.controller');

router.get('/', ctrl.getAllFaqCategories);
router.post('/', ctrl.createFaqCategory);
router.put('/:id', ctrl.updateFaqCategory);
router.delete('/:id', ctrl.deleteFaqCategory);


module.exports = router;