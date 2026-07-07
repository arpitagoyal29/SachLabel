const express = require('express');
const router = express.Router();
const { checkCombination } = require('../controllers/combinationController');
const { validate } = require('../middleware/validate');
const { checkCombinationSchema } = require('../schemas/combinationSchema');

router.post('/check-combinations', validate(checkCombinationSchema), checkCombination);

module.exports = router;