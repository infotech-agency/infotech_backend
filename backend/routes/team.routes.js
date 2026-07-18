const router = require('express').Router();
const ctrl = require('../controllers/team.controller');
const upload = require('../middlewares/upload');

router.get('/', ctrl.getAllTeam);
router.get('/:id', ctrl.getTeamById);
router.post('/', upload.single('photo'), ctrl.createTeamMember);
router.put('/:id', upload.single('photo'), ctrl.updateTeamMember);
router.delete('/:id', ctrl.deleteTeamMember);

module.exports = router;
