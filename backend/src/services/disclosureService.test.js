const { detectVagueDisclosure } = require('./disclosureService');

describe('detectVagueDisclosure', () => {
  test('flags known vague terms', () => {
    const result = detectVagueDisclosure(['Water', 'Fragrance', 'Glycerin']);
    expect(result.transparent).toBe(false);
    expect(result.vagueTerms).toContain('Fragrance');
  });

  test('is case-insensitive via the shared normalizer', () => {
    const result = detectVagueDisclosure(['FRAGRANCE']);
    expect(result.vagueTerms).toEqual(['FRAGRANCE']); // original casing preserved in output
  });

  test('fully transparent ingredient list has no vague terms', () => {
    const result = detectVagueDisclosure(['Water', 'Niacinamide', 'Glycerin']);
    expect(result.transparent).toBe(true);
    expect(result.count).toBe(0);
  });
});
