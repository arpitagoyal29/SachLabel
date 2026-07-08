const { z } = require('zod');

const verifyProductSchema = z.object({
  ingredients: z.array(z.string({ error: 'Each ingredient must be a string' }).trim().min(1)).min(1, 'Provide at least one ingredient'),
  marketingText: z.string().trim().optional(),
  sourceUrl: z.string().trim().optional(),
  websiteIngredients: z.array(z.string().trim().min(1)).optional(),
});

module.exports = { verifyProductSchema };
