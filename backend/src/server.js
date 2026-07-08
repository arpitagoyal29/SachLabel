require('dotenv').config();
const express = require('express');
const prisma = require('./lib/prisma');
const ingredientRoutes = require('./routes/ingredientRoutes');
const combinationRoutes = require('./routes/combinationRoutes');
const mismatchRoutes = require('./routes/mismatchRoutes');
const verifyProductRoutes = require('./routes/verifyProductRoutes');

const app = express();

app.use(express.json());

app.use('/api', ingredientRoutes);
app.use('/api', combinationRoutes);
app.use('/api', mismatchRoutes);
app.use('/api', verifyProductRoutes);

const PORT = process.env.PORT || 3000;

app.get('/api', (req,res) => {
    res.json({
        service: 'Sachalbel API',
        version: 1,
        endpoints: {
            'POST /api/verify': 'Check a single ingredient for safety (banned / Schedule H / EU-banned)',
            'POST /api/check-combinations': 'Check an ingredient list for dangerous combinations',
            'POST /api/check-mismatch': 'Compare two ingredient sources for mismatches (fraud signal)',
        },
    });
});

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