const router = require('express').Router();
const ctrl = require('../controllers/client.controller');
const upload = require('../middlewares/upload');

router.get('/', ctrl.getAllClients);
router.get('/:id', ctrl.getClientById);
router.post('/', upload.single('logo'), ctrl.createClient);
router.put('/:id', upload.single('logo'), ctrl.updateClient);
router.delete('/:id', ctrl.deleteClient);

module.exports = router;
