// const router = require('express').Router();
// // const c = require('../controllers/projectCategoryController');
// const c = require('../controllers/project.category.controller')
// // const { protect } = require('../middleware/auth');
// // const upload = require('../middleware/upload');
// // const iconUpload = upload.fields([{ name: 'icon', maxCount: 1 }]);

// router.get('/', c.getAllProjectCategories);
// router.get('/slug/:slug', c.getProjectCategoryBySlug);
// router.get('/:id', c.getProjectCategoryById);

// router.post('/', /* protect, iconUpload, */ c.createProjectCategory);
// router.put('/:id', /* protect, iconUpload, */ c.updateProjectCategory);
// router.delete('/:id', /* protect, */ c.deleteProjectCategory);

// module.exports = router;



const router = require('express').Router();
const c = require('../controllers/project.category.controller');

// ⚠️ Ye 2 lines projectRoutes.js se copy karo (wahi path/naam jo wahan chal raha hai)
const upload = require('../middlewares/upload');
// const { protect } = require('../middleware/auth');

const iconUpload = upload.fields([{ name: 'icon', maxCount: 1 }]);

router.get('/', c.getAllProjectCategories);
router.get('/slug/:slug', c.getProjectCategoryBySlug);
router.get('/:id', c.getProjectCategoryById);

router.post('/', /* protect, */ iconUpload, c.createProjectCategory);
router.put('/:id', /* protect, */ iconUpload, c.updateProjectCategory);
router.delete('/:id', /* protect, */ c.deleteProjectCategory);

module.exports = router;