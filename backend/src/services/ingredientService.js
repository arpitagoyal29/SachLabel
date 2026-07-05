const prisma = require('../lib/prisma');

async function verifyIngredient(name){
    const ingredient = await prisma.ingredient.findUnique({
        where: { name },
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

module.exports = { verifyIngredient };