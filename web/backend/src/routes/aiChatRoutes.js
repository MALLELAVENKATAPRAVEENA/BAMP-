const express = require('express');
const aiChatController = require('../controllers/aiChatController');
const auth = require('../middleware/auth');

const router = express.Router();

// AI Chatbot queries are secured behind doctor authentication
router.post('/chat', auth, aiChatController.chat);

module.exports = router;
