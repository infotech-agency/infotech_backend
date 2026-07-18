const router = require('express').Router();
const ctrl = require('../controllers/caseStudy.controller');
const upload = require('../middlewares/upload');

const fields = upload.fields([{ name: 'images', maxCount: 10 }, { name: 'gallery', maxCount: 20 }]);

router.get('/', ctrl.getAllCaseStudies);
router.get('/slug/:slug', ctrl.getCaseStudyBySlug);
router.get('/:id', ctrl.getCaseStudyById);
router.post('/', fields, ctrl.createCaseStudy);
router.put('/:id', fields, ctrl.updateCaseStudy);
router.delete('/:id', ctrl.deleteCaseStudy);

module.exports = router;
