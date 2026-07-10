const request = require('supertest');
const app = require('./app');

jest.mock('./services/geminiService', () => ({
  explainFlag: jest.fn((detail) => Promise.resolve(detail)),
}));

const { scrapeIngredients } = require('./services/scraperService');
jest.mock('./services/scraperService', () => ({
  scrapeIngredients: jest.fn(),
}));

describe('POST /api/verify-product', () => {
  test('flags a product with a Schedule H drug as HIGH_RISK', async () => {
    const res = await request(app)
      .post('/api/verify-product')
      .send({ ingredients: ['Retinoic Acid'] });

    expect(res.status).toBe(200);
    expect(res.body.verdict).toBe('HIGH_RISK');
    expect(res.body.findings.length).toBeGreaterThan(0);
  });

  test('a clean product with no known issues has no findings', async () => {
    const res = await request(app)
      .post('/api/verify-product')
      .send({ ingredients: ['Water', 'Glycerin'] });

    expect(res.status).toBe(200);
    expect(res.body.verdict).toBe('SAFE');
  });

  test('rejects a request with no ingredients (Zod validation)', async () => {
    const res = await request(app)
      .post('/api/verify-product')
      .send({});

    expect(res.status).toBe(400);
  });

  test('unknown route returns a clean 404 JSON, not HTML', async () => {
    const res = await request(app).get('/api/does-not-exist');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Not found');
  });
});

describe('Layer 3 fallback — scraping sourceUrl when websiteIngredients is omitted', () => {
  afterEach(() => jest.clearAllMocks());

  test('a successful scrape with a real mismatch produces a Layer 3 finding', async () => {
    scrapeIngredients.mockResolvedValueOnce(['Water', 'Retinoic Acid']);

    const res = await request(app)
      .post('/api/verify-product')
      .send({ ingredients: ['Water'], sourceUrl: 'https://example.com/product' });

    expect(res.status).toBe(200);
    expect(res.body.checkedLayers).toContain(3);
    expect(res.body.findings.some((f) => f.layer === 3)).toBe(true);
  });

  test('a scrape that returns no ingredients skips Layer 3 entirely — never fabricates a mismatch', async () => {
    scrapeIngredients.mockResolvedValueOnce([]);

    const res = await request(app)
      .post('/api/verify-product')
      .send({ ingredients: ['Water', 'Glycerin'], sourceUrl: 'https://example.com/product' });

    expect(res.status).toBe(200);
    expect(res.body.checkedLayers).not.toContain(3);
    expect(res.body.findings.some((f) => f.layer === 3)).toBe(false);
  });

  test('a failed scrape (network error, timeout, non-OK response) skips Layer 3 instead of failing the request', async () => {
    scrapeIngredients.mockRejectedValueOnce(new Error('Failed to fetch: 404'));

    const res = await request(app)
      .post('/api/verify-product')
      .send({ ingredients: ['Water'], sourceUrl: 'https://example.com/product' });

    expect(res.status).toBe(200);
    expect(res.body.checkedLayers).not.toContain(3);
  });

  test('explicit websiteIngredients skips the scrape entirely', async () => {
    const res = await request(app)
      .post('/api/verify-product')
      .send({ ingredients: ['Water'], websiteIngredients: ['Water'] });

    expect(res.status).toBe(200);
    expect(scrapeIngredients).not.toHaveBeenCalled();
    expect(res.body.checkedLayers).toContain(3);
  });
});
