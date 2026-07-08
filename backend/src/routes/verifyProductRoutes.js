const express = require('express');
const router = express.Router();
const { verifyProductController } = require('../controllers/verifyProductController');
const { validate } = require('../middleware/validate');
const { verifyProductSchema } = require('../schemas/verifyProductSchema');

router.post('/verify-product', validate(verifyProductSchema), verifyProductController);

module.exports = router;
