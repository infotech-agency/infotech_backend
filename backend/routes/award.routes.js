const router = require('express').Router();
const ctrl = require('../controllers/award.controller');
const upload = require('../middlewares/upload');

router.get('/', ctrl.getAllAwards);
router.get('/:id', ctrl.getAwardById);
router.post('/', upload.single('image'), ctrl.createAward);
router.put('/:id', upload.single('image'), ctrl.updateAward);
router.delete('/:id', ctrl.deleteAward);

module.exports = router;
