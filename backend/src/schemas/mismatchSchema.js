const { z } = require('zod');

const nameArray = z
      .array(z.string({ error: 'Each ingredient must be a string' }).trim().min(1,'Ingredient name cannot be empty'))
      .min(1, 'Each source must have at least one ingredient');

const checkMismatchSchema = z.object({
     sourceA: nameArray,
     sourceB: nameArray,
})

module.exports = { checkMismatchSchema };