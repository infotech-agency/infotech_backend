const router = require('express').Router();
const ctrl = require('../controllers/seo.controller');

router.get('/', ctrl.getSeo);
router.put('/', ctrl.updateSeo);

module.exports = router;
