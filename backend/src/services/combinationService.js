const prisma = require('../lib/prisma');
const { resolveIngredientNames } = require('./aliasService');

async function checkCombinations(names) {
  const resolved = await resolveIngredientNames(names);
  const ids = [...new Set(resolved.filter(Boolean).map((i) => i.id))];

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
