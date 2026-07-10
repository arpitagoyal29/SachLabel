process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'test-key';
const { extractFromImage } = require('./geminiService');
const redis = require('../lib/redis');

afterAll(async () => {
  await redis.quit();
});

describe('extractFromImage', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('parses a clean JSON array response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: '["Water", "Glycerin"]' }] } }],
      }),
    });

    const result = await extractFromImage(Buffer.from('fake-image'), 'image/jpeg');
    expect(result).toEqual(['Water', 'Glycerin']);
  });

  test('strips a markdown code fence before parsing', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: '```json\n["Retinoic Acid"]\n```' }] } }],
      }),
    });

    const result = await extractFromImage(Buffer.from('fake-image'), 'image/jpeg');
    expect(result).toEqual(['Retinoic Acid']);
  });

  test('returns [] on a non-OK response instead of throwing', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 });

    const result = await extractFromImage(Buffer.from('fake-image'), 'image/jpeg');
    expect(result).toEqual([]);
  });

  test('returns [] on malformed (non-array) JSON instead of throwing', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: '{"not": "an array"}' }] } }],
      }),
    });

    const result = await extractFromImage(Buffer.from('fake-image'), 'image/jpeg');
    expect(result).toEqual([]);
  });
});

describe('extractFromImage with no API key', () => {
  test('returns [] without calling fetch', async () => {
    jest.resetModules();
    const originalKey = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;
    global.fetch = jest.fn();

    const { extractFromImage: extractFresh } = require('./geminiService');
    const result = await extractFresh(Buffer.from('fake'), 'image/jpeg');

    expect(result).toEqual([]);
    expect(global.fetch).not.toHaveBeenCalled();
    await require('../lib/redis').quit();

    process.env.GEMINI_API_KEY = originalKey;
  });
});
