const express = require('express');
const settingsController = require('../controllers/settingsController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth); // Secure settings endpoints

router.get('/', settingsController.getSettings);
router.put('/', settingsController.updateSettings);

module.exports = router;
