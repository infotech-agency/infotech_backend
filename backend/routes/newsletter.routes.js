const router = require('express').Router();
const ctrl = require('../controllers/newsletter.controller');

router.get('/', ctrl.getAllSubscribers);
router.post('/', ctrl.subscribe);
router.delete('/:id', ctrl.unsubscribe);

module.exports = router;
