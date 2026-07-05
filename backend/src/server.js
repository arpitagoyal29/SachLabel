require('dotenv').config();
const express = require('express');
const prisma = require('./lib/prisma');
const ingredientRoutes = require('./routes/ingredientRoutes');

const app = express();

app.use(express.json());

app.use('/api', ingredientRoutes);

const PORT = process.env.PORT || 3000;

app.get('/health',(req,res)=>{
    res.json({status : 'ok'});
});

app.get('/ingredients', async (req,res) => {
    const ingredients = await prisma.ingredient.findMany();
    res.json(ingredients);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});