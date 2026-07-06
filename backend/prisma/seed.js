const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();

const ingredients = [
  { name: 'Retinoic Acid', status: 'SCHEDULE_H', reason: 'Prescription-only drug; illegal to sell OTC in cosmetics', source: 'CDSCO' },
  { name: 'Hydroquinone',  status: 'SCHEDULE_H', reason: 'Skin-lightening agent; prescription-only above 2%', source: 'CDSCO' },
  { name: 'Mercury',       status: 'BANNED',     reason: 'Toxic heavy metal; banned in cosmetics', source: 'CDSCO' },
  { name: 'Water',         status: 'SAFE',       reason: null, source: null },
  { name: 'Lactic Acid',   status: 'SAFE',       reason: null, source: null },
  { name: 'Kojic Acid',    status: 'SAFE',       reason: null, source: null },
  { name: 'Vitamin C',     status: 'SAFE',       reason: null, source: null },
  { name: 'Salicylic Acid',status: 'SAFE',       reason: null, source: null },
];

const combinations = [
  { a: 'Retinoic Acid', b: 'Lactic Acid', severity: 'HIGH',   reason: 'Retinoid + AHA: high irritation and skin-barrier damage' },
  { a: 'Retinoic Acid', b: 'Kojic Acid',  severity: 'MEDIUM', reason: 'Retinoid + Kojic acid: over-exfoliation and sensitivity' },
  { a: 'Retinoic Acid', b: 'Vitamin C',   severity: 'MEDIUM', reason: 'Retinoid + Vitamin C: instability and irritation' },
];


async function main() {
  for (const ingredient of ingredients) {
    await prisma.ingredient.upsert({
      where:  { name: ingredient.name },
      update: ingredient,
      create: ingredient,
    });
  }
  for (const combo of combinations) {
    const ingA = await prisma.ingredient.findUnique({ where: { name: combo.a } });
    const ingB = await prisma.ingredient.findUnique({ where: { name: combo.b } });
    
    const [aId, bId] = ingA.id < ingB.id ? [ingA.id, ingB.id] : [ingB.id, ingA.id];

    await prisma.combinationRule.upsert({
      where: { ingredientAId_ingredientBId: { ingredientAId: aId, ingredientBId: bId } },
      update: { severity: combo.severity, reason: combo.reason },
      create: { ingredientAId: aId, ingredientBId: bId, severity: combo.severity, reason: combo.reason },
    });
  }
  console.log('Seeding complete.');
}

main()
  .catch((e)=>{
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });