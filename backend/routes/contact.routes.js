const router = require('express').Router();
const ctrl = require('../controllers/contact.controller');

router.get('/', ctrl.getAllContacts);
router.get('/:id', ctrl.getContactById);
router.post('/', ctrl.createContact);
router.delete('/:id', ctrl.deleteContact);

module.exports = router;
