const express = require('express');
const researchController = require('../controllers/researchController');
const auth = require('../middleware/auth');

const router = express.Router();

// Research export queries are secured with auth
router.get('/export', auth, researchController.exportCsv);

module.exports = router;
