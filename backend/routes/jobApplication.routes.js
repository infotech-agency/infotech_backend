const router = require('express').Router();
const ctrl = require('../controllers/jobApplication.controller');
const uploadAny = require('../middlewares/uploadAny');

router.get('/', ctrl.getAllApplications);
router.get('/:id', ctrl.getApplicationById);
router.post('/', uploadAny.single('resume'), ctrl.createApplication);
router.patch('/:id/status', ctrl.updateApplicationStatus);
router.delete('/:id', ctrl.deleteApplication);

module.exports = router;
