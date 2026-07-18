const router = require('express').Router();
const ctrl = require('../controllers/faq.controller');

router.get('/', ctrl.getAllFaqs);
router.get('/:id', ctrl.getFaqById);
router.post('/', ctrl.createFaq);
router.put('/:id', ctrl.updateFaq);
router.delete('/:id', ctrl.deleteFaq);

module.exports = router;
