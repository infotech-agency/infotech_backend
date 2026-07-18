const router = require('express').Router();
const ctrl = require('../controllers/career.controller');

router.get('/', ctrl.getAllCareers);
router.get('/slug/:slug', ctrl.getCareerBySlug);
router.get('/:id', ctrl.getCareerById);
router.post('/', ctrl.createCareer);
router.put('/:id', ctrl.updateCareer);
router.delete('/:id', ctrl.deleteCareer);

module.exports = router;
