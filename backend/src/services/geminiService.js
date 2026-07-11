const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const { getOrSet } = require('../lib/cache');

async function explainFlag(detail) {
  if (!GEMINI_API_KEY) {
    return detail;
  }

  try {
    return await getOrSet(`explain:${detail}`, 60 * 60 * 24 * 7, async () => {
      const prompt = `In 2 short, simple sentences, explain to an everyday shopper why a cosmetic product was flagged for this issue. Be factual. Do not add medical advice beyond explaining the flag. Issue: "${detail}".`;

      const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error('Empty Gemini response');
      }
      return text.trim();
    });
  } catch (err) {
    return detail;
  }
}

function stripConcentration(name) {
  return name
    .replace(/\s*\([^)]*%[^)]*\)\s*$/, '')
    .replace(/\s*\d+(\.\d+)?\s*%\s*$/, '')
    .trim();
}

class QuotaExceededError extends Error {}

async function callGeminiForIngredients(imageBuffer, mimeType) {
  const prompt = 'Transcribe ONLY the ingredient list visible in this image, exactly as written. Return a JSON array of ingredient name strings and nothing else — no markdown, no explanation, no extra text. Do NOT include concentration percentages or parenthetical amounts (e.g. write "Zinc Pyrithione", not "Zinc Pyrithione (1.0%)" or "Zinc Pyrithione 1.0%"). Do not infer, guess, or add any ingredient that is not literally visible. If no ingredient list is visible in the image, return an empty array: []';

  const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(15000),
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: prompt },
          { inline_data: { mime_type: mimeType, data: imageBuffer.toString('base64') } },
        ],
      }],
      generationConfig: { temperature: 0 },
    }),
  });

  if (response.status === 429) {
    throw new QuotaExceededError('Gemini API quota exceeded');
  }
  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return [];

  const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/```\s*$/, '');
  const parsed = JSON.parse(cleaned);
  if (!Array.isArray(parsed)) return [];

  return parsed
    .filter((item) => typeof item === 'string' && item.trim().length > 0)
    .map(stripConcentration)
    .filter((item) => item.length > 0);
}

async function extractFromImage(imageBuffer, mimeType) {
  if (!GEMINI_API_KEY) {
    return [];
  }

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const ingredients = await callGeminiForIngredients(imageBuffer, mimeType);
      if (ingredients.length > 0) return ingredients;
    } catch (err) {
      if (err instanceof QuotaExceededError) throw err;
      // any other failure — fall through and try once more
    }
  }

  return [];
}

module.exports = { explainFlag, extractFromImage, QuotaExceededError };


