const request = require('supertest');
const app = require('./app');

jest.mock('./services/geminiService', () => ({
  explainFlag: jest.fn((detail) => Promise.resolve(detail)),
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
