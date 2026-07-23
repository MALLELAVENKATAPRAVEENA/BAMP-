const express = require('express');
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth); // Secure alerts endpoints

router.get('/', notificationController.getAll);
router.put('/:id/read', notificationController.markAsRead);

module.exports = router;
