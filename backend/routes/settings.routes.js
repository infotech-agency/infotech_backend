const router = require('express').Router();
const ctrl = require('../controllers/settings.controller');
const upload = require('../middlewares/upload');

router.get('/', ctrl.getSettings);
router.put('/', upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'favicon', maxCount: 1 }]), ctrl.updateSettings);

module.exports = router;
