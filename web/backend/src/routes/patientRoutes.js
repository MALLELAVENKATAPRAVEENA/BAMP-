const express = require('express');
const patientController = require('../controllers/patientController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth); // Secure all patient directory actions

router.get('/', patientController.getAll);
router.get('/:id', patientController.getById);
router.post('/', patientController.create);
router.put('/:id', patientController.update);
router.delete('/:id', patientController.delete);

module.exports = router;
