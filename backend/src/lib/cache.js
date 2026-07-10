const redis = require('./redis');

async function getOrSet(key, ttlSeconds, computeFn){
    const cached = await redis.get(key);
    if(cached !== null) {
        return JSON.parse(cached);
    }

    const value = await computeFn();
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    return value;
}

module.exports = { getOrSet };