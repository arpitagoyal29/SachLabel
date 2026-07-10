afterAll(async () => {
  const redis = require('./src/lib/redis');
  await redis.quit();
});
