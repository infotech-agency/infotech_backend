const router = require('express').Router();
const ctrl = require('../controllers/project.controller');
const upload = require('../middlewares/upload');

const fields = upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'gallery', maxCount: 20 }]);

router.get('/', ctrl.getAllProjects);
router.get('/slug/:slug', ctrl.getProjectBySlug);
router.get('/:id', ctrl.getProjectById);
router.post('/', fields, ctrl.createProject);
router.put('/:id', fields, ctrl.updateProject);
router.delete('/:id', ctrl.deleteProject);

module.exports = router;
