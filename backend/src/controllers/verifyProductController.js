const { verifyProduct } = require('../services/verificationService');

async function verifyProductController(req, res) {
  const result = await verifyProduct(req.body);
  res.json(result);
}

module.exports = { verifyProductController };
