const { checkCombinations } = require('./combinationService');

describe('checkCombinations', () => {
  test('finds a known dangerous pair from the seed data', async () => {
    const result = await checkCombinations(['Retinoic Acid', 'Lactic Acid']);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].severity).toBe('HIGH');
  });

  test('is case- and hyphen-insensitive (uses normalizedName)', async () => {
    const result = await checkCombinations(['RETINOIC-ACID', 'lactic acid']);
    expect(result.length).toBeGreaterThan(0);
  });

  test('returns empty array when no dangerous pair exists', async () => {
    const result = await checkCombinations(['Water', 'Glycerin']);
    expect(result).toEqual([]);
  });
});
