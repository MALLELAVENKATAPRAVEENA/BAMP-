const express = require('express');
const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth');

const router = express.Router();

// PDF report endpoint is secured with auth
router.get('/generate', auth, reportController.generateReport);

module.exports = router;
