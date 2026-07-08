const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

async function explainFlag(detail) {
  if (!GEMINI_API_KEY) {
    return detail;
  }

  try {
    const prompt = `In 2 short, simple sentences, explain to an everyday shopper why a cosmetic product was flagged for this issue. Be factual. Do not add medical advice beyond explaining the flag. Issue: "${detail}".`;

    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      return detail;
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text?.trim() || detail;
  } catch (err) {
    return detail;
  }
}


module.exports = { explainFlag };


