const router = require('express').Router();
const ctrl = require('../controllers/technology.controller');
const upload = require('../middlewares/upload');

router.get('/', ctrl.getAllTechnologies);
router.get('/:id', ctrl.getTechnologyById);
router.post('/', upload.single('logo'), ctrl.createTechnology);
router.put('/:id', upload.single('logo'), ctrl.updateTechnology);
router.delete('/:id', ctrl.deleteTechnology);

module.exports = router;
