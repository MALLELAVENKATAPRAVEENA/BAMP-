const express = require('express');
const multer = require('multer');
const path = require('path');
const predictionController = require('../controllers/predictionController');
const auth = require('../middleware/auth');

const router = express.Router();

// Multer Local Disk Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.floor(Math.random() * 1000)}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const mimeMatch = allowedTypes.test(file.mimetype);
    const extMatch = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimeMatch && extMatch) {
      return cb(null, true);
    }
    cb(new Error('Only standard images (JPG, PNG, WEBP) are supported.'));
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.use(auth); // Secure AI evaluation

router.get('/', predictionController.getAll);
router.get('/:id', predictionController.getById);
router.post('/analyze', upload.single('scanFile'), predictionController.analyze);
router.post('/predict', predictionController.predict);

module.exports = router;
