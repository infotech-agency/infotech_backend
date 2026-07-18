const router = require('express').Router();
const ctrl = require('../controllers/blog.controller');
const upload = require('../middlewares/upload');

const fields = upload.fields([{ name: 'featuredImage', maxCount: 1 }, { name: 'gallery', maxCount: 20 }]);

router.get('/', ctrl.getAllBlogs);
router.get('/slug/:slug', ctrl.getBlogBySlug);
router.get('/:id', ctrl.getBlogById);
router.post('/', fields, ctrl.createBlog);
router.put('/:id', fields, ctrl.updateBlog);
router.delete('/:id', ctrl.deleteBlog);

module.exports = router;
