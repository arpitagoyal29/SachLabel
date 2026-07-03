const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();

const ingredients = [
  { name: 'Retinoic Acid', status: 'SCHEDULE_H', reason: 'Prescription-only drug; illegal to sell OTC in cosmetics', source: 'CDSCO' },
  { name: 'Hydroquinone',  status: 'SCHEDULE_H', reason: 'Skin-lightening agent; prescription-only above 2%', source: 'CDSCO' },
  { name: 'Mercury',       status: 'BANNED',     reason: 'Toxic heavy metal; banned in cosmetics', source: 'CDSCO' },
  { name: 'Water',         status: 'SAFE',       reason: null, source: null },
];

async function main() {
  for (const ingredient of ingredients) {
    await prisma.ingredient.upsert({
      where:  { name: ingredient.name },
      update: ingredient,
      create: ingredient,
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