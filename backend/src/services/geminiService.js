const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

async function explainFlag(name, reason) {
  if (!GEMINI_API_KEY) {
    return reason; // no key → gracefully return the raw reason
  }
  
    try {
    const prompt = `In 2 short, simple sentences, explain to an everyday shopper why this cosmetic ingredient was flagged. Be factual. Do not add medical advice beyond explaining the flag. Ingredient: "${name}". Flag reason: "${reason}".`;

    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      return reason;
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text?.trim() || reason;
  } catch (err) {
    return reason;
  }
}

module.exports = { explainFlag };


