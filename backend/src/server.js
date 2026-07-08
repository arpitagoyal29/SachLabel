require('dotenv').config();
const REQUIRED_ENV = ['DATABASE_URL'];
for (const key of REQUIRED_ENV) {
    if(!process.env[key]) {
        console.error(`Missing required environment variable: ${key}`);
        process.exit(1);
    }
}
const express = require('express');
const prisma = require('./lib/prisma');
const ingredientRoutes = require('./routes/ingredientRoutes');
const combinationRoutes = require('./routes/combinationRoutes');
const mismatchRoutes = require('./routes/mismatchRoutes');
const verifyProductRoutes = require('./routes/verifyProductRoutes');

const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const apiLimiter = rateLimit({
    windowMs: 15*60*1000, // 15 minutes
    max: 100,             // max requests per IP per window
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
});

app.use('/api',apiLimiter);

app.use('/api', ingredientRoutes);
app.use('/api', combinationRoutes);
app.use('/api', mismatchRoutes);
app.use('/api', verifyProductRoutes);

const PORT = process.env.PORT || 3000;

app.get('/api', (req,res) => {
    res.json({
        service: 'Sachlabel API',
        version: 1,
        endpoints: {
            'POST /api/verify': 'Check a single ingredient for safety (banned / Schedule H / EU-banned)',
            'POST /api/check-combinations': 'Check an ingredient list for dangerous combinations',
            'POST /api/check-mismatch': 'Compare two ingredient sources for mismatches (fraud signal)',
            'POST /api/verify-product': 'Run all 6 verification layers and return an aggregated verdict',
        },
    });
});

app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    res.status(503).json({ status: 'error', db: 'disconnected' });
  }
});

// nothing matched
app.use((req,res) => {
    res.status(404).json({ error: 'Not found', path: req.originalUrl });
});

// centralized error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: 'Internal server error' })
});

// app.get('/ingredients', async (req,res) => {
//     const ingredients = await prisma.ingredient.findMany();
//     res.json(ingredients);
// });

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

async function shutdown(signal) {
    console.log(`${signal} received - shutting down gracefully`);
    server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
    });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));