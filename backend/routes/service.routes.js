const router = require('express').Router();
const { getServicesMenu } = require('../controllers/category.controller');
const ctrl = require('../controllers/service.controller');
const upload = require('../middlewares/upload');

const fields = upload.fields([
  { name: 'bannerImage', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
  { name: 'gallery', maxCount: 20 },
]);
router.get('/menu', getServicesMenu);
router.get('/', ctrl.getAllServices);
router.get('/category/:categorySlug', ctrl.getServicesByCategorySlug);
router.get('/slug/:slug', ctrl.getServiceBySlug);
router.get('/:id', ctrl.getServiceById);
router.post('/', fields, ctrl.createService);
router.put('/:id', fields, ctrl.updateService);

router.delete('/:id', ctrl.deleteService);

module.exports = router;
