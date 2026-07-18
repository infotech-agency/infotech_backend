const router = require('express').Router();
const ctrl = require('../controllers/industry.controller');
const upload = require('../middlewares/upload');

const fields = upload.fields([{ name: 'banner', maxCount: 1 }, { name: 'gallery', maxCount: 20 }]);

router.get('/', ctrl.getAllIndustries);
router.get('/slug/:slug', ctrl.getIndustryBySlug);
router.get('/:id', ctrl.getIndustryById);
router.post('/', fields, ctrl.createIndustry);
router.put('/:id', fields, ctrl.updateIndustry);
router.delete('/:id', ctrl.deleteIndustry);

module.exports = router;
