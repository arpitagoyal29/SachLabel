const { extractFromImage } = require('../services/geminiService');

async function extractIngredientsController(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided (field name: "image")' });
  }

  const ingredients = await extractFromImage(req.file.buffer, req.file.mimetype);
  res.json({ ingredients });
}

module.exports = { extractIngredientsController };
