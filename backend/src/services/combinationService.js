const prisma = require('../lib/prisma');

async function checkCombinations(names) {
  const ingredients = await prisma.ingredient.findMany({
    where: { name: { in: names } },
  });

   const ids = ingredients.map((i) => i.id);

    const rules = await prisma.combinationRule.findMany({
    where: {
      ingredientAId: { in: ids },
      ingredientBId: { in: ids },
    },
    include: {
      ingredientA: true,
      ingredientB: true,
    },
  });

  return rules.map((rule) => ({
    ingredientA: rule.ingredientA.name,
    ingredientB: rule.ingredientB.name,
    severity: rule.severity,
    reason: rule.reason,
  }));
}

module.exports = { checkCombinations };