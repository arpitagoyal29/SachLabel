const { resolveIngredientNames } = require('./aliasService');

describe('resolveIngredientNames', () => {
  test('resolves a name that matches an Ingredient directly', async () => {
    const [result] = await resolveIngredientNames(['Retinoic Acid']);
    expect(result.name).toBe('Retinoic Acid');
    expect(result.status).toBe('SCHEDULE_H');
  });

  test('resolves an alias to its canonical ingredient', async () => {
    const [result] = await resolveIngredientNames(['Tretinoin']);
    expect(result.name).toBe('Retinoic Acid');
    expect(result.status).toBe('SCHEDULE_H');
  });

  test('is case- and punctuation-insensitive for aliases too', async () => {
    const [result] = await resolveIngredientNames(['pyrithione-zinc']);
    expect(result.name).toBe('Zinc Pyrithione');
  });

  test('returns null for a name that matches neither an ingredient nor an alias', async () => {
    const [result] = await resolveIngredientNames(['Definitely Not A Real Ingredient']);
    expect(result).toBeNull();
  });

  test('preserves input order and length, mixing direct matches, aliases, and misses', async () => {
    const results = await resolveIngredientNames(['Water', 'Tretinoin', 'Not Real', 'Vitamin C']);
    expect(results).toHaveLength(4);
    expect(results[0].name).toBe('Water');
    expect(results[1].name).toBe('Retinoic Acid');
    expect(results[2]).toBeNull();
    expect(results[3].name).toBe('Ascorbic Acid');
  });
});
