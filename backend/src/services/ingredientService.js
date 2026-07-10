const prisma = require('../lib/prisma');
const { normalize } = require('../lib/normalize');

async function verifyIngredient(name){
    const ingredient = await prisma.ingredient.findUnique({
        where: { normalizedName: normalize(name) },
    });
    if(!ingredient) {
        return {
            name,
            status: 'UNKNOWN',
            reason: 'Not found in our reference database',
            source: null,
        };
    }
    return ingredient;
}

async function verifyIngredients(names) {
  if (names.length === 0) return [];
  const found = await prisma.ingredient.findMany({
    where: { normalizedName: { in: names.map(normalize) } },
  });
  const byNormalizedName = new Map(found.map((ing) => [ing.normalizedName, ing]));
  return names.map(
    (name) =>
      byNormalizedName.get(normalize(name)) ?? {
        name,
        status: 'UNKNOWN',
        reason: 'Not found in our reference database',
        source: null,
      }
  );
}

module.exports = { verifyIngredient,verifyIngredients };