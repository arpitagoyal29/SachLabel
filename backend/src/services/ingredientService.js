const { resolveIngredientNames } = require('./aliasService');

async function verifyIngredient(name) {
  const [resolved] = await resolveIngredientNames([name]);
  return (
    resolved ?? {
      name,
      status: 'UNKNOWN',
      reason: 'Not found in our reference database',
      source: null,
    }
  );
}

async function verifyIngredients(names) {
  if (names.length === 0) return [];
  const resolved = await resolveIngredientNames(names);
  return names.map(
    (name, i) =>
      resolved[i] ?? {
        name,
        status: 'UNKNOWN',
        reason: 'Not found in our reference database',
        source: null,
      }
  );
}

module.exports = { verifyIngredient, verifyIngredients };
