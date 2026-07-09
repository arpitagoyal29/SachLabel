const { detectDrugClaims } = require('./claimsService');

describe('detectDrugClaims', () => {
  test('flags an explicit disease-treatment claim', () => {
    const result = detectDrugClaims('This cream will cure your acne');
    expect(result.hasIllegalClaims).toBe(true);
  });

  test('does NOT false-positive on a word containing "cure"', () => {
    const result = detectDrugClaims('Apply with a manicure brush for best results');
    expect(result.hasIllegalClaims).toBe(false);
  });

  test('flags multiple claim categories in one text', () => {
    const result = detectDrugClaims('Miracle cream, clinically proven to treat wrinkles');
    expect(result.claims.length).toBeGreaterThan(1);
  });

  test('clean marketing text has no claims', () => {
    const result = detectDrugClaims('A lightweight daily moisturizer for all skin types');
    expect(result.hasIllegalClaims).toBe(false);
    expect(result.count).toBe(0);
  });
});
