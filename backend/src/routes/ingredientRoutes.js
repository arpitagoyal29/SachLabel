const express = require('express');
const router = express.Router();
const { validate } = require('../middleware/validate');
const { verifyIngredientSchema } = require('../schemas/ingredientSchema');
const { verify } = require('../controllers/ingredientController');

router.post('/verify', validate(verifyIngredientSchema), verify);

module.exports = router;
