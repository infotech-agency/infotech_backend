const router = require('express').Router();
const ctrl = require('../controllers/proposal.controller');

router.get('/', ctrl.getAllProposals);
router.get('/:id', ctrl.getProposalById);
router.post('/', ctrl.createProposal);
router.delete('/:id', ctrl.deleteProposal);

module.exports = router;
