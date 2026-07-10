require('dotenv').config();
const REQUIRED_ENV = ['DATABASE_URL'];
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');

const redis = require('./lib/redis');
const prisma = require('./lib/prisma');
const ingredientRoutes = require('./routes/ingredientRoutes');
const combinationRoutes = require('./routes/combinationRoutes');
const mismatchRoutes = require('./routes/mismatchRoutes');
const verifyProductRoutes = require('./routes/verifyProductRoutes');
const extractRoutes = require('./routes/extractRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  }),
});

app.use('/api', apiLimiter);

app.use('/api', ingredientRoutes);
app.use('/api', combinationRoutes);
app.use('/api', mismatchRoutes);
app.use('/api', verifyProductRoutes);
app.use('/api', extractRoutes);

app.get('/api', (req, res) => {
  res.json({
    service: 'SachLabel API',
    version: 1,
    endpoints: {
      'POST /api/verify': 'Check a single ingredient for safety (banned / Schedule H / EU-banned)',
      'POST /api/check-combinations': 'Check an ingredient list for dangerous combinations',
      'POST /api/check-mismatch': 'Compare two ingredient sources for mismatches (fraud signal)',
      'POST /api/verify-product': 'Run all 6 verification layers and return an aggregated verdict',
      'POST /api/extract-ingredients': 'Extract an ingredient list from a photo of a product label (OCR, multipart field name "image")',
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

app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.originalUrl });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: 'Internal server error' });
});

module.exports = app;
