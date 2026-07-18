const router = require('express').Router();
const ctrl = require('../controllers/media.controller');
const upload = require('../middlewares/upload');

router.get('/', ctrl.getAllMedia);
router.post('/upload', upload.array('images', 50), ctrl.uploadMedia);
router.delete('/:id', ctrl.deleteMedia);

module.exports = router;
