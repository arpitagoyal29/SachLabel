const express = require('express');
const upload = require('../middleware/upload');
const { extractIngredientsController } = require('../controllers/extractController');

const router = express.Router();

router.post('/extract-ingredients', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, extractIngredientsController);

module.exports = router;
