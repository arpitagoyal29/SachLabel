const prisma = require('../lib/prisma');
const { normalize } = require('../lib/normalize');

async function resolveIngredientNames(names) {
  const normalizedNames = names.map(normalize);

  const [directMatches, aliasMatches] = await Promise.all([
    prisma.ingredient.findMany({ where: { normalizedName: { in: normalizedNames } } }),
    prisma.ingredientAlias.findMany({
      where: { normalizedAlias: { in: normalizedNames } },
      include: { ingredient: true },
    }),
  ]);

  const byNormalizedName = new Map();
  for (const ing of directMatches) {
    byNormalizedName.set(ing.normalizedName, ing);
  }
  for (const alias of aliasMatches) {
    byNormalizedName.set(alias.normalizedAlias, alias.ingredient);
  }

  return names.map((name) => byNormalizedName.get(normalize(name)) ?? null);
}

module.exports = { resolveIngredientNames };
