const router = require('express').Router();
const ctrl = require('../controllers/page.controller');
const upload = require('../middlewares/upload');

const fields = upload.fields([{ name: 'bannerImage', maxCount: 1 }, { name: 'gallery', maxCount: 20 }]);

router.get('/', ctrl.getAllPages);
router.get('/slug/:slug', ctrl.getPageBySlug);
router.get('/:id', ctrl.getPageById);
router.post('/', fields, ctrl.createPage);
router.put('/:id', fields, ctrl.updatePage);
router.delete('/:id', ctrl.deletePage);

module.exports = router;
