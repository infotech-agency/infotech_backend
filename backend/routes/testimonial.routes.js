const router = require('express').Router();
const ctrl = require('../controllers/testimonial.controller');
const upload = require('../middlewares/upload');

router.get('/', ctrl.getAllTestimonials);
router.get('/:id', ctrl.getTestimonialById);
router.post('/', upload.single('photo'), ctrl.createTestimonial);
router.put('/:id', upload.single('photo'), ctrl.updateTestimonial);
router.delete('/:id', ctrl.deleteTestimonial);

module.exports = router;
