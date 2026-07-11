const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();

const { ingredients } = require('./data/ingredients');
const { combinations } = require('./data/combinations');
const { aliases } = require('./data/aliases');
const { normalize } = require('../src/lib/normalize')

async function main() {
  for (const ingredient of ingredients) {
    const data = { ...ingredient, normalizedName: normalize(ingredient.name) };
    await prisma.ingredient.upsert({
      where:  { name: ingredient.name },
      update: data,
      create: data,
    });
  }

  for (const { alias, canonical } of aliases) {
    const target = await prisma.ingredient.findUnique({ where: { name: canonical } });
    if (!target) {
      console.warn(`Skipping alias — canonical ingredient not found: "${canonical}" (for alias "${alias}")`);
      continue;
    }
    await prisma.ingredientAlias.upsert({
      where: { alias },
      update: { normalizedAlias: normalize(alias), ingredientId: target.id },
      create: { alias, normalizedAlias: normalize(alias), ingredientId: target.id },
    });
  }

  for (const combo of combinations) {
    const ingA = await prisma.ingredient.findUnique({ where: { name: combo.a } });
    const ingB = await prisma.ingredient.findUnique({ where: { name: combo.b } });

    if (!ingA || !ingB) {
      console.warn(`Skipping combination — ingredient not found: ${combo.a} + ${combo.b}`);
      continue;
    }

    const [aId, bId] = ingA.id < ingB.id ? [ingA.id, ingB.id] : [ingB.id, ingA.id];

    await prisma.combinationRule.upsert({
      where: { ingredientAId_ingredientBId: { ingredientAId: aId, ingredientBId: bId } },
      update: { severity: combo.severity, reason: combo.reason, source: combo.source },
      create: { ingredientAId: aId, ingredientBId: bId, severity: combo.severity, reason: combo.reason, source: combo.source },
    });
  }

  console.log(`Seeding complete: ${ingredients.length} ingredients, ${aliases.length} aliases, ${combinations.length} combination rules.`);
}

main()
  .catch((e)=>{
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
