const { verifyIngredient } = require('../services/ingredientService');

async function verify(req, res) {
  const { name } = req.body;
  const result = await verifyIngredient(name);
  res.json(result);
}

module.exports = { verify };
