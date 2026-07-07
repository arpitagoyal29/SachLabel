const express = require('express');
const router = express.Router();
const { checkMismatch } = require('../controllers/mismatchController');
const { validate } = require('../middleware/validate');
const { checkMismatchSchema } = require('../schemas/mismatchSchema');

router.post('/check-mismatch', validate(checkMismatchSchema), checkMismatch);

module.exports = router;
