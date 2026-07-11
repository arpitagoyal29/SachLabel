const { extractFromImage, QuotaExceededError } = require('../services/geminiService');

async function extractIngredientsController(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided (field name: "image")' });
  }

  try {
    const ingredients = await extractFromImage(req.file.buffer, req.file.mimetype);
    res.json({ ingredients });
  } catch (err) {
    if (err instanceof QuotaExceededError) {
      return res.status(503).json({ error: 'AI ingredient reader is temporarily unavailable (usage limit reached) — please type the ingredients manually' });
    }
    throw err;
  }
}

module.exports = { extractIngredientsController };
