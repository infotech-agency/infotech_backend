const router = require('express').Router();
const ctrl = require('../controllers/counter.controller');

router.get('/', ctrl.getAllCounters);
router.get('/:id', ctrl.getCounterById);
router.post('/', ctrl.createCounter);
router.put('/:id', ctrl.updateCounter);
router.delete('/:id', ctrl.deleteCounter);

module.exports = router;
