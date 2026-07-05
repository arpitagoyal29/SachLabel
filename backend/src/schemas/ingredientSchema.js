const { z } = require('zod')

const verifyIngredientSchema = z.object({
  name: z.string({ error: 'Ingredient name is required'})
         .trim()
         .min(1,'Ingredient name cannot be empty'),  
});

module.exports = { verifyIngredientSchema };