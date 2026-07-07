const { z } = require('zod');

const checkCombinationSchema = z.object({
  ingredients: z
    .array(z.string({ error: 'Each ingredient must be a string' }).trim().min(1, 'Ingredient name cannot be empty'))
    .min(2, 'Provide at least 2 ingredients to check for combinations'),
});

module.exports = { checkCombinationSchema };
